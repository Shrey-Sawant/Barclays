'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { interventionTypes, interventionStatuses, customers } from '@/lib/mock-data'
import { Plus, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

const mockInterventions = [
  {
    id: 'INT001',
    customerName: 'Rajesh Kumar',
    customerId: 'CUST0001',
    interventionType: 'Soft Reminder',
    status: 'Sent',
    dateSent: '2024-06-15',
    outcome: 'Accepted',
  },
  {
    id: 'INT002',
    customerName: 'Priya Singh',
    customerId: 'CUST0002',
    interventionType: 'Grace Period',
    status: 'Accepted',
    dateSent: '2024-06-14',
    outcome: 'Accepted',
  },
  {
    id: 'INT003',
    customerName: 'Amit Patel',
    customerId: 'CUST0003',
    interventionType: 'EMI Restructure',
    status: 'Pending',
    dateSent: '2024-06-13',
    outcome: 'Pending',
  },
  {
    id: 'INT004',
    customerName: 'Sneha Gupta',
    customerId: 'CUST0004',
    interventionType: 'Soft Reminder',
    status: 'Sent',
    dateSent: '2024-06-12',
    outcome: 'Rejected',
  },
  {
    id: 'INT005',
    customerName: 'Vikram Mehta',
    customerId: 'CUST0005',
    interventionType: 'Payment Holiday',
    status: 'Accepted',
    dateSent: '2024-06-11',
    outcome: 'Accepted',
  },
]

export default function InterventionsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [newIntervention, setNewIntervention] = useState({
    customerId: '',
    interventionType: '',
  })

  const filteredInterventions = mockInterventions.filter((intervention) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return intervention.status === 'Pending'
    if (filterStatus === 'accepted') return intervention.outcome === 'Accepted'
    return true
  })

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Pending') return 'default'
    if (status === 'Sent') return 'secondary'
    if (status === 'Accepted') return 'secondary'
    if (status === 'Rejected') return 'destructive'
    return 'outline'
  }

  const getOutcomeBadgeVariant = (outcome: string) => {
    if (outcome === 'Accepted') return 'secondary'
    if (outcome === 'Rejected') return 'destructive'
    return 'default'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Pending') return <Clock className="h-4 w-4" />
    if (status === 'Sent' || status === 'Accepted') return <CheckCircle2 className="h-4 w-4" />
    if (status === 'Rejected') return <AlertTriangle className="h-4 w-4" />
    return null
  }

  const totalInterventions = mockInterventions.length
  const pendingInterventions = mockInterventions.filter((i) => i.status === 'Pending').length
  const acceptedOffers = mockInterventions.filter((i) => i.outcome === 'Accepted').length
  const riskReduced = (acceptedOffers * 12).toFixed(1)

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 flex-1 overflow-auto">
        <PageHeader
          title="Intervention Management"
          description="Track and manage customer interventions and offers"
          actions={
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Intervention
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Intervention</DialogTitle>
                    <DialogDescription>Send an intervention offer to a customer</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="customer">Customer</Label>
                      <Select value={newIntervention.customerId} onValueChange={(value) => setNewIntervention({ ...newIntervention, customerId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.slice(0, 10).map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="intervention-type">Intervention Type</Label>
                      <Select value={newIntervention.interventionType} onValueChange={(value) => setNewIntervention({ ...newIntervention, interventionType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intervention" />
                        </SelectTrigger>
                        <SelectContent>
                          {interventionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Create Intervention</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <div className="p-8">
          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-border bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Interventions</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{totalInterventions}</p>
            </Card>
            <Card className="border border-border bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{pendingInterventions}</p>
            </Card>
            <Card className="border border-border bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">Accepted Offers</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{acceptedOffers}</p>
            </Card>
            <Card className="border border-border bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">Risk Score Reduction</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{riskReduced}</p>
            </Card>
          </div>

          {/* Filter Badges */}
          <div className="mb-6 flex gap-2">
            <Badge 
              variant={filterStatus === 'all' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setFilterStatus('all')}
            >
              All ({totalInterventions})
            </Badge>
            <Badge 
              variant={filterStatus === 'pending' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setFilterStatus('pending')}
            >
              Pending ({pendingInterventions})
            </Badge>
            <Badge 
              variant={filterStatus === 'accepted' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setFilterStatus('accepted')}
            >
              Accepted ({acceptedOffers})
            </Badge>
          </div>

          {/* Interventions Table */}
          <Card className="border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="text-foreground">Customer Name</TableHead>
                  <TableHead className="text-foreground">Intervention Type</TableHead>
                  <TableHead className="text-center text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Date Sent</TableHead>
                  <TableHead className="text-center text-foreground">Outcome</TableHead>
                  <TableHead className="text-center text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterventions.map((intervention) => (
                  <TableRow key={intervention.id} className="border-b border-border hover:bg-muted">
                    <TableCell className="font-medium text-foreground">{intervention.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">{intervention.interventionType}</TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2">
                        {getStatusIcon(intervention.status)}
                        <Badge variant={getStatusBadgeVariant(intervention.status)}>
                          {intervention.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(intervention.dateSent).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getOutcomeBadgeVariant(intervention.outcome)}>
                        {intervention.outcome}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/customer-360?id=${intervention.customerId}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {filteredInterventions.length === 0 && (
            <Card className="border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No interventions found for the selected filter.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
