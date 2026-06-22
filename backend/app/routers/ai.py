import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from google import genai
from google.genai import types
from dotenv import load_dotenv

# 1. Force load the .env file locally for this router
load_dotenv(override=True)

router = APIRouter()

@router.post("/analyze-log")
async def analyze_log(file: UploadFile = File(...)):
    print(f"\n{'='*40}")
    print(f"[AI_ANALYSIS] Triggered for file: {file.filename}")
    
    # 2. Verify API Key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[CRITICAL ERROR] GEMINI_API_KEY is not found in the environment!")
        raise HTTPException(status_code=500, detail="Gemini API Key missing on server.")
    else:
        print(f"[SUCCESS] API Key loaded (Starts with: {api_key[:5]}...)")

    try:
        # Read the file
        content = await file.read()
        log_data = content.decode("utf-8")
        print(f"[SUCCESS] File read successfully. Length: {len(log_data)} chars.")

        # Initialize Client
        print("[INFO] Initializing Gemini Client...")
        client = genai.Client(api_key=api_key)
        
        system_instruction = "You are NetBot, an expert autonomous network security engineer for the NetVisionX platform. Analyze the logs and provide actionable threat mitigation steps in clean Markdown."
        
        # Call API
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
        # 3. The Ultimate Error Catcher
        print(f"\n[!!! CRITICAL BACKEND CRASH !!!]")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Details: {str(e)}")
        print(f"{'='*40}\n")
        raise HTTPException(status_code=500, detail=f"AI Engine failure: {str(e)}")