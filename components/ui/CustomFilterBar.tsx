import { X, Plus } from 'lucide-react';
import { BiSolidSave } from "react-icons/bi";
import { LuCopy } from "react-icons/lu";

export default function CustomFilterBar({ filters, updateFilter, removeFilter, addFilter, clearAllFilters }: { filters: any[], updateFilter: any, removeFilter: any, addFilter: any, clearAllFilters: any }) {
    return (
        <div className="bg-white px-6 py-3 border border-gray-300 rounded-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    {filters.map((filter, index) => (
                        <div key={filter.id} className="flex items-center gap-2">
                            {index > 0 && <span className="text-sm text-gray-500">AND</span>}
                            <div className="flex items-center gap-2 bg-gray-200 rounded px-2 py-1">
                                <select
                                    value={filter.field}
                                    onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                                    className="text-sm bg-transparent border-none focus:outline-none text-gray-700"
                                >
                                    <option>Customer status</option>
                                    <option>Country</option>
                                    <option>Owner</option>
                                </select>
                                <span className="text-sm text-gray-500">•</span>
                                <select
                                    value={filter.operator}
                                    onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                                    className="text-sm bg-transparent border-none focus:outline-none text-gray-700"
                                >
                                    <option>is one of</option>
                                    <option>is not one of</option>
                                    <option>is empty</option>
                                    <option>is not empty</option>
                                </select>
                                <span className="text-sm text-gray-500">•</span>
                                <input
                                    type="text"
                                    value={filter.value}
                                    onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                                    className="text-sm bg-transparent border-none focus:outline-none text-gray-700 w-24"
                                />
                                <button
                                    onClick={() => removeFilter(filter.id)}
                                    className="p-0.5 hover:bg-gray-200 rounded"
                                >
                                    <X className="w-3 h-3 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addFilter}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="Save filter">
                        <BiSolidSave className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="Copy filter">
                        <LuCopy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={clearAllFilters}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Clear all filters"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    )
}