from pydantic import BaseModel
from typing import List

class LogAnalysisResult(BaseModel):
    severity: str
    root_cause: str
    suggested_fixes: List[str]