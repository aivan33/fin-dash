'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './chart-wrapper';
import { getChartColor } from '@/lib/chart-colors';

interface LineChartProps<T> {
  title: string;
  description?: string;
  data: T[];
  xAxisKey: keyof T & string;
  lines: {
    dataKey: keyof T & string;
    label?: string;
    color?: string;
  }[];
  isLoading?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  formatTooltip?: (value: number) => string;
  formatXAxis?: (value: string) => string;
}

export function LineChart<T extends Record<string, unknown>>({
  title,
  description,
  data,
  xAxisKey,
  lines,
  isLoading = false,
  xAxisLabel,
  yAxisLabel,
  formatTooltip,
  formatXAxis,
}: LineChartProps<T>) {
  const isEmpty = !data || data.length === 0;

  return (
    <ChartWrapper
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey={xAxisKey}
            className="text-xs fill-muted-foreground"
            tickFormatter={formatXAxis}
            label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', offset: -5 } : undefined}
          />
          <YAxis
            className="text-xs fill-muted-foreground"
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
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
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.label || line.dataKey}
              stroke={line.color || getChartColor(index)}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
