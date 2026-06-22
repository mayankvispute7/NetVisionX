# Use official lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install OS-level dependencies (required for our ICMP Ping engine)
RUN apt-get update && apt-get install -y iputils-ping && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the API port
EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]