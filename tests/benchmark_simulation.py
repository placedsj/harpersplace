import sys
import time
import unittest
from unittest.mock import MagicMock, patch
import os
import io

# Mock the google libraries before importing process_exhibits
# We need to make sure these are in sys.modules so import works
sys.modules['google'] = MagicMock()
sys.modules['google.oauth2'] = MagicMock()
sys.modules['google.oauth2.service_account'] = MagicMock()
sys.modules['googleapiclient'] = MagicMock()
sys.modules['googleapiclient.discovery'] = MagicMock()
sys.modules['googleapiclient.http'] = MagicMock()
sys.modules['google.generativeai'] = MagicMock()

# Now import the script to test
# Since process_exhibits is in the root, and we are in tests/, we need to add root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import process_exhibits

class TestProcessExhibitsPerformance(unittest.TestCase):
    def setUp(self):
        self.start_time = time.time()

    def tearDown(self):
        duration = time.time() - self.start_time
        print(f"\nExecution time: {duration:.4f} seconds")

    @patch('process_exhibits.os.getenv')
    @patch('process_exhibits.service_account.Credentials.from_service_account_info')
    @patch('process_exhibits.build')
    @patch('process_exhibits.genai.GenerativeModel')
    def test_performance_simulation(self, mock_genai_model, mock_build, mock_creds, mock_getenv):
        # Setup mocks
        mock_getenv.side_effect = lambda key: {
            "DRIVE_SERVICE_ACCOUNT": '{"project_id": "test"}',
            "GEMINI_API_KEY": "test_key",
            "DRIVE_FOLDER_ID": "test_folder"
        }.get(key)

        # Mock Drive Service
        mock_drive = MagicMock()
        mock_build.return_value = mock_drive

        # Mock file listing
        # Create 10 dummy files to process (reduced to 10 for speed in test)
        files_count = 10
        files_data = [{'id': f'file_{i}', 'name': f'image_{i}.jpg', 'mimeType': 'image/jpeg'} for i in range(files_count)]
        mock_drive.files().list().execute.return_value = {'files': files_data}

        # Mock file download (simulate latency)
        # In the script: request = drive_service.files().get_media(fileId=file_id)
        # Then MediaIoBaseDownload uses request.

        # Mock Gemini analysis (simulate latency)
        mock_model_instance = MagicMock()
        mock_genai_model.return_value = mock_model_instance
        def mock_generate(*args, **kwargs):
            time.sleep(0.1) # Simulate 100ms analysis per file
            return MagicMock(text="2023-10-27_Receipt_Lunch")
        mock_model_instance.generate_content.side_effect = mock_generate

        # Mock file rename (simulate latency)
        def mock_update(*args, **kwargs):
            time.sleep(0.05) # Simulate 50ms update per file
            return {'name': 'new_name.jpg'}
        mock_drive.files().update().execute.side_effect = mock_update

        # Run the main function
        print(f"\nStarting performance benchmark with {files_count} files...")

        # We need to patch the MediaIoBaseDownload as well since it is used in main
        with patch('process_exhibits.MediaIoBaseDownload') as mock_downloader:
            # Configure downloader to finish immediately after sleep
            mock_downloader_instance = MagicMock()

            def mock_next_chunk():
                time.sleep(0.05) # Simulate 50ms download per chunk/file
                return (None, True)

            mock_downloader_instance.next_chunk.side_effect = mock_next_chunk
            mock_downloader.return_value = mock_downloader_instance

            process_exhibits.main()

if __name__ == '__main__':
    unittest.main()
