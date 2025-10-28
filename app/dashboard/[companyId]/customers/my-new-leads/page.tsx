'use client';

import { useState, useEffect } from 'react';
import CustomerTitle from '@/components/ui/CustomerTitle';
import CustomFilterBar from '@/components/ui/CustomFilterBar';
import { MdFiberNew } from "react-icons/md";
import SearchBar from '@/components/ui/SearchBar';
import { useMemberships } from '@/lib/contexts/MembershipsContext';
import { useAnalytics } from '@/lib/contexts/AnalyticsContext';
import { ymd } from '@/lib/utils';
import { CustomerType } from '@/lib/types/analytics';


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
            const statusFiltered = data.memberships.filter(m => m.status == 'trialing');
            let count = 0;
            const filtered: any[] = statusFiltered.map(m => ({
                id: count++,
                name: m.member?.name ? m.member?.name : '—',
                owner: "—",
                country: 'United States',
                since: m.createdAt,
                trialStartedAt: m.createdAt,
                status: 'New Lead'
            })).flat()
            setCustomers(filtered)
        }; // Use flat() to flatten the array of arrays
    }, [data]);

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
    const filteredLeads = customers.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            (customer.name.toLowerCase().includes(query) ||
                customer.owner.toString().includes(query) ||
                // customer..toLowerCase().includes(query) ||
                customer.status.toLowerCase().includes(query))
        );
    });

    return (
        <div className="bg-blue-50 px-10 py-4 space-y-4">
            {/* Header */}
            <CustomerTitle title="My New Leads" icon={<MdFiberNew className="w-6 h-6 text-blue-400" />} />

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
                                        checked={customers.length > 0 && selectedRows.length === customers.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Lead Created At</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Free Trial Started At</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Country</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Owner</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Customer Status</th>
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
                                        <td className="px-4 py-3 text-sm text-gray-400">
                                            {ymd(lead.since)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{ymd(lead.trialStartedAt)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.country}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.owner}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-800">{lead.status}</span>
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
            </div>
        </div>
    );
}