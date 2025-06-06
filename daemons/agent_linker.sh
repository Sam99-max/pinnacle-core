#!/bin/bash
while true; do
  for agent in planner memory executor; do
    echo "[Linker] Agent $agent active."
  done
  sleep 60
done
