import { DataFile, MonthlyDataRow } from './types';

const DATA_BASE_PATH = '/data';  // Relative to public folder

/**
 * Generic data loader - fetches and parses JSON data files
 */
async function loadDataFile<T>(filename: string): Promise<DataFile<T>> {
  const response = await fetch(`${DATA_BASE_PATH}/${filename}`);

  if (!response.ok) {
    throw new Error(`Failed to load data file: ${filename}`);
  }

  return response.json();
}

/**
 * Load monthly financial data
 * Returns null if file doesn't exist (not configured yet)
 */
export async function loadMonthlyData(): Promise<DataFile<MonthlyDataRow> | null> {
  try {
    return await loadDataFile<MonthlyDataRow>('monthly_data.json');
  } catch (error) {
    // File doesn't exist yet - that's OK for unconfigured boilerplate
    console.log('No monthly data file found. Configure data source first.');
    return null;
  }
}

/**
 * Check if any data files exist
 */
export async function hasDataConfigured(): Promise<boolean> {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/monthly_data.json`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get data freshness - how old is the data?
 */
export function getDataAge(fetchedAt: string): string {
  const fetched = new Date(fetchedAt);
  const now = new Date();
  const diffMs = now.getTime() - fetched.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Just now';
}
