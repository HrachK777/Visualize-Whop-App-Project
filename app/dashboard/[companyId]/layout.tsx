"use client";

import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import SubscriptionModal from "@/components/SubscriptionModal";
import { use, useEffect, useState } from "react";
import MainSidebar from "@/components/MainSidebar";
import SubSidebar from '@/components/SubSidebar';
import DashboardTabs from "@/components/DashboardTabs";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const collapsed = useSidebarStore((state) => state.collapsed);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('dashboard');

  useEffect(() => {
    async function checkSubscription() {
      try {
        // Get userId from Whop's window context (provided by Whop SDK)
        const whopContext = (
          window as typeof window & { __WHOP__?: { userId?: string } }
        ).__WHOP__;
        const whopUserId = whopContext?.userId || companyId;
        setUserId(whopUserId);

        // Check subscription status by companyId
        const subscriptionResponse = await fetch(
          `/api/subscription/check?companyId=${companyId}`
        );
        if (subscriptionResponse.ok) {
          const subscriptionData = (await subscriptionResponse.json()) as {
            hasAccess: boolean;
          };

          // Show modal if user doesn't have access
          // if (!subscriptionData.hasAccess) {
          //   setShowSubscriptionModal(true);
          // }
        }
      } catch (err) {
        // Error checking subscription
      } finally {
        setLoading(false);
      }
    }

    checkSubscription();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Subscription Modal - shows when user doesn't have access */}
      {showSubscriptionModal && userId && (
        <SubscriptionModal userId={userId} companyId={companyId} />
      )}

      {/* Main Dashboard - blurred if no subscription */}
      <div
        className={
          showSubscriptionModal
            ? "filter blur-sm pointer-events-none w-full flex"
            : "w-full flex"
        }
      >
        {/* <Sidebar companyId={companyId} /> */}
        <MainSidebar active={active} setActive={setActive} companyId={companyId} />
        <SubSidebar active={active} companyId={companyId} />
        <div className="flex-1 flex flex-col">
          {/* <DashboardHeader companyId={companyId} /> */}
          <main
            className={`flex-1 transition-all duration-300 pt-6 ${
              collapsed ? "ml-16" : "ml-80"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
