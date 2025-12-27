'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadMonthlyData, getDataAge } from '@/lib/data/loader';
import { DataFile, MonthlyDataRow } from '@/lib/data/types';

export default function DashboardPage() {
  const [data, setData] = useState<DataFile<MonthlyDataRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const monthlyData = await loadMonthlyData();
        if (monthlyData) {
          setData(monthlyData);
          setConfigured(true);
        } else {
          setConfigured(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setConfigured(false);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not configured state - show setup instructions
  if (!configured || !data) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">Get started by connecting your data source</p>
        </div>

        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              This is a boilerplate dashboard. Follow these steps to connect your data:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-card-foreground mb-3">Setup Steps:</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-mono text-card-foreground">1.</span>
                  <div>
                    <strong className="text-card-foreground">Add credentials:</strong> Place your Google service account credentials in{' '}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">data/credentials/</code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-card-foreground">2.</span>
                  <div>
                    <strong className="text-card-foreground">Configure data source:</strong> Edit{' '}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">data/config.yaml</code> with your Google Sheet ID and settings
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-card-foreground">3.</span>
                  <div>
                    <strong className="text-card-foreground">Fetch data:</strong> Run{' '}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">python data/main.py</code> to pull data from your sources
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-card-foreground">4.</span>
                  <div>
                    <strong className="text-card-foreground">Sync to frontend:</strong> Run{' '}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">npm run sync-data</code> to copy data to the frontend
                  </div>
                </li>
              </ol>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-card-foreground">Coming next:</strong> Charts and visualizations will be added in Prompt 04
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Data loaded state - show KPIs and metrics
  const dataAge = getDataAge(data.metadata.fetched_at);
  const rowCount = data.metadata.row_count;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {rowCount} record{rowCount !== 1 ? 's' : ''} loaded • Last updated {dataAge}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Overview</CardTitle>
            <CardDescription>
              Source: {data.metadata.source}
              {data.metadata.sheet && ` - ${data.metadata.sheet}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Records</p>
                <p className="text-3xl font-bold text-card-foreground">{rowCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Data Source</p>
                <p className="text-lg font-semibold text-card-foreground">{data.metadata.source}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                <p className="text-lg font-semibold text-card-foreground">{dataAge}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placeholder Metrics</CardTitle>
            <CardDescription>
              Customize these metrics based on your client&apos;s data structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Metric 1</h3>
                <p className="text-2xl font-bold text-card-foreground">--</p>
                <p className="text-xs text-muted-foreground mt-1">Configure in page.tsx</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Metric 2</h3>
                <p className="text-2xl font-bold text-card-foreground">--</p>
                <p className="text-xs text-muted-foreground mt-1">Configure in page.tsx</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Metric 3</h3>
                <p className="text-2xl font-bold text-card-foreground">--</p>
                <p className="text-xs text-muted-foreground mt-1">Configure in page.tsx</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Charts and visualizations coming in Prompt 04
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
