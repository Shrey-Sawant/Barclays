'use client'

import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { KPICard } from '@/components/kpi-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertTriangle, TrendingDown } from 'lucide-react'
import { customers, getHighRiskCustomers, getAverageRiskScore, getPredicted30DayDelinquencies } from '@/lib/mock-data'

// Generate risk distribution data for pie chart
const highRiskCount = getHighRiskCustomers().length
const mediumRiskCount = customers.filter(c => c.riskScore >= 40 && c.riskScore < 70).length
const lowRiskCount = customers.filter(c => c.riskScore < 40).length

const riskDistribution = [
  { name: 'High Risk', value: highRiskCount, color: '#dc2626' },
  { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
  { name: 'Low Risk', value: lowRiskCount, color: '#10b981' },
]

// Generate salary delay trend data
const salaryDelayTrend = [
  { month: 'Jan', delayed: 8, onTime: 17 },
  { month: 'Feb', delayed: 9, onTime: 16 },
  { month: 'Mar', delayed: 11, onTime: 14 },
  { month: 'Apr', delayed: 13, onTime: 12 },
  { month: 'May', delayed: 12, onTime: 13 },
  { month: 'Jun', delayed: 14, onTime: 11 },
]

const COLORS = ['#dc2626', '#f59e0b', '#10b981']

export default function Dashboard() {
  const avgRisk = getAverageRiskScore()
  const predicted30Day = getPredicted30DayDelinquencies()
  const highRiskCount = getHighRiskCustomers().length
  const activeInterventions = Math.floor(customers.length * 0.15)

  const kpiData = [
    { label: 'Total Customers', value: customers.length.toString(), change: '+2', trend: 'down' },
    { label: 'High Risk Individuals', value: highRiskCount.toString(), change: `+${highRiskCount > 5 ? 3 : 1}`, trend: 'up' },
    { label: 'Avg Risk Score', value: avgRisk.toString(), change: '+5', trend: 'up' },
    { label: 'Predicted 30D Delinquencies', value: predicted30Day.toString(), change: '+1', trend: 'up' },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="ml-64 flex-1 overflow-auto">
        <PageHeader 
          title="Retail Risk Dashboard"
          description="EMI default prevention and customer stress detection"
          actions={
            <>
              <Button variant="outline">Export Report</Button>
              <Button>Manage Interventions</Button>
            </>
          }
        />

        <div className="p-8">
          {/* KPI Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend as 'up' | 'down'}
                color={kpi.trend === 'up' ? 'red' : 'green'}
              />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Salary Delay Trend Chart */}
            <Card className="border border-border bg-card p-6 lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Salary Delay Trend (6 Months)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryDelayTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    cursor={{ stroke: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="delayed" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    dot={{ fill: '#dc2626', r: 4 }}
                    name="Salary Delayed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="onTime" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="On Time"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Risk Distribution */}
            <Card className="border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} customers`} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* High Risk Customers Alert */}
          <Card className="border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-red-50 p-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">High Risk Customers Requiring Attention</h3>
                  <p className="text-sm text-muted-foreground">
                    {highRiskCount} customers have risk scores above 70 and may need immediate intervention
                  </p>
                </div>
              </div>
              <Button className="flex-shrink-0">View All</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
