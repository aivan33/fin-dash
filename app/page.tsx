export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your financial dashboard</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">Overview</h2>
          <p className="text-muted-foreground">Dashboard content goes here. Charts and metrics will be added in future prompts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Metric 1</h3>
            <p className="text-2xl font-bold text-card-foreground">$0.00</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Metric 2</h3>
            <p className="text-2xl font-bold text-card-foreground">$0.00</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Metric 3</h3>
            <p className="text-2xl font-bold text-card-foreground">$0.00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
