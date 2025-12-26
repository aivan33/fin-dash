"""Google Sheets connector using service account authentication."""

import logging
import os
from typing import Any, Dict, List

from google.auth.transport.requests import Request
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from .base import BaseConnector

logger = logging.getLogger(__name__)


class GoogleSheetsConnector(BaseConnector):
    """Connector for fetching data from Google Sheets.

    Requires service account credentials in data/credentials/service_account.json
    """

    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

    def __init__(self, config: Dict[str, Any]):
        """Initialize Google Sheets connector.

        Args:
            config: Must include 'spreadsheet_id' and 'sheets' (list of sheet configs)
        """
        super().__init__(config)
        self.spreadsheet_id = config.get('spreadsheet_id')
        self.sheets_config = config.get('sheets', [])
        self.service = None

        if not self.spreadsheet_id:
            raise ValueError("spreadsheet_id is required in config")

    def connect(self) -> None:
        """Authenticate with Google Sheets API using service account."""
        try:
            # Path to service account credentials
            creds_path = os.path.join(
                os.path.dirname(__file__),
                '..',
                'credentials',
                'service_account.json'
            )

            if not os.path.exists(creds_path):
                raise FileNotFoundError(
                    f"Service account credentials not found at {creds_path}. "
                    "Please download your service account JSON and save it there."
                )

            # Authenticate
            creds = service_account.Credentials.from_service_account_file(
                creds_path,
                scopes=self.SCOPES
            )

            # Build the service
            self.service = build('sheets', 'v4', credentials=creds)
            self.connected = True
            logger.info(f"Connected to Google Sheets API for spreadsheet: {self.spreadsheet_id}")

        except Exception as e:
            logger.error(f"Failed to connect to Google Sheets: {e}")
            raise ConnectionError(f"Google Sheets connection failed: {e}")

    def fetch(self) -> List[Dict[str, Any]]:
        """Fetch data from all configured sheets.

        Returns:
            List of dictionaries with metadata and data for each sheet
        """
        if not self.connected:
            self.connect()

        all_data = []

        for sheet_config in self.sheets_config:
            sheet_name = sheet_config.get('name')
            range_str = sheet_config.get('range')
            output_key = sheet_config.get('output_key', sheet_name)

            if not sheet_name or not range_str:
                logger.warning(f"Skipping sheet config - missing name or range: {sheet_config}")
                continue

            try:
                data = self._fetch_sheet(sheet_name, range_str, output_key)
                all_data.append(data)
            except Exception as e:
                logger.error(f"Failed to fetch sheet '{sheet_name}': {e}")
                # Continue with other sheets even if one fails
                continue

        return all_data

    def _fetch_sheet(self, sheet_name: str, range_str: str, output_key: str) -> Dict[str, Any]:
        """Fetch data from a specific sheet.

        Args:
            sheet_name: Name of the sheet tab
            range_str: A1 notation range (e.g., "A1:Z1000")
            output_key: Key to use in output JSON

        Returns:
            Dictionary with metadata and data
        """
        full_range = f"{sheet_name}!{range_str}"
        logger.info(f"Fetching range: {full_range}")

        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=full_range
            ).execute()

            values = result.get('values', [])

            if not values:
                logger.warning(f"No data found in {full_range}")
                return {
                    'metadata': {
                        'source': self.spreadsheet_id,
                        'sheet': sheet_name,
                        'output_key': output_key,
                        'row_count': 0
                    },
                    'data': []
                }

            # First row is header
            headers = values[0]
            rows = values[1:]

            # Convert rows to list of dictionaries
            data_dicts = []
            for row in rows:
                # Pad row if it's shorter than headers
                row_padded = row + [''] * (len(headers) - len(row))
                row_dict = dict(zip(headers, row_padded))
                data_dicts.append(row_dict)

            logger.info(f"Fetched {len(data_dicts)} rows from {sheet_name}")

            return {
                'metadata': {
                    'source': self.spreadsheet_id,
                    'sheet': sheet_name,
                    'output_key': output_key,
                    'row_count': len(data_dicts)
                },
                'data': data_dicts
            }

        except HttpError as e:
            error_msg = f"HTTP error fetching {full_range}: {e}"
            logger.error(error_msg)

            if e.resp.status == 403:
                logger.error(
                    "Permission denied. Make sure the spreadsheet is shared with "
                    "the service account email."
                )

            raise RuntimeError(error_msg)
