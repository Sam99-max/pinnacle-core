#!/bin/bash
# Simple sync script for pinnacle-core-4
cd "/Users/samoey/pinnacle-core-4"
git add .
git commit -m "🔄 Auto-sync at $(date)" 2>/dev/null
git push origin main

# Sync with iCloud if the directory exists
if [ -d "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4" ]; then
  echo "Syncing with iCloud..."
  rsync -avz --exclude='.git' --exclude='node_modules' "/Users/samoey/pinnacle-core-4/" "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4/"
  echo "iCloud sync complete."
fi