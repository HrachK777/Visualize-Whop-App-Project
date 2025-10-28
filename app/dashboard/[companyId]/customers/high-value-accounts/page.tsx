'use client';

import { useState, useEffect } from 'react';
import CustomerTitle from '@/components/ui/CustomerTitle';
import CustomFilterBar from '@/components/ui/CustomFilterBar';
import { RiVipDiamondFill } from "react-icons/ri";
import SearchBar from '@/components/ui/SearchBar';
import { useMemberships } from '@/lib/contexts/MembershipsContext'
import { useAnalytics } from '@/lib/contexts/AnalyticsContext';
import { formatCurrency1, ymd } from '@/lib/utils';
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
                const statusFiltered = data.memberships.filter(m => m.status == 'active');
                let count = 0;

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
            prev.length === customers.length ? [] : customers.map(c => c.id)
        );
    };

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

    return (
        <div className="bg-blue-50 px-10 py-4 space-y-4">
            {/* Header */}
            <CustomerTitle title="High-Value Accounts" icon={<RiVipDiamondFill className='text-blue-400 w-5 h-5' />} />

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
                <div className="border border-gray-300 rounded-md bg-white">

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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">MRR</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ARR</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Plan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Billing Cycle</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Net Payments</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Country</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Subscriber Since</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Customer Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(customer.id)}
                                                onChange={() => toggleRowSelection(customer.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{customer.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency1(customer.mrr)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency1(customer.arr)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.plan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.billing}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency1(customer.payment)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.country}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.since && ymd(customer.since)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-blue-600">{customer.status}</span>
                                                {/* {customer.note && (
                                                    <span className="text-xs text-gray-500">{customer.note}</span>
                                                )} */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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
        </div>
    );
}