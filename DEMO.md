# MCP Kali Server - Demo & Interaktionsbeispiele

Dieses Dokument zeigt, wie die Interaktion mit dem MCP Kali Server in Claude CLI aussieht.

## Setup Demo

```bash
# 1. Projekt bauen
$ ./scripts/build.sh
Building MCP Kali Server Docker image...
✓ Docker image built successfully

Installing Node.js dependencies...
✓ Dependencies installed successfully

Building TypeScript...
✓ TypeScript compiled successfully

Setup complete! You can now:
  1. Start the server with: npm start
  2. Or use it with Claude Desktop (see README.md)

# 2. MCP Server registrieren
$ claude mcp add --transport stdio kali -- node /workspace/mcp-kali-server/dist/index.js
✓ Added MCP server 'kali'

# 3. Verifizieren
$ claude mcp list
kali - Kali Linux security tools in Docker

# 4. Container starten
$ ./scripts/start-container.sh
Starting Kali Docker container...
✓ Container started successfully

Container status:
NAME       IMAGE                      STATUS
mcp-kali   mcp-kali-server:latest    Up 2 seconds
```

## Claude CLI Interaktionen

### Beispiel 1: Container Status prüfen

```
You: Can you check if the Kali container is running?

Claude: I'll check the container status for you.
[Uses container_status tool]

Command executed: (internal status check)

Result:
Container status: running

The Kali Linux container is currently running and ready to execute security tools.
```

### Beispiel 2: WHOIS Lookup

```
You: Use whois_lookup for github.com

Claude: I'll perform a WHOIS lookup for github.com.
[Uses whois_lookup tool]

Command executed: whois github.com

Result:
Domain Name: GITHUB.COM
Registry Domain ID: 1264983250_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.markmonitor.com
Registrar URL: http://www.markmonitor.com
Updated Date: 2023-09-07T09:10:44Z
Creation Date: 2007-10-09T18:20:50Z
Registry Expiry Date: 2024-10-09T18:20:50Z
Registrar: MarkMonitor Inc.
[... weitere WHOIS Daten ...]

The domain github.com was registered in 2007 and is managed by MarkMonitor Inc.
```

### Beispiel 3: Nmap Scan

```
You: Can you do a quick nmap scan on scanme.nmap.org?

Claude: I'll perform a quick nmap scan on scanme.nmap.org using the Kali container.
[Uses nmap_scan tool with scan_type: "quick"]

Command executed: nmap -F  scanme.nmap.org

Result:
Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.084s latency).
Not shown: 96 closed tcp ports (reset)
PORT      STATE    SERVICE
22/tcp    open     ssh
80/tcp    open     http
443/tcp   filtered https
9929/tcp  open     nping-echo

Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds

The scan found 4 interesting ports on scanme.nmap.org:
- SSH (22) is open
- HTTP (80) is open
- HTTPS (443) is filtered
- Nping-echo (9929) is open
```

### Beispiel 4: DNS Enumeration

```
You: Get the DNS records for example.com

Claude: I'll enumerate the DNS records for example.com.
[Uses dns_enum tool with record_type: "ANY"]

Command executed: dig example.com ANY +noall +answer

Result:
example.com.        86400   IN  A       93.184.216.34
example.com.        86400   IN  NS      a.iana-servers.net.
example.com.        86400   IN  NS      b.iana-servers.net.
example.com.        3600    IN  TXT     "v=spf1 -all"
example.com.        86400   IN  SOA     ns.icann.org. noc.dns.icann.org. ...

Found the following DNS records:
- A record: 93.184.216.34 (IPv4 address)
- NS records: a.iana-servers.net, b.iana-servers.net (name servers)
- TXT record: SPF policy
- SOA record: Start of Authority information
```

### Beispiel 5: Web Directory Scanning

```
You: Use gobuster to scan http://testphp.vulnweb.com for common directories with php extension

Claude: I'll run a Gobuster directory scan on http://testphp.vulnweb.com looking for PHP files.
[Uses gobuster_scan tool]

Command executed: gobuster dir -u http://testphp.vulnweb.com -w /usr/share/wordlists/dirb/common.txt -x php

Result:
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://testphp.vulnweb.com
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin.php            (Status: 200) [Size: 1234]
/login.php            (Status: 200) [Size: 2345]
/index.php            (Status: 200) [Size: 4567]
/images               (Status: 301) [Size: 0]
===============================================================
Finished
===============================================================

Found several interesting paths:
- /admin.php: Admin interface (accessible)
- /login.php: Login page
- /index.php: Main page
- /images: Image directory
```

