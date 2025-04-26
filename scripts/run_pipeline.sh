#!/bin/bash

# Set the path to the backend directory
BACKEND_DIR="$(dirname "$(dirname "$(realpath "$0")")")/backend"
LOG_DIR="$BACKEND_DIR/logs"
EMAIL="admin@example.com"  # Change to your email

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Log file with timestamp
LOG_FILE="$LOG_DIR/pipeline_$(date +%Y%m%d_%H%M%S).log"

# Check if the backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: Backend directory not found at $BACKEND_DIR" | tee -a "$LOG_FILE"
    echo "Pipeline execution failed" | mail -s "Compliance Pipeline Error" "$EMAIL"
    exit 1
fi

# Function to handle errors
handle_error() {
    echo "Error: Pipeline execution failed: $1" | tee -a "$LOG_FILE"
    echo "Pipeline execution failed: $1" | mail -s "Compliance Pipeline Error" "$EMAIL"
    exit 1
}

# Execute the pipeline
echo "Starting compliance pipeline execution at $(date)" | tee -a "$LOG_FILE"

# Make API call to run the pipeline
# In a real implementation, this would call the appropriate FastAPI endpoint
curl -s -X POST "http://localhost:8000/reg-intel/scrape" \
     -H "Content-Type: application/json" | tee -a "$LOG_FILE" || handle_error "Regulatory intelligence scraping failed"

echo "Regulatory intelligence scraping completed" | tee -a "$LOG_FILE"

# In a real implementation, we would have additional steps
# to process the results through the full pipeline
echo "Pipeline execution completed successfully at $(date)" | tee -a "$LOG_FILE" 