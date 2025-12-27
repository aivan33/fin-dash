'use client';

import { LineChart, BarChart, AreaChart, PieChart } from '@/components/charts';

// Example data - replace with real data after forking
const EXAMPLE_DATA = [
  { month: 'Jan', value1: 400, value2: 240 },
  { month: 'Feb', value1: 300, value2: 139 },
  { month: 'Mar', value1: 520, value2: 380 },
  { month: 'Apr', value1: 478, value2: 390 },
  { month: 'May', value1: 589, value2: 480 },
  { month: 'Jun', value1: 639, value2: 520 },
];

const EXAMPLE_PIE_DATA = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 200 },
  { name: 'Category D', value: 100 },
];

export default function ChartsPage() {
  // Toggle this to test empty states
  const showExampleData = true;

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Charts</h1>
          <p className="text-muted-foreground">
            Reusable chart components. Replace example data with your client data after forking.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <LineChart
            title="Line Chart Example"
            description="Trend over time"
            data={showExampleData ? EXAMPLE_DATA : []}
            xAxisKey="month"
            lines={[
              { dataKey: 'value1', label: 'Series 1' },
              { dataKey: 'value2', label: 'Series 2' },
            ]}
          />

          <BarChart
            title="Bar Chart Example"
            description="Comparison by category"
            data={showExampleData ? EXAMPLE_DATA : []}
            xAxisKey="month"
            bars={[
              { dataKey: 'value1', label: 'Series 1' },
              { dataKey: 'value2', label: 'Series 2' },
            ]}
          />

          <AreaChart
            title="Area Chart Example"
            description="Volume over time"
            data={showExampleData ? EXAMPLE_DATA : []}
            xAxisKey="month"
            areas={[
              { dataKey: 'value1', label: 'Series 1' },
            ]}
          />

          <PieChart
            title="Pie Chart Example"
            description="Distribution by category"
            data={showExampleData ? EXAMPLE_PIE_DATA : []}
            dataKey="value"
            nameKey="name"
            donut
          />
        </div>

        {/* Usage Documentation */}
        <div className="rounded-lg border bg-card p-6 mt-8">
          <h2 className="text-lg font-medium mb-4">Usage After Forking</h2>
          <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
{`// Import the chart you need
import { LineChart } from '@/components/charts';

// Use with your data
<LineChart
  title="Monthly Revenue"
  data={monthlyData}
  xAxisKey="period"
  lines={[
    { dataKey: 'revenue', label: 'Revenue' },
    { dataKey: 'target', label: 'Target' },
  ]}
  formatTooltip={(value) => \`$\${value.toLocaleString()}\`}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
