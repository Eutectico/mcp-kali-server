# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MCP Kali Server is a Model Context Protocol (MCP) server that exposes Kali Linux penetration testing tools through a privileged Docker container. It provides 10 security tools accessible via MCP, allowing AI assistants to perform authorized security testing.

**Critical**: This project provides access to penetration testing tools. Only use on authorized targets with explicit written permission. See SECURITY.md for responsible use guidelines.

## Architecture

### Two-Layer Design

1. **MCP Server Layer** (`src/index.ts`):
   - **Runs on the host system** (NOT in Docker)
   - Implements MCP protocol using `@modelcontextprotocol/sdk`
   - Uses stdio transport for communication with Claude CLI/Desktop
   - Defines 10 tool schemas (nmap_scan, nikto_scan, sqlmap_scan, etc.)
   - Routes tool calls to DockerManager for execution

2. **Docker Management Layer** (`src/docker-manager.ts`):
   - **Runs on the host system** alongside the MCP server
   - Manages lifecycle of privileged Kali Linux container (`mcp-kali`)
   - Uses dockerode to interact with Docker daemon via `/var/run/docker.sock` **on the host**
   - Auto-creates/starts container on first tool use
   - Executes commands inside container with configurable timeouts
   - Cleans Docker stream multiplexing headers from output

**Important**: The Kali container does NOT have access to the Docker socket. Only the host-based MCP server controls the container.

### Container Configuration

The Kali container runs with:
- **Privileged mode**: Required for network tools (nmap, tcpdump, etc.)
- **Host networking**: Direct access to host network interfaces
- **Capabilities**: NET_ADMIN, NET_RAW, SYS_ADMIN
- **Volume mount**: `./workspace:/workspace` for sharing scan results
- **Image**: Built from `Dockerfile` with 30+ pre-installed security tools

## Development Commands

### Build and Setup
```bash
# Complete build (Docker image + npm + TypeScript)
./scripts/build.sh

# Build TypeScript only
npm run build

# Watch mode for development
npm run dev
```

### Docker Management
```bash
# Start Kali container
./scripts/start-container.sh
# Uses: docker compose up -d

# Stop container
./scripts/stop-container.sh
# Uses: docker compose down

# Interactive shell in container
./scripts/shell.sh
# Uses: docker exec -it mcp-kali /bin/bash

# Check setup (validates Docker, Node, dependencies)
./scripts/test-setup.sh
```

**Note**: Scripts auto-detect `docker-compose` (v1) or `docker compose` (v2).

### Running the MCP Server
```bash
# Start server (stdio transport)
npm start

# Register with Claude CLI
claude mcp add --transport stdio kali -- node $(pwd)/dist/index.js
```

## Key Implementation Details

### Adding New Security Tools

To add a new Kali tool:

1. **Add to Dockerfile** (line ~6-50):
   ```dockerfile
   apt-get install -y your-tool
   ```

2. **Define MCP tool schema** in `src/index.ts` TOOLS array:
   ```typescript
   {
     name: 'your_tool',
     description: 'What it does',
     inputSchema: {
       type: 'object',
       properties: { /* parameters */ },
       required: ['param1']
     }
   }
   ```

3. **Implement handler** in `handleToolCall()` switch statement (~line 240):
   ```typescript
   case 'your_tool': {
     const { param1 } = args;
     command = `your-tool ${param1}`;
     result = await dockerManager.executeCommand(command, timeout);
     break;
   }
   ```

4. **Update documentation**: README.md (Available Tools), EXAMPLES.md

### Docker Image Considerations

- **Python packages**: Use `--break-system-packages` flag (required for Python 3.13+ in containers)
- **Build time**: First build takes 5-10 minutes (Kali base + tools installation)
- **Rebuild**: Only changed layers rebuild thanks to Docker cache
- **Size**: Image is ~2GB due to security tools

### Error Handling

- Container not found → Auto-creates via `ensureContainer()`
- Container stopped → Auto-starts before command execution
- Image missing → Throws error with build instructions
- Command timeout → Configurable per tool (default 300000ms)

### Output Processing

Commands return raw output from container. Docker stream headers (8-byte frames) are stripped by `cleanDockerOutput()` in DockerManager.

## Testing on Different Systems

The project handles environment differences:
- **Docker Compose**: Auto-detects v1 (`docker-compose`) vs v2 (`docker compose`)
- **SSH vs HTTPS**: Git remote can use either (SSH recommended: `git@github.com:eutectico/mcp-kali-server.git`)
- **Permissions**: Host MCP server requires Docker socket access (`/var/run/docker.sock`) to manage the Kali container

## MCP Integration

The server uses stdio transport, making it compatible with:
- **Claude CLI**: Via `claude mcp add` command or `.mcp.json` file
- **Claude Desktop**: Via `claude_desktop_config.json`
- **Any MCP client**: Implementing stdio transport

Tool invocations follow pattern:
```
User → Claude → MCP Server → DockerManager → Kali Container → Security Tool
```

## Security Notes

- **Never commit** changes that weaken container isolation
- **Container is privileged**: Has host-level access to network
- **Workspace directory**: Scan results may contain sensitive info
- **Command injection**: `custom_command` tool executes arbitrary commands (by design, but contained in Docker)
- All tools require explicit authorization before use on any target

## Common Issues

1. **"docker-compose: command not found"**: Install Docker Compose v2 or use legacy v1
2. **"externally-managed-environment" (pip)**: Dockerfile needs `--break-system-packages` flag
3. **Container permission errors**: User needs Docker group membership or sudo
4. **Image not found**: Run `./scripts/build.sh` first to build Kali image
5. **Tools timeout**: Increase timeout in tool handler (3rd parameter to `executeCommand()`)
