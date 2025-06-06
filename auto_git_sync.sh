#!/bin/bash
cd "/Users/samoey/pinnacle_projects/pinnacle-core"
git add . && git commit -m "Auto-sync $(date '+%Y-%m-%d %H:%M:%S')" || true
git push origin main || true
