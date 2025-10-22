'use client';

import { useState } from 'react';
import CustomerTitle from '@/components/ui/CustomerTitle';
import CustomFilterBar from '@/components/ui/CustomFilterBar';
import { MdFiberNew } from "react-icons/md";
import SearchBar from '@/components/ui/SearchBar';

const leads = [
    { id: 1, customer: 'ultdrop@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 2, customer: 'danieljacobdorsey@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 3, customer: 'toxicmula420@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 4, customer: 'directterms@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 5, customer: 'flipacademy@yahoo.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 6, customer: 'newdismain@ixempires.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 7, customer: 'ebaycashcamel@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 8, customer: 'danieljacobdorsey@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 9, customer: 'chernichaw1@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 10, customer: 'monkman9696@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 11, customer: 'rothstleo82@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead', note: 'Free subscriber' },
    { id: 12, customer: 'maria.kipling@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
];

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState([]) as any[];
    const [filters, setFilters] = useState([
        { id: 1, field: 'Customer status', operator: 'is one of', value: 'New Lead' }
    ]);
    const [showFilterBar, setShowFilterBar] = useState(true);

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
    const toggleRowSelection = (id: any) => {
        setSelectedRows((prev: any[]) =>
            prev.includes(id) ? prev.filter((rowId: any) => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedRows((prev: any) =>
            prev.length === leads.length ? [] : leads.map(c => c.id)
        );
    };

    // Filter customers based on search query
    const filteredLeads = leads.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            customer.customer.toLowerCase().includes(query) ||
            customer.leadCreated.toLowerCase().includes(query) ||
            customer.trialStarted.toLowerCase().includes(query) ||
            customer.country.toLowerCase().includes(query) ||
            customer.status.toLowerCase().includes(query)
        );
    });

    return (
        <div className="bg-blue-50 px-10 py-4 space-y-4">
            {/* Header */}
            <CustomerTitle title="All New Leads" icon={<MdFiberNew className='text-blue-400 w-8 h-8' />} />

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
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowFilterBar={setShowFilterBar} />

                {/* Table */}
                <div className="flex-1 bg-gray-50">
                    <table className="w-full bg-white">
                        <thead className="sticky top-0 bg-gray-50 border-b">
                            <tr>
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === leads.length}
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
                                                checked={selectedRows.includes(lead.id)}
                                                onChange={() => toggleRowSelection(lead.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{lead.customer}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.leadCreated}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.trialStarted}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.country}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{lead.owner}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-blue-600">{lead.status}</span>
                                                {lead.note && (
                                                    <span className="text-xs text-gray-400">{lead.note}</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan={10} className="px-4 py-3 text-sm text-gray-400 text-center">
                                        No leads found matching "{searchQuery}"
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