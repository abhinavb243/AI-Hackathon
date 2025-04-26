#!/bin/bash

# Set the path to the backend directory
BACKEND_DIR="$(dirname "$(dirname "$(realpath "$0")")")/backend"

# Check if the backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: Backend directory not found at $BACKEND_DIR"
    exit 1
fi

# Change to the backend directory
cd "$BACKEND_DIR"

# Check if the virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install or update dependencies
echo "Installing/updating dependencies..."
pip install -r requirements.txt

# Start the API server
echo "Starting API server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Deactivate the virtual environment when done
deactivate 