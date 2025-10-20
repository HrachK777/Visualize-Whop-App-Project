'use client';
import { useState } from 'react';
import { Calendar, BarChart2, LineChart } from 'lucide-react';

type Props = {
    onRangeChange: (range: { start: string; end: string }) => void;
    currentRange: { start: string; end: string };
};

export default function DateRangeToolbar({
    onRangeChange,
    currentRange,
}: Props) {
    const [range, setRange] = useState(currentRange);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'start' | 'end') => {
        const newRange = { ...range, [key]: e.target.value };
        setRange(newRange);
        onRangeChange(newRange);
    };

    return (
        // /{/ * Right side — date range */
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-800" />
            <input
                type="date"
                value={range.start}
                onChange={(e) => handleDateChange(e, 'start')}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-900"
            />
            <span className="text-gray-500">→</span>
            <input
                type="date"
                value={range.end}
                onChange={(e) => handleDateChange(e, 'end')}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-900"
            />
        </div>
    );
}
