from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String, index=True, nullable=False)
    ip_address = Column(String, unique=True, index=True, nullable=False)
    device_type = Column(String, nullable=False) # e.g., router, switch, firewall
    vendor = Column(String, nullable=True)       # e.g., Cisco, Juniper
    is_online = Column(Boolean, default=False)
    last_checked = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())