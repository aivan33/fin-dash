"""Main entry point for the data layer.

Orchestrates data fetching from various sources and outputs JSON files.
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

import yaml

from .connectors.google_sheets import GoogleSheetsConnector
from .connectors.csv_loader import CSVLoader

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_config(config_path: str = 'data/config.yaml') -> Dict[str, Any]:
    """Load configuration from YAML file.

    Args:
        config_path: Path to config.yaml file

    Returns:
        Configuration dictionary

    Raises:
        FileNotFoundError: If config file doesn't exist
        yaml.YAMLError: If config file is invalid
    """
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    logger.info(f"Loaded configuration from {config_path}")
    return config


def get_connector(source_type: str, source_config: Dict[str, Any]):
    """Factory function to create appropriate connector.

    Args:
        source_type: Type of connector ('google_sheets', 'csv', etc.)
        source_config: Configuration for the connector

    Returns:
        Connector instance

    Raises:
        ValueError: If source type is unknown
    """
    connectors = {
        'google_sheets': GoogleSheetsConnector,
        'csv': CSVLoader,
    }

    if source_type not in connectors:
        raise ValueError(
            f"Unknown source type: {source_type}. "
            f"Available types: {', '.join(connectors.keys())}"
        )

    return connectors[source_type](source_config)


def write_output(data: List[Dict[str, Any]], output_dir: str, source_name: str) -> None:
    """Write data to JSON files.

    Args:
        data: List of data dictionaries (each has metadata and data)
        output_dir: Directory to write output files
        source_name: Name of the data source (used in filename)
    """
    # Ensure output directory exists
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    for item in data:
        output_key = item.get('metadata', {}).get('output_key', source_name)
        filename = f"{output_key}.json"
        filepath = os.path.join(output_dir, filename)

        # Add timestamp to metadata
        if 'metadata' in item:
            item['metadata']['fetched_at'] = datetime.utcnow().isoformat() + 'Z'

        with open(filepath, 'w') as f:
            json.dump(item, f, indent=2)

        logger.info(f"Wrote {filepath} ({item.get('metadata', {}).get('row_count', 0)} rows)")


def run_etl(config: Dict[str, Any], source_filter: str = None, dry_run: bool = False) -> None:
    """Run the ETL pipeline.

    Args:
        config: Configuration dictionary
        source_filter: Optional source name to run only that source
        dry_run: If True, validate config without fetching data
    """
    sources = config.get('sources', {})
    output_config = config.get('output', {})
    output_dir = output_config.get('directory', './data/output')

    if not sources:
        logger.warning("No sources configured in config.yaml")
        return

    # Filter sources if specified
    if source_filter:
        if source_filter not in sources:
            logger.error(f"Source '{source_filter}' not found in config")
            sys.exit(1)
        sources = {source_filter: sources[source_filter]}

    logger.info(f"Processing {len(sources)} source(s)")

    for source_name, source_config in sources.items():
        logger.info(f"Processing source: {source_name}")

        source_type = source_config.get('type')
        if not source_type:
            logger.error(f"Source '{source_name}' missing 'type' field")
            continue

        try:
            # Create connector
            connector = get_connector(source_type, source_config)

            if dry_run:
                logger.info(f"[DRY RUN] Would fetch from {source_type}: {source_name}")
                continue

            # Connect and fetch
            connector.connect()
            data = connector.fetch()

            # Write output
            write_output(data, output_dir, source_name)

            # Cleanup
            connector.disconnect()

        except Exception as e:
            logger.error(f"Failed to process source '{source_name}': {e}")
            # Continue with other sources even if one fails
            continue

    if dry_run:
        logger.info("[DRY RUN] Config validation successful")
    else:
        logger.info("ETL pipeline completed")


def main():
    """Main entry point with CLI argument parsing."""
    parser = argparse.ArgumentParser(
        description='FinDash data layer - fetch data from various sources'
    )
    parser.add_argument(
        '--config',
        default='data/config.yaml',
        help='Path to config file (default: data/config.yaml)'
    )
    parser.add_argument(
        '--source',
        help='Run only this specific source (optional)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Validate config without fetching data'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable debug logging'
    )

    args = parser.parse_args()

    # Set log level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    try:
        # Load config
        config = load_config(args.config)

        # Run ETL
        run_etl(config, source_filter=args.source, dry_run=args.dry_run)

    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
