import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    CartesianGrid,
} from 'recharts';

export default function NetMRRMovementsChart() {
    const NetMRRData = [
        {
            month: 'Jan',
            newMRR: 4000,
            expansionMRR: 2000,
            contractionMRR: 1000,
            churnMRR: 500,
            netMRR: 5500,
        },
        {
            month: 'Feb',
            newMRR: 3000,
            expansionMRR: 2500,
            contractionMRR: 1500,
            churnMRR: 700,
            netMRR: 5300,
        },
        {
            month: 'Mar',
            newMRR: 5000,
            expansionMRR: 3000,
            contractionMRR: 1200,
            churnMRR: 800,
            netMRR: 6000,
        },
        {
            month: 'Apr',
            newMRR: 3500,
            expansionMRR: 2200,
            contractionMRR: 1100,
            churnMRR: 600,
            netMRR: 5000,
        },
    ];

    const COLORS = {
        newMRR: '#22c55e', // Tailwind green-500
        expansionMRR: '#a7f3d0', // Tailwind green-200
        contractionMRR: '#f97316', // Tailwind orange-500
        churnMRR: '#ef4444', // Tailwind red-500
        netMRR: '#5998fdff', // Tailwind blue-500
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Net MRR Movements</h2>
            <ResponsiveContainer width="100%">
                <BarChart data={NetMRRData} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    {/* <YAxis stroke="#6b7280" /> */}
                    {/* <Tooltip content={<CustomTooltip />} /> */}
                    <Legend
                        wrapperStyle={{ paddingTop: 10 }}
                        formatter={(value) => (
                            <span className="capitalize text-gray-700 font-medium">{value}</span>
                        )}
                    />
                    {/* <Bar
                            dataKey="newMRR"
                            stackId="a"
                            fill={COLORS.newMRR}
                            radius={[4, 4, 0, 0]}
                            name="New MRR"
                          />
                          <Bar
                            dataKey="expansionMRR"
                            stackId="a"
                            fill={COLORS.expansionMRR}
                            name="Expansion MRR"
                          />
                          <Bar
                            dataKey="contractionMRR"
                            stackId="a"
                            fill={COLORS.contractionMRR}
                            name="Contraction MRR"
                          />
                          <Bar
                            dataKey="churnMRR"
                            stackId="a"
                            fill={COLORS.churnMRR}
                            name="Churn MRR"
                          /> */}
                    <Bar
                        dataKey="netMRR"
                        stackId="a"
                        fill={COLORS.netMRR}
                        name="Net MRR"
                    />
                    <Line
                        type="monotone"
                        dataKey="netMRR"
                        stroke={COLORS.netMRR}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Net MRR"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}