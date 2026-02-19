'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
}

export function ChartCard({ title, description, children, action }: ChartCardProps) {
  return (
    <Card className="border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="mt-6">
        {children}
      </div>
    </Card>
  )
}
