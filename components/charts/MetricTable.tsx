// 'use client';
// import { useState } from 'react';
// import { Download, ChevronDown } from 'lucide-react';

// type MetricPivotData = {
//   category: string;
//   values: Record<string, number>; // { 'Jan 2025': 6500, 'Feb 2025': 7200, ... }
// };

// export default function MetricPivotTable({
//   title = 'Chart Data',
//   columns,
//   data,
//   onFilterChange,
// }: {
//   title?: string;
//   columns: string[];
//   data: MetricPivotData[];
//   onFilterChange?: (filter: string) => void;
// }) {
//   const [filter, setFilter] = useState('All MRR Movements');

//   const exportToCSV = () => {
//     const header = ['Category', ...columns];
//     const rows = data.map((row) => [
//       row.category,
//       ...columns.map((col) => row.values[col] ?? 0),
//     ]);
//     const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.csv`;
//     link.click();
//   };

//   const handleFilterClick = () => {
//     const newFilter =
//       filter === 'All MRR Movements' ? 'New Business MRR' : 'All MRR Movements';
//     setFilter(newFilter);
//     onFilterChange?.(newFilter);
//   };

//   return (
//     <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-md font-semibold text-gray-800">{title}</h3>

//         <div className="flex items-center gap-2">
//           {/* Filter Dropdown */}
//           <button
//             onClick={handleFilterClick}
//             className="flex items-center gap-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-100"
//           >
//             {filter}
//             <ChevronDown className="h-4 w-4" />
//           </button>

//           {/* Export Button */}
//           <button
//             onClick={exportToCSV}
//             className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
//           >
//             <Download className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* Pivot Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm text-left border-t border-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="py-2 px-3 font-medium text-gray-600 border-b border-gray-200">
//                 Category
//               </th>
//               {columns.map((col) => (
//                 <th
//                   key={col}
//                   className="py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-right"
//                 >
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row) => (
//               <tr
//                 key={row.category}
//                 className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//               >
//                 <td className="py-2 px-3 text-gray-800 font-medium whitespace-nowrap">
//                   {row.category}
//                 </td>
//                 {columns.map((col) => (
//                   <td
//                     key={col}
//                     className="py-2 px-3 text-right text-gray-700 tabular-nums"
//                   >
//                     {row.values[col]
//                       ? `$${row.values[col].toLocaleString()}`
//                       : '—'}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

export interface MetricPivotData {
  category: string;
  values: Record<string, string | number>;
}

interface Props {
  title?: string;
  columns: string[];
  data: MetricPivotData[];
  filterOptions?: string[]; // new prop
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function MetricPivotTable({
  title = 'Chart Data',
  columns,
  data,
  filterOptions = ['All MRR Movements'],
  selectedFilter = 'All MRR Movements',
  onFilterChange,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const exportToCSV = () => {
    const header = ['Category', ...columns];
    const rows = data.map((row) => [
      row.category,
      ...columns.map((col) => row.values[col] ?? 0),
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.csv`;
    link.click();
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 relative">
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-100"
            >
              {selectedFilter}
              <ChevronDown className="h-4 w-4" />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onFilterChange?.(option);
                      setOpenDropdown(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm ${
                      selectedFilter === option
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-t border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-3 font-medium text-gray-600 border-b border-gray-200">
                Category
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-right"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.category}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-3 text-gray-800 font-medium whitespace-nowrap">
                  {row.category}
                </td>
                {columns.map((col) => (
                  <td
                    key={col}
                    className="py-2 px-3 text-right text-gray-700 tabular-nums"
                  >
                    {row.values[col]
                      ? `$${row.values[col].toLocaleString()}`
                      : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
