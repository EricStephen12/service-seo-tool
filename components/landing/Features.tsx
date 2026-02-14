"use client";

import { motion } from 'framer-motion';
import { useRef } from 'react';

const collection = [
    {
        id: "01",
        season: "A/W 26",
        title: "The Audit",
        desc: "Everything you need to know, nothing you don't. A 50-point health check that tells you why you aren't ranking.",
        tags: ["Technical", "Visual", "Core Web Vitals"]
    },
    {
        id: "02",
        season: "S/S 26",
        title: "Market Insight",
        desc: "See what the competition is doing. We scout the marketplace so you don't have to.",
        tags: ["Strategy", "Positioning", "Gaps"]
    },
    {
        id: "03",
        season: "RESORT",
        title: "Rank Tracker",
        desc: "Real metrics for real businesses. Daily updates on how your site or gig is performing in the wild.",
        tags: ["Visibility", "Google", "Fiverr"]
    }
];

export function FeatureCollection() {
    return (
        <section className="py-40 bg-fashion-light">
            <div className="couture-container">
                <div className="mb-32 flex justify-between items-end border-b border-black/10 pb-8">
                    <h2 className="text-display-large font-serif italic">The Collection</h2>
                    <span className="text-label">Functional Tools</span>
                </div>

                <div className="space-y-40">
                    {collection.map((item, i) => (
                        <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-12 group items-center">
                            <div className="lg:col-span-3 text-label text-fashion-gray pt-2 border-t border-black/10 group-hover:border-black transition-colors duration-500">
                                {item.season} — {item.id}
                            </div>

                            <div className="lg:col-span-4">
                                <motion.h3
                                    initial={{ opacity: 0.8 }}
                                    whileInView={{ opacity: 1, x: 10 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-5xl md:text-6xl font-serif text-fashion-black mb-6"
                                >
                                    {item.title}
                                </motion.h3>
                                <p className="text-xl font-light leading-relaxed mb-8 text-fashion-gray">
                                    {item.desc}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, t) => (
                                        <span key={t} className="px-3 py-1 border border-black/10 text-[9px] uppercase font-bold tracking-widest rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* VISUAL EVIDENCE COLUMN */}
                            <div className="lg:col-span-5 relative h-64 md:h-80 bg-white border border-black/5 p-8 flex items-center justify-center overflow-hidden group-hover:shadow-2xl transition-all duration-700">

                                {i === 0 && ( /* THE AUDIT VISUAL */
                                    <div className="relative w-full max-w-xs">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs uppercase tracking-widest">Health Score</span>
                                            <span className="text-6xl font-serif">98</span>
                                        </div>
                                        <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
                                            <div className="w-[98%] h-full bg-semrush-orange" />
                                        </div>
                                        <div className="mt-8 space-y-2">
                                            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                                                <span>Performance</span>
                                                <span>A+</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                                                <span>Accessibility</span>
                                                <span>100</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {i === 1 && ( /* MARKET INSIGHT VISUAL */
                                    <div className="relative w-full max-w-xs">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                            <div className="w-48 h-48 border border-black rounded-full" />
                                            <div className="w-32 h-32 border border-black rounded-full absolute" />
                                        </div>
                                        <div className="relative z-10 grid grid-cols-2 gap-4">
                                            <div className="bg-fashion-black text-white p-4 text-center">
                                                <span className="block text-2xl font-serif mb-1">2.4k</span>
                                                <span className="text-[8px] uppercase tracking-widest">Comp. Volume</span>
                                            </div>
                                            <div className="border border-black p-4 text-center">
                                                <span className="block text-2xl font-serif mb-1 text-semrush-orange">Low</span>
                                                <span className="text-[8px] uppercase tracking-widest">Difficulty</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {i === 2 && ( /* RANK TRACKER VISUAL */
                                    <div className="relative w-full max-w-xs space-y-4">
                                        {[1, 2, 3].map((r) => (
                                            <div key={r} className="flex items-center gap-4 p-2 border-b border-black/5">
                                                <span className="font-serif italic text-xl text-fashion-gray">#{r}</span>
                                                <div className="flex-1 h-2 bg-black/5 rounded-full" />
                                                <span className="text-[10px] uppercase tracking-widest text-green-600">▲ 12%</span>
                                            </div>
                                        ))}
                                        <div className="absolute top-0 right-0 p-2 bg-semrush-orange text-white text-[8px] font-bold uppercase tracking-widest">
                                            Live
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
