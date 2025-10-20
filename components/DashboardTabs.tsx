'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Plus, PlusIcon, Settings, SortDescIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useSidebarStore } from "@/lib/stores/sidebarStore";


interface DashboardTabsProps {
  companyId: string
}

export default function DashboardTabs({ companyId }: DashboardTabsProps) {
  const pathname = usePathname();
  const collapsed = useSidebarStore((state) => state.collapsed);
  const tabs = [
    { name: 'Home', href: `/dashboard/${companyId}` },
    { name: 'Leads & Trials', href: `/dashboard/${companyId}/leads` },
    { name: 'Sales-led', href: `/dashboard/${companyId}/sales` },
    { name: 'Churn & Retention', href: `/dashboard/${companyId}/churn` },
    { name: 'Cash Flow', href: `/dashboard/${companyId}/cash` },
    // { name: '+', href: '#' },
  ];

  return (
    <div className={`flex items-center space-x-6 border-b border-gray-200 bg-[#f7f9fc] px-8 pt-6 ${collapsed ? "ml-16" : "ml-80"
      }`}>
      {tabs.map((tab) => {
        const isActive =
          pathname == tab.href ||
          (tab.name === 'Home' && pathname === `/dashboard/${companyId}`);

      return (
            <Link
              key={tab.name}
              href={tab.href}
              className={clsx(
                'text-base font-medium text-gray-800 font-medium',
                isActive
                  ? 'border-b-2 border-[#1677ff]'
                  : 'text-gray-500 hover:text-gray-800'
              )}
            >
              {tab.name}
            </Link>
        );
      })}
      <Plus className='text-gray-400 w-7 h-7 font-semibold' />
    </div>
  );
}
