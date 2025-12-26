export default function AdminPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin</h1>
        <p className="text-muted-foreground">Administrative settings and configuration</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">Settings</h2>
          <p className="text-muted-foreground">Admin panel content goes here. Configuration options and settings will be added in future prompts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-card-foreground mb-2">Configuration</h3>
            <p className="text-sm text-muted-foreground">System configuration options</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-card-foreground mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground">Manage users and permissions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
