/**
 * Member-based Analytics
 * Calculates ARPU, CLV, and LTV using actual member spend data from Whop members API
 *
 * Per Whop API documentation:
 * https://docs.whop.com/api-reference/members/list-members
 * Each member includes `usd_total_spent` field which represents total spend
 */

export interface Member {
  id: string
  user: {
    id: string
    email: string | null
    name: string | null
    username: string
  } | null
  usd_total_spent: number
  status: 'drafted' | 'joined' | 'left'
  access_level: 'no_access' | 'admin' | 'customer'
  most_recent_action: string | null
  created_at: string
  joined_at: string
}

export interface MemberBasedMetrics {
  arpu: number
  clv: {
    average: number
    median: number
    total: number
    totalCustomers: number
  }
  ltv: number
}

/**
 * Calculate ARPU (Average Revenue Per User) from member data
 *
 * ARPU = Total spend across all members / Number of unique members
 *
 * This gives the average amount each member has spent with the company
 */
export function calculateMemberBasedARPU(members: Member[]): number {
  if (members.length === 0) return 0

  // Sum total spend across all members
  const totalSpend = members.reduce((sum, member) => sum + member.usd_total_spent, 0)

  // Calculate average per member
  return totalSpend / members.length
}

/**
 * Calculate CLV (Customer Lifetime Value) from member data
 *
 * CLV represents the total value a customer brings to the business
 * Using actual spend data from members gives us realized CLV
 */
export function calculateMemberBasedCLV(members: Member[]): {
  average: number
  median: number
  total: number
  totalCustomers: number
} {
  // Filter to customers only (not admins or no_access)
  const customers = members.filter(m =>
    m.access_level === 'customer' && m.usd_total_spent > 0
  )

  if (customers.length === 0) {
    return {
      average: 0,
      median: 0,
      total: 0,
      totalCustomers: 0
    }
  }

  // Get all CLV values (which is just usd_total_spent for each customer)
  const clvValues = customers.map(m => m.usd_total_spent)

  // Calculate total
  const total = clvValues.reduce((sum, val) => sum + val, 0)

  // Calculate average
  const average = total / clvValues.length

  // Calculate median
  const sorted = [...clvValues].sort((a, b) => a - b)
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]

  return {
    average,
    median,
    total,
    totalCustomers: customers.length
  }
}

/**
 * Calculate LTV (Lifetime Value) prediction
 *
 * LTV = ARPU / Churn Rate
 *
 * This predicts the total value a customer will generate over their lifetime
 * Requires churn rate from other calculations
 */
export function calculateMemberBasedLTV(
  members: Member[],
  customerChurnRate: number
): number {
  if (customerChurnRate === 0 || members.length === 0) return 0

  const arpu = calculateMemberBasedARPU(members)

  // LTV = ARPU / Churn Rate (as decimal)
  const churnRateDecimal = customerChurnRate / 100

  return arpu / churnRateDecimal
}

/**
 * Calculate all member-based metrics at once
 */
export function calculateMemberMetrics(
  members: Member[],
  customerChurnRate: number
): MemberBasedMetrics {
  const arpu = calculateMemberBasedARPU(members)
  const clv = calculateMemberBasedCLV(members)
  const ltv = calculateMemberBasedLTV(members, customerChurnRate)

  return {
    arpu,
    clv,
    ltv
  }
}

/**
 * Get active members only (customers who have joined)
 */
export function getActiveMembers(members: Member[]): Member[] {
  return members.filter(m =>
    m.status === 'joined' &&
    m.access_level === 'customer'
  )
}

/**
 * Get total spend across all members
 */
export function getTotalMemberSpend(members: Member[]): number {
  return members.reduce((sum, member) => sum + member.usd_total_spent, 0)
}
