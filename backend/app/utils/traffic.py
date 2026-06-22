import time
from collections import Counter
import random

def analyze_live_traffic(packet_count: int = 50, timeout: int = 10, use_mock: bool = False) -> dict:
    """
    Captures network packets and returns statistics on protocols and top talkers.
    Requires Administrator privileges unless use_mock is True.
    """
    if use_mock:
        # Simulate network capture time
        time.sleep(2)
        return {
            "status": "success",
            "total_packets": packet_count,
            "protocols": {
                "TCP": int(packet_count * 0.7), 
                "UDP": int(packet_count * 0.2), 
                "ICMP": int(packet_count * 0.1)
            },
            "top_talkers": ["192.168.1.15", "10.0.0.5", "8.8.8.8", "142.250.190.46"],
            "message": "Mock traffic analysis complete."
        }

    # Real Scapy Capture Logic
    try:
        from scapy.all import sniff, IP, TCP, UDP, ICMP
    except ImportError:
        return {"status": "error", "message": "Scapy library is not installed."}

    protocols = Counter()
    ips = Counter()

    def packet_callback(packet):
        if IP in packet:
            ips[packet[IP].src] += 1
            if TCP in packet: protocols["TCP"] += 1
            elif UDP in packet: protocols["UDP"] += 1
            elif ICMP in packet: protocols["ICMP"] += 1
            else: protocols["Other"] += 1

    try:
        # Sniff packets on the default interface
        sniff(prn=packet_callback, count=packet_count, timeout=timeout)
    except PermissionError:
        return {"status": "error", "message": "Administrator privileges required to sniff packets. Try running in mock mode."}
    except Exception as e:
        return {"status": "error", "message": f"Capture failed: {str(e)}"}

    return {
        "status": "success",
        "total_packets": sum(protocols.values()),
        "protocols": dict(protocols),
        "top_talkers": [ip for ip, count in ips.most_common(5)],
        "message": "Live traffic analysis complete."
    }