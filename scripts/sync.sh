#!/bin/bash
cd "/Users/samoey/pinnacle_projects/pinnacle-core"
git add .
git commit -m "🔄 Auto-sync at $(date)" 2>/dev/null
git push origin main
