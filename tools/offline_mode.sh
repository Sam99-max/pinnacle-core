#!/bin/bash
ping -q -c 1 google.com > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "[📴] Offline fallback mode activated."
else
  echo "[📶] Online mode active."
fi
