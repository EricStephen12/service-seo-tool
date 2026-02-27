import { AlertTriangle, CheckCircle2, XCircle, Play, HelpCircle, Activity } from 'lucide-react';

interface GigReportData {
    score: number;
    competitionLevel: string;
    trustAudit: {
        video: { status: string; message: string };
        faq: { status: string; message: string };
        activity: { status: string; message: string };
    };
    improvements: string[];
    [key: string]: any;
}

export default function GigReportCard({ data }: { data: GigReportData }) {
    const getStatusIcon = (status: string) => {
        if (status === 'pass') return <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />;
        if (status === 'fail') return <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />;
        return <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />;
    };

    return (
        <div className="bg-white border border-black/10 rounded-xl overflow-hidden mt-4 mb-2 shadow-sm font-sans max-w-2xl">
            {/* Header */}
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold">Strategic Briefing Summary</span>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-semrush-orange">Growth Score: {data.score}</span>
                </div>
            </div>

            {/* Growth Score & Market Context */}
            <div className="p-6 bg-fashion-light border-b border-black/5">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Market Sentiment</p>
                        <p className="text-sm font-bold italic font-serif">{data.competitionLevel} Competition</p>
                    </div>
                </div>
            </div>

            {/* Top 3 Critical Gaps */}
            <div className="p-6 border-b border-black/5">
                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Top 3 Critical Gaps</p>
                <div className="space-y-3">
                    {data.improvements?.[0] && (
                        <div className="flex items-start gap-3 p-3 bg-white border border-black/5 rounded-lg">
                            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-fashion-black font-medium leading-tight">{data.improvements[0]}</p>
                        </div>
                    )}
                    {data.improvements?.[1] && (
                        <div className="flex items-start gap-3 p-3 bg-white border border-black/5 rounded-lg">
                            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-fashion-black font-medium leading-tight">{data.improvements[1]}</p>
                        </div>
                    )}
                    {data.improvements?.[2] && (
                        <div className="flex items-start gap-3 p-3 bg-white border border-black/5 rounded-lg">
                            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-fashion-black font-medium leading-tight">{data.improvements[2]}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Trust Signals */}
            <div className="p-6 bg-slate-50">
                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Trust Pulse</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(data.trustAudit.video.status)}
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Video</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(data.trustAudit.faq.status)}
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">FAQ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(data.trustAudit.activity.status)}
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Activity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
