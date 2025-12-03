# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Additional security tool integrations
- Support for custom wordlists management
- Enhanced output formatting
- Results export functionality
- MCP prompts for common workflows

## [1.0.0] - 2024-12-03

### Added
- Initial release of MCP Kali Server
- Docker container with Kali Linux rolling
- 10 security tool integrations via MCP:
  - nmap_scan: Network scanning with multiple scan types
  - nikto_scan: Web server vulnerability scanning
  - sqlmap_scan: SQL injection testing
  - dirb_scan: Directory brute-forcing
  - gobuster_scan: Fast directory/DNS/vhost enumeration
  - hydra_bruteforce: Password brute-forcing
  - whois_lookup: Domain information lookup
  - dns_enum: DNS enumeration
  - custom_command: Execute arbitrary Kali tools
  - container_status: Check container health
- Pre-installed security tools in container:
  - Network scanning: nmap, masscan
  - Web testing: nikto, sqlmap, wpscan, dirb, gobuster
  - Exploitation: metasploit-framework
  - Password cracking: john, hydra, hashcat
  - Wireless: aircrack-ng
  - Forensics: binwalk, foremost
  - Reverse engineering: radare2
  - And many more
- Docker management utilities:
  - DockerManager class for container operations
  - Automatic container lifecycle management
  - Command execution with timeout support
- MCP server implementation:
  - Stdio transport for Claude CLI integration
  - TypeScript with strict typing
  - Comprehensive error handling
- Documentation:
  - README with installation and usage
  - QUICKSTART guide for fast setup
  - EXAMPLES with practical use cases
  - DEMO showing interaction examples
  - CONTRIBUTING guidelines
  - CODE_OF_CONDUCT
  - SECURITY policy
- Development tools:
  - TypeScript configuration
  - Build scripts
  - Docker Compose setup
  - Helper scripts for container management
- GitHub integration:
  - Issue templates (bug, feature, security tool)
  - Pull request template
  - GitHub Actions CI/CD:
    - Build and test workflow
    - Docker image publishing
    - CodeQL security scanning
  - Community guidelines
  - License (MIT)
- Claude CLI integration:
  - .mcp.json configuration
  - Setup instructions
  - Usage examples

### Security
- Privileged Docker container with network capabilities
- Input validation for all tool parameters
- Command injection prevention
- Comprehensive security documentation
- Responsible use guidelines

### Documentation
- Comprehensive README.md
- Quick start guide
- Usage examples
- Security best practices
- Contributing guidelines
- Code of conduct

## [0.1.0] - Development

### Added
- Initial project structure
- Basic MCP server skeleton
- Dockerfile prototype

---

## Version History

- **1.0.0** - Initial public release
- **0.1.0** - Development version

## Upgrade Guide

### From 0.x to 1.0.0

This is the first stable release. No upgrade path needed.

## Breaking Changes

None yet. Breaking changes will be clearly marked with BREAKING CHANGE in future releases.

## Deprecations

None yet.

## Contributors

Thanks to all contributors who helped with this release!

- [Your Name] - Initial implementation

---

For more details, see the [full commit history](https://github.com/eutectico/mcp-kali-server/commits/main).
