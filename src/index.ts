#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { DockerManager } from './docker-manager.js';

const dockerManager = new DockerManager();

const TOOLS: Tool[] = [
  {
    name: 'nmap_scan',
    description: 'Perform network scanning using Nmap. Supports various scan types and options.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target IP address, hostname, or CIDR range to scan',
        },
        scan_type: {
          type: 'string',
          enum: ['quick', 'full', 'ping', 'stealth', 'service', 'os'],
          description: 'Type of scan: quick (-F), full (-p-), ping (-sn), stealth (-sS), service (-sV), os (-O)',
          default: 'quick',
        },
        additional_args: {
          type: 'string',
          description: 'Additional nmap arguments (optional)',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'nikto_scan',
    description: 'Perform web server vulnerability scanning using Nikto',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target URL (e.g., http://example.com)',
        },
        port: {
          type: 'number',
          description: 'Target port (default: 80 for http, 443 for https)',
        },
        tuning: {
          type: 'string',
          description: 'Tuning options (e.g., 1,2,3 for specific tests)',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'sqlmap_scan',
    description: 'Test for SQL injection vulnerabilities using SQLMap',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Target URL to test',
        },
        data: {
          type: 'string',
          description: 'POST data (optional)',
        },
        level: {
          type: 'number',
          description: 'Level of tests (1-5, default: 1)',
          minimum: 1,
          maximum: 5,
        },
        risk: {
          type: 'number',
          description: 'Risk of tests (1-3, default: 1)',
          minimum: 1,
          maximum: 3,
        },
        batch: {
          type: 'boolean',
          description: 'Never ask for user input, use default behavior',
          default: true,
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'dirb_scan',
    description: 'Directory and file brute-forcing using Dirb',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Target URL',
        },
        wordlist: {
          type: 'string',
          description: 'Path to wordlist (default: /usr/share/dirb/wordlists/common.txt)',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'gobuster_scan',
    description: 'Fast directory/file brute-forcing using Gobuster',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Target URL',
        },
        mode: {
          type: 'string',
          enum: ['dir', 'dns', 'vhost'],
          description: 'Gobuster mode: dir (directory), dns (subdomain), vhost (vhost)',
          default: 'dir',
        },
        wordlist: {
          type: 'string',
          description: 'Path to wordlist (default: /usr/share/wordlists/dirb/common.txt)',
        },
        extensions: {
          type: 'string',
          description: 'File extensions to search for (e.g., php,html,txt)',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'hydra_bruteforce',
    description: 'Password brute-forcing using Hydra',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target IP or hostname',
        },
        service: {
          type: 'string',
          description: 'Service to attack (e.g., ssh, ftp, http-post-form)',
        },
        username: {
          type: 'string',
          description: 'Username to test (or path to username list with -L)',
        },
        password_list: {
          type: 'string',
          description: 'Path to password list',
        },
        additional_args: {
          type: 'string',
          description: 'Additional Hydra arguments',
        },
      },
      required: ['target', 'service', 'username', 'password_list'],
    },
  },
  {
    name: 'whois_lookup',
    description: 'Perform WHOIS lookup for domain information',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name or IP address',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'dns_enum',
    description: 'DNS enumeration and information gathering',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name to enumerate',
        },
        record_type: {
          type: 'string',
          enum: ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'ANY'],
          description: 'DNS record type to query',
          default: 'ANY',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'custom_command',
    description: 'Execute a custom command in the Kali container',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Command to execute',
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds (default: 300000)',
          default: 300000,
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'container_status',
    description: 'Get the status of the Kali Docker container',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function handleToolCall(name: string, args: any): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    let command = '';
    let result = '';

    switch (name) {
      case 'nmap_scan': {
        const { target, scan_type = 'quick', additional_args = '' } = args;
        const scanArgsMap: { [key: string]: string } = {
          quick: '-F',
          full: '-p-',
          ping: '-sn',
          stealth: '-sS',
          service: '-sV',
          os: '-O',
        };
        const scanArgs = scanArgsMap[scan_type] || '-F';
        command = `nmap ${scanArgs} ${additional_args} ${target}`;
        result = await dockerManager.executeCommand(command, 600000);
        break;
      }

      case 'nikto_scan': {
        const { target, port, tuning } = args;
        let cmd = `nikto -h ${target}`;
        if (port) cmd += ` -p ${port}`;
        if (tuning) cmd += ` -Tuning ${tuning}`;
        command = cmd;
        result = await dockerManager.executeCommand(command, 600000);
        break;
      }

      case 'sqlmap_scan': {
        const { url, data, level = 1, risk = 1, batch = true } = args;
        let cmd = `sqlmap -u "${url}" --level=${level} --risk=${risk}`;
        if (data) cmd += ` --data="${data}"`;
        if (batch) cmd += ' --batch';
        command = cmd;
        result = await dockerManager.executeCommand(command, 600000);
        break;
      }

      case 'dirb_scan': {
        const { url, wordlist = '/usr/share/dirb/wordlists/common.txt' } = args;
        command = `dirb ${url} ${wordlist}`;
        result = await dockerManager.executeCommand(command, 600000);
        break;
      }

      case 'gobuster_scan': {
        const { url, mode = 'dir', wordlist = '/usr/share/wordlists/dirb/common.txt', extensions } = args;
        let cmd = `gobuster ${mode} -u ${url} -w ${wordlist}`;
        if (extensions && mode === 'dir') cmd += ` -x ${extensions}`;
        command = cmd;
        result = await dockerManager.executeCommand(command, 600000);
        break;
      }

      case 'hydra_bruteforce': {
        const { target, service, username, password_list, additional_args = '' } = args;
        command = `hydra -l ${username} -P ${password_list} ${additional_args} ${target} ${service}`;
        result = await dockerManager.executeCommand(command, 600000);
        break;
      }

      case 'whois_lookup': {
        const { domain } = args;
        command = `whois ${domain}`;
        result = await dockerManager.executeCommand(command);
        break;
      }

      case 'dns_enum': {
        const { domain, record_type = 'ANY' } = args;
        command = `dig ${domain} ${record_type} +noall +answer`;
        result = await dockerManager.executeCommand(command);
        break;
      }

      case 'custom_command': {
        const { command: cmd, timeout = 300000 } = args;
        command = cmd;
        result = await dockerManager.executeCommand(cmd, timeout);
        break;
      }

      case 'container_status': {
        const status = await dockerManager.getContainerStatus();
        result = `Container status: ${status}`;
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Command executed: ${command}\n\nResult:\n${result}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
    };
  }
}

async function main() {
  const server = new Server(
    {
      name: 'mcp-kali-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await handleToolCall(request.params.name, request.params.arguments);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('MCP Kali Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
