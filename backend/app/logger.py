import logging
import os
from datetime import datetime

# Ensure logs directory exists
log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
os.makedirs(log_dir, exist_ok=True)

log_file_path = os.path.join(log_dir, "network_operations.log")

# Configure professional log formatting
logging.basicConfig(
    filename=log_file_path,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def log_event(event_type: str, message: str):
    """
    Logs an enterprise event to the permanent log file.
    """
    formatted_message = f"[{event_type.upper()}] {message}"
    logging.info(formatted_message)
    print(formatted_message) # Also print to terminal for easy debugging