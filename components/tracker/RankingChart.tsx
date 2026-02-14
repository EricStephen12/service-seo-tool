"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RankingChart({ data }: { data: any[] }) {
    // Process history into Recharts format
    const chartData = data.reduce((acc: any[], entry) => {
        const date = new Date(entry.date).toLocaleDateString();
        const existing = acc.find(d => d.date === date);
        if (existing) {
            existing[entry.keyword] = entry.position;
        } else {
            acc.push({ date, [entry.keyword]: entry.position });
        }
        return acc;
    }, []).reverse();

    const keywords = Array.from(new Set(data.map(d => d.keyword)));

    return (
        <div className="glass p-8 rounded-2xl h-[400px] mt-12">
            <h3 className="text-xl mb-6">Ranking Performance</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis reversed domain={[1, 100]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                    />
                    {keywords.map((kw, i) => (
                        <Line
                            key={kw}
                            type="monotone"
                            dataKey={kw}
                            stroke={i === 0 ? '#6366f1' : '#14b8a6'}
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#6366f1' }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
