"use client";

import { useSidebarStore } from "@/lib/stores/sidebarStore";
import SubscriptionModal from "@/components/SubscriptionModal";
import { use, useEffect, useState } from "react";
import MainSidebar from "@/components/MainSidebar";
import SubSidebar from '@/components/SubSidebar';
import DashboardTabs from "@/components/DashboardTabs";
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const collapsed = useSidebarStore((state) => state.collapsed);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('') as any;
  const pathname = usePathname();
  const navItems = [
    { id: 'customers', title: 'Customers', url: `/customers` },
    { id: 'reports', title: 'Reports', url: `/reports` },
    { id: 'settings', title: 'Settings', url: `/settings` },
  ];
  // console.log('for debug DashboardLayout active = ', active);
  // console.log('for debug DashboardLayout pathname = ', pathname);
  useEffect(() => {
    const activeItem = navItems.find((item) => pathname.includes(item.id));
    if (activeItem) setActive(activeItem?.id);
  }, [active]);

  console.log('for debug DashboardLayout active = ', active);

  // Extract the last segment of the path (e.g., 'customers', 'reports', etc.)
  const isDashboardPage =
    pathname?.includes('/dashboard/') &&
    !pathname?.includes('/customers') &&
    !pathname?.includes('/reports') &&
    !pathname?.includes('/settings');

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
        {/* Toggle Button */}
        {(pathname.includes('/reports') || pathname.includes('/customers')) &&
          (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`fixed ${collapsed ? "ml-16" : "ml-80"} bottom-10 bg-white hover:bg-gray-300 text-gray-800 rounded-md px-1.5 py-3 shadow-lg transition-colors z-10`}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        <div className={`flex-1 flex flex-col`}>
          {/* <DashboardHeader companyId={companyId} /> */}
          {isDashboardPage && <DashboardTabs companyId={companyId} />}
          <main
            className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-80"
              }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
