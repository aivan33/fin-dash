'use client';

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './chart-wrapper';
import { getChartColor } from '@/lib/chart-colors';

interface AreaChartProps<T> {
  title: string;
  description?: string;
  data: T[];
  xAxisKey: keyof T & string;
  areas: {
    dataKey: keyof T & string;
    label?: string;
    color?: string;
  }[];
  isLoading?: boolean;
  stacked?: boolean;
  formatTooltip?: (value: number) => string;
}

export function AreaChart<T extends Record<string, unknown>>({
  title,
  description,
  data,
  xAxisKey,
  areas,
  isLoading = false,
  stacked = false,
  formatTooltip,
}: AreaChartProps<T>) {
  const isEmpty = !data || data.length === 0;

  return (
    <ChartWrapper
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey={xAxisKey} className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
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
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              name={area.label || area.dataKey}
              stroke={area.color || getChartColor(index)}
              fill={area.color || getChartColor(index)}
              fillOpacity={0.3}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
