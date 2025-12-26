"""CSV file loader connector."""

import logging
import os
from typing import Any, Dict, List

import pandas as pd

from .base import BaseConnector

logger = logging.getLogger(__name__)


class CSVLoader(BaseConnector):
    """Connector for loading data from CSV files."""

    def __init__(self, config: Dict[str, Any]):
        """Initialize CSV loader.

        Args:
            config: Must include 'path' (file path) and 'output_key'
        """
        super().__init__(config)
        self.file_path = config.get('path')
        self.output_key = config.get('output_key', 'csv_data')

        if not self.file_path:
            raise ValueError("'path' is required in config for CSV loader")

    def connect(self) -> None:
        """Verify CSV file exists and is readable."""
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"CSV file not found: {self.file_path}")

        if not os.access(self.file_path, os.R_OK):
            raise PermissionError(f"CSV file not readable: {self.file_path}")

        self.connected = True
        logger.info(f"CSV file verified: {self.file_path}")

    def fetch(self) -> List[Dict[str, Any]]:
        """Load data from CSV file.

        Returns:
            List containing one dictionary with metadata and data

        Raises:
            RuntimeError: If CSV reading fails
        """
        if not self.connected:
            self.connect()

        try:
            # Try UTF-8 first, fall back to latin-1 if that fails
            try:
                df = pd.read_csv(self.file_path, encoding='utf-8')
            except UnicodeDecodeError:
                logger.warning(f"UTF-8 decoding failed, trying latin-1 for {self.file_path}")
                df = pd.read_csv(self.file_path, encoding='latin-1')

            # Convert DataFrame to list of dictionaries
            # Replace NaN with None for JSON serialization
            data_dicts = df.where(pd.notnull(df), None).to_dict('records')

            logger.info(f"Loaded {len(data_dicts)} rows from {self.file_path}")

            return [{
                'metadata': {
                    'source': self.file_path,
                    'output_key': self.output_key,
                    'row_count': len(data_dicts),
                    'columns': list(df.columns)
                },
                'data': data_dicts
            }]

        except pd.errors.EmptyDataError:
            logger.warning(f"CSV file is empty: {self.file_path}")
            return [{
                'metadata': {
                    'source': self.file_path,
                    'output_key': self.output_key,
                    'row_count': 0
                },
                'data': []
            }]

        except Exception as e:
            error_msg = f"Failed to read CSV file {self.file_path}: {e}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)
