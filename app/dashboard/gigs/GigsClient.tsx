"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Zap, Search, ArrowRight, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface Gig {
    id: string;
    gigUrl: string;
    category: string | null;
    lastAnalysisScore: number | null;
    analyses: any[];
}

export function GigsClient({ initialGigs }: { initialGigs: Gig[] }) {
    const [gigUrl, setGigUrl] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeGig, setActiveGig] = useState<any>(initialGigs[0] || null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!gigUrl) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const res = await fetch('/api/optimize-fiverr-gig', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gig_url: gigUrl }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to analyze");
            }

            const result = await res.json();
            // Refresh logic here (or local state update)
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-fashion-light pl-24 pr-8 py-12 md:pl-32 md:pr-12 md:py-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                <div>
                    <span className="text-label text-semrush-orange">Fiverr Intelligence</span>
                    <h1 className="text-5xl md:text-7xl font-serif italic mt-4 text-fashion-black tracking-tight">
                        Gig Optimizer
                    </h1>
                </div>

                <div className="w-full md:w-auto relative group">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-semrush-orange transition-transform group-hover:scale-110" />
                    <input
                        value={gigUrl}
                        onChange={(e) => setGigUrl(e.target.value)}
                        type="text"
                        placeholder="Paste Fiverr Gig URL..."
                        className="w-full md:w-96 bg-white border border-black/10 py-5 pl-12 pr-12 outline-none font-serif italic text-lg shadow-sm focus:border-black transition-all"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black hover:text-semrush-orange transition-colors disabled:opacity-50"
                    >
                        {isAnalyzing ? "..." : <ArrowRight className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-12 p-6 bg-red-50 border border-red-100 flex items-center gap-4 text-red-600 font-bold uppercase text-[10px] tracking-widest">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {!activeGig ? (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-40">
                    <Zap className="w-16 h-16 mb-8 stroke-1" />
                    <h3 className="text-2xl font-serif italic">No Active Analysis</h3>
                    <p className="max-w-xs mt-4 text-sm font-light">Enter your gig URL above to initiate the intelligence protocol.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Rail: Optimized Spec Sheet */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-12">

                        {/* Title Section */}
                        <div className="bg-white p-12 shadow-sm border-l-4 border-black group">
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-label opacity-40">Marketplace Narrative</span>
                                <button
                                    onClick={() => copyToClipboard(activeGig.analyses[0]?.optimizedData?.title, 'title')}
                                    className="text-fashion-gray hover:text-black transition-colors"
                                >
                                    {copied === 'title' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif italic leading-tight">
                                {activeGig.analyses[0]?.optimizedData?.title}
                            </h2>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white p-12 shadow-sm border-l-4 border-black">
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-label opacity-40">The Buyer Brief (Description)</span>
                                <button
                                    onClick={() => copyToClipboard(activeGig.analyses[0]?.optimizedData?.description, 'desc')}
                                    className="text-fashion-gray hover:text-black transition-colors"
                                >
                                    {copied === 'desc' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="prose prose-sm font-light text-fashion-black max-w-none space-y-4 whitespace-pre-wrap">
                                {activeGig.analyses[0]?.optimizedData?.description}
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="bg-white p-12 shadow-sm border-l-4 border-black">
                            <span className="text-label opacity-40 block mb-8">Search Intent Tags</span>
                            <div className="flex flex-wrap gap-4">
                                {activeGig.analyses[0]?.optimizedData?.tags?.map((tag: string, i: number) => (
                                    <span key={i} className="px-6 py-2 border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:border-semrush-orange transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Rail: Comparison & Stats */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">

                        {/* Scorecard */}
                        <div className="bg-black text-white p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-semrush-orange/10 blur-3xl -mr-16 -mt-16" />
                            <span className="text-label text-semrush-orange mb-6 block">Saturation Index</span>
                            <span className="text-8xl font-serif block mb-2">{activeGig.lastAnalysisScore || '—'}%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Visibility Ranking Potency</span>
                        </div>

                        {/* Competition Matrix */}
                        <div className="bg-white p-12 shadow-sm">
                            <h3 className="text-xl font-serif italic mb-8 border-b border-black/5 pb-4">Seller Saturation</h3>
                            <div className="space-y-6 mb-12">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                        <span>Competition</span>
                                        <span className="text-semrush-orange">{activeGig.analyses[0]?.competitionLevel}</span>
                                    </div>
                                    <div className="h-1 bg-black/5">
                                        <div
                                            className="h-full bg-black transition-all duration-1000"
                                            style={{ width: activeGig.analyses[0]?.competitionLevel === 'High' ? '90%' : '40%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-black/5">
                                <span className="text-label opacity-40 block mb-6">How to Apply Fix</span>
                                <div className="space-y-4">
                                    {activeGig.analyses[0]?.optimizedData?.improvements?.map((step: string, i: number) => (
                                        <div key={i} className="flex gap-4 group">
                                            <span className="text-[10px] font-mono text-semrush-orange opacity-40 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                            <p className="text-[11px] font-light leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Previous Runs List */}
                        <div className="space-y-4">
                            <span className="text-label block opacity-40 mb-4">Historical Archives</span>
                            {initialGigs.map((gig, i) => (
                                <div
                                    key={gig.id}
                                    onClick={() => setActiveGig(gig)}
                                    className={`p-6 border border-black/5 bg-white flex justify-between items-center cursor-pointer transition-all hover:pl-8 hover:border-black ${activeGig.id === gig.id ? 'border-semrush-orange bg-white shadow-md' : ''}`}
                                >
                                    <span className="font-serif italic text-sm truncate max-w-[150px]">{gig.gigUrl.split('/').pop()}</span>
                                    <span className="text-[10px] font-bold">{gig.lastAnalysisScore}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
