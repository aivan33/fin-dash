# FinDash Data Layer

Python-based data fetching layer for the FinDash financial dashboard.

## Overview

This data layer fetches data from various sources (Google Sheets, CSV files) and outputs JSON files that the Next.js frontend can consume.

## Setup

### Prerequisites

- Python 3.10 or higher
- pip package manager

### Installation

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r data/requirements.txt
```

## Configuration

Edit `data/config.yaml` to define your data sources:

```yaml
sources:
  main_financials:
    type: google_sheets
    spreadsheet_id: "YOUR_SPREADSHEET_ID"
    sheets:
      - name: "Monthly Data"
        range: "A1:Z1000"
        output_key: "monthly_data"
```

## Google Sheets Setup

To use Google Sheets as a data source:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google Sheets API" in APIs & Services
4. Create a Service Account (IAM & Admin → Service Accounts)
5. Create and download JSON key
6. Save as `data/credentials/service_account.json`
7. Copy the service account email (looks like `xxx@project.iam.gserviceaccount.com`)
8. Share your Google Sheet with that email (Viewer access is enough)

## Usage

Run from the project root directory using Python's module syntax:

### Run all data sources
```bash
python -m data
```

### Run a specific source
```bash
python -m data --source main_financials
```

### Dry run (validate config without fetching)
```bash
python -m data --dry-run
```

### Verbose logging
```bash
python -m data --verbose
```

## Output

JSON files are written to `data/output/` with the following format:

```json
{
  "metadata": {
    "source": "spreadsheet_id",
    "sheet": "Monthly Data",
    "fetched_at": "2024-01-15T10:30:00Z",
    "row_count": 150
  },
  "data": [
    {"date": "2024-01", "revenue": 50000, "expenses": 30000},
    ...
  ]
}
```

## Project Structure

```
data/
├── main.py              # Entry point - orchestrates everything
├── config.yaml          # Data source configuration
├── connectors/          # Data source connectors
│   ├── base.py          # Abstract base class
│   ├── google_sheets.py # Google Sheets connector
│   └── csv_loader.py    # CSV file loader
├── processors/          # Data transformation (future)
│   └── base.py          # Base processor class
├── output/              # Generated JSON files
├── credentials/         # Service account credentials (gitignored)
├── input/               # CSV input files (gitignored)
└── requirements.txt     # Python dependencies
```

## Troubleshooting

### ModuleNotFoundError
Make sure you're running from the project root directory (fin-dash/) using:
```bash
python -m data
```

### 403 Forbidden from Google API
Make sure the spreadsheet is shared with the service account email.

### CSV encoding errors
The loader tries UTF-8 first, then falls back to latin-1. If issues persist, check your CSV file encoding.

## Adding New Data Sources

1. Create a new connector in `connectors/` that extends `BaseConnector`
2. Implement `connect()` and `fetch()` methods
3. Add the connector to the factory in `main.py`
4. Configure it in `config.yaml`
