#!/bin/bash
cd "$(dirname "$0")"
git pull --rebase
git add .
git commit -am "🛠️ Auto-update: $(date)" || true
git push
