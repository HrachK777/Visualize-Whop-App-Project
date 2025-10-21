// components/ARRLineChart.jsx
import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    AreaChart
} from 'recharts';
import { formatCurrency } from '@/lib/utils'

const data = [
    { month: 'Jan', ARR: 72000 },
    { month: 'Feb', ARR: 76000 },
    { month: 'Mar', ARR: 82000 },
    { month: 'Apr', ARR: 87000 },
    { month: 'May', ARR: 94000 },
    { month: 'Jun', ARR: 102000 },
    { month: 'Jul', ARR: 110000 },
    { month: 'Aug', ARR: 118000 },
    { month: 'Sep', ARR: 124000 },
    { month: 'Oct', ARR: 131000 },
    { month: 'Nov', ARR: 139000 },
    { month: 'Dec', ARR: 148000 },
];

const COLORS = {
    line: '#0f2940', // Tailwind gray-800
    grid: '#c8cfdcff', // Tailwind gray-200
    axis: '#6b7280', // Tailwind gray-500
    fillColor: '#1677ff', // Tailwind gray-800
};

// ✅ Format numbers to "$148k" style
function formatCurrency1(value: any) {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
}

const CustomizedLabel = ({ x, y, value, index }: any) => {
    if (index === data.length - 1) {
        return (
            <text
                x={x - 10}
                y={y}
                dy={-10}
                fill={COLORS.line}
                fontSize={13}
                fontWeight="bold"
            >
                {formatCurrency1(value)}
            </text>
        );
    }
    return null;
};

export default function ARRLineChart() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-5 h-[300px] flex flex-col">
            <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-800">Annual Run Rate</h2>
                <div className="flex gap-20 text-right">
                    <p className="text-2xl font-semibold text-gray-800">
                        {formatCurrency(data[data.length - 1].ARR)}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">+23.02%<br />
                        <span className="text-gray-400">Last 30 days:</span> </p>
                </div>
            </div>
            <div className="flex-1 flex">
                <ResponsiveContainer width="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.fillColor} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={COLORS.fillColor} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                        <XAxis dataKey="ARR" stroke={COLORS.axis}  tick={{ fill: COLORS.axis, fontSize: 12 }} />
                        {/* <YAxis
                            stroke={COLORS.axis}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        /> */}
                        {/* <Tooltip content={<CustomTooltip />} /> */}
                        <Tooltip
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px' }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        {/* Blue filled area under the line */}
                        <Area
                            type="linear"
                            dataKey="ARR"
                            stroke="none"
                            fill="url(#colorARR)"
                        />
                        <Line
                            type="linear"
                            dataKey="ARR"
                            stroke={COLORS.line}
                            strokeWidth={3}
                            dot={{ fill: '#0f2940', r: 4 }}
                            activeDot={{ r: 6 }}
                            fillOpacity={1}
                            fill="url(#colorARR)"
                            name="ARR"
                            label={CustomizedLabel}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
