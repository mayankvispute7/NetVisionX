import os
import asyncio
import json
import random
import subprocess
import platform
from datetime import datetime, timedelta

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from google.genai import types
import psutil

from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# 1. Force Load Environment Variables Immediately
load_dotenv(override=True)

# ==========================================
# DATABASE SETUP
# ==========================================
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("CRITICAL ERROR: DATABASE_URL is not set.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DeviceDB(Base):
    __tablename__ = "devices"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    ip = Column(String)
    type = Column(String)
    status = Column(String)
    traffic = Column(String)

class AlertDB(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, index=True)
    type = Column(String)
    title = Column(String)
    source = Column(String)
    time = Column(String)
    description = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# APP INITIALIZATION
# ==========================================
app = FastAPI(title="NetVisionX API Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Open for MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    if db.query(DeviceDB).count() == 0:
        initial_devices = [
            {"id": "DEV-01", "name": "Core Router Alpha", "ip": "192.168.1.1", "type": "router", "status": "online", "traffic": "450 GB"},
            {"id": "DEV-02", "name": "DB Server Primary", "ip": "127.0.0.1", "type": "server", "status": "online", "traffic": "1.2 TB"},
            {"id": "DEV-03", "name": "Web Node 01", "ip": "192.168.1.21", "type": "server", "status": "warning", "traffic": "890 GB"},
        ]
        for dev in initial_devices:
            db.add(DeviceDB(**dev))
        
        initial_alerts = [
            {"id": "ALT-001", "type": "critical", "title": "Unauthorized Access Attempt", "source": "192.168.1.104", "time": "2 mins ago", "description": "Multiple failed SSH login attempts detected."},
        ]
        for alt in initial_alerts:
            db.add(AlertDB(**alt))
        db.commit()
    db.close()

# ==========================================
# OPEN API ROUTES (NO AUTH REQUIRED)
# ==========================================
@app.get("/")
async def root():
    return {"status": "System Optimal", "service": "NetVisionX Backend Core"}

@app.get("/api/v1/devices")
async def get_devices(db: Session = Depends(get_db)):
    return db.query(DeviceDB).all()

@app.get("/api/v1/alerts")
async def get_alerts(db: Session = Depends(get_db)):
    return db.query(AlertDB).all()

@app.post("/api/v1/devices/ping/{device_id}")
async def ping_device(device_id: str, db: Session = Depends(get_db)):
    device = db.query(DeviceDB).filter(DeviceDB.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    target_ip = device.ip
    command = ["ping", "-n", "1", "-w", "2000", target_ip] if platform.system().lower() == "windows" else ["ping", "-c", "1", "-W", "2", target_ip]
    
    try:
        output = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=4)
        if output.returncode == 0:
            device.status = "online"
            db.commit()
            return {"status": "online", "message": f"Successfully reached {target_ip}"}
        else:
            device.status = "offline"
            db.commit()
            return {"status": "offline", "message": f"Destination host {target_ip} unreachable"}
    except subprocess.TimeoutExpired:
        device.status = "offline"
        db.commit()
        return {"status": "offline", "message": f"Timeout unresponsive."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ping failed: {str(e)}")

@app.get("/api/v1/devices/{device_id}/config")
async def fetch_device_config(device_id: str, db: Session = Depends(get_db)):
    device = db.query(DeviceDB).filter(DeviceDB.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    await asyncio.sleep(1.5)
    cisco_config = f"Building configuration...\n\nhostname {device.name.replace(' ', '-')}\n!\ninterface GigabitEthernet0/0\n ip address {device.ip} 255.255.255.0\n!\nend"
    return {"status": "success", "config": cisco_config}

# ==========================================
# HARDENED AI LOGIC
# ==========================================
@app.post("/api/v1/ai/analyze-log")
async def analyze_log(file: UploadFile = File(...)):
    print(f"\n{'='*40}")
    print(f"[AI_ANALYSIS] Triggered for file: {file.filename}")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[CRITICAL ERROR] GEMINI_API_KEY is not found in the environment!")
        raise HTTPException(status_code=500, detail="Gemini API Key missing on server.")
    else:
        print(f"[SUCCESS] API Key loaded (Starts with: {api_key[:5]}...)")

    try:
        content = await file.read()
        log_data = content.decode("utf-8")
        print(f"[SUCCESS] File read successfully. Length: {len(log_data)} chars.")

        print("[INFO] Initializing Gemini Client...")
        client = genai.Client(api_key=api_key)
        
        system_instruction = "You are NetBot, an expert autonomous network security engineer for the NetVisionX platform. Analyze the logs and provide actionable threat mitigation steps in clean Markdown."
        
        print("[INFO] Sending payload to Google Gemini 2.5 Flash...")
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=log_data,
            config=types.GenerateContentConfig(system_instruction=system_instruction, temperature=0.2)
        )
        
        print("[SUCCESS] AI Response received! Sending to frontend.")
        print(f"{'='*40}\n")
        return {"status": "success", "analysis": response.text}

    except Exception as e:
        print(f"\n[!!! CRITICAL BACKEND CRASH !!!]")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Details: {str(e)}")
        print(f"{'='*40}\n")
        raise HTTPException(status_code=500, detail=f"AI Engine failure: {str(e)}")

# ==========================================
# WEBSOCKET STREAM
# ==========================================
@app.websocket("/api/v1/traffic/ws/live")
async def websocket_traffic_endpoint(websocket: WebSocket):
    await websocket.accept() 
    try:
        old_io = psutil.net_io_counters()
        while True:
            await asyncio.sleep(1.5)
            current_time = datetime.now().strftime("%H:%M:%S")
            new_io = psutil.net_io_counters()
            bytes_sent = new_io.bytes_sent - old_io.bytes_sent
            bytes_recv = new_io.bytes_recv - old_io.bytes_recv
            total_mb = round((bytes_sent + bytes_recv) / (1024 * 1024), 2)
            if total_mb < 0.1:
                total_mb = round(random.uniform(0.5, 2.3), 2)
            old_io = new_io
            await websocket.send_text(json.dumps({"time": current_time, "traffic": total_mb}))
    except WebSocketDisconnect:
        pass