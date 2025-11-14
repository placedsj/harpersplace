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
        str: Generated filename in format [DATE]_[TYPE]_[SUMMARY]
        
    Raises:
        Exception: If Gemini API call fails or returns invalid format
    """
    prompt = (
        "PERFORM OCR on this image. Then, extract the following three pieces of information to create a structured filename: "
        "1. The most accurate date (DD-MM-YYYY). "
        "2. The type of document (e.g., 'Email', 'Text_Message', 'Medical_Bill'). "
        "3. A short, professional summary of the content (5 words max). "
        "Format the output EXACTLY like this: [DATE]_[TYPE]_[SUMMARY]"
    )
    
    # This function assumes genai is already configured
    try:
        # Upload the file bytes to Gemini
        # Convert bytes to a file-like object
        file_data = io.BytesIO(file_bytes)
        logging.info("Sending image to Gemini for analysis.")
        
        # Use the Gemini model for vision tasks
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Prepare the image part
        image_part = {
            'mime_type': 'image/jpeg',  # Adjust mime type if needed
            'data': file_bytes
        }
        
        # Generate content with the prompt and image
        response = model.generate_content([prompt, image_part])
        
        # Extract the generated filename
        new_filename = response.text.strip()
        
        # Basic validation of the response format
        if not new_filename or '_' not in new_filename:
            raise ValueError(f"Received invalid filename format from Gemini: '{new_filename}'")

        return new_filename
        
    except Exception as e:
        # Re-raise the exception to be handled by the main loop for fallback logic
        # This allows for fallback naming logic.
        raise Exception(f"Gemini analysis failed: {str(e)}")

def get_fallback_filename(original_filename):
    from datetime import datetime
    date_str = datetime.now().strftime('%Y-%m-%d')
    return f"NEEDS_REVIEW_{date_str}_{original_filename}"

def main():
    """
    Main function to process all files in the Google Drive folder.
    Lists files, downloads them, analyzes with Gemini, and renames them.
    """
    logging.info("Starting file processing script.")
    try:
        # --- Configuration and Setup ---
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT_ID")
        folder_id = os.getenv("DRIVE_FOLDER_ID")

        if not all([project_id, folder_id, os.getenv("DRIVE_SERVICE_ACCOUNT")]):
            raise ValueError("One or more required environment variables are not set (GOOGLE_CLOUD_PROJECT_ID, DRIVE_FOLDER_ID, DRIVE_SERVICE_ACCOUNT).")

        logging.info("All required environment variables are present.")

        # Configure Gemini API
        api_key = get_secret(project_id, "gemini-api-key")
        genai.configure(api_key=api_key)
        logging.info("Gemini API configured successfully.")

        # Setup Drive service        
        drive_service = setup_drive_service()

        # --- File Listing ---
        logging.info(f"Fetching files from Google Drive folder: {folder_id}")
        query = f"'{folder_id}' in parents and trashed=false"
        results = drive_service.files().list(
            q=query,
            fields="files(id, name, mimeType)",
            pageSize=100
        ).execute()
        files = results.get('files', [])
        
        if not files:
            logging.info("No files found in the specified folder.")
            return
        
        logging.info(f"Found {len(files)} file(s) to process.")
        
        # Process each file
        for file in files:
            file_id = file['id']
            file_name = file['name']
            mime_type = file.get('mimeType', '')
            
            logging.info(f"Processing: '{file_name}' (ID: {file_id})")
            
            # Skip non-image files
            if not mime_type.startswith('image/'):
                logging.warning(f"  Skipping non-image file '{file_name}' with MIME type: {mime_type}")
                continue
            
            try:
                # Download file bytes
                request = drive_service.files().get_media(fileId=file_id)
                file_bytes_io = io.BytesIO()
                downloader = MediaIoBaseDownload(file_bytes_io, request)
                
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                
                file_bytes = file_bytes_io.getvalue()
                logging.info(f"  Downloaded {len(file_bytes)} bytes for '{file_name}'.")
                
                # Analyze and get new filename
                try:
                    new_filename = analyze_and_rename(file_bytes)
                    logging.info(f"  Gemini generated filename: '{new_filename}'")
                except Exception as analysis_error:
                    logging.warning(f"  Gemini analysis failed for '{file_name}': {analysis_error}")
                    new_filename = get_fallback_filename(file_name)
                    logging.info(f"  Using fallback filename: '{new_filename}'")

                
                # Add file extension if not present
                if '.' not in new_filename:
                    # Get extension from original filename
                    if '.' in file_name:
                        ext = file_name.rsplit('.', 1)[1]
                        new_filename = f"{new_filename}.{ext}"
                    else:
                        # Default to jpg for images
                        new_filename = f"{new_filename}.jpg"
                
                # Rename the file in Google Drive
                updated_file = drive_service.files().update(
                    fileId=file_id,
                    body={'name': new_filename}
                ).execute()
                
                logging.info(f"  Successfully renamed '{file_name}' to '{updated_file.get('name')}'")
                
            except Exception as e:
                logging.error(f"  An unexpected error occurred while processing file '{file_name}': {e}")
                continue
        
        logging.info("="*50)
        logging.info("All files processed. Script finished.")
        
    except Exception as e:
        logging.critical(f"A fatal error occurred: {e}", exc_info=True)
        raise

if __name__ == "__main__":
    main()