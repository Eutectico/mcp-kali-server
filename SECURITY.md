# Security Policy

## Responsible Use Statement

MCP Kali Server provides access to powerful penetration testing and security assessment tools. This software is intended **exclusively** for:

- ✅ Authorized security assessments with written permission
- ✅ Educational purposes on owned systems
- ✅ CTF (Capture The Flag) competitions
- ✅ Security research in controlled environments
- ✅ Defensive security and testing your own infrastructure

**Unauthorized use is illegal and unethical.**

## Security Considerations

### Container Security

The Kali Docker container runs with:
- **Privileged mode** - Required for network tools
- **Host networking** - Direct access to host network
- **Extended capabilities** - NET_ADMIN, NET_RAW, SYS_ADMIN

⚠️ **Implications**:
- Container can access host network interfaces
- Container has extensive system capabilities
- Should only run on trusted systems
- Not suitable for multi-tenant environments

### Access Control

**Recommendations**:
1. **Restrict access** to the MCP server to authorized users only
2. **Monitor usage** - Log and review security tool execution
3. **Network isolation** - Run on isolated networks when testing
4. **No public exposure** - Never expose the MCP server to the internet
5. **User authentication** - Implement additional auth if needed

### Data Protection

- **Scan results** may contain sensitive information
- **Workspace directory** should have restricted permissions
- **Container logs** may expose tested targets
- **Clean up** scan results after assessments

## Reporting Security Vulnerabilities

We take security vulnerabilities seriously. If you discover a security issue:

### Please DO:

1. **Email** security concerns to: eutectico@gmail.com
2. **Provide details**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fixes (if any)
3. **Allow time** for us to address the issue before public disclosure
4. **Act responsibly** - Do not exploit the vulnerability

### Please DON'T:

- ❌ Open public GitHub issues for security vulnerabilities
- ❌ Share vulnerabilities publicly before they're fixed
- ❌ Exploit vulnerabilities for malicious purposes
- ❌ Test vulnerabilities on systems you don't own

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Best effort

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Best Practices for Users

### 1. Legal Authorization

```markdown
✅ DO:
- Get written permission before testing
- Test only systems you own or have explicit authorization for
- Follow scope of engagement documents
- Respect time windows for authorized testing

❌ DON'T:
- Scan random internet targets
- Test production systems without approval
- Exceed authorized scope
- Ignore responsible disclosure practices
```

### 2. Container Hardening

```bash
# Review container capabilities
docker inspect mcp-kali | grep -A 10 CapAdd

# Monitor container activity
docker logs mcp-kali --follow

# Restrict container if possible for your use case
# (Note: Some tools require privileged mode)
```

### 3. Network Segmentation

- Run on isolated test networks when possible
- Use VPNs for authorized remote testing
- Implement firewall rules to limit scope
- Monitor network traffic during assessments

### 4. Credential Management

- Never commit credentials to git
- Use environment variables or secrets management
- Rotate credentials after assessments
- Don't store passwords in scan results

### 5. Audit Logging

```bash
# Enable Docker logging
# Add to docker-compose.yml:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

# Review command history
docker exec mcp-kali history
```

## Known Security Considerations

### 1. Command Injection Risk

The `custom_command` tool executes arbitrary commands in the container. While contained in Docker:

- **Mitigation**: Container isolation provides defense-in-depth
- **Recommendation**: Limit who can use this tool
- **Future**: Consider implementing command allowlisting

### 2. Docker Socket Access

The MCP server requires access to Docker socket:

- **Risk**: Docker socket access is equivalent to root access
- **Mitigation**: Run MCP server with appropriate user permissions
- **Alternative**: Use Docker contexts for remote Docker access

### 3. Sensitive Output

Tool outputs may contain:
- Internal IP addresses
- System information
- Service versions
- Discovered vulnerabilities

**Recommendation**: Sanitize outputs before sharing or logging.

## Compliance

### Legal Frameworks

Users must comply with applicable laws including:
- Computer Fraud and Abuse Act (CFAA) - USA
- Computer Misuse Act - UK
- EU Cybersecurity directives
- Local computer crime laws

### Organizational Policies

- Follow your organization's security policies
- Adhere to professional codes of conduct (e.g., EC-Council, SANS)
- Respect NDAs and confidentiality agreements
- Document all authorized testing activities

## Security Updates

- **Subscribe** to repository notifications for security updates
- **Review** CHANGELOG.md for security-related changes
- **Update** regularly to get security patches
- **Test** updates in non-production environments first

## Additional Resources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [SANS Penetration Testing](https://www.sans.org/cyber-security-courses/penetration-testing/)
- [Offensive Security Ethics](https://www.offensive-security.com/offsec/what-it-means-to-try-harder/)

## Contact

For security concerns: eutectico@gmail.com

For general questions: https://github.com/eutectico/mcp-kali-server/discussions

---

**Remember**: With great power comes great responsibility. Use these tools ethically and legally.
