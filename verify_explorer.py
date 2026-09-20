import urllib.request
import json
import sys

def test_dev_server():
    print("[1/3] Testing Vite dev server response...")
    req = urllib.request.Request("http://localhost:5173/")
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        assert "LIFE//RECEIPTS" in html or "id=\"root\"" in html
        print(f"  [OK] Dev server responded with status {response.status}, HTML length: {len(html)}")

def test_data_endpoints():
    print("[2/3] Testing static datasets availability...")
    datasets = [
        "http://localhost:5173/data/spotify_sample.csv",
        "http://localhost:5173/data/daily_household.csv",
        "http://localhost:5173/data/india_transactions.csv"
    ]
    for url in datasets:
        with urllib.request.urlopen(url) as response:
            data = response.read(200).decode('utf-8')
            print(f"  [OK] {url.split('/')[-1]}: {response.status} (First line: {data.splitlines()[0][:50]}...)")

def main():
    test_dev_server()
    test_data_endpoints()
    print("[3/3] Receipts Explorer verification script completed successfully!")

if __name__ == "__main__":
    main()
