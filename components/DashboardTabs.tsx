'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Plus, PlusIcon, Settings, SortDescIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { MdOutlineSort } from "react-icons/md";
import { CgSortAz } from "react-icons/cg";


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
    { name: 'Cash Flow', href: `/dashboard/${companyId}/cash-flow` },
    // { name: '+', href: '#' },
  ];
  const activeTabName =
    tabs.find(
      (t) =>
        pathname === t.href ||
        (t.name === 'Home' && pathname === '/dashboard')
    )?.name || '';

  return (
    <div className={`items-center  bg-[#f7f9fc] px-8 pt-6 ${collapsed ? "ml-16" : "ml-80"
      }`}>
      <div className="flex space-x-6 border-b border-gray-200">
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
      {/* Page Title */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          {activeTabName} <Settings className="h-5 w-5 text-gray-400" />
        </h1>
        <div className="grid grid-cols-2 items-center m-3 border border-gray-200 rounded-md divide-x-2 divide-gray-200 bg-white">
          <button className='hover:bg-gray-100 cursor-pointer'>
            <CgSortAz className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
          </button>
          <button className='hover:bg-gray-100 cursor-pointer'>
            <PlusIcon className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
          </button>
        </div>
      </div>
    </div>

  );
}
