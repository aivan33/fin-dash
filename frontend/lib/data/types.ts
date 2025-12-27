// Base metadata included in all data files
export interface DataMetadata {
  source: string;
  sheet?: string;
  fetched_at: string;
  row_count: number;
}

// Generic data file wrapper
export interface DataFile<T> {
  metadata: DataMetadata;
  data: T[];
}

// =============================================================================
// CLIENT-SPECIFIC TYPES - Customize these after forking for each client
// =============================================================================

/**
 * Example monthly data row structure
 * Replace with actual fields from your client's data source
 */
export interface MonthlyDataRow {
  period: string;           // e.g., "2024-01"
  // Add client-specific fields here, e.g.:
  // funding_amount: number;
  // revenue: number;
  // transactions: number;
  // region: string;
  [key: string]: string | number | boolean | null;  // Allow dynamic fields
}

/**
 * Example budget data row structure
 */
export interface BudgetDataRow {
  period: string;
  category: string;
  budgeted: number;
  actual?: number;
  [key: string]: string | number | boolean | null | undefined;
}
