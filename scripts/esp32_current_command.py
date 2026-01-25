import urequests
import json
import time

# Your Firebase Cloud Function URL
FIREBASE_URL = "https://us-central1-placed-app.cloudfunctions.net/updateShedStats"

def send_to_cloud(current_amps, status):
    data = {
        "shed_id": "SHED_802_NB",  # Unique ID for the Saint John unit
        "current_amps": current_amps,
        "relay_status": status,   # "ON" or "SHEDDING_LOAD"
        "auth_token": "PLACED_SECURE_TOKEN_2026"
    }
    try:
        headers = {'Content-Type': 'application/json'}
        response = urequests.post(FIREBASE_URL, data=json.dumps(data), headers=headers)
        print("Cloud Sync Success:", response.status_code)
        response.close()
    except Exception as e:
        print("Cloud Sync Failed:", e)

def main_loop():
    while True:
        # Mock reading from CT Clamp sensor
        current_amps = read_amps_from_sensor() 
        relay_status = "ON"
        
        if current_amps > 14.5:
            relay_status = "SHEDDING_LOAD"
            trigger_relay_off()
            print("ALERT: Load Shedding Active!")
            
        send_to_cloud(current_amps, relay_status)
        time.sleep(5) # Push every 5 seconds

def read_amps_from_sensor():
    # Placeholder for ADC logic
    return 12.4

def trigger_relay_off():
    # Placeholder for GPIO logic
    pass

if __name__ == "__main__":
    main_loop()
