import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
# import google.generativeai as genai

def setup_drive_service():
    creds_json = os.getenv("DRIVE_SERVICE_ACCOUNT")
    creds_dict = json.loads(creds_json)
    creds = service_account.Credentials.from_service_account_info(creds_dict, scopes=['https://www.googleapis.com/auth/drive'])
    drive_service = build('drive', 'v3', credentials=creds)
    return drive_service

def analyze_and_rename(file_bytes):
    prompt = (
        "PERFORM OCR on this image. Then, extract the following three pieces of information to create a structured filename: "
        "1. The most accurate date (DD-MM-YYYY). "
        "2. The type of document (e.g., 'Email', 'Text_Message', 'Medical_Bill'). "
        "3. A short, professional summary of the content (5 words max). "
        "Format the output EXACTLY like this: [DATE]_[TYPE]_[SUMMARY]"
    )
    # TODO: Call Gemini API for OCR and filename generation
    pass

def main():
    drive_service = setup_drive_service()
    folder_id = os.getenv("DRIVE_FOLDER_ID")
    # TODO: List files in folder, download bytes, call analyze_and_rename, then rename in Drive
    pass

if __name__ == "__main__":
    main()