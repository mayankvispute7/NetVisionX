import platform
import subprocess
import ipaddress
from concurrent.futures import ThreadPoolExecutor

def ping_ip(ip_address: str) -> bool:
    """
    Pings an IP address and returns True if it responds, False otherwise.
    """
    is_windows = platform.system().lower() == 'windows'
    param = '-n' if is_windows else '-c'
    # Add a timeout so we don't wait forever on dead IP addresses
    timeout_param = '-w' if is_windows else '-W'
    timeout_val = '1000' if is_windows else '1'
    
    command = ['ping', param, '1', timeout_param, timeout_val, ip_address]
    
    try:
        output = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return output.returncode == 0
    except Exception:
        return False

def scan_subnet(subnet: str) -> list[str]:
    """
    Scans a given subnet (e.g., '192.168.1.0/24') and returns a list of responsive IP addresses.
    Uses multi-threading to scan concurrently for speed.
    """
    try:
        network = ipaddress.ip_network(subnet, strict=False)
    except ValueError:
        return [] # Invalid subnet format
        
    active_ips = []
    
    # Use 50 workers to ping multiple IPs simultaneously 
    with ThreadPoolExecutor(max_workers=50) as executor:
        hosts = [str(ip) for ip in network.hosts()]
        results = executor.map(ping_ip, hosts)
        
        for ip, is_active in zip(hosts, results):
            if is_active:
                active_ips.append(ip)
                
    return active_ips