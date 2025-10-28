'use client';

import { useState, useEffect } from 'react';
import CustomerTitle from '@/components/ui/CustomerTitle';
import CustomFilterBar from '@/components/ui/CustomFilterBar';
import { RiAlarmWarningFill } from "react-icons/ri";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        const fetchPayments = async () => {
            const res = await fetch(`/api/transactions?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}`);
            if (!res.ok) return 'Fetching payments failed';
            const payments = await res.json();
            if (data && data.memberships) {
                const statusFiltered = data.memberships.filter(m => m.status == 'past_due');;
                let count = 0;
                if(statusFiltered.length == 0) return;

                const filtered: any[] = statusFiltered.map(m => {
                    const planMatches = data.plans.filter(p => p.id == m?.plan?.id);

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
                        mrr: plan.rawRenewalPrice,
                        arr: plan.rawRenewalPrice * 12,
                        plan: plan.accessPass?.title,
                        billing: plan.billingPeriod == 30 ? 'Monthly' : 'Annual',
                        payment: totalPayment, // Sum of all payments for this plan
                        country: 'United States',
                        since: m.createdAt,
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
            prev.length === customers.length ? [] : customers.map(c => Number(c.id))
        );
    };

    // Filter customers based on search query
    // Filter customers based on search query
    const filteredCustomers = customers.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            customer.name && customer.name.toLowerCase().includes(query) ||
            customer.plan && customer.plan.toLowerCase().includes(query) ||
            customer.country && customer.country.toLowerCase().includes(query) ||
            customer.status.toLowerCase().includes(query)
        );
    });

    // Calculate current items to display
    const currentItems = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-blue-50 px-10 py-4 space-y-4">
            {/* Header */}
            <CustomerTitle title="Past due customers" icon={<RiAlarmWarningFill className='text-red-600 w-6 h-6' />} />

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
                                        checked={filteredCustomers.length > 0 && selectedRows.length === filteredCustomers.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Past Due Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Renewal Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ARR</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Plan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Billing Cycle</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">MRR</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Net Payments</th>
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
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.pastDueAt && ymd(lead.pastDueAt)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.renewalAt && ymd(lead.renewalAt)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{formatCurrency1(lead.arr)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.plan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.billing}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{formatCurrency1(lead.mrr)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{formatCurrency1(lead.payment)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.since && ymd(lead.since)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-orange-600">{lead.status}</span>
                                                {lead.note && (
                                                    <span className="text-xs text-gray-400">{lead.note}</span>
                                                )}
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
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredCustomers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    );
}