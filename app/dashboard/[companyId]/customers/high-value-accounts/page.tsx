'use client';

import { use, useState } from 'react';
import {
    Search, X, Plus, Download, Upload,
    Grid3x3, Sliders,
} from 'lucide-react';
import CustomerTitle from '@/components/ui/CustomerTitle';
import CustomFilterBar from '@/components/ui/CustomFilterBar';
import { MdFiberNew } from "react-icons/md";
import { BiSolidSave } from "react-icons/bi";
import { LuCopy } from "react-icons/lu";
import { RiVipDiamondFill } from "react-icons/ri";


const datas = [
    { id: 1, name: 'Ethan C Welsh', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$120', country: 'United States', since: 'Oct 14, 2025', status: 'Active' },
    { id: 2, name: 'MD SHAHID B EMDAD', mrr: '$24', arr: '$288', plan: 'Elite', billing: 'Monthly', payment: '$24', country: 'United States', since: 'Oct 13, 2025', status: 'Active' },
    { id: 3, name: 'Evan Nebab', mrr: '$0.60', arr: '$7.20', plan: 'Advanced', billing: 'Monthly', payment: '$0.60', country: 'United States', since: 'Sep 30, 2025', status: 'Active' },
    { id: 4, name: 'Luis Delpino', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 21, 2025', status: 'Active', note: 'Cancelling in 5 days' },
    { id: 5, name: 'Thien Nguyen', mrr: '$0.60', arr: '$7.20', plan: 'Advanced', billing: 'Monthly', payment: '$0.60', country: 'United States', since: 'Sep 17, 2025', status: 'Active' },
    { id: 6, name: 'Vincent Nicchia', mrr: '$6', arr: '$72', plan: 'Advanced', billing: 'Monthly', payment: '$6', country: 'United States', since: 'Sep 17, 2025', status: 'Active' },
    { id: 7, name: 'Brock Stewart', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 16, 2025', status: 'Active' },
    { id: 8, name: 'Jacob malamud', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 16, 2025', status: 'Active' },
    { id: 9, name: 'Jacob Malamud', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 16, 2025', status: 'Active' },
    { id: 10, name: 'Advaith Malka', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$132', country: 'United States', since: 'Sep 12, 2025', status: 'Active' },
    { id: 11, name: 'rishi.singh0619@gmail.com', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$132', country: 'United States', since: 'Sep 11, 2025', status: 'Active' },
    { id: 12, name: 'Patrick Merriman', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$132', country: 'United States', since: 'Sep 5, 2025', status: 'Active' },
    { id: 13, name: "Trenton O'Neill", mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$240', country: 'United States', since: 'Sep 4, 2025', status: 'Active' },
    { id: 14, name: 'Eva Shindin', mrr: '$60', arr: '$720', plan: 'Advanced', billing: 'Monthly', payment: '$120', country: 'United States', since: 'Sep 3, 2025', status: 'Active' },
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
            prev.length === datas.length ? [] : datas.map(c => c.id)
        );
    };

    // Filter customers based on search query
    const filteredCustomers = datas.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            customer.plan.toLowerCase().includes(query) ||
            customer.country.toLowerCase().includes(query) ||
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
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                placeholder="Search customers..."
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                        <span className="text-sm text-gray-600">
                            136 customers (67 active subscribers)
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50" onClick={() => setShowFilterBar(true)}>
                            <Plus className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                            <Grid3x3 className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                            <Download className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                            <Upload className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

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
                                            checked={selectedRows.length === datas.length}
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
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.mrr}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.arr}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.plan}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.billing}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.payment}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.country}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{customer.since}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-blue-600">{customer.status}</span>
                                                {customer.note && (
                                                    <span className="text-xs text-gray-500">{customer.note}</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}