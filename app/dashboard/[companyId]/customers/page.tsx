'use client';

import { useState } from 'react';
import {
    Search, X, Plus, Download, Upload,
    Grid3x3,
} from 'lucide-react';
import CustomerTitle from '@/components/ui/CustomerTitle';
import * as constants from '@/lib/constants';
const datas = constants.customers;


export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const toggleRowSelection = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedRows((prev) =>
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
        <div className="bg-blue-50 px-10 py-4">
            {/* Header */}
            <CustomerTitle title="Customers" />

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
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Paid Subscriber Since</th>
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
    );
}