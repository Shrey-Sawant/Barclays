'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { customers, getCustomerById } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react'

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

const behavioralTrendData = [
  { month: 'Jan', salaryDelay: 2, savings: 85, atmActivity: 60 },
  { month: 'Feb', salaryDelay: 1, savings: 82, atmActivity: 65 },
  { month: 'Mar', salaryDelay: 3, savings: 78, atmActivity: 72 },
  { month: 'Apr', salaryDelay: 4, savings: 75, atmActivity: 80 },
  { month: 'May', salaryDelay: 5, savings: 70, atmActivity: 85 },
  { month: 'Jun', salaryDelay: 6, savings: 65, atmActivity: 90 },
]

const suggestedOffers = [
  { type: 'Grace Period', confidence: 78, expectedValue: '₹2,500', description: 'Offer 1-month payment holiday' },
  { type: 'Restructure', confidence: 65, expectedValue: '₹1,200', description: 'Extend loan tenure by 6 months' },
  { type: 'Soft Reminder', confidence: 92, expectedValue: '₹500', description: 'Send preventive notification' },
]

export default function Customer360Page() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('id') || 'CUST0001'
  const customer = getCustomerById(customerId) || customers[0]
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [interventionSent, setInterventionSent] = useState(false)

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-green-600'
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="ml-64 flex-1 overflow-auto">
        <PageHeader 
          title={`Customer 360° - ${customer.name}`}
          description={`Individual risk profile and behavioral metrics`}
          actions={
            <>
              <Button variant="outline">Print Profile</Button>
              <Button>Create Intervention</Button>
            </>
          }
        />

        <div className="p-8 space-y-8">
          {/* Customer Info Cards Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Monthly Income</p>
              <p className="mt-2 text-2xl font-bold text-foreground">₹{customer.monthlyIncome.toLocaleString()}</p>
            </Card>
            <Card className="border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">EMI Amount</p>
              <p className="mt-2 text-2xl font-bold text-foreground">₹{customer.emiAmount.toLocaleString()}</p>
            </Card>
            <Card className="border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Savings Balance</p>
              <p className="mt-2 text-2xl font-bold text-foreground">₹{customer.savingsBalance.toLocaleString()}</p>
            </Card>
            <Card className="border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Loan Type</p>
              <p className="mt-2 text-base font-bold text-foreground">{customer.loanType}</p>
            </Card>
            <Card className={cn('border border-border bg-card p-4', customer.riskScore >= 70 ? 'bg-red-50' : 'bg-background')}>
              <p className="text-xs font-medium text-muted-foreground uppercase">Risk Score</p>
              <p className={cn('mt-2 text-2xl font-bold', getRiskColor(customer.riskScore))}>
                {customer.riskScore}/100
              </p>
            </Card>
          </div>

          {/* Risk Intelligence Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Risk Intelligence</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={cn('text-2xl font-bold', getRiskColor(customer.riskScore))}>
                      {customer.riskScore}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">Very High</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-red-600" style={{ width: `${customer.riskScore}%` }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{customer.healthScore}</span>
                    <span className="text-xs font-medium text-muted-foreground">Poor</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: `${customer.healthScore}%` }} />
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Risk Momentum</p>
                  <Badge variant={customer.riskMomentum === 'Declining' ? 'destructive' : customer.riskMomentum === 'Critical' ? 'destructive' : 'default'}>
                    {customer.riskMomentum}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Key Risk Drivers (SHAP)</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Salary Delay</span>
                  <span className="font-semibold text-red-600">{customer.salaryDelay} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failed Auto Debits</span>
                  <span className="font-semibold text-red-600">{customer.behavioralMetrics.failedAutoDebits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Savings Decline %</span>
                  <span className="font-semibold text-amber-600">{customer.behavioralMetrics.savingsDecline}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ATM Spike</span>
                  <span className="font-semibold">{customer.behavioralMetrics.atmSpike ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Utility Bill Delay</span>
                  <span className="font-semibold text-amber-600">{customer.behavioralMetrics.utilityDelay} days</span>
                </div>
              </div>
            </Card>

            <Card className="border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                      Send Advisory SMS
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send SMS to {customer.name}</DialogTitle>
                      <DialogDescription>
                        Send a payment advisory notification
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm">Hi {customer.name}, we noticed a payment due soon. Please ensure timely EMI payment to avoid penalties.</p>
                      <Button onClick={() => setInterventionSent(true)} className="w-full">Send SMS</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <CheckCircle2 className="h-4 w-4" />
                      Offer EMI Grace
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Offer Payment Grace Period</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm">Offer a 1-month payment holiday to {customer.name}</p>
                      <Button onClick={() => setInterventionSent(true)} className="w-full">Send Offer</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <TrendingDown className="h-4 w-4" />
                      Offer Restructure
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Offer Loan Restructure</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm">Restructure loan to extend tenure and reduce EMI by 15%</p>
                      <Button onClick={() => setInterventionSent(true)} className="w-full">Send Offer</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {interventionSent && (
                <div className="mt-4 rounded-lg bg-green-50 p-3 text-xs text-green-700">
                  Intervention sent successfully!
                </div>
              )}
            </Card>
          </div>

          {/* Behavioral Trends Chart */}
          <Card className="border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Behavioral Trend (6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={behavioralTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="salaryDelay" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  name="Salary Delay (Days)"
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Savings Index"
                />
                <Line 
                  type="monotone" 
                  dataKey="atmActivity" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="ATM Activity"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Suggested Interventions */}
          <Card className="border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">AI-Suggested Interventions</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {suggestedOffers.map((offer) => (
                <Card key={offer.type} className="border border-border bg-background p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{offer.type}</h4>
                    <Badge variant="secondary">{offer.confidence}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Expected Retention Value:</span>
                    <span className="font-bold text-green-600">{offer.expectedValue}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => setSelectedOffer(offer.type)}
                  >
                    Select
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
