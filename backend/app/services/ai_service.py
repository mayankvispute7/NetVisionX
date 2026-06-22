import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.log import LogAnalysisResult

# Initialize the new modern Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def analyze_network_log(log_content: str) -> LogAnalysisResult:
    """
    Sends raw network log text to Gemini and forces it to return structured JSON.
    """
    prompt = f"""
    You are an expert Cisco Network Automation Architect. 
    Analyze the following network log snippet. Detect the issue, find the root cause, and suggest fixes.
    
    Required JSON structure:
    {{
        "severity": "Low" | "Medium" | "High" | "Critical",
        "root_cause": "A brief, highly technical explanation of the failure",
        "suggested_fixes": ["Fix step 1", "Fix step 2"]
    }}
    
    Log Content:
    {log_content}
    """
    
    try:
        # Call the AI model using the new syntax and enforce JSON formatting
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        # Convert the string to a Python dictionary
        data = json.loads(response.text)
        
        # Validate and return using our Pydantic schema
        return LogAnalysisResult(**data)
        
    except Exception as e:
        # If the AI fails, catch it safely
        return LogAnalysisResult(
            severity="Critical",
            root_cause=f"AI Analysis Failed: {str(e)}",
            suggested_fixes=["Review logs manually"]
        )