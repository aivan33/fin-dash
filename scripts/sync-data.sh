#!/bin/bash
# Sync data from Python output to frontend public folder

SOURCE_DIR="data/output"
DEST_DIR="frontend/public/data"

# Create destination if it doesn't exist
mkdir -p "$DEST_DIR"

# Check if there are any JSON files to copy
shopt -s nullglob
json_files=("$SOURCE_DIR"/*.json)
shopt -u nullglob

if [ ${#json_files[@]} -eq 0 ]; then
    echo "ℹ No JSON files found in $SOURCE_DIR"
    echo "  This is normal for an unconfigured boilerplate."
    echo "  Configure data/config.yaml and run 'python data/main.py' first."
    exit 0
fi

# Copy all JSON files
cp "$SOURCE_DIR"/*.json "$DEST_DIR/"

echo "✓ Data synced to frontend"
echo "  Files copied:"
ls -la "$DEST_DIR"/*.json
