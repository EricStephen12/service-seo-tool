"use client";

import { motion } from 'framer-motion';

export function Testimonials() {
    return (
        <section className="py-40 bg-white border-t border-border-light">
            <div className="editorial-container">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <span className="text-semrush-orange font-bold uppercase tracking-[0.2em] text-[10px] mb-12 block">
                            Expert Perspectives
                        </span>
                        <blockquote className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-navy-900 leading-snug mb-16">
                            "I hate spreadsheets and I hate data dumps. RankMost is the first tool that actually speaks my language. I can see what's happening in 30 seconds, and I know exactly what to do next. It's the best investment I've made for my agency."
                        </blockquote>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-cream-50 mb-6 flex items-center justify-center font-bold text-navy-900 luxury-border">DM</div>
                            <p className="font-bold text-sm tracking-widest uppercase mb-1">David Miller</p>
                            <p className="text-xs text-slate-500 italic">Founder, Premier Plumbing Group</p>
                        </div>
                    </motion.div>
                </div>

                {/* Logo cloud - Refined */}
                <div className="mt-40 pt-20 border-t border-border-light">
                    <div className="flex flex-wrap justify-center items-center gap-x-24 gap-y-12 opacity-20 grayscale">
                        <span className="font-serif italic text-2xl font-bold">VOGUE</span>
                        <span className="font-black text-2xl">Forbes</span>
                        <span className="font-sans font-black tracking-tighter text-2xl">SAMSUNG</span>
                        <span className="font-serif font-bold text-2xl">The New York Times</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
