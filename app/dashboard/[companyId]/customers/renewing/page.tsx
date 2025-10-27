'use client';

import { useState, useEffect } from 'react';
import CustomerTitle from '@/components/ui/CustomerTitle';
import CustomFilterBar from '@/components/ui/CustomFilterBar';
import { MdOutlineAutorenew } from "react-icons/md";
import * as constants from '@/lib/constants';
import SearchBar from '@/components/ui/SearchBar';
import { useMemberships } from '@/lib/contexts/MembershipsContext';
import { ymd, formatCurrency1 } from '@/lib/utils';
import { useAnalytics } from '@/lib/contexts/AnalyticsContext';
import { CustomerType } from '@/lib/types/analytics';

const datas = constants.customers;

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [filters, setFilters] = useState<{ id: number; field: string; operator: string; value: string }[]>([
        { id: 1, field: 'Customer status', operator: 'is one of', value: 'New Lead' }
    ]);
    const [showFilterBar, setShowFilterBar] = useState(true);
    const { data } = useMemberships();
    const { data: analytics } = useAnalytics();
    const [customers, setCustomers] = useState<CustomerType[]>([]);

    useEffect(() => {
        if (data && data.memberships) {
            const statusFiltered = data.memberships.filter(m => m.status == 'active' || m.status == 'trialing');
            let count = 0;
            const filtered: any[] = statusFiltered.map(m => {
                const planMatches = data.plans.filter(p => p.id == m?.plan?.id);
                return planMatches.map(p => ({
                    id: count++,
                    name: m.member?.name ? m.member?.name : '—',
                    mrr: p.rawRenewalPrice,
                    arr: p.rawRenewalPrice * 12,
                    plan: p.accessPass?.title, // You might want to set this to p.name or something meaningful
                    billing: p.billingPeriod == 30 ? 'Monthly' : 'Annual',
                    payment: "—",
                    country: 'United States',
                    since: m.createdAt,
                    status: m.status == 'active' ? 'Active' : 'New Lead',
                    pastDueAt: m.createdAt,
                    renewalAt: m.expiresAt,
                }));
            }).flat(); // Use flat() to flatten the array of arrays
            console.log('for debug filtered = ', filtered);
            setCustomers(filtered)
        }
    }, [data])

    const addFilter = () => {
        setFilters([...filters, {
            id: Date.now(),
            field: 'Customer status',
            operator: 'is one of',
            value: 'New Lead'
        }]);
    };

    const removeFilter = (id: number) => {
        setFilters(filters.filter(f => f.id !== id));
    };

    const updateFilter = (id: number, key: string, value: string) => {
        setFilters(filters.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const clearAllFilters = () => {
        setFilters([]);
        setShowFilterBar(false);
    };
    const toggleRowSelection = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedRows((prev) =>
            prev.length === customers.length ? [] : customers.map(c => c.id)
        );
    };

    // Filter customers based on search query
    const filteredLeads = customers.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            customer.arr.toLowerCase().includes(query) ||
            customer.mrr.toLowerCase().includes(query) ||
            customer.country.toLowerCase().includes(query) ||
            customer.status.toLowerCase().includes(query)
        );
    });

    return (
        <div className="bg-blue-50 px-10 py-4 space-y-4">
            {/* Header */}
            <CustomerTitle title="Renewing in <7 days" icon={<MdOutlineAutorenew className="w-6 h-6 bg-blue-400 text-white rounded" />} />

            {/* Filter Bar */}
            {showFilterBar && (
                <CustomFilterBar
                    filters={filters}
                    updateFilter={updateFilter}
                    removeFilter={removeFilter}
                    addFilter={addFilter}
                    clearAllFilters={clearAllFilters}
                />)}

            {/* Main Content */}
            <div className="border border-gray-300 rounded-md bg-white">
                {/* Search and Actions */}
                <SearchBar total={data.memberships.length} actives={customers.length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowFilterBar={setShowFilterBar} />

                {/* Table */}
                <div className="flex-1 bg-gray-50">
                    <table className="w-full bg-white">
                        <thead className="sticky top-0 bg-gray-50 border-b">
                            <tr>
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={filteredLeads.length > 0 && selectedRows.length === filteredLeads.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Past Due Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ARR</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Plan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Billing Cycle</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">MRR</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Net Payments</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Subscriber Since</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Customer Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Renewal Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredLeads.length > 0 ? (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(Number(lead.id))}
                                                onChange={() => toggleRowSelection(Number(lead.id))}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{lead.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.pastDueAt && ymd(lead.pastDueAt)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{formatCurrency1(lead.arr)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.plan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.billing}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{formatCurrency1(lead.mrr)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{formatCurrency1(lead.payment)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.since && ymd(lead.since)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-blue-600">{lead.status}</span>
                                                {lead.note && (
                                                    <span className="text-xs text-gray-400">{lead.note}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.renewalAt && ymd(lead.renewalAt)}</td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan={10} className="px-4 py-3 text-sm text-gray-400 text-center">
                                        No data found matching {searchQuery}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}