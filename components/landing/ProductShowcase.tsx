"use client";

import { motion } from 'framer-motion';

export function ProductShowcase() {
    return (
        <section className="py-20 md:py-40 bg-fashion-light overflow-hidden">
            <div className="couture-container">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <div>
                        <span className="text-label text-semrush-orange">The Interface</span>
                        <h2 className="text-display-large font-serif italic mt-4 text-fashion-black">
                            Beauty in <br />
                            The Data.
                        </h2>
                    </div>
                    <p className="text-xl font-light max-w-md text-right hidden md:block text-fashion-gray">
                        Sophisticated analytics presented with the clarity of a high-fashion editorial.
                    </p>
                </div>

                {/* The "Device" Frame - Cinematic Perspective */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="relative mx-auto max-w-6xl perspective-1000"
                >
                    {/* Browser Window Chrome */}
                    <div className="bg-white rounded-xl shadow-2xl border border-black/5 overflow-hidden">
                        {/* Window Controls */}
                        <div className="h-8 bg-fashion-light border-b border-black/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400 opacity-50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-50" />
                            <div className="w-3 h-3 rounded-full bg-green-400 opacity-50" />
                        </div>

                        {/* Dashboard Mockup Content */}
                        <div className="flex h-[600px] md:h-[800px] overflow-hidden bg-fashion-light">

                            {/* Mock Sidebar */}
                            <div className="w-16 md:w-20 bg-fashion-navy flex flex-col items-center py-8 gap-8 z-10">
                                <div className="w-8 h-8 rounded-full bg-white/10" />
                                <div className="flex flex-col gap-6 w-full px-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="w-full h-1 bg-white/20 rounded-full" />
                                    ))}
                                </div>
                            </div>

                            {/* Mock Main Content */}
                            <div className="flex-1 p-8 md:p-12 overflow-hidden relative">

                                {/* Header */}
                                <div className="flex justify-between items-center mb-12">
                                    <div>
                                        <h3 className="text-3xl font-serif italic text-fashion-black">Project: Vogue International</h3>
                                        <p className="text-xs uppercase tracking-widest text-fashion-gray mt-2">Global SEO Campaign • A/W 2026</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-black/10" />
                                </div>

                                {/* Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                    {/* Card 1: Authority Score */}
                                    <div className="bg-white p-8 rounded-none border border-black/5 shadow-sm hover:shadow-lg transition-shadow">
                                        <span className="text-xs uppercase tracking-widest text-fashion-gray block mb-4">Authority Score</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-serif text-fashion-black">92</span>
                                            <span className="text-sm text-green-500 font-bold">▲ 4%</span>
                                        </div>
                                        <div className="mt-8 h-24 bg-fashion-light/50 relative overflow-hidden">
                                            {/* Fake Chart Line */}
                                            <svg viewBox="0 0 100 50" className="w-full h-full absolute bottom-0">
                                                <path d="M0,50 Q25,40 50,20 T100,10" fill="none" stroke="black" strokeWidth="0.5" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Card 2: Health */}
                                    <div className="bg-fashion-navy text-white p-8 rounded-none shadow-xl col-span-1 md:col-span-2 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <span className="text-xs uppercase tracking-widest text-white/60 block mb-4">Site Health</span>
                                            <div className="flex justify-between items-end">
                                                <span className="text-8xl font-serif italic">A+</span>
                                                <div className="text-right">
                                                    <span className="block text-2xl mb-1">98/100</span>
                                                    <span className="text-xs text-white/60">0 Critical Errors</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-semrush-orange opacity-20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                                    </div>

                                    {/* Card 3: Keywords */}
                                    <div className="bg-white p-8 rounded-none border border-black/5">
                                        <span className="text-xs uppercase tracking-widest text-fashion-gray block mb-4">Top Keywords</span>
                                        <div className="space-y-4">
                                            {[
                                                { k: "luxury seo services", p: "#1" },
                                                { k: "high fashion marketing", p: "#3" },
                                                { k: "premium digital agency", p: "#2" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b border-black/5">
                                                    <span className="font-serif italic text-lg">{item.k}</span>
                                                    <span className="bg-fashion-navy text-white text-[10px] px-2 py-1 rounded-full">{item.p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {/* Floating "Notification" Card */}
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.8 }}
                                    className="absolute bottom-12 right-12 bg-white p-6 shadow-2xl border-l-4 border-semrush-orange max-w-xs z-20"
                                >
                                    <span className="text-[10px] uppercase font-bold text-semrush-orange mb-2 block">Auto-Fix Engine</span>
                                    <p className="text-sm font-serif">
                                        <span className="italic">"Optimization Complete."</span> <br />
                                        Fixed 3 broken links in /collections.
                                    </p>
                                </motion.div>

                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
