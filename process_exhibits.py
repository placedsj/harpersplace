import os
import json
import io
import concurrent.futures
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import google.generativeai as genai

def setup_drive_service():
    creds_json = os.getenv("DRIVE_SERVICE_ACCOUNT")
    creds_dict = json.loads(creds_json)
    creds = service_account.Credentials.from_service_account_info(creds_dict, scopes=['https://www.googleapis.com/auth/drive'])
    drive_service = build('drive', 'v3', credentials=creds)
    return drive_service

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
    
    try:
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        genai.configure(api_key=api_key)
        
        # Upload the file bytes to Gemini
        # Convert bytes to a file-like object
        file_data = io.BytesIO(file_bytes)
        
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
            raise ValueError(f"Invalid filename format from Gemini: {new_filename}")
        
        return new_filename
        
    except Exception as e:
        raise Exception(f"Error analyzing file with Gemini: {str(e)}")

def process_single_file(file, drive_service):
    """
    Process a single file: download, analyze, and rename.
    """
    file_id = file['id']
    file_name = file['name']
    mime_type = file.get('mimeType', '')

    print(f"\nProcessing: {file_name} (ID: {file_id})")

    # Skip non-image files
    if not mime_type.startswith('image/'):
        print(f"  Skipping non-image file: {mime_type}")
        return 'skipped'

    try:
        # Download file bytes
        request = drive_service.files().get_media(fileId=file_id)
        file_bytes_io = io.BytesIO()
        downloader = MediaIoBaseDownload(file_bytes_io, request)

        done = False
        while not done:
            status, done = downloader.next_chunk()
            if status:
                print(f"  Download progress: {int(status.progress() * 100)}%")

        file_bytes = file_bytes_io.getvalue()
        print(f"  Downloaded {len(file_bytes)} bytes")

        # Analyze and get new filename
        new_filename = analyze_and_rename(file_bytes)
        print(f"  Generated filename: {new_filename}")

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

        print(f"  ✓ Successfully renamed to: {updated_file.get('name')}")
        return 'success'

    except Exception as e:
        print(f"  ✗ Error processing file {file_name}: {str(e)}")
        return 'failed'

def main():
    """
    Main function to process all files in the Google Drive folder.
    Lists files, downloads them, analyzes with Gemini, and renames them.
    """
    try:
        # Setup Drive service
        drive_service = setup_drive_service()
        folder_id = os.getenv("DRIVE_FOLDER_ID")
        
        if not folder_id:
            raise ValueError("DRIVE_FOLDER_ID environment variable not set")
        
        print(f"Processing files in folder: {folder_id}")
        
        # List files in the folder
        query = f"'{folder_id}' in parents and trashed=false"
        results = drive_service.files().list(
            q=query,
            fields="files(id, name, mimeType)",
            pageSize=100
        ).execute()
        
        files = results.get('files', [])
        
        if not files:
            print("No files found in the folder.")
            return
        
        print(f"Found {len(files)} file(s) to process.")
        
        # Process each file in parallel
        # We use a ThreadPoolExecutor to handle I/O bound tasks concurrently
        # max_workers=5 is a conservative limit to avoid hitting API rate limits
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            # Submit all tasks
            future_to_file = {
                executor.submit(process_single_file, file, drive_service): file
                for file in files
            }
            
            # Wait for all tasks to complete
            success_count = 0
            skipped_count = 0
            fail_count = 0
            for future in concurrent.futures.as_completed(future_to_file):
                file = future_to_file[future]
                try:
                    result = future.result()
                    if result == 'success':
                        success_count += 1
                    elif result == 'skipped':
                        skipped_count += 1
                    else:
                        fail_count += 1
                except Exception as exc:
                    print(f"  ✗ Unhandled exception for {file['name']}: {exc}")
                    fail_count += 1

            print(f"\nProcessing Summary: {success_count} successful, {skipped_count} skipped, {fail_count} failed.")
        
        print("\n" + "="*50)
        print("Processing complete!")
        
    except Exception as e:
        print(f"Fatal error in main: {str(e)}")
        raise

if __name__ == "__main__":
    main()