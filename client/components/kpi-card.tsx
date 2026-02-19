'use client'

import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  icon?: LucideIcon
  color?: 'blue' | 'green' | 'red' | 'amber'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
}

export function KPICard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color = 'blue',
}: KPICardProps) {
  return (
    <Card className="border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        {trend && (
          <div className={cn('rounded-lg p-2', colorClasses[color])}>
            {trend === 'up' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </div>
        )}
        {Icon && !trend && (
          <div className={cn('rounded-lg p-2', colorClasses[color])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-red-600' : 'text-green-600'
          )}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </Card>
  )
}
