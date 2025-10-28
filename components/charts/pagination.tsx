// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5; // Number of page buttons to show
        
        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);
        
        // Adjust if we're at the end
        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            {/* Results count */}
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
            </div>

            {/* Page navigation */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-gray-600 px-3 py-1 text-sm border border-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-100 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                    {getPageNumbers().map((page, index, array) => {
                        const showStartEllipsis = page === array[0] && page > 1;
                        const showEndEllipsis = page === array[array.length - 1] && page < totalPages;
                        
                        return (
                            <div key={page} className="flex items-center">
                                {showStartEllipsis && index === 0 && (
                                    <>
                                        <button
                                            onClick={() => onPageChange(1)}
                                            className="text-gray-600 px-3 py-1 text-sm border border-gray-500 rounded-md hover:bg-gray-50"
                                        >
                                            1
                                        </button>
                                        <span className="px-1 text-gray-500">...</span>
                                    </>
                                )}
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1 text-sm rounded-md ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-600 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                                {showEndEllipsis && index === array.length - 1 && (
                                    <>
                                        <span className="px-1 text-gray-500">...</span>
                                        <button
                                            onClick={() => onPageChange(totalPages)}
                                            className="text-gray-600 px-3 py-1 text-sm border border-gray-500 rounded-md hover:bg-gray-50"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-gray-600 px-3 py-1 text-sm border border-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            {/* Items per page selector */}
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        onItemsPerPageChange(Number(e.target.value));
                        onPageChange(1); // Reset to first page
                    }}
                    className="text-gray-600 border border-gray-600 rounded-md px-2 py-1 text-sm"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </div>
    );
};

export default Pagination;