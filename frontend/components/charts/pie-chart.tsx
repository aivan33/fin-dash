'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './chart-wrapper';
import { CHART_COLOR_ARRAY } from '@/lib/chart-colors';

interface PieChartProps<T> {
  title: string;
  description?: string;
  data: T[];
  dataKey: keyof T & string;
  nameKey: keyof T & string;
  isLoading?: boolean;
  donut?: boolean;
  formatTooltip?: (value: number) => string;
}

export function PieChart<T extends Record<string, unknown>>({
  title,
  description,
  data,
  dataKey,
  nameKey,
  isLoading = false,
  donut = false,
  formatTooltip,
}: PieChartProps<T>) {
  const isEmpty = !data || data.length === 0;

  return (
    <ChartWrapper
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={donut ? 60 : 0}
            outerRadius={100}
            paddingAngle={2}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={formatTooltip ? (value) => (typeof value === 'number' ? formatTooltip(value) : value) : undefined}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
