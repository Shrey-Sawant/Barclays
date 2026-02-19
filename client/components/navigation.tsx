'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, TrendingUp, Users, AlertCircle, Send, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/portfolio', icon: BarChart3, label: 'Customer Risk' },
  { href: '/customer-360', icon: Users, label: 'Customer 360°' },
  { href: '/interventions', icon: AlertCircle, label: 'Interventions' },
  { href: '/engagement', icon: Send, label: 'Engagement Console' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">EarlyRisk</h1>
            <p className="text-xs text-muted-foreground">Retail Risk Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="space-y-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-muted hover:shadow-sm'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-6 py-4">
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Retail Banking</p>
          <p>EMI Default Prevention</p>
        </div>
      </div>
    </nav>
  )
}
