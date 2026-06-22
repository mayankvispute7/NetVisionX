from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.models.device import Device
from app.utils.network import ping_ip

def update_device_status(db: Session, device_id: int) -> Device:
    """
    Finds a device, pings its IP, and updates its online status in the database.
    """
    # 1. Fetch the device from the database
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        return None
    
    # 2. Ping the IP address
    is_responsive = ping_ip(device.ip_address)
    
    # 3. Update the database record
    device.is_online = is_responsive
    # Use timezone-aware UTC time for professional logging
    device.last_checked = datetime.now(timezone.utc) 
    
    # 4. Save changes
    db.commit()
    db.refresh(device)
    
    return device