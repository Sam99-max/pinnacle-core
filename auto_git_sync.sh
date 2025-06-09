#!/bin/zsh
# Master auto sync script for pinnacle-core-1
# 1. Add, commit, and push all changes to GitHub
# 2. Pull latest changes from GitHub
# 3. Run auto_deploy.sh for build and deployment

cd "/Users/samoey/pinnacle-core-1" || { echo "Project directory not found"; exit 1; }

echo "[Auto Sync] Adding all changes..."
git add .

echo "[Auto Sync] Committing changes..."
git commit -m "Auto-sync $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nothing to commit."

echo "[Auto Sync] Pushing to GitHub..."
git push origin main || echo "Git push failed."

echo "[Auto Sync] Pulling latest changes from GitHub..."
git pull origin main || { echo "Git pull failed"; exit 1; }

echo "[Auto Sync] Running auto_deploy.sh..."
./auto_deploy.sh || { echo "Auto deploy failed"; exit 1; }

echo "[Auto Sync] Complete."
