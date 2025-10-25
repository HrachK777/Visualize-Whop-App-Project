import {
    Search, X, Plus, Download, Upload,
    Grid3x3, Sliders,
} from 'lucide-react';

export default function SearchBar({ total, actives, searchQuery, setSearchQuery, setShowFilterBar }: { total?: number, actives?: number, searchQuery: string; setSearchQuery: (query: string) => void; setShowFilterBar: (show: boolean) => void; }) {
    return (
        <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                        placeholder="Search customers by name, email or external id"
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
                    {total} customers ({actives} active subscribers)
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
    )
}