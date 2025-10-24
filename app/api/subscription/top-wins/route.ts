import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { Collections, hasActiveSubscription, getSubscriptionInfo } from '@/lib/models';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        if (!companyId) {
            return NextResponse.json(
                { error: 'Company ID is required' },
                { status: 400 }
            );
        }

        if (!clientPromise) {
            return NextResponse.json(
                { error: 'MongoDB not configured' },
                { status: 500 }
            );
        }

        // Check MongoDB only - webhooks keep it up to date in real-time
        const client = await clientPromise;
        const db = client.db('financier');
        const subscriptionsCollection = db.collection(Collections.SUBSCRIPTIONS);
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);

        // Get subscription from database by companyId (stored in whopData.metadata)
        const data = await subscriptionsCollection.aggregate([
            {
                $match: {
                    status: 'active',
                    updatedAt: { $gte: oneWeekAgo },
                    trialEndsAt: { $lte: now }
                }
            },
            {
                $project: {
                    userId: 1,
                    membershipId: 1,
                    planId: 1,
                    updatedAt: 1,
                    whopData: 1
                }
            },
            { $sort: { updatedAt: -1 } },
            { $limit: 10 }
        ]).toArray();

        if(data) {
            const topWins = data.map(win => ({
                customer: win.whopData?.metadata.email || win.userId,
                planId: win.planId || "unknown",
                arr: win.whopData?.arr || 0,
                billing: win.whopData?.billingCycle || "monthly",
                country: win.whopData?.country || "United States"
            }));
            return Response.json(topWins);
        }
    } catch {
        return NextResponse.json(
            { error: 'Failed to check subscription status' },
            { status: 500 }
        );
    }
}
