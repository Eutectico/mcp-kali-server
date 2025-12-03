# MCP Kali Server - Usage Examples

This document provides practical examples of using the MCP Kali Server with Claude or other MCP clients.

## Basic Reconnaissance

### 1. Port Scanning with Nmap

**Quick scan of a target:**
```
Use nmap_scan to perform a quick scan on 192.168.1.1
```

**Full port scan:**
```
Use nmap_scan with scan_type "full" on 192.168.1.0/24
```

**Service version detection:**
```
Use nmap_scan with scan_type "service" on 192.168.1.100
```

**OS detection:**
```
Use nmap_scan with scan_type "os" on 192.168.1.100 and additional_args "-A"
```

### 2. DNS Enumeration

**Get all DNS records:**
```
Use dns_enum to query all records for example.com
```

**Get specific record type:**
```
Use dns_enum to get MX records for example.com
```

**WHOIS lookup:**
```
Use whois_lookup for example.com
```

## Web Application Testing

### 3. Web Server Scanning

**Basic Nikto scan:**
```
Use nikto_scan to scan http://testphp.vulnweb.com
```

**Nikto with specific port:**
```
Use nikto_scan on http://example.com with port 8080
```

### 4. Directory Enumeration

**Dirb scan with default wordlist:**
```
Use dirb_scan to enumerate directories on http://example.com
```

**Gobuster with file extensions:**
```
Use gobuster_scan on http://example.com with extensions "php,html,txt"
```

**DNS subdomain enumeration:**
```
Use gobuster_scan in mode "dns" on example.com
```

### 5. SQL Injection Testing

**Basic SQLMap test:**
```
Use sqlmap_scan to test http://testphp.vulnweb.com/artists.php?artist=1
```

**SQLMap with POST data:**
```
Use sqlmap_scan on http://example.com/login.php with data "username=admin&password=test"
```

**Aggressive SQLMap scan:**
```
Use sqlmap_scan on http://example.com/page.php?id=1 with level 3 and risk 2
```

## Password Testing

### 6. Brute Force Attacks

**SSH brute force:**
```
Use hydra_bruteforce on 192.168.1.100 for service "ssh" with username "admin" and password_list "/usr/share/wordlists/rockyou.txt"
```

**FTP brute force:**
```
Use hydra_bruteforce on 192.168.1.50 for service "ftp" with username "ftp" and password_list "/workspace/passwords.txt"
```

**HTTP form brute force:**
```
Use hydra_bruteforce on example.com for service "http-post-form" with additional_args "/login:username=^USER^&password=^PASS^:F=incorrect"
```

## Advanced Usage

### 7. Custom Commands

**Run custom nmap script:**
```
Use custom_command to run "nmap --script vuln 192.168.1.100"
```

**Check metasploit version:**
```
Use custom_command to run "msfconsole --version"
```

**Search for exploits:**
```
Use custom_command to run "searchsploit apache 2.4"
```

**Run Python script:**
```
Use custom_command to run "python3 /workspace/my_script.py"
```

### 8. Container Management

**Check container status:**
```
Use container_status to check if the Kali container is running
```

## Workflow Examples

### Complete Web Application Assessment

1. **Reconnaissance:**
```
Use whois_lookup for target-domain.com
Use dns_enum to get all records for target-domain.com
Use nmap_scan with scan_type "service" on target-domain.com
```

2. **Directory enumeration:**
```
Use gobuster_scan on http://target-domain.com with extensions "php,html,txt,bak"
```

3. **Vulnerability scanning:**
```
Use nikto_scan to scan http://target-domain.com
```

4. **SQL injection testing on found endpoints:**
```
Use sqlmap_scan to test http://target-domain.com/products.php?id=1
```

### Network Penetration Test

1. **Discovery:**
```
Use nmap_scan with scan_type "ping" on 192.168.1.0/24
```

2. **Port scanning:**
```
Use nmap_scan with scan_type "full" on 192.168.1.100
```

3. **Service enumeration:**
```
Use nmap_scan with scan_type "service" on 192.168.1.100
```

4. **Password attacks on discovered services:**
```
Use hydra_bruteforce on 192.168.1.100 for service "ssh" with username "admin" and password_list "/usr/share/wordlists/rockyou.txt"
```

## Tips and Best Practices

### Performance Optimization

1. **Use appropriate scan types:**
   - Quick scans for fast results
   - Full scans when thoroughness is needed
   - Stealth scans to avoid detection

2. **Manage timeouts:**
```
Use custom_command with timeout 600000 to run "nmap -p- --max-retries 1 192.168.1.100"
```

### Working with Wordlists

**Common wordlist locations in the container:**
- `/usr/share/wordlists/rockyou.txt` - Password list
- `/usr/share/dirb/wordlists/common.txt` - Common directories
- `/usr/share/wordlists/dirb/big.txt` - Larger directory list
- `/usr/share/seclists/` - SecLists collection (if installed)

**Custom wordlists:**
Place your wordlists in the `workspace/` directory:
```
Use dirb_scan on http://example.com with wordlist "/workspace/my_custom_wordlist.txt"
```

### Saving Results

**Save scan results to workspace:**
```
Use custom_command to run "nmap -oA /workspace/scan_results 192.168.1.100"
```

**Export SQLMap results:**
```
Use custom_command to run "sqlmap -u 'http://example.com/page.php?id=1' --batch --dump --output-dir=/workspace/sqlmap_output"
```

## Responsible Testing

Always remember:

1. **Get permission** before testing any system
2. **Stay in scope** of your authorized testing
3. **Document findings** properly
4. **Report vulnerabilities** responsibly
5. **Clean up** after testing (remove uploaded files, test accounts, etc.)

## CTF Examples

**For Capture The Flag competitions:**

1. **Port scanning:**
```
Use nmap_scan with scan_type "full" on ctf-challenge.local
```

2. **Web enumeration:**
```
Use gobuster_scan on http://ctf-challenge.local with extensions "php,txt,html,zip"
```

3. **Check for SQL injection:**
```
Use sqlmap_scan to test http://ctf-challenge.local/index.php?id=1
```

4. **Search for hidden files:**
```
Use custom_command to run "find /workspace/extracted -name 'flag.txt' 2>/dev/null"
```

## Troubleshooting

**If a command times out:**
```
Use custom_command with timeout 900000 to run your long-running command
```

**If container is not responding:**
```
Use container_status to check the container
```

Then restart it:
```bash
./scripts/stop-container.sh
./scripts/start-container.sh
```

**For interactive tools, use custom_command with appropriate flags:**
```
Use custom_command to run "msfconsole -q -x 'search apache; exit'"
```
