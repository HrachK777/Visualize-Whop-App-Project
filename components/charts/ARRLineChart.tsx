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
import { ticksNumber, formatCurrency1 } from '@/lib/utils'

const COLORS = {
    line: '#0f2940', // Tailwind gray-800
    grid: '#c8cfdcff', // Tailwind gray-200
    axis: '#6b7280', // Tailwind gray-500
    fillColor: '#1677ff', // Tailwind gray-800
};




export default function ARRLineChart({ ARRData, growth }: { ARRData: any[], growth: number }) {
    
    const CustomizedLabel = ({ x, y, value, index }: any) => {
        if (index % 3 === 0 || index == ARRData.length - 1) {
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

    return (
        <div className="bg-white rounded-lg shadow-sm p-5 h-[300px] flex flex-col">
            <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-800">Annual Run Rate</h2>
                <div className="flex gap-20 text-right">
                    <p className="text-2xl font-semibold text-gray-800">
                        {formatCurrency1(ARRData[ARRData.length - 1].arr)}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">{growth}%<br />
                        <span className="text-gray-400">Last 30 days:</span> </p>
                </div>
            </div>
            <div className="flex-1 flex">
                <ResponsiveContainer width="100%">
                    <AreaChart data={ARRData} margin={{ top: 20, right: 40, left: 10, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.fillColor} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={COLORS.fillColor} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                        <XAxis dataKey="arr" stroke={COLORS.axis} tick={{ fill: COLORS.axis, fontSize: 12 }}
                            interval="preserveStartEnd" ticks={ticksNumber(ARRData, 'date')}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px' }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        {/* Blue filled area under the line */}
                        <Area
                            type="linear"
                            dataKey="arr"
                            stroke="none"
                            fill="url(#colorARR)"
                        />
                        <Line
                            type="linear"
                            dataKey="arr"
                            stroke={COLORS.line}
                            strokeWidth={3}
                            dot={{ fill: '#0f2940', r: 4 }}
                            activeDot={{ r: 6 }}
                            // fillOpacity={1}
                            fill="url(#colorARR)"
                            name="arr"
                            label={CustomizedLabel}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
