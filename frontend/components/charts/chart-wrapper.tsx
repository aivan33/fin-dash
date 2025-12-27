import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  error?: string | null;
  className?: string;
}

export function ChartWrapper({
  title,
  description,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No data available. Configure your data source to see charts.',
  error = null,
  className = '',
}: ChartWrapperProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading chart...
            </div>
          </div>
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-destructive text-center">
              <p className="font-medium">Failed to load chart</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center text-muted-foreground px-4">
              <p>{emptyMessage}</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px]">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
