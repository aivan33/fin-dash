/**
 * Chart color palette - works with CSS variables from theme
 * These should match the chart colors defined in globals.css / theme.json
 */

// Default chart colors - customize per client
export const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  tertiary: 'hsl(var(--chart-3))',
  quaternary: 'hsl(var(--chart-4))',
  quinary: 'hsl(var(--chart-5))',
} as const;

// Array for easy iteration (pie charts, multiple series)
export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
];

// Semantic colors for specific use cases
export const SEMANTIC_COLORS = {
  positive: 'hsl(var(--chart-positive, 142 76% 36%))',  // Green
  negative: 'hsl(var(--chart-negative, 0 84% 60%))',    // Red
  neutral: 'hsl(var(--chart-neutral, 220 9% 46%))',     // Gray
} as const;

/**
 * Get color by index (wraps around if more series than colors)
 */
export function getChartColor(index: number): string {
  return CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length];
}
