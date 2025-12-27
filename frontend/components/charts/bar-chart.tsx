'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './chart-wrapper';
import { getChartColor } from '@/lib/chart-colors';

interface BarChartProps<T> {
  title: string;
  description?: string;
  data: T[];
  xAxisKey: keyof T & string;
  bars: {
    dataKey: keyof T & string;
    label?: string;
    color?: string;
  }[];
  isLoading?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  formatTooltip?: (value: number) => string;
}

export function BarChart<T extends Record<string, unknown>>({
  title,
  description,
  data,
  xAxisKey,
  bars,
  isLoading = false,
  stacked = false,
  horizontal = false,
  formatTooltip,
}: BarChartProps<T>) {
  const isEmpty = !data || data.length === 0;

  return (
    <ChartWrapper
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          {horizontal ? (
            <>
              <XAxis type="number" className="text-xs fill-muted-foreground" />
              <YAxis dataKey={xAxisKey} type="category" className="text-xs fill-muted-foreground" />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={formatTooltip ? (value) => (typeof value === 'number' ? formatTooltip(value) : value) : undefined}
          />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.label || bar.dataKey}
              fill={bar.color || getChartColor(index)}
              stackId={stacked ? 'stack' : undefined}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
