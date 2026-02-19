'use client'

import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  icon?: LucideIcon
  color?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = 'text-foreground',
}: StatCardProps) {
  return (
    <Card className="border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      {Icon && (
        <div className="mt-4 flex justify-end">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
    </Card>
  )
}
