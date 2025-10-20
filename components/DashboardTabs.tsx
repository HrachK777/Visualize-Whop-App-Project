'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Plus, PlusIcon, Settings, SortDescIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';


interface DashboardTabsProps {
  company_id: string
}

export default function DashboardTabs({ company_id }: DashboardTabsProps) {
  const pathname = usePathname();
  const tabs = [
    { name: 'Home', href: `/dashboard/${company_id}` },
    { name: 'Leads & Trials', href: `/dashboard/${company_id}/leads` },
    { name: 'Sales-led', href: `/dashboard/${company_id}/sales` },
    { name: 'Churn & Retention', href: `/dashboard/${company_id}/churn` },
    { name: 'Cash Flow', href: `/dashboard/${company_id}/cash` },
    // { name: '+', href: '#' },
  ];

  return (
    <div className="flex items-center space-x-6 border-b border-gray-200 bg-[#f7f9fc]">
      {tabs.map((tab) => {
        const isActive =
          pathname == tab.href ||
          (tab.name === 'Home' && pathname === `/dashboard/${company_id}`);

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
