"use client";

import { motion } from 'framer-motion';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Hero() {
    const [domain, setDomain] = useState('');
    const router = useRouter();

    const handleAnalyze = () => {
        if (!domain) return;
        // Clean URL roughly
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
        router.push(`/dashboard?new_scan=${encodeURIComponent(cleanDomain)}`);
    };

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center bg-white overflow-hidden pt-20 px-6">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]" />

            {/* Floating Hero Accents - Subtle Background Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[5%] md:left-[15%] w-32 h-32 md:w-64 md:h-64 opacity-10 md:opacity-20 blur-sm md:blur-lg"
                >
                    <img src="/hero_accent_01_lens_1770894544912.png" className="w-full h-full object-contain grayscale" alt="" />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -10, 0]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[40%] right-[-5%] md:right-[10%] w-40 h-40 md:w-80 md:h-80 opacity-5 md:opacity-15 blur-[2px] md:blur-md"
                >
                    <img src="/hero_accent_02_gold_thread_1770894562480.png" className="w-full h-full object-contain" alt="" />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[10%] left-[20%] w-48 h-48 md:w-96 md:h-96 opacity-5 md:opacity-10 blur-xl md:blur-3xl"
                >
                    <img src="/hero_accent_03_abstract_mesh_1770894594057.png" className="w-full h-full object-contain grayscale" alt="" />
                </motion.div>
            </div>

            <div className="couture-container relative z-10 w-full text-center">

                {/* The 'Issue Number' Label */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mb-8 md:mb-12 flex justify-center items-center gap-4"
                >
                    <div className="h-[1px] w-8 bg-semrush-orange" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-semrush-orange">The Authority Issue</span>
                    <div className="h-[1px] w-8 bg-semrush-orange" />
                </motion.div>

                {/* Monolithic Title - Matched to Login Aesthetic but slightly more prominent */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-8"
                >
                    <span className="text-6xl md:text-[8rem] font-serif italic leading-tight text-fashion-black tracking-tighter">
                        RankMost.
                    </span>
                </motion.h1>

                {/* Refined Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-8 md:mt-12 max-w-xl mx-auto text-base md:text-xl font-light text-fashion-gray leading-relaxed mb-12 md:mb-20 px-4"
                >
                    Algorithm precision. High-fashion prestige. <br className="hidden md:block" /> Effortless search dominance.
                </motion.p>

                {/* HIGH VISIBILITY COMMAND BAR - MOBILE OPTIMIZED */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="max-w-2xl mx-auto relative group w-full"
                >
                    <div className="flex flex-col md:flex-row items-center gap-4 bg-fashion-light p-4 md:p-2 md:pr-2 rounded-3xl md:rounded-full border border-black/5 hover:border-black/20 transition-colors shadow-2xl shadow-black/5">
                        <div className="flex-1 w-full md:pl-8 text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-2 md:mb-1">Target Domain</span>
                            <input
                                type="text"
                                placeholder="example.com"
                                className="w-full bg-transparent text-lg md:text-xl outline-none text-fashion-black font-serif italic placeholder:text-black/20"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            className="w-full md:w-auto px-8 py-4 md:px-10 md:py-5 bg-fashion-navy text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-semrush-orange transition-colors rounded-xl md:rounded-full shadow-lg whitespace-nowrap"
                        >
                            Analyze
                        </button>
                    </div>

                    <p className="mt-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-fashion-gray opacity-40">
                        Free Analysis • Instant Results
                    </p>
                </motion.div>

            </div>

            {/* 'Scroll' Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex"
            >
                <div className="w-[1px] h-12 bg-black/10" />
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] rotate-180" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
            </motion.div>
        </section>
    );
}
