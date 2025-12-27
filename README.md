# FinDash

A customizable financial dashboard boilerplate that connects to Google Sheets and displays data with modern React components.

## Project Structure

```
fin-dash/
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # Utilities and data loaders
├── data/             # Python data pipeline
│   ├── config.yaml   # Data source configuration
│   ├── main.py       # Data fetcher script
│   └── output/       # Generated JSON files
└── scripts/          # Utility scripts
    └── sync-data.sh  # Sync data to frontend
```

## Quick Start (Development)

```bash
# Install frontend dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the dashboard.

The dashboard will show a "Getting Started" screen until you configure a data source.

## Configuration (After Forking)

This is a boilerplate. To connect to your client's data:

### 1. Google Sheets Setup

1. Create a Google Cloud project and enable the Sheets API
2. Create a service account and download the JSON key
3. Place the key at `data/credentials/google_service_account.json`
4. Share your Google Sheet with the service account email (found in the JSON)

### 2. Configure Data Source

Edit `data/config.yaml`:

```yaml
sources:
  - name: monthly_data
    type: google_sheets
    sheet_id: "your-sheet-id-from-url"
    sheet_name: "Tab Name"
    range: "A:Z"
```

### 3. Fetch and Sync Data

```bash
# Fetch from sources
python data/main.py

# Sync to frontend
cd frontend && npm run sync-data

# Start dev server
npm run dev
```

### 4. Customize Types

Update `frontend/lib/data/types.ts` with your actual data fields.

## Features

- Dark/Light theme with persistent preference
- Graceful empty states for unconfigured data
- Data freshness indicators
- Responsive layout
- Type-safe data loading
- Static JSON data (no backend required)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Data Layer**: Python, PyYAML, Google Sheets API
- **Deployment**: Static export ready

## Development Workflow

1. Configure `data/config.yaml` with your data sources
2. Run `python data/main.py` to fetch latest data
3. Run `npm run sync-data` to copy data to frontend
4. Frontend automatically shows updated data

## Next Steps

- Customize dashboard metrics in `frontend/app/page.tsx`
- Add chart components (Prompt 04)
- Style with your brand colors in `frontend/theme.json`
- Deploy to Vercel or static hosting

## License

MIT
