# Quick Start Guide - MCP Kali Server mit Claude CLI

## Voraussetzungen

Stelle sicher, dass du folgendes installiert hast:
- Docker & Docker Compose
- Node.js (v18+)
- Claude CLI

## Wie funktioniert das System?

```
┌─────────────────────────────────────┐
│        HOST SYSTEM                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   MCP Server (Node.js)      │   │
│  │   - Läuft auf Host          │   │
│  │   - Greift auf Docker       │   │
│  │     Socket zu               │   │
│  │   - Managed Kali Container  │   │
│  └──────────┬──────────────────┘   │
│             │ Docker API            │
│  ┌──────────▼──────────────────┐   │
│  │   Docker                    │   │
│  │  ┌───────────────────────┐  │   │
│  │  │  Kali Container       │  │   │
│  │  │  - Security Tools     │  │   │
│  │  │  - Isoliert           │  │   │
│  │  │  - KEIN Docker Zugriff│  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Wichtig:** Der MCP Server läuft auf dem Host, NICHT im Container. Nur der Host-Server kann Docker-Container verwalten.

## Schritt-für-Schritt Anleitung

### 1. Repository klonen/kopieren

```bash
cd /pfad/zum/mcp-kali-server
```

### 2. Projekt bauen

```bash
# Alles auf einmal
./scripts/build.sh

# Oder manuell:
npm install
npm run build
docker-compose build
```

### 3. MCP Server zu Claude CLI hinzufügen

**Option A: Mit CLI-Befehl (empfohlen)**
```bash
# Für aktuelles Projekt
claude mcp add --transport stdio kali -- node $(pwd)/dist/index.js

# Für alle Projekte (user-level)
claude mcp add --scope user --transport stdio kali -- node $(pwd)/dist/index.js
```

**Option B: Mit .mcp.json (automatisch)**
Die `.mcp.json` Datei ist bereits im Projekt und wird automatisch erkannt, wenn du Claude CLI im Projektverzeichnis startest.

### 4. Verifizieren

```bash
# Liste alle MCP Server
claude mcp list

# Sollte ausgeben:
# kali - Kali Linux security tools in Docker
```

### 5. Container starten

```bash
./scripts/start-container.sh

# Oder manuell:
docker-compose up -d
```

### 6. Testen

Starte Claude Code oder CLI und teste ein Tool:

```
Hey Claude, use container_status to check if the Kali container is running
```

Oder teste ein einfaches Scan-Tool:

```
Use whois_lookup for google.com
```

## Verfügbare Befehle

### MCP Management
```bash
claude mcp list              # Alle Server anzeigen
claude mcp get kali          # Details für Kali Server
claude mcp remove kali       # Server entfernen
```

### Container Management
```bash
./scripts/start-container.sh # Container starten
./scripts/stop-container.sh  # Container stoppen
./scripts/shell.sh           # Shell im Container öffnen
docker-compose logs -f       # Logs anzeigen
```

### Im Claude CLI
```
/mcp                         # MCP Server Status anzeigen
```

## Beispiel-Konversation mit Claude

```
Du: Use nmap_scan to scan 192.168.1.1 with scan_type "quick"

Claude: [Führt nmap -F 192.168.1.1 im Kali Container aus]
        [Zeigt Ergebnisse an]

Du: Use whois_lookup for example.com

Claude: [Führt whois example.com aus]
        [Zeigt Domain-Informationen an]
```

## Troubleshooting

### MCP Server wird nicht erkannt
```bash
# Prüfe ob der Server registriert ist
claude mcp list

# Wenn nicht, füge ihn hinzu
claude mcp add --transport stdio kali -- node $(pwd)/dist/index.js
```

### Container startet nicht
```bash
# Prüfe Docker
docker ps -a

# Logs anzeigen
docker-compose logs

# Neustart
docker-compose down
docker-compose up -d
```

### Berechtigung-Fehler
```bash
# Docker Socket Berechtigung
sudo chmod 666 /var/run/docker.sock

# Oder user zur docker-Gruppe hinzufügen
sudo usermod -aG docker $USER
newgrp docker
```

### Tools funktionieren nicht
```bash
# Shell im Container öffnen
./scripts/shell.sh

# Tool manuell testen
nmap --version
nikto -Version
```

## Sicherheitshinweis

⚠️ **Wichtig:** Nutze diese Tools nur:
- Auf eigenen Systemen
- Mit expliziter schriftlicher Erlaubnis
- In legalen CTF-Umgebungen
- Für autorisierte Penetration Tests

Nicht autorisiertes Scannen ist in den meisten Ländern illegal!

## Nächste Schritte

1. **Lerne die Tools kennen:** Siehe `EXAMPLES.md` für praktische Beispiele
2. **Eigene Wordlists:** Lege sie in `workspace/` ab
3. **Ergebnisse speichern:** Alle Scans können nach `workspace/` exportiert werden
4. **Erweitern:** Füge eigene Tools zum Dockerfile hinzu

## Support

Probleme? Überprüfe:
1. Docker läuft: `docker ps`
2. Image gebaut: `docker images | grep mcp-kali`
3. Container Status: `docker-compose ps`
4. MCP registriert: `claude mcp list`
