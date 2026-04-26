import requests
import json

import sys

API_URL = "http://localhost:3001/api/infographic/generate" # Update port if needed

def trigger():
    event_name = sys.argv[1] if len(sys.argv) > 1 else None
    print(f"🚀 Triggering Infographic Generation... {f'(Event: {event_name})' if event_name else ''}")
    
    try:
        payload = {"eventName": event_name} if event_name else {}
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            data = response.json()
            print("\n✅ SUCCESS!")
            print(json.dumps(data, indent=2))
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    trigger()
