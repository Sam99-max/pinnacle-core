#!/bin/zsh
# Master automation script for pinnacle-core-4
# 1. Build the project
# 2. Connect to remote deployment
# 3. Deploy to zenith-xas.com

PROJECT_DIR="/Users/samoey/pinnacle-core-4"
cd "$PROJECT_DIR" || { echo "Project directory not found"; exit 1; }

# Step 1: Build the project (customize as needed)
echo "[1/3] Building pinnacle-core-4..."
if [ -f ./setup/build_api_tools.sh ]; then
  bash ./setup/build_api_tools.sh || { echo "Build failed"; exit 1; }
else
  echo "No build script found, skipping build."
fi

# Step 2: Connect to remote deployment (API/webhook integration)
# Example: curl to notify remote deployment (customize endpoint and payload)
echo "[2/3] Notifying remote deployment..."
curl -X POST https://8881269e-c2b0-4992-a9b1-7bb7dbd0d8f2.deployments.pythagora.ai/api/notify \
  -H "Content-Type: application/json" \
  -d '{"status": "build_complete", "source": "pinnacle-core-4"}' || echo "Remote notification failed."

# Step 3: Deploy to zenith-xas.com (customize with your deployment method)
echo "[3/3] Deploying to zenith-xas.com..."
# Auto sync with GitHub before deployment
echo "[Auto Sync] Pulling latest changes from GitHub..."
git pull origin main || { echo "Git pull failed"; exit 1; }
# Example: rsync files to remote server (replace with your credentials and path)
# rsync -avz --exclude='.git' ./ user@zenith-xas.com:/var/www/pinnacle-core-4/
# Uncomment and set up SSH keys for passwordless deployment

echo "Automation complete."
