from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceResponse, SubnetScanRequest
from app.services.device_service import update_device_status
from app.utils.network import scan_subnet

router = APIRouter()

@router.post("/", response_model=DeviceResponse)
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    db_device = db.query(Device).filter(Device.ip_address == device.ip_address).first()
    if db_device:
        raise HTTPException(status_code=400, detail="IP address already registered")
    
    new_device = Device(
        hostname=device.hostname,
        ip_address=device.ip_address,
        device_type=device.device_type,
        vendor=device.vendor
    )
    
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    
    return new_device

@router.get("/", response_model=List[DeviceResponse])
def get_devices(db: Session = Depends(get_db)):
    return db.query(Device).all()

@router.post("/{device_id}/ping", response_model=DeviceResponse)
def ping_device(
    device_id: int = Path(..., description="The ID of the device to ping"),
    db: Session = Depends(get_db)
):
    updated_device = update_device_status(db, device_id=device_id)
    if not updated_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return updated_device

# NEW DISCOVERY ENDPOINT
@router.post("/discover")
def discover_network(request: SubnetScanRequest):
    """
    Scans a subnet (e.g., 192.168.1.0/24) and returns all active IP addresses.
    """
    active_ips = scan_subnet(request.subnet)
    
    if not active_ips:
        return {"message": "No active devices found or invalid subnet.", "active_ips": []}
        
    return {"message": f"Discovered {len(active_ips)} active devices.", "active_ips": active_ips}