"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import {
  ChevronLeft,
  FactoryIcon,
  FanIcon,
  ChevronRight
} from "lucide-react";
import { usePathname } from "next/navigation";
import { IoFolder } from "react-icons/io5";
import { useEffect } from "react";
import { MdFiberNew } from "react-icons/md";
import { RiVipDiamondFill } from "react-icons/ri";
import { FaRoadBarrier } from "react-icons/fa6";
import { RiAlarmWarningFill } from "react-icons/ri";
import { MdOutlineAutorenew } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { HiUsers } from "react-icons/hi";
import { GiTrophyCup } from "react-icons/gi";



const sections = {
  reports: {
    title: "Reports",
    groups: [
      {
        label: "Recurring Revenue",
        items: [
          {
            title: "MRR",
            href: "/reports/mrr"
          },
          {
            title: "ARR",
            href: "/reports/arr"
          },
          {
            title: "New MRR",
            href: "/reports/new-mrr"
          },
          {
            title: "Expansion MRR",
            href: "/reports/expansion-mrr"
          },
          {
            title: "Contraction MRR",
            href: "/reports/contraction-mrr"
          },
          {
            title: "Churned MRR",
            href: "/reports/churned-mrr"
          },
          {
            title: "Reactivation MRR",
            href: "/reports/reactivation-mrr"
          },
          {
            title: "Net New MRR",
            href: "/reports/net-new-mrr"
          },
        ],
      },
      {
        label: "Churn & Retention",
        items: [
          { title: "Customer Churn Rate", href: "/reports/customer-churn-rate" },
          { title: "MRR Churn Rate", href: "/reports/mrr-churn-rate" },
          { title: "ARPU", href: "/reports/arpu" },
          { title: "LTV", href: "/reports/ltv" }
        ],
      },
      {
        label: "Leads & Conversions",
        items: [
          { title: "Leads", href: "/reports/leads" },
          { title: "Free Trials", href: "/reports/free-trials" },
          { title: "Trial → Paid Conversions", href: "/reports/trial-to-paid-conversions" },
        ],
      },
    ],
  },
  customers: {
    title: "Customers List",
    groups: [
      {
        label: "Leads lists",
        items: [
          {
            title: "All new leads",
            icon: <MdFiberNew className="w-4 h-4 text-blue-400" />,
            href: "/customers/all-new-leads"
          },
          {
            title: "My working leads",
            icon: <FaRoadBarrier className="w-4 h-4 text-yellow-400" />,
            href: "/customers/my-working-leads"
          },
          {
            title: "My new leads",
            icon: <MdFiberNew className="w-4 h-4 text-blue-400" />,
            href: "/customers/my-new-leads"
          },
        ],
      },
      {
        label: "Needs attention",
        items: [
          {
            title: "Past due customers",
            icon: <RiAlarmWarningFill className="w-4 h-4 text-red-600" />,
            href: "/customers/past-due-customers"
          },
          {
            title: "Renewing in < 7days",
            icon: <MdOutlineAutorenew className="w-4 h-4 bg-blue-400 text-white rounded" />,
            href: "/customers/renewing"
          },
        ],
      },
      {
        items: [
          {
            title: "Leads to revisit",
            icon: <MdOutlineAutorenew className="w-4 h-3 bg-blue-400 text-white rounded" />,
            href: "/customers/leads-to-revisit"
          },
          {
            title: "High-value accounts",
            icon: <RiVipDiamondFill className='text-blue-400 w-4 h-4' />,
            href: "/customers/high-value-accounts"
          },
          {
            title: "Top wins from this week",
            icon: <GiTrophyCup className="text-yellow-400 w-4 h-4" />,
            href: "/customers/top-wins-from-this-week"
          },
          {
            title: "Customers with > 1 subscription",
            icon: <HiUsers className="text-purple-600 w-4 h-4" />,
            href: "/customers/customers-with-more-than-one-subscription"
          },
          {
            title: "Discounted customers",
            icon: <GiMoneyStack className="text-green-400 w-4 h-4" />,
            href: "/customers/discounted-customers"
          },
        ],
      },
    ],
  },
};

export default function SubSidebar({ active, companyId }: any) {
  const section = sections[active as keyof typeof sections];
  const collapsed = useSidebarStore((state) => state.collapsed);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  useEffect(() => {
    if (section) {
      setCollapsed(false);
    } else if (!section) {
      setCollapsed(true);
    }
  }, [section])

  if (!section || collapsed) return null;

  return (
    <aside className="fixed left-16 top-0 h-screen w-64 border-r bg-white shadow-sm overflow-y-auto">
      <div className="p-4 border-b space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
        {section.title == "Customers List" && (
          <>
            <Link
              href={`/dashboard/${companyId}/customers`}
              className={clsx(
                "block rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all",
                pathname === `/dashboard/${companyId}/customers` ? "bg-gray-200 text-gray-900" : ""
              )}
            >
              Customers
            </Link>
            <button className="px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
              ADD FOLDER
            </button>
          </>
        )}
      </div>
      <nav className="p-3 space-y-4">
        {section.groups.map((group, i) => (
          <div key={i}>
            {group.label && (
              <p className="flex gap-2 items-center text-xs uppercase font-semibold text-gray-800 mb-2">
                <IoFolder className="w-5 h-5" />
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items?.map((item, j) => (
                <li key={j} className="items-center">
                  <Link
                    href={`/dashboard/${companyId}/${item.href}`}
                    className={clsx(
                      "flex rounded-md py-1.5 items-center hover:bg-gray-100 hover:text-gray-900 transition-all",
                      group.label ? "px-6 text-sm text-gray-700" : "text-gray-800 uppercase text-[11px] font-medium",
                      isActive(item.href) == true ? "bg-gray-200 text-gray-900" : ""
                    )}
                  >
                    {typeof item === "object" && item !== null ? (
                      <>
                        {(item as any).icon ? (
                          <span className="mr-2">
                            {(item as any).icon}
                          </span>
                        ) : null}
                        {(item as any).title}
                      </>
                    ) : (
                      item
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
