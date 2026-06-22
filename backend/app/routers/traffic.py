from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import random
from datetime import datetime

router = APIRouter()

@router.websocket("/ws/live")
async def websocket_traffic_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # We simulate a continuous stream of network traffic data
        base_traffic = 500
        while True:
            # Generate realistic-looking fluctuating traffic data
            fluctuation = random.randint(-150, 250)
            current_traffic = max(50, base_traffic + fluctuation)
            
            # Send the data packet to the Next.js frontend
            await websocket.send_json({
                "time": datetime.now().strftime("%H:%M:%S"),
                "traffic": current_traffic
            })
            
            # Wait 2 seconds before sending the next packet
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        print("Client disconnected from live traffic feed")