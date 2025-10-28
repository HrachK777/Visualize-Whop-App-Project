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
import Pagination from '@/components/charts/pagination';

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
    const [activeCustomers, setActiveCustomers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        const fetchPayments = async () => {
            const res = await fetch(`/api/transactions?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}`);
            if (!res.ok) return 'Fetching payments failed';
            const payments = await res.json();
            if (data && data.memberships) {
                const statusFiltered = data.memberships.filter(m => m.status == 'active');

                let count = 0;
                if (statusFiltered.length == 0) return;

                const filtered: any[] = statusFiltered.map(m => {
                    const planMatches = data.plans.filter(p => p.id == m?.plan?.id);
                    const highestMRR: any = planMatches.reduce((max, current) =>
                        current.rawRenewalPrice > max.rawRenewalPrice ? current : max, planMatches[0]
                    );

                    // Take only the first matching plan (or handle as needed)
                    const plan = planMatches[0];
                    if (!plan) return null;

                    // Find the most recent payment or sum payments as needed
                    const paymentMatches = payments.data.filter((pay: { plan: { id: string; } }) =>
                        pay.plan.id == plan.id
                    );

                    // Calculate total payments for this plan or take the latest
                    const totalPayment = paymentMatches.reduce((sum: number, t: { total: number }) =>
                        sum + t.total, 0
                    );

                    // Or take the latest payment only:
                    // const latestPayment = paymentMatches[paymentMatches.length - 1]?.total || 0;

                    return {
                        id: count++,
                        name: m.member?.name ? m.member?.name : '—',
                        payment: totalPayment,
                        country: 'United States',
                        since: m.canceledAt,
                        status: m.status
                    };
                }).filter(Boolean); // Remove null entries

                setCustomers(filtered);
            }
        }
        fetchPayments();
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
            prev.length === data.memberships.length ? [] : data.memberships.map(c => Number(c.id))
        );
    };

    // Filter customers based on search query
    const filteredLeads = customers.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            customer.name && customer.name.toLowerCase().includes(query) ||
            customer.plan && customer.plan.toLowerCase().includes(query) ||
            customer.country && customer.country.toLowerCase().includes(query) ||
            customer.status.toLowerCase().includes(query)
        );
    });

    const currentItems = filteredLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-blue-50 px-10 py-4 space-y-4">
            {/* Header */}
            <CustomerTitle title="Leads to Revisit" icon={<MdOutlineAutorenew className="w-8 h-8 bg-blue-400 text-white rounded" />} />

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
                <SearchBar total={data.memberships.length} actives={activeCustomers.length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowFilterBar={setShowFilterBar} />

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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Net Payments</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Country</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Subscriber Since</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Customer Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((lead) => (
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
                                        <td className="px-4 py-3 text-sm text-gray-700">{lead.payment !== '—' ? formatCurrency1(lead.payment) : lead.payment}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{lead.country}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{lead.since && ymd(lead.since)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-red-500">{lead.status}</span>
                                            </div>
                                        </td>
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
                {currentItems && <Pagination
                    currentPage={currentPage}
                    totalItems={filteredLeads.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />}
            </div>
        </div>
    );
}