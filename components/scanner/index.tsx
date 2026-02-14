"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export function ScannerInput({ onResults }: { onResults: (data: any) => void }) {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    const startScan = async () => {
        setIsScanning(true);
        setProgress(10);

        // Simulate progress while scanning
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + 5, 90));
        }, 1000);

        try {
            const res = await fetch('/api/scan-website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            setProgress(100);
            onResults(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            clearInterval(interval);
            setIsScanning(false);
        }
    };

    return (
        <div className="glass p-8 rounded-2xl max-w-2xl mx-auto mt-12">
            <h2 className="text-2xl mb-6 text-center">Scan your business website</h2>
            <div className="flex gap-4">
                <input
                    type="url"
                    placeholder="https://myplumbingbusiness.com"
                    className="flex-1 bg-surface-light p-3 rounded-lg border border-gray-700 focus:border-primary outline-none transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    onClick={startScan}
                    disabled={isScanning || !url}
                    className="bg-primary hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {isScanning ? 'Scanning...' : 'Scan Now'}
                </button>
            </div>

            {isScanning && (
                <div className="mt-8 space-y-2">
                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Analyzing SEO signals...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export function ResultsDashboard({ results }: { results: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
            {/* Score Gauge */}
            <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r="45" fill="none" stroke="url(#scoreGrad)"
                            strokeWidth="8" strokeDasharray={`${results.score * 2.82} 282`}
                            strokeLinecap="round" className="animate-gauge"
                        />
                        <defs>
                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#14b8a6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold">{results.score}</span>
                    </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold">SEO Score</h3>
            </div>

            {/* Problems List */}
            <div className="md:col-span-2 space-y-4">
                {results.problems.map((problem: any, idx: number) => (
                    <div key={idx} className="glass p-6 rounded-xl card-hover">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${problem.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                                        problem.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-blue-500/20 text-blue-500'
                                    }`}>
                                    {problem.severity} impact
                                </span>
                                <h4 className="text-lg mt-2">{problem.issue}</h4>
                            </div>
                            <button className="text-primary hover:underline text-sm font-semibold">
                                Fix in one click
                            </button>
                        </div>
                        <p className="text-text-muted text-sm">{problem.explanation.what_it_means}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
