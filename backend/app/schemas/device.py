from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DeviceBase(BaseModel):
    hostname: str
    ip_address: str
    device_type: str
    vendor: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceResponse(DeviceBase):
    id: int
    is_online: bool
    last_checked: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# NEW SCHEMA FOR SUBNET SCANNING
class SubnetScanRequest(BaseModel):
    subnet: str