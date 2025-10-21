'use client';
import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangePicker({
  range,
  onChange,
}: {
  range: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleSelect = (ranges: RangeKeyDict) => {
    const sel = ranges.selection;
    onChange({ start: sel.startDate!, end: sel.endDate! });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-800 bg-white hover:bg-gray-100 flex items-center gap-2"
      >
        {/* <Calendar className="h-4 w-4" /> */}
        {range.start.toLocaleDateString()} to {range.end.toLocaleDateString()}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
          <DateRange
            ranges={[
              {
                startDate: range.start,
                endDate: range.end,
                key: 'selection',
              },
            ]}
            onChange={handleSelect}
            rangeColors={['#1677ff']}
          />
        </div>
      )}
    </div>
  );
}
