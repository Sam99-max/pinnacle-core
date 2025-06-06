#!/bin/bash
read -p "Enter URL: " url
curl -s "$url" | grep -Eo '<title>[^<]*</title>'
