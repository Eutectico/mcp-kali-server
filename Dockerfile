FROM kalilinux/kali-rolling:latest

# Update and install essential tools
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
    # Network scanning
    nmap \
    masscan \
    # Web application testing
    nikto \
    sqlmap \
    wpscan \
    dirb \
    gobuster \
    # Exploitation frameworks
    metasploit-framework \
    # Password cracking
    john \
    hydra \
    hashcat \
    # Wireless tools
    aircrack-ng \
    # Forensics
    binwalk \
    foremost \
    # Reverse engineering
    radare2 \
    # Web proxy
    burpsuite \
    # Utilities
    git \
    curl \
    wget \
    netcat-traditional \
    socat \
    python3 \
    python3-pip \
    ruby \
    perl \
    # Additional recon tools
    whois \
    dnsutils \
    traceroute \
    tcpdump \
    wireshark-common \
    tshark && \
    # Clean up
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install additional Python tools
RUN pip3 install --no-cache-dir \
    impacket \
    pwntools \
    scapy

# Create workspace directory
RUN mkdir -p /workspace && chmod 777 /workspace

WORKDIR /workspace

# Keep container running
CMD ["/bin/bash"]
