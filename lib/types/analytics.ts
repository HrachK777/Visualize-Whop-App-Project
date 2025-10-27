export interface Plan {
  id: string
  rawRenewalPrice: number  // Price in cents (e.g., 2900 = $29.00)
  rawInitialPrice: number  // Price in cents (e.g., 2900 = $29.00)
  billingPeriod: number | null // days, or null for one_time
  planType: 'renewal' | 'one_time'
  baseCurrency: string
  description?: string | null
  accessPass?: {
    id: string
    title: string
  } | null
  createdAt?: number
  updatedAt?: number
  visibility?: string
  releaseMethod?: string
  __typename?: string
}

export interface Membership {
  id: string
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'completed' | 'expired'
  createdAt: number  // Unix timestamp in seconds - GraphQL uses camelCase
  canceledAt: number | null
  expiresAt: number | null
  cancelationReason: string | null
  totalSpend: number
  plan?: {
    id: string
    __typename?: string
  }
  // Enriched plan data (populated after fetching from API)
  planData?: Plan
  accessPass?: {
    id: string
    title: string
    __typename?: string
  }
  member?: {
    id: string
    email: string
    username?: string
    name?: string | null
    __typename?: string
  } | null
  promoCode?: unknown
  __typename?: string
}

export interface MRRData {
  total: number
  breakdown: {
    monthly: number
    annual: number
    quarterly: number
    other: number
  }
}

export interface MRRMovement {
  type: 'new_business' | 'expansion' | 'contraction' | 'churn' | 'reactivation'
  amount: number
  count: number
}

export interface SubscriberMetrics {
  active: number
  cancelled: number
  past_due: number
  trialing: number
  total: number
}

export interface ChurnMetrics {
  customerChurnRate: number
  revenueChurnRate: number
  netRevenueRetention: number
}

export interface AnalyticsPeriod {
  startDate: Date
  endDate: Date
  mrr: number
  subscribers: SubscriberMetrics
  movements: MRRMovement[]
}

export interface Lead {
  id: number;
  customer: string;
  leadCreated: string;
  trialStarted: string;
  country: string;
  owner: string;
  status: string;
  note?: string;
};

export interface CustomerType {
    id: number,
    name: string,
    mrr: string,
    arr: string,
    plan: string,
    billing: string,
    payment: string,
    country: string,
    since: number,
    status: string,
    pastDueAt?: number,
    renewalAt?: number,
    trialStartedAt: number,
    note?: string,
    owner: string,
}
