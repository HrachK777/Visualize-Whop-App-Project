"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import {
  AmbulanceIcon,
  FactoryIcon,
  FanIcon,
  FolderOpen,
  NewspaperIcon,
  TvIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { IoFolder } from "react-icons/io5";
import { useEffect } from "react";


const sections = {
  reports: {
    title: "Reports",
    groups: [
      {
        label: "Recurring Revenue",
        items: [
          "MRR",
          "ARR",
          "New MRR",
          "Expansion MRR",
          "Contraction MRR",
          "Churned MRR",
          "Reactivation MRR",
          "Net MRR MRR",
        ],
      },
      {
        label: "Churn & Retention",
        items: ["Customer Churn Rate", "MRR Churn Rate", "ARPU", "ARPA", "LTV"],
      },
      {
        label: "Leads & Conversions",
        items: ["Leads", "Free Trials", "Trial → Paid Conversions", "Cohorts"],
      },
    ],
  },
  customers: {
    title: "Customers",
    groups: [
      {
        label: "Leads lists",
        items: [
          {
            title: "All new leads",
            icon: <IoFolder className="w-4 h-4" />,
          },
          {
            title: "My working leads",
            icon: <FactoryIcon className="w-4 h-4" />,
          },
          {
            title: "My new leads",
            icon: <FanIcon className="w-4 h-4" />,
          },
        ],
      },
      {
        label: "Needs attention",
        items: [
          {
            title: "Past due customers",
            icon: <AmbulanceIcon className="w-4 h-4" />,
          },
          {
            title: "Renewing in < 7days",
            icon: <NewspaperIcon className="w-4 h-4" />,
          },
        ],
      },
      {
        items: [
          {
            title: "Leads to revisit",
            icon: <TvIcon className="w-4 h-4" />,
          },
          {
            title: "High-value accounts",
            icon: <TvIcon className="w-4 h-4" />,
          },
          {
            title: "Top wins from this week",
            icon: <TvIcon className="w-4 h-4" />,
          },
          {
            title: "Customers with > 1 subscription",
            icon: <TvIcon className="w-4 h-4" />,
          },
          {
            title: "Discounted customers",
            icon: <TvIcon className="w-4 h-4" />,
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
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    if (section) {
      setCollapsed(false);
    } else if (!section) {
      setCollapsed(true);
    }
  }, [section])

  if(!section) return null;

  return (
    <aside className="fixed left-16 top-0 h-screen w-64 border-r bg-white shadow-sm overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
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
                <li key={j}>
                  <Link
                    href="#"
                    className={clsx(
                      "block rounded-md py-1.5  hover:bg-gray-100 hover:text-gray-900 transition-all",
                      group.label ? "px-6 text-sm text-gray-700" : "text-gray-800 uppercase text-[11px] font-medium"
                    )}
                  >
                    {typeof item === "object" && item !== null ? (
                      <>
                        {(item as any).icon ? (
                          <span className="inline-block mr-2">
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
