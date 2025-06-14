#!/bin/zsh
# Master auto sync script for pinnacle-core-4
# 1. Add, commit, and push all changes to GitHub
# 2. Pull latest changes from GitHub
# 3. Run auto_deploy.sh for build and deployment

PROJECT_DIR="/Users/samoey/pinnacle-core-4"
cd "$PROJECT_DIR" || { echo "Project directory not found"; exit 1; }

echo "[Auto Sync] Adding all changes..."
git add .

echo "[Auto Sync] Committing changes..."
git commit -m "Auto-sync $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nothing to commit."

echo "[Auto Sync] Pushing to GitHub..."
git push origin main || echo "Git push failed."

echo "[Auto Sync] Pulling latest changes from GitHub..."
git pull origin main || { echo "Git pull failed"; exit 1; }

# Sync with iCloud if needed
if [ -d "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4" ]; then
  echo "[Auto Sync] Syncing with iCloud..."
  rsync -avz --exclude='.git' --exclude='node_modules' "$PROJECT_DIR/" "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4/"
  echo "[Auto Sync] iCloud sync complete."
fi

echo "[Auto Sync] Running auto_deploy.sh..."
"$PROJECT_DIR/auto_deploy.sh" || { echo "Auto deploy failed"; exit 1; }

echo "[Auto Sync] Complete."