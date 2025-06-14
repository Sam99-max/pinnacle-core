# Pinnacle Core 4 - Synchronization Instructions

This document explains how to keep your Pinnacle Core 4 project synchronized across multiple platforms:
- Your local Mac
- GitHub repository
- iCloud storage

## Available Synchronization Scripts

### 1. Master Sync Script (Recommended)

The easiest way to sync everything at once:

```bash
./sync_all.sh
```

This script will:
- Set up iCloud sync if not already configured
- Pull the latest changes from GitHub
- Commit and push your local changes to GitHub
- Sync your project to iCloud

### 2. GitHub Sync

For syncing with GitHub only:

```bash
./auto_git_sync.sh
```

This script handles:
- Adding, committing, and pushing changes to GitHub
- Pulling the latest changes from GitHub
- Running the auto_deploy.sh script for deployment

### 3. Simple Sync

For a quick sync to GitHub and iCloud:

```bash
./scripts/sync.sh
```

### 4. iCloud Setup

If you need to set up iCloud sync manually:

```bash
./setup/setup_icloud_sync.sh
```

## Deployment

After synchronizing, you can deploy your project:

```bash
./auto_deploy.sh
```

## Automatic Synchronization

You can set up automatic synchronization using cron jobs:

```bash
# Open crontab editor
crontab -e

# Add a line to run sync_all.sh every hour
0 * * * * /Users/samoey/pinnacle-core-4/sync_all.sh >> /Users/samoey/pinnacle-core-4/sync.log 2>&1
```

## Troubleshooting

If you encounter synchronization issues:

1. Check your Git configuration:
   ```bash
   git config --list
   ```

2. Verify iCloud access:
   ```bash
   ls -la "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4"
   ```

3. Check sync logs:
   ```bash
   tail -n 50 /Users/samoey/pinnacle-core-4/sync.log
   ```

4. Manual force sync:
   ```bash
   cd /Users/samoey/pinnacle-core-4
   git pull origin main
   git add .
   git commit -m "Force sync"
   git push origin main
   rsync -avz --exclude='.git' --exclude='node_modules' /Users/samoey/pinnacle-core-4/ "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Projects/pinnacle-core-4/"
   ```