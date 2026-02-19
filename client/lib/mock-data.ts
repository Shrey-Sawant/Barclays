export interface BehavioralMetrics {
  savingsDecline: number
  discretionaryRatio: number
  atmSpike: boolean
  failedAutoDebits: number
  utilityDelay: number
}

export interface Customer {
  id: string
  name: string
  monthlyIncome: number
  emiAmount: number
  savingsBalance: number
  riskScore: number
  healthScore: number
  loanType: string
  missedEMI6M: number
  salaryDelay: number
  riskMomentum: string
  behavioralMetrics: BehavioralMetrics
}

const customerNames = [
  'Rajesh Kumar',
  'Priya Singh',
  'Amit Patel',
  'Sneha Gupta',
  'Vikram Mehta',
  'Ananya Sharma',
  'Rohan Desai',
  'Divya Iyer',
  'Sanjay Reddy',
  'Neha Malhotra',
  'Arjun Nair',
  'Pooja Verma',
  'Nikhil Rao',
  'Kavya Krishnan',
  'Suresh Joshi',
  'Anjali Bhatt',
  'Aditya Roy',
  'Deepika Nambiar',
  'Karan Singh',
  'Radhika Chopra',
  'Varun Kapoor',
  'Isha Saxena',
  'Harsh Pandey',
  'Megha Bhat',
  'Sameer Khan',
  'Ritika Chakraborty',
  'Rohit Sharma',
  'Shruti Iyer',
  'Praveen Kumar',
  'Anushka Tiwari',
]

const loanTypes = ['Auto Loan', 'Personal Loan', 'Home Loan', 'Education Loan', 'Business Loan']
const riskMomentums = ['Improving', 'Stable', 'Declining', 'Critical']

function generateCustomers(): Customer[] {
  const customers: Customer[] = []

  for (let i = 0; i < 25; i++) {
    const monthlyIncome = 25000 + Math.random() * 95000
    const emiAmount = 5000 + Math.random() * 30000
    const savingsBalance = Math.random() * 200000
    const riskScore = Math.floor(15 + Math.random() * 75)
    const healthScore = Math.max(20, 100 - riskScore + (Math.random() * 20 - 10))
    const missedEMI6M = Math.floor(Math.random() * 3)
    const salaryDelay = Math.floor(Math.random() * 9)

    customers.push({
      id: `CUST${String(i + 1).padStart(4, '0')}`,
      name: customerNames[i % customerNames.length],
      monthlyIncome: Math.round(monthlyIncome),
      emiAmount: Math.round(emiAmount),
      savingsBalance: Math.round(savingsBalance),
      riskScore,
      healthScore: Math.round(healthScore),
      loanType: loanTypes[Math.floor(Math.random() * loanTypes.length)],
      missedEMI6M,
      salaryDelay,
      riskMomentum: riskMomentums[Math.floor(Math.random() * riskMomentums.length)],
      behavioralMetrics: {
        savingsDecline: Math.floor(Math.random() * 60),
        discretionaryRatio: Math.floor(20 + Math.random() * 60),
        atmSpike: Math.random() > 0.7,
        failedAutoDebits: Math.floor(Math.random() * 5),
        utilityDelay: Math.floor(Math.random() * 90),
      },
    })
  }

  return customers.sort((a, b) => b.riskScore - a.riskScore)
}

export const customers = generateCustomers()

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id)
}

export function getHighRiskCustomers(): Customer[] {
  return customers.filter((c) => c.riskScore >= 70)
}

export function getMediumRiskCustomers(): Customer[] {
  return customers.filter((c) => c.riskScore >= 40 && c.riskScore < 70)
}

export function getLowRiskCustomers(): Customer[] {
  return customers.filter((c) => c.riskScore < 40)
}

export function getAverageRiskScore(): number {
  const sum = customers.reduce((acc, c) => acc + c.riskScore, 0)
  return Math.round(sum / customers.length)
}

export function getPredicted30DayDelinquencies(): number {
  return customers.filter((c) => c.riskScore >= 70 && c.salaryDelay >= 5).length
}

export const interventionTypes = [
  'Soft Reminder',
  'Grace Period',
  'EMI Restructure',
  'Payment Holiday',
  'Balance Transfer',
  'Personal Visit',
]

export const channels = ['SMS', 'App Notification', 'Email', 'Call', 'Portal']

export const interventionStatuses = ['Pending', 'Sent', 'Accepted', 'Rejected', 'Completed']
