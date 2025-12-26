export default function TablesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Tables</h1>
        <p className="text-muted-foreground">View and manage your data tables</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">Data Tables</h2>
          <p className="text-muted-foreground">Table views will be added here. This will display financial data in tabular format.</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-sm font-medium text-muted-foreground">Column 1</span>
              <span className="text-sm font-medium text-muted-foreground">Column 2</span>
              <span className="text-sm font-medium text-muted-foreground">Column 3</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-card-foreground">Sample data 1</span>
              <span className="text-sm text-card-foreground">Sample data 2</span>
              <span className="text-sm text-card-foreground">Sample data 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
