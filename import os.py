import os
import json
import io
import logging
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from googleapiclient.errors import HttpError
from google.cloud import secretmanager
import google.generativeai as genai
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file
load_dotenv()

def setup_drive_service():
    creds_json = os.getenv("DRIVE_SERVICE_ACCOUNT")
    creds_dict = json.loads(creds_json)
    creds = service_account.Credentials.from_service_account_info(creds_dict, scopes=['https://www.googleapis.com/auth/drive'])
    try:
        drive_service = build('drive', 'v3', credentials=creds)
        logging.info("Google Drive service setup successful.")
        return drive_service
    except HttpError as e:
        logging.error(f"Failed to build Google Drive service: {e}")
        raise

def get_secret(project_id, secret_id, version_id="latest"):
    """
    Retrieves a secret from Google Secret Manager.
    """
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    try:
        response = client.access_secret_version(request={"name": name})
        logging.info(f"Successfully retrieved secret: {secret_id}")
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logging.error(f"Error accessing secret: {secret_id}. Ensure it exists and the service account has the 'Secret Manager Secret Accessor' role.")
        raise e


def analyze_and_rename(file_bytes):
    """
    Use Gemini API to perform OCR on the image and generate a structured filename.
    
    Args:
        file_bytes: Bytes of the image file
        
    Returns:
        str: Generated filename