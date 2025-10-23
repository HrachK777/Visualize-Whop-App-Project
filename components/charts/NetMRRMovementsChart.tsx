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

export default function NetMRRMovementsChart({ NetMRRData }: { NetMRRData: any[] }) {
    console.log('for debug NetMRRData = ', NetMRRData);
    // const NetMRRData = [
    //     {
    //         month: 'Jan',
    //         newMRR: 4000,
    //         expansionMRR: 2000,
    //         contractionMRR: 1000,
    //         churnMRR: 500,
    //         netMRR: 5500,
    //     },
    //     {
    //         month: 'Feb',
    //         newMRR: 3000,
    //         expansionMRR: 2500,
    //         contractionMRR: 1500,
    //         churnMRR: 700,
    //         netMRR: 5300,
    //     },
    //     {
    //         month: 'Mar',
    //         newMRR: 5000,
    //         expansionMRR: 3000,
    //         contractionMRR: 1200,
    //         churnMRR: 800,
    //         netMRR: 6000,
    //     },
    //     {
    //         month: 'Apr',
    //         newMRR: 3500,
    //         expansionMRR: 2200,
    //         contractionMRR: 1100,
    //         churnMRR: 600,
    //         netMRR: 5000,
    //     },
    // ];

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
            <div className='h-[200px]'>
                <ResponsiveContainer width="100%">
                    <BarChart data={NetMRRData}>
                        <CartesianGrid stroke="#f0f2f5" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        {/* <YAxis tickLine={false} axisLine={false} /> */}
                        <Tooltip />
                        <Bar dataKey="net" fill={COLORS.netMRR}  barSize={25} />
                        <Bar dataKey="contraction" fill="url(#patternRed)" barSize={25} />
                        <defs>
                            <pattern
                                id="patternRed"
                                patternUnits="userSpaceOnUse"
                                width="6"
                                height="6"
                            >
                                <rect width="6" height="6" fill="#75acd3ff" opacity="0.8" />
                                <path d="M0 0L6 6ZM-1 5L5 -1ZM5 7L7 5Z" stroke="#76a5f0ff" strokeWidth={2} />
                            </pattern>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}