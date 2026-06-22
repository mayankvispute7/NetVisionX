import os
import time
from datetime import datetime
from netmiko import ConnectHandler, NetmikoTimeoutException, NetmikoAuthenticationException

BACKUP_DIR = os.path.join(os.getcwd(), "backups")
os.makedirs(BACKUP_DIR, exist_ok=True)

def backup_device_config(ip_address: str, username: str, password: str, device_type: str = 'cisco_ios', use_mock: bool = False) -> dict:
    """
    Connects to a network device via SSH, grabs the running config, and saves it to a file.
    Includes a mock mode for testing and portfolio demonstrations.
    """
    
    # --- MOCK MODE LOGIC ---
    if use_mock:
        # Simulate network latency (2 seconds) so it feels real in the UI
        time.sleep(2) 
        
        mock_config = f"""!
! Last configuration change at {datetime.now().strftime('%H:%M:%S %Z %a %b %d %Y')}
!
version 15.4
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
!
hostname Core-Router-{ip_address.replace('.', '-')}
!
boot-start-marker
boot-end-marker
!
interface GigabitEthernet0/0
 description ** MANAGEMENT INTERFACE **
 ip address {ip_address} 255.255.255.0
 no ip route-cache
 duplex auto
 speed auto
!
line vty 0 4
 login local
 transport input ssh
!
end"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"MOCK_{ip_address}_{timestamp}.cfg"
        filepath = os.path.join(BACKUP_DIR, filename)
        
        with open(filepath, 'w') as backup_file:
            backup_file.write(mock_config)
            
        return {
            "status": "success",
            "message": "Mock backup completed successfully. File saved to disk.",
            "file": filename,
            "size_bytes": len(mock_config)
        }
    # --- END MOCK MODE ---

    # Real Netmiko Logic
    device_params = {
        'device_type': device_type,
        'host': ip_address,
        'username': username,
        'password': password,
        'timeout': 10, 
    }

    try:
        connection = ConnectHandler(**device_params)
        running_config = connection.send_command("show running-config")
        connection.disconnect()
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{ip_address}_{timestamp}.cfg"
        filepath = os.path.join(BACKUP_DIR, filename)
        
        with open(filepath, 'w') as backup_file:
            backup_file.write(running_config)
            
        return {
            "status": "success",
            "message": "Backup completed successfully",
            "file": filename,
            "size_bytes": len(running_config)
        }
        
    except NetmikoAuthenticationException:
        return {"status": "error", "message": "Authentication failed. Check username/password."}
    except NetmikoTimeoutException:
        return {"status": "error", "message": "Connection timed out. Device might be offline or firewalled."}
    except Exception as e:
        return {"status": "error", "message": f"An unexpected error occurred: {str(e)}"}