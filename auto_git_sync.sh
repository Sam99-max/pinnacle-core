#!/bin/bash
cd "$(dirname "$0")"
git add -A
git commit -m "Auto-sync: $(date +"%Y-%m-%d %H:%M:%S")" || true
git push origin main || true
