# Harpers Place Automation - Setup Guide

This guide will help you set up and run the Google Drive exhibits automation script that uses Gemini AI for OCR and intelligent file renaming.

## Prerequisites

- Python 3.12 or higher
- A Google Cloud project with:
  - Google Drive API enabled
  - A service account with access to your Drive folder
- A Google Gemini API key

## Setup Instructions

### 1. Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create a service account:
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name and click "Create"
   - Grant minimal permissions (just "Viewer" role is sufficient for Drive access)
   - Click "Done"
5. Create and download service account key:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the key file

### 2. Folder Sharing & Secrets Management

1. **Share your Google Drive folder with the service account:**
   - Open the folder you want to process in Google Drive
   - Click "Share"
   - Add the service account email (found in the JSON key file as `client_email`)
   - Grant "Editor" permissions
   - Copy the folder ID from the URL (the last part after `/folders/`)

2. **Set up environment variables (Replit Secrets or local .env):**
   
   You need to configure three secrets:

   - `DRIVE_SERVICE_ACCOUNT`: The entire contents of the service account JSON key file
   - `GEMINI_API_KEY`: Your Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
   - `DRIVE_FOLDER_ID`: The ID of your Google Drive folder

   **For Replit:**
   - Go to the "Secrets" tab (lock icon in left sidebar)
   - Add each secret with its value

   **For local development:**
   - Create a `.env` file (not recommended for production)
   - Add the values (note: you'll need python-dotenv package)

### 3. Installation

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Running the Script

Run the automation script:

```bash
python process_exhibits.py
```

The script will:
1. Connect to Google Drive using the service account
2. List all image files in the specified folder
3. Download each image
4. Use Gemini AI to perform OCR and extract:
   - Date (DD-MM-YYYY format)
   - Document type (e.g., Email, Text_Message, Medical_Bill)
   - Short content summary (max 5 words)
5. Rename the file in the format: `[DATE]_[TYPE]_[SUMMARY].ext`
6. Update the file name in Google Drive

## Expected Output Format

Files will be renamed according to this pattern:
```
01-03-2024_Medical_Bill_Patient_Care_Services.pdf
15-02-2024_Email_Meeting_Confirmation_Details.jpg
23-01-2024_Text_Message_Appointment_Reminder_Notice.png
```

## Error Handling

The script includes comprehensive error handling:
- Validates all required environment variables
- Skips non-image files automatically
- Continues processing even if individual files fail
- Provides detailed progress and error messages

## Troubleshooting

**"DRIVE_SERVICE_ACCOUNT environment variable not set"**
- Ensure you've set up the secret in Replit or environment variable correctly
- The value should be the entire JSON content of the service account key

**"GEMINI_API_KEY environment variable not set"**
- Get your API key from Google AI Studio
- Set it in Replit Secrets or environment variables

**"No files found in the folder"**
- Verify the folder ID is correct
- Ensure the service account has access to the folder (check sharing settings)
- Make sure the folder contains image files

**Permission denied errors**
- Ensure the service account has Editor access to the folder
- Check that the Google Drive API is enabled in your project

## Security Notes

- Never commit the service account JSON file or API keys to version control
- Use Replit Secrets or environment variables for all sensitive data
- The service account should have minimal permissions (only access to specific folders)
- Regularly rotate API keys and service account credentials

## Next Steps

After successful setup and testing:
1. Process a small batch of files first to verify correct naming
2. Review the renamed files to ensure quality
3. Adjust the Gemini prompt in `process_exhibits.py` if needed for better results
4. Scale up to process larger batches

## Support

For issues or questions:
- Check the console output for detailed error messages
- Verify all environment variables are set correctly
- Ensure API quotas are not exceeded
- Review the service account permissions
