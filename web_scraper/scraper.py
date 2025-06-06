#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup

def scrape(url):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    return soup.title.string

if __name__ == "__main__":
    import sys
    print(scrape(sys.argv[1]) if len(sys.argv) > 1 else "Usage: scraper.py <url>")
