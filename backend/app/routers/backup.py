from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.backup_service import backup_device_config

router = APIRouter()

class BackupRequest(BaseModel):
    ip_address: str
    username: str
    password: str
    device_type: str = "cisco_ios"
    use_mock: bool = False  # <-- NEW: Defaults to False so real backups still work

@router.post("/")
def trigger_backup(request: BackupRequest):
    """
    Triggers an SSH connection to backup the running configuration of a network device.
    Set 'use_mock' to true if you do not have a physical device to connect to.
    """
    result = backup_device_config(
        ip_address=request.ip_address,
        username=request.username,
        password=request.password,
        device_type=request.device_type,
        use_mock=request.use_mock # <-- NEW: Pass the flag to the service
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result["message"])
        
    return result