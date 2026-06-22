from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NetVisionX"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    GEMINI_API_KEY: str

    # Automatically read from the .env file
    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()