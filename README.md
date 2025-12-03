# MCP Kali Server

[![CI](https://github.com/eutectico/mcp-kali-server/actions/workflows/ci.yml/badge.svg)](https://github.com/eutectico/mcp-kali-server/actions/workflows/ci.yml)
[![Docker](https://github.com/eutectico/mcp-kali-server/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/eutectico/mcp-kali-server/actions/workflows/docker-publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-required-blue)](https://www.docker.com/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple)](https://modelcontextprotocol.io)

A Model Context Protocol (MCP) server that provides access to Kali Linux security tools through a privileged Docker container. This allows AI assistants to perform security testing and reconnaissance using industry-standard penetration testing tools.

## Features

- **Privileged Docker Container**: Runs Kali Linux with full network capabilities
- **Pre-installed Security Tools**: Includes nmap, Metasploit, Nikto, SQLMap, Hydra, and more
- **MCP Integration**: Seamlessly integrates with Claude Desktop and other MCP clients
- **Safe Isolation**: All tools run in a containerized environment
- **Easy Management**: Simple scripts for container lifecycle management

## Security Tools Included

- **Network Scanning**: nmap, masscan
- **Web Scanning**: nikto, sqlmap, dirb, gobuster, wpscan
- **Exploitation**: metasploit-framework
- **Password Cracking**: john, hydra, hashcat
- **Wireless**: aircrack-ng
- **Forensics**: binwalk, foremost
- **Reverse Engineering**: radare2
- **And many more...**

## Prerequisites

- Docker and Docker Compose (v1 or v2)
  - `docker-compose` (v1) or `docker compose` (v2) - both supported
- Node.js (v18 or higher)
- Linux host (for best compatibility)
- Root/sudo access (for privileged container)

## Installation

1. Clone or create this repository:
```bash
cd /workspace/mcp-kali-server
```

2. Build the Docker image and install dependencies:
```bash
./scripts/build.sh
```

This will:
- Build the Kali Linux Docker image
- Install Node.js dependencies
- Compile the TypeScript code

## Usage

### Standalone Mode

Start the MCP server directly:
```bash
npm start
```

### With Claude CLI

Add the MCP server using the CLI:

```bash
# Add for current project only
claude mcp add --transport stdio kali -- node /workspace/mcp-kali-server/dist/index.js

# Or add for all projects (user-level)
claude mcp add --scope user --transport stdio kali -- node /workspace/mcp-kali-server/dist/index.js
```

**Verify it's added:**
```bash
claude mcp list
```

**Use with Claude Code:**
The server provides tools you can call directly. Check status with:
```bash
/mcp
```

**Alternatively**, you can use the included `.mcp.json` file for project-level configuration (automatically recognized by Claude CLI when in this directory).

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%/Claude/claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "kali": {
      "command": "node",
      "args": ["/workspace/mcp-kali-server/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop, and the Kali tools will be available.

## Available Tools

### 1. nmap_scan
Perform network scanning using Nmap.

**Parameters:**
- `target` (required): IP address, hostname, or CIDR range
- `scan_type`: quick, full, ping, stealth, service, or os
- `additional_args`: Extra nmap arguments

**Example:**
```
Use nmap_scan to scan 192.168.1.1 with a quick scan
```

### 2. nikto_scan
Web server vulnerability scanning.

**Parameters:**
- `target` (required): Target URL
- `port`: Target port
- `tuning`: Tuning options

**Example:**
```
Use nikto_scan to scan http://example.com
```

### 3. sqlmap_scan
SQL injection testing.

**Parameters:**
- `url` (required): Target URL
- `data`: POST data
- `level`: Test level (1-5)
- `risk`: Risk level (1-3)
- `batch`: Auto-answer prompts (default: true)

**Example:**
```
Use sqlmap_scan to test http://example.com/page?id=1
```

### 4. dirb_scan
Directory and file brute-forcing.

**Parameters:**
- `url` (required): Target URL
- `wordlist`: Path to wordlist

**Example:**
```
Use dirb_scan to scan http://example.com
```

### 5. gobuster_scan
Fast directory/file/DNS brute-forcing.

**Parameters:**
- `url` (required): Target URL or domain
- `mode`: dir, dns, or vhost
- `wordlist`: Path to wordlist
- `extensions`: File extensions to search

**Example:**
```
Use gobuster_scan in dir mode on http://example.com with php,html extensions
```

### 6. hydra_bruteforce
Password brute-forcing.

**Parameters:**
- `target` (required): Target IP or hostname
- `service` (required): Service (ssh, ftp, http-post-form, etc.)
- `username` (required): Username
- `password_list` (required): Path to password list
- `additional_args`: Extra Hydra arguments

**Example:**
```
Use hydra_bruteforce to test SSH on 192.168.1.1 with username admin
```

### 7. whois_lookup
Domain WHOIS information.

**Parameters:**
- `domain` (required): Domain name or IP

**Example:**
```
Use whois_lookup for example.com
```

### 8. dns_enum
DNS enumeration.

**Parameters:**
- `domain` (required): Domain to query
- `record_type`: A, AAAA, MX, NS, TXT, SOA, or ANY

**Example:**
```
Use dns_enum to get all records for example.com
```

### 9. custom_command
Execute any command in the Kali container.

**Parameters:**
- `command` (required): Command to execute
- `timeout`: Timeout in milliseconds

**Example:**
```
Use custom_command to run "ping -c 4 8.8.8.8"
```

### 10. container_status
Check if the Kali container is running.

**Example:**
```
Use container_status to check the container
```

## Container Management

### Start the container:
```bash
./scripts/start-container.sh
```

### Stop the container:
```bash
./scripts/stop-container.sh
```

### Get a shell in the container:
```bash
./scripts/shell.sh
```

### View container logs:
```bash
docker-compose logs -f
```

## Project Structure

```
mcp-kali-server/
├── src/
│   ├── index.ts              # Main MCP server
│   └── docker-manager.ts     # Docker container management
├── scripts/
│   ├── build.sh             # Build everything
│   ├── start-container.sh   # Start container
│   ├── stop-container.sh    # Stop container
│   └── shell.sh             # Shell access
├── workspace/               # Shared workspace (created on first run)
├── Dockerfile              # Kali Linux image
├── docker-compose.yml      # Container configuration
├── package.json
├── tsconfig.json
└── README.md

```

## Workspace Directory

The `workspace/` directory is mounted into the container at `/workspace`. Use this to:
- Store scan results
- Share files between host and container
- Save wordlists and scripts

## Important Security Notes

⚠️ **WARNING**: This server provides access to powerful penetration testing tools.

- **Only use on authorized targets**: Unauthorized scanning is illegal
- **Container runs privileged**: Has extensive system access
- **Network access**: Container uses host networking mode
- **Responsible use**: Follow responsible disclosure practices
- **Legal compliance**: Ensure you have permission before testing

## Authorized Use Cases

- Security research in controlled environments
- CTF (Capture The Flag) competitions
- Authorized penetration testing engagements
- Educational purposes on owned systems
- Defensive security and testing your own infrastructure

## Troubleshooting

### Container won't start
```bash
# Check Docker daemon
sudo systemctl status docker

# Check for port conflicts
docker ps -a

# Remove old container
docker rm -f mcp-kali
```

### Permission errors
```bash
# Ensure Docker socket has correct permissions
sudo chmod 666 /var/run/docker.sock

# Or run with sudo (not recommended for production)
sudo npm start
```

### Image build fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

## Development

### Rebuild after code changes:
```bash
npm run build
```

### Watch mode (auto-rebuild):
```bash
npm run dev
```

### Run tests:
```bash
npm test
```

## Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript best practices
- New tools include proper documentation
- Security implications are considered
- Tests are included where applicable

## License

MIT License - See LICENSE file for details

## Disclaimer

This tool is provided for educational and authorized testing purposes only. The authors are not responsible for misuse or damage caused by this software. Always ensure you have explicit permission before testing any systems you do not own.
