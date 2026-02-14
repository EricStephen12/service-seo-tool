"use client";

import { motion } from 'framer-motion';

export function VisualEvidence() {
    return (
        <section className="py-40 bg-white text-fashion-black overflow-hidden border-t border-black/5">
            <div className="couture-container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-32">
                    <div>
                        <span className="text-label text-semrush-orange">Phase IV</span>
                        <h2 className="text-display-large font-serif italic mt-4">The Evidence</h2>
                    </div>
                    <p className="text-xl font-light max-w-md text-right hidden md:block">
                        Data doesn't lie. Most of our users save 40 hours a month just by letting the AI handle the grunt work.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
                    {[
                        { val: "300%", label: "Avg. Traffic Increase", sub: "Within 90 Days" },
                        { val: "#1", label: "Rankings Achieved", sub: "For 12k+ Keywords" },
                        { val: "40hr", label: "Saved Monthly", sub: "Via Auto-Fix AI" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className="bg-white p-12 lg:p-20 flex flex-col justify-between aspect-square group hover:bg-fashion-navy hover:text-white transition-colors duration-500"
                        >
                            <span className="text-label opacity-50 mb-auto">{stat.sub}</span>
                            <div>
                                <span className="text-6xl lg:text-8xl font-serif italic block mb-4 group-hover:text-semrush-orange transition-colors">
                                    {stat.val}
                                </span>
                                <span className="text-sm font-bold uppercase tracking-widest">{stat.label}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-40">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="text-9xl font-serif leading-none opacity-10">"</span>
                        <p className="text-3xl md:text-5xl font-serif italic leading-tight -mt-12">
                            We spent years guessing why our phone wasn't ringing. RankMost showed us exactly where we were losing—and helped us fix it in an afternoon. Our call volume has never been higher.
                        </p>
                        <div className="mt-12 flex flex-col items-center">
                            <span className="text-label font-bold">Alexander V.</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-50 mt-2">Director, Elite Plumbing NYC</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
