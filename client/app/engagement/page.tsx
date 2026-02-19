'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { customers, interventionTypes, channels } from '@/lib/mock-data'
import { Send, MessageSquare, Check, AlertCircle } from 'lucide-react'

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

const offerTemplates = {
  'Soft Reminder': {
    title: 'Payment Reminder',
    template: 'Hi {name}, your EMI payment of ₹{emiAmount} is due on {dueDate}. Please ensure timely payment to avoid penalties.',
  },
  'Grace Period': {
    title: 'Grace Period Offer',
    template: 'Hi {name}, we understand financial challenges. We\'re offering a 1-month payment holiday on your EMI. Reply YES to accept this offer.',
  },
  'EMI Restructure': {
    title: 'EMI Restructure Offer',
    template: 'Hi {name}, we can restructure your loan to reduce your monthly EMI by 15%. This will extend your loan tenure by 6 months. Interested? Reply YES.',
  },
  'Payment Holiday': {
    title: 'Payment Holiday Offer',
    template: 'Hi {name}, take a breather with our 2-month payment holiday. No interest charges apply. Accept this offer to proceed.',
  },
  'Balance Transfer': {
    title: 'Balance Transfer Offer',
    template: 'Hi {name}, consolidate your loans with us and get a lower interest rate. Call us at 1800-123-4567 to discuss.',
  },
  'Personal Visit': {
    title: 'Personal Assistance',
    template: 'Hi {name}, our relationship manager will visit you this week to discuss personalized solutions for your financial needs.',
  },
}

export default function EngagementConsolePage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedOffer, setSelectedOffer] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const [simulateAccepted, setSimulateAccepted] = useState(false)

  const customer = selectedCustomerId ? customers.find((c) => c.id === selectedCustomerId) : null
  const currentTemplate = selectedOffer ? offerTemplates[selectedOffer as keyof typeof offerTemplates] : null

  const generateMessage = () => {
    if (!currentTemplate || !customer) return ''
    let message = currentTemplate.template
    message = message.replace('{name}', customer.name)
    message = message.replace('{emiAmount}', customer.emiAmount.toLocaleString())
    message = message.replace('{dueDate}', 'next week')
    return message
  }

  const handleSendMessage = () => {
    setMessageSent(true)
    setTimeout(() => {
      setMessageSent(false)
    }, 3000)
  }

  const getCharacterCount = (text: string) => text.length
  const maxCharacters = 160

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="ml-64 flex-1 overflow-auto">
        <PageHeader
          title="Customer Engagement Console"
          description="Direct communication tool for sending offers and notifications to customers"
          actions={
            <>
              <Button variant="outline">View Delivery Report</Button>
              <Button>Campaign Analytics</Button>
            </>
          }
        />

        <div className="p-8 space-y-8">
          {/* Main Console Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Panel: Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Selection */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Step 1: Select Customer</h3>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer to send message to" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((cust) => (
                      <SelectItem key={cust.id} value={cust.id}>
                        {cust.name} (Risk: {cust.riskScore})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {customer && (
                  <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground">Monthly Income</p>
                        <p className="font-semibold">₹{customer.monthlyIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">EMI Amount</p>
                        <p className="font-semibold">₹{customer.emiAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Risk Score</p>
                        <p className={cn('font-semibold', customer.riskScore >= 70 ? 'text-red-600' : 'text-amber-600')}>
                          {customer.riskScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Salary Delay</p>
                        <p className="font-semibold">{customer.salaryDelay} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Offer Selection */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Step 2: Select Offer Type</h3>
                <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an offer to send" />
                  </SelectTrigger>
                  <SelectContent>
                    {interventionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentTemplate && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">{currentTemplate.title}</p>
                    <p className="text-sm text-blue-800">{currentTemplate.template}</p>
                  </div>
                )}
              </Card>

              {/* Channel Selection */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Step 3: Select Channel</h3>
                <div className="grid grid-cols-2 gap-3">
                  {channels.map((channel) => (
                    <Button
                      key={channel}
                      variant={selectedChannel === channel ? 'default' : 'outline'}
                      className="justify-start"
                      onClick={() => setSelectedChannel(channel)}
                    >
                      {channel}
                    </Button>
                  ))}
                </div>

                {selectedChannel && (
                  <div className="mt-4 rounded-lg bg-green-50 p-4 border border-green-200">
                    <p className="text-sm font-semibold text-green-900">
                      Message will be sent via: <span className="font-bold">{selectedChannel}</span>
                    </p>
                  </div>
                )}
              </Card>

              {/* Message Preview */}
              {customer && selectedOffer && (
                <Card className="border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Step 4: Preview Message</h3>
                  <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 min-h-24">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{generateMessage()}</p>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Character count: {getCharacterCount(generateMessage())}/{maxCharacters}
                    </p>
                    {getCharacterCount(generateMessage()) > maxCharacters && (
                      <Badge variant="destructive">Exceeds SMS limit</Badge>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Panel: Send & Status */}
            <div className="space-y-6">
              {/* Ready to Send */}
              <Card className={cn(
                'border bg-card p-6',
                selectedCustomerId && selectedOffer && selectedChannel
                  ? 'border-green-200 bg-green-50'
                  : 'border-border opacity-50'
              )}>
                <div className="flex items-start gap-3">
                  {selectedCustomerId && selectedOffer && selectedChannel ? (
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Ready to Send</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomerId && selectedOffer && selectedChannel
                        ? 'All fields completed. Click send below.'
                        : 'Complete all steps above to enable sending.'}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 gap-2"
                  disabled={!selectedCustomerId || !selectedOffer || !selectedChannel}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>

                {messageSent && (
                  <div className="mt-4 rounded-lg bg-green-100 p-3 border border-green-300">
                    <p className="text-sm font-semibold text-green-900">Message sent successfully!</p>
                    <p className="text-xs text-green-800 mt-1">Delivery status: In Progress</p>
                  </div>
                )}
              </Card>

              {/* Delivery Status */}
              {messageSent && (
                <Card className="border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Delivery Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sent</span>
                      <Badge variant="secondary">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Delivered</span>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setSimulateAccepted(!simulateAccepted)}
                  >
                    {simulateAccepted ? 'Clear Response' : 'Simulate Customer Response'}
                  </Button>

                  {simulateAccepted && (
                    <div className="mt-4 rounded-lg bg-green-50 p-3 border border-green-200">
                      <p className="text-sm font-semibold text-green-900">Customer accepted the offer!</p>
                      <p className="text-xs text-green-800 mt-1">Follow-up: Offer details sent to customer</p>
                    </div>
                  )}
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Today's Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Messages Sent</span>
                    <span className="font-bold text-lg">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Accept Rate</span>
                    <span className="font-bold text-lg text-green-600">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                    <span className="font-bold text-lg">2.3 hrs</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
