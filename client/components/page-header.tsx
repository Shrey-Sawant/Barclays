'use client'

import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 text-muted-foreground">{description}</p>
          </div>
          {actions && <div className="flex gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
