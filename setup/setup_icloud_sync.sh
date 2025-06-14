#!/bin/zsh
# Setup iCloud sync for pinnacle-core-4

# Define paths
PROJECT_DIR="/Users/samoey/pinnacle-core-4"
ICLOUD_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4"

# Create iCloud directory if it doesn't exist
if [ ! -d "$ICLOUD_DIR" ]; then
  echo "Creating iCloud directory structure..."
  mkdir -p "$ICLOUD_DIR"
  echo "iCloud directory created at: $ICLOUD_DIR"
else
  echo "iCloud directory already exists at: $ICLOUD_DIR"
fi

# Initial sync from project to iCloud
echo "Performing initial sync to iCloud..."
rsync -avz --exclude='.git' --exclude='node_modules' "$PROJECT_DIR/" "$ICLOUD_DIR/"
echo "Initial sync complete."

echo "iCloud sync setup complete. You can now use auto_git_sync.sh or scripts/sync.sh to keep everything in sync."