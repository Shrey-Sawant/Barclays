'use client'

import { ReactNode } from 'react'
import { Navigation } from './navigation'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="ml-64 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
