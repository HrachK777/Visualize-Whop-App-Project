'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {Membership, Plan} from '@/lib/types/analytics';

interface MembershipsContextType {
  data: {
    memberships: Membership[],
    plans: Plan[]
  }
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const MembershipsContextType = createContext<MembershipsContextType | undefined>(undefined)

export function MembershipsProvider({
  children,
  companyId
}: {
  children: ReactNode
  companyId: string
}) {
  const [data, setData] = useState<{memberships: Membership[], plans: Plan[]}>({memberships: [], plans: []})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchMemberships = async () => {
    // Prevent duplicate simultaneous fetches
    if (isFetching) {
      console.log('[MembershipsContext] Fetch already in progress, skipping duplicate request')
      return
    }

    setIsFetching(true)
    setLoading(true)
    setError(null)
    try {
      // Try to read from MongoDB cache first
      let response = await fetch(`/api/memberships?company_id=${companyId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch Memberships')
      }
      const MembershipsData = await response.json();
      setData(MembershipsData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchMemberships()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  return (
    <MembershipsContextType.Provider value={{ data, loading, error, refetch: fetchMemberships }}>
      {children}
    </MembershipsContextType.Provider>
  )
}

export function useMemberships() {
  const context = useContext(MembershipsContextType)
  if (context === undefined) {
    throw new Error('useMemberships must be used within MembershipsProvider')
  }
  return context
}
