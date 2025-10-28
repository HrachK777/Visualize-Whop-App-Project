import { NextRequest, NextResponse } from 'next/server'
import { getAllMemberships, getAllPayments, getAllPlans, getAllMembers } from '@/lib/whop/helpers'
import { whopClient } from '@/lib/whop/sdk'
import { calculateMRR, calculateARR } from '@/lib/analytics/mrr'
import { calculateSubscriberMetrics, getActiveUniqueSubscribers } from '@/lib/analytics/subscribers'
import { calculateTrialMetrics } from '@/lib/analytics/trials'
import { calculateCashFlow, calculatePaymentMetrics, calculateRefundMetrics } from '@/lib/analytics/transactions'
import { calculateMemberBasedARPU, calculateMemberBasedCLV, calculateMemberBasedLTV } from '@/lib/analytics/members'
import { Membership, Plan } from '@/lib/types/analytics'
import { metricsRepository } from '@/lib/db/repositories/MetricsRepository'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const companyId = searchParams.get('company_id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required. Pass it as ?company_id=YOUR_ID' },
        { status: 400 }
      )
    }

    // Fetch all data from SDK
    console.log(`[Whop SDK] ========================================`)
    console.log(`[Whop SDK] REQUESTED COMPANY ID: ${companyId}`)
    console.log(`[Whop SDK] ========================================`)
    const company = await whopClient.companies.retrieve(companyId)
    console.log(`[Whop SDK] ========================================`)
    console.log(`[Whop SDK] RETURNED COMPANY ID: ${company.id}`)
    console.log(`[Whop SDK] RETURNED COMPANY TITLE: ${company.title}`)
    console.log(`[Whop SDK] ========================================`)

    if (company.id !== companyId) {
      console.error(`[Whop SDK] ⚠️  WARNING: Requested ${companyId} but got ${company.id}`)
    }

    const allMemberships = await getAllMemberships(companyId)
    const allPlans = await getAllPlans(companyId)
    const payments = await getAllPayments(companyId)
    const allMembers = await getAllMembers(companyId)

    // Enrich memberships with plan data
    const planMap = new Map<string, Plan>()
    allPlans.forEach((plan) => {
      planMap.set(plan.id, plan)
    })

    const enrichedMemberships: Membership[] = allMemberships.map(m => ({
      ...m,
      planData: m.plan ? planMap.get(m.plan.id) : undefined
    }))

    // Calculate all metrics
    const mrrData = calculateMRR(enrichedMemberships)
    const arr = calculateARR(mrrData.total)
    const subscriberMetrics = calculateSubscriberMetrics(enrichedMemberships)
    const activeUniqueSubscribers = getActiveUniqueSubscribers(enrichedMemberships)
    const trialMetrics = calculateTrialMetrics(enrichedMemberships)
    const cashFlowMetrics = calculateCashFlow(payments)
    const paymentMetrics = calculatePaymentMetrics(payments)
    const refundMetrics = calculateRefundMetrics(payments)

    // Calculate member-based metrics (ARPU, CLV, LTV) using actual spend data
    const arpu = calculateMemberBasedARPU(allMembers)
    const clvMetrics = calculateMemberBasedCLV(allMembers)
    const customerChurnRate = (subscriberMetrics.cancelled / subscriberMetrics.total) * 100
    const ltv = calculateMemberBasedLTV(allMembers, customerChurnRate)

    // Extract unique plans
    const uniquePlans = allPlans
      .filter(plan => plan.accessPass?.title)
      .reduce((acc, plan) => {
        const existing = acc.find(p => p.id === plan.id)
        if (!existing) {
          acc.push({
            id: plan.id,
            name: plan.accessPass?.title || 'Unknown Plan'
          })
        }
        return acc
      }, [] as Array<{ id: string; name: string }>)

    const responseData = {
      mrr: {
        total: mrrData.total,
        breakdown: mrrData.breakdown,
      },
      arr,
      arpu,
      subscribers: subscriberMetrics,
      activeUniqueSubscribers,
      trials: {
        total: trialMetrics.totalTrials,
        active: trialMetrics.activeTrials,
        converted: trialMetrics.convertedTrials,
        conversionRate: trialMetrics.conversionRate,
      },
      clv: {
        average: clvMetrics.average,
        median: clvMetrics.median,
        total: clvMetrics.totalCustomers,
      },
      ltv: {
        value: ltv,
        arpu: arpu,
        churnRate: customerChurnRate,
      },
      cashFlow: {
        gross: cashFlowMetrics.grossCashFlow,
        net: cashFlowMetrics.netCashFlow,
        recurring: cashFlowMetrics.recurringCashFlow,
        nonRecurring: cashFlowMetrics.nonRecurringCashFlow,
      },
      payments: {
        successful: paymentMetrics.successfulPayments,
        failed: paymentMetrics.failedPayments,
        total: paymentMetrics.totalPayments,
        successRate: paymentMetrics.successRate,
      },
      refunds: {
        total: refundMetrics.totalRefunds,
        amount: refundMetrics.refundedAmount,
        rate: refundMetrics.refundRate,
      },
      plans: uniquePlans,
      timestamp: new Date().toISOString(),
    }

    // Store in MongoDB for chart pages to reference
    // NOTE: This is a legacy fallback. Normal flow is webhook → snapshot
    try {
      await metricsRepository.insertSnapshot(companyId, {
        mrr: {
          total: mrrData.total,
          breakdown: mrrData.breakdown,
        },
        arr,
        arpu,
        subscribers: subscriberMetrics,
        activeUniqueSubscribers,
        metadata: {
          totalMemberships: allMemberships.length,
          activeMemberships: enrichedMemberships.filter(m => {
            const now = Date.now() / 1000
            return (m.status === 'active' || m.status === 'completed') &&
                   m.canceledAt === null &&
                   (!m.expiresAt || m.expiresAt > now)
          }).length,
          plansCount: allPlans.length,
        },
        rawData: {
          company: company as unknown,
          memberships: allMemberships,
          plans: allPlans,
          transactions: payments,
          members: allMembers,
        }
      })
      console.log('[MongoDB] Stored analytics data for all chart pages to reference')
    } catch (dbError) {
      console.error('[MongoDB] Failed to store analytics:', dbError)
      // Don't fail the request if MongoDB save fails
    }

    return NextResponse.json(responseData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}