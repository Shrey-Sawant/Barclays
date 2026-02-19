'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter } from 'lucide-react'
import { customers } from '@/lib/mock-data'

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CustomerRiskPage() {
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (riskFilter === 'high') return matchesSearch && customer.riskScore >= 70
    if (riskFilter === 'medium') return matchesSearch && customer.riskScore >= 40 && customer.riskScore < 70
    if (riskFilter === 'low') return matchesSearch && customer.riskScore < 40
    return matchesSearch
  })

  const getRiskBadgeVariant = (riskScore: number) => {
    if (riskScore >= 70) return 'destructive'
    if (riskScore >= 40) return 'default'
    return 'secondary'
  }

  const getRiskLabel = (riskScore: number) => {
    if (riskScore >= 70) return 'High Risk'
    if (riskScore >= 40) return 'Medium Risk'
    return 'Low Risk'
  }

  const getMomentumColor = (momentum: string) => {
    if (momentum === 'Improving') return 'text-green-600'
    if (momentum === 'Declining') return 'text-red-600'
    if (momentum === 'Critical') return 'text-red-700'
    return 'text-muted-foreground'
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="ml-64 flex-1 overflow-auto">
        <PageHeader 
          title="Customer Risk List"
          description="Individual customer risk assessment and EMI health metrics"
          actions={
            <>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button>Create Intervention</Button>
            </>
          }
        />

        <div className="p-8">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search customer name..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={riskFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={riskFilter === 'high' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('high')}
              >
                High Risk
              </Button>
              <Button 
                variant={riskFilter === 'medium' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('medium')}
              >
                Medium Risk
              </Button>
              <Button 
                variant={riskFilter === 'low' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('low')}
              >
                Low Risk
              </Button>
            </div>
          </div>

          {/* Customers Table */}
          <Card className="border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="text-foreground">Customer Name</TableHead>
                  <TableHead className="text-center text-foreground">Risk Score</TableHead>
                  <TableHead className="text-center text-foreground">Health Score</TableHead>
                  <TableHead className="text-right text-foreground">EMI Amount</TableHead>
                  <TableHead className="text-center text-foreground">Missed EMI (6M)</TableHead>
                  <TableHead className="text-center text-foreground">Salary Delay (Days)</TableHead>
                  <TableHead className="text-foreground">Risk Momentum</TableHead>
                  <TableHead className="text-center text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-b border-border hover:bg-muted">
                    <TableCell className="font-medium text-foreground">{customer.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getRiskBadgeVariant(customer.riskScore)}>
                        {customer.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-foreground">{customer.healthScore}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">₹{customer.emiAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{customer.missedEMI6M}</TableCell>
                    <TableCell className="text-center">{customer.salaryDelay}</TableCell>
                    <TableCell>
                      <span className={cn('text-sm font-medium', getMomentumColor(customer.riskMomentum))}>
                        {customer.riskMomentum}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/customer-360?id=${customer.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {filteredCustomers.length === 0 && (
            <Card className="border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No customers found matching your filters.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
