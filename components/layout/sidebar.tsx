"use client"

import { usePathname } from "next/navigation"
import { LayoutDashboard, Table, Settings } from "lucide-react"
import { SidebarItem } from "./sidebar-item"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Table,
    label: "Tables",
    href: "/tables",
  },
  {
    icon: Settings,
    label: "Admin",
    href: "/admin",
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col bg-sidebar border-r border-sidebar-border", className)}>
      {/* Logo/Header */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">FinDash</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom section with theme toggle */}
      <div className="p-4 space-y-4">
        <Separator className="bg-sidebar-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-sidebar-foreground">Settings</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