### Beispiel 6: Custom Command

```
You: Check what version of Metasploit is installed

Claude: I'll check the Metasploit Framework version in the Kali container.
[Uses custom_command tool]

Command executed: msfconsole --version

Result:
Framework Version: 6.3.31-dev

Metasploit Framework version 6.3.31-dev is installed in the container.
```

### Beispiel 7: Komplexer Workflow

```
You: I need to do reconnaissance on example-target.com (authorized pentest).
     Can you start with WHOIS, then DNS enumeration, and finally a service scan?

Claude: I'll perform a comprehensive reconnaissance on example-target.com for you. Let me break this down into steps:

1. First, let me get the WHOIS information:
[Uses whois_lookup]

Command executed: whois example-target.com
Result: [WHOIS data...]

2. Now let's enumerate the DNS records:
[Uses dns_enum]

Command executed: dig example-target.com ANY +noall +answer
Result: [DNS records including A records showing IP: 192.0.2.1]

3. Finally, let's scan the services on the discovered IP:
[Uses nmap_scan with scan_type: "service"]

Command executed: nmap -sV  192.0.2.1
Result: [Service versions for open ports...]

Summary of reconnaissance:
- Domain registered since: 2010
- IP Address: 192.0.2.1
- Open services:
  * SSH (22): OpenSSH 8.2
  * HTTP (80): Apache 2.4.41
  * HTTPS (443): Apache 2.4.41

Would you like me to proceed with web application scanning on the HTTP/HTTPS services?
```

## MCP Status Check

```bash
# Im Claude CLI
$ claude

You: /mcp

Claude: Current MCP Servers:

Name: kali
Status: Connected ✓
Description: Kali Linux security tools in Docker
Tools: 10 available
  - nmap_scan
  - nikto_scan
  - sqlmap_scan
  - dirb_scan
  - gobuster_scan
  - hydra_bruteforce
  - whois_lookup
  - dns_enum
  - custom_command
  - container_status
```

## Workspace Sharing

```
You: Can you save the nmap results to a file in the workspace?

Claude: I'll run the scan and save the results to the workspace directory.
[Uses custom_command]

Command executed: nmap -oA /workspace/scan_results 192.168.1.100

Result:
Starting Nmap...
Nmap done: 1 IP address scanned
[Scan results...]

The scan results have been saved to:
- /workspace/scan_results.nmap (normal output)
- /workspace/scan_results.xml (XML output)
- /workspace/scan_results.gnmap (grepable output)

You can find these files in your local workspace directory at:
./workspace/scan_results.*
```

## Error Handling

```
You: Scan 999.999.999.999

Claude: I'll attempt to scan that IP address.
[Uses nmap_scan]

Command executed: nmap -F  999.999.999.999

Result:
Failed to resolve "999.999.999.999".
WARNING: No targets were specified, so 0 hosts scanned.

Error: The IP address 999.999.999.999 is invalid. Please provide a valid IP address, hostname, or CIDR range.
```

## Container Management

```
You: Is the container running?

Claude: Let me check the container status.
[Uses container_status]

Result:
Container status: running

Yes, the Kali Linux container is currently running and ready.

---

You: The container seems slow, can you restart it?

Claude: I can't directly restart the container through the MCP tools, but you can restart it using:

```bash
./scripts/stop-container.sh
./scripts/start-container.sh
```

Or with Docker Compose:
```bash
docker-compose restart
```

Would you like me to check the container status after you restart it?
```

## Tips für effektive Nutzung

1. **Kombination von Tools**: Nutze mehrere Tools nacheinander für umfassende Assessments
2. **Workspace nutzen**: Speichere Ergebnisse in `/workspace` für spätere Analyse
3. **Custom Commands**: Für spezialisierte Tools, die nicht als dediziertes Tool verfügbar sind
4. **Context aufbauen**: Claude merkt sich den Kontext und kann logische nächste Schritte vorschlagen

## Nächste Schritte

Nach dem Setup kannst du:
- 📚 Weitere Beispiele in `EXAMPLES.md` ansehen
- 🔧 Eigene Tools zum Dockerfile hinzufügen
- 📝 Scan-Ergebnisse in `workspace/` organisieren
- 🎯 Komplexe Workflows erstellen
