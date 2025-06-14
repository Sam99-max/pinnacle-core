#!/bin/zsh
# Master synchronization script for pinnacle-core-4
# This script synchronizes your project across:
# 1. Local Mac directory
# 2. GitHub repository
# 3. iCloud storage

PROJECT_DIR="/Users/samoey/pinnacle-core-4"
ICLOUD_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4"

cd "$PROJECT_DIR" || { echo "Project directory not found"; exit 1; }

echo "===== PINNACLE CORE 4 SYNCHRONIZATION ====="
echo "Starting synchronization process..."

# Step 1: Make sure iCloud directory exists
if [ ! -d "$ICLOUD_DIR" ]; then
  echo "[1/4] Setting up iCloud directory..."
  ./setup/setup_icloud_sync.sh
else
  echo "[1/4] iCloud directory already set up."
fi

# Step 2: Pull latest changes from GitHub
echo "[2/4] Pulling latest changes from GitHub..."
git pull origin main || { echo "Git pull failed"; exit 1; }

# Step 3: Sync with GitHub (add, commit, push)
echo "[3/4] Syncing with GitHub..."
git add .
git commit -m "🔄 Full sync at $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nothing to commit."
git push origin main || echo "Git push failed."

# Step 4: Sync with iCloud
echo "[4/4] Syncing with iCloud..."
rsync -avz --exclude='.git' --exclude='node_modules' "$PROJECT_DIR/" "$ICLOUD_DIR/"

echo "===== SYNCHRONIZATION COMPLETE ====="
echo "Your project is now synchronized across:"
echo "- Local Mac: $PROJECT_DIR"
echo "- GitHub repository"
echo "- iCloud: $ICLOUD_DIR"
echo ""
echo "To deploy your project, run: ./auto_deploy.sh"