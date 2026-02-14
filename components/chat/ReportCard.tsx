import { AlertTriangle } from 'lucide-react';

interface DossierData {
    id: string;
    health: number;
    authority: string | number;
    rankings: any[];
    problems: any[];
    [key: string]: any;
}

// Visual Component: The Honest Briefing Card
export default function ReportCard({ data }: { data: DossierData }) {
    return (
        <div className="bg-white border border-black/10 rounded-xl overflow-hidden mt-4 mb-2 shadow-sm font-sans">
            {/* Header */}
            <div className="bg-black text-white px-6 py-4">
                <span className="text-[10px] uppercase tracking-widest font-bold">Site Audit Summary</span>
            </div>

            {/* Top 3 Critical Issues */}
            <div className="p-6 bg-fashion-light">
                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Top 3 Critical Issues</p>
                <div className="space-y-3">
                    {data.problems.slice(0, 3).map((prob, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white border border-black/5 rounded-lg">
                            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-fashion-black leading-tight mb-1">{prob.category} Error</p>
                                <p className="text-[10px] text-fashion-gray">{prob.issue}</p>
                            </div>
                        </div>
                    ))}
                    {data.problems.length === 0 && (
                        <div className="text-center py-4 opacity-40 text-xs">No critical issues detected.</div>
                    )}
                </div>
            </div>

        </div>
    );
}
