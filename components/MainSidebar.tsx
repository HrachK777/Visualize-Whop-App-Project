'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  LineChart,
  Users,
  Settings,
  Building2,
  CheckSquare,
  DollarSign,
  Search,
  Target,
  Bell,
  User,
} from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { RxDashboard } from "react-icons/rx";
import { BsBarChart } from "react-icons/bs";
import { FaBuildingUser } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";


export default function MainSidebar({ active, setActive, companyId }: any) {
  const navItems = [
    { id: 'dashboard', icon: <RxDashboard />, label: 'Dashboard', url: `/dashboard/${companyId}` },
    { id: 'reports', icon: <BsBarChart />, label: 'Reports' },
    { id: 'customers', icon: <FaBuildingUser />, label: 'Customers' },
    { id: 'settings', icon: <CiSettings />, label: 'Settings', url: `/dashboard/${companyId}/settings` }
  ];
  const router = useRouter();

  const handleClickMainMenuItem = (item: any) => {
    setActive(item.id);
    if(item.url) {
      router.push(item.url)
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-16 flex flex-col items-center justify-between bg-[#0f2940] text-gray-300 border-r border-slate-700 py-4">
      {/* Top icons */}
      <div className="flex flex-col items-center gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClickMainMenuItem(item)}
            className={clsx(
              'relative flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-[#1d3d5a]',
              active === item.id && 'bg-blue-500 text-white'
            )}
            title={item.label}
          >
            <div className="items-center">{item.icon}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}
