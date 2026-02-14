"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export function GigOptimizerUI({ onOptimized }: { onOptimized: (data: any) => void }) {
    const [url, setUrl] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);

    const optimize = async () => {
        setIsOptimizing(true);
        try {
            const res = await fetch('/api/optimize-fiverr-gig', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gig_url: url })
            });
            const data = await res.json();
            onOptimized(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="glass p-8 rounded-2xl max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-2xl mb-4">Optimize your Fiverr Gig</h2>
            <p className="text-text-muted mb-6">Analyze competition and generate high-converting content with GPT-4</p>
            <div className="flex gap-4">
                <input
                    type="url"
                    placeholder="https://www.fiverr.com/..."
                    className="flex-1 bg-surface-light p-3 rounded-lg border border-gray-700 outline-none"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    onClick={optimize}
                    disabled={isOptimizing || !url}
                    className="bg-secondary hover:bg-teal-600 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-secondary/20"
                >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Gig'}
                </button>
            </div>
        </div>
    );
}

export function GigComparison({ current, optimized }: { current: any, optimized: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-20">
            <div className="glass p-8 rounded-2xl opacity-60">
                <h3 className="text-xl mb-4 border-b border-white/10 pb-2">Original Gig</h3>
                <p className="font-bold text-lg mb-2">{current.title}</p>
                <p className="text-sm text-text-muted line-clamp-6">{current.description}</p>
            </div>

            <div className="glass p-8 rounded-2xl border-primary bg-primary/5">
                <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
                    <h3 className="text-xl text-primary font-bold">AI Optimized Version</h3>
                    <button className="bg-primary px-4 py-1 rounded text-sm hover:bg-primary-dark transition-all">Copy All</button>
                </div>
                <p className="font-bold text-lg mb-4 text-white leading-tight">{optimized.title}</p>
                <div className="space-y-4">
                    <div className="bg-surface-light p-4 rounded-lg">
                        <h4 className="text-sm text-secondary font-bold uppercase mb-2">Optimized Description</h4>
                        <p className="text-sm text-text-muted whitespace-pre-line max-h-60 overflow-y-auto custom-scrollbar">{optimized.description}</p>
                    </div>

                    {/* Trust Audit Section */}
                    {optimized.trustAudit && (
                        <div className="bg-surface-light p-4 rounded-lg border border-white/5">
                            <h4 className="text-sm text-secondary font-bold uppercase mb-3">Human Trust Audit</h4>
                            <div className="space-y-3">
                                <TrustIndicator label="Video Intro" data={optimized.trustAudit.video} />
                                <TrustIndicator label="FAQ Section" data={optimized.trustAudit.faq} />
                                <TrustIndicator label="Seller Activity" data={optimized.trustAudit.activity} />
                            </div>
                        </div>
                    )}

                    {/* Neuro-Hooks Section */}
                    {optimized.neuroHooks && (
                        <div>
                            <h4 className="text-sm text-secondary font-bold uppercase mb-2">Psychological Triggers (Neuro-Hooks)</h4>
                            <div className="flex flex-wrap gap-2">
                                {optimized.neuroHooks.map((hook: string, i: number) => (
                                    <span key={i} className="bg-purple-900/30 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-xs font-medium">⚡ {hook}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Visual Dominance Section */}
                    {optimized.visualAdvice && (
                        <div className="bg-gradient-to-r from-orange-900/20 to-red-900/10 p-4 rounded-lg border-l-2 border-orange-500">
                            <h4 className="text-sm text-orange-400 font-bold uppercase mb-1">Visual Dominance Strategy</h4>
                            <p className="text-sm text-gray-300 italic">"{optimized.visualAdvice}"</p>
                        </div>
                    )}

                    <div>
                        <h4 className="text-sm text-secondary font-bold uppercase mb-2">Targeted Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {optimized.tags.map((tag: string, i: number) => (
                                <span key={i} className="bg-surface-light px-3 py-1 rounded-full text-xs">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrustIndicator({ label, data }: { label: string, data: { status: string, message: string } }) {
    const color = data.status === 'pass' ? 'text-green-400' : (data.status === 'warn' ? 'text-yellow-400' : 'text-red-400');
    const icon = data.status === 'pass' ? '✓' : (data.status === 'warn' ? '⚠' : '✕');

    return (
        <div className="flex items-start gap-3 text-sm">
            <span className={`font-bold ${color} mt-0.5`}>{icon}</span>
            <div>
                <span className="font-semibold text-white block">{label}</span>
                <span className="text-text-muted text-xs">{data.message}</span>
            </div>
        </div>
    );
}
