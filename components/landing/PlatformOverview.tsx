"use client";

import { motion } from 'framer-motion';
import { Search, Zap, Target, BarChart3, Globe, Shield } from 'lucide-react';

export function PlatformOverview() {
    return (
        <section className="py-40 bg-white">
            <div className="editorial-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-6">
                        <span className="text-semrush-orange font-bold uppercase tracking-[0.2em] text-[10px] mb-8 block">
                            The Architecture of Growth
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif font-light leading-tight mb-12 text-navy-900">
                            One solution <br />
                            to win every <span className="italic luxury-underline">Search mission.</span>
                        </h2>
                        <p className="text-lg text-slate-600 font-light leading-relaxed mb-16 max-w-lg">
                            RankMost Pro isn't just a tracking tool. It's an integrated SEO mission control that brings technical intelligence, content curation, and market dominance into a single, cohesive interface.
                        </p>

                        <div className="space-y-12">
                            {[
                                { title: 'Technical Site Audit', desc: 'Fix your website with 50+ rigorous technical checks designed for high-end service businesses.', icon: Search },
                                { title: 'AI Fix Engine', desc: 'Automate your growth. Our AI creates the actual technical fixes, from meta tags to image optimizations.', icon: Zap },
                                { title: 'Position Tracking', desc: 'Command your market with daily ranking updates across Google and Fiverr categories.', icon: Target }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-10 items-start group">
                                    <div className="w-12 h-12 shrink-0 flex items-center justify-center border border-border-light bg-cream-50 group-hover:bg-semrush-orange group-hover:text-white transition-all duration-500">
                                        <feature.icon className="w-5 h-5" strokeWidth={1} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl mb-3 text-navy-900 group-hover:text-semrush-orange transition-colors">{feature.title}</h3>
                                        <p className="text-slate-500 text-sm font-light leading-relaxed max-w-sm">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative">
                        <div className="sticky top-40">
                            <div className="editorial-card p-2 shadow-2xl overflow-hidden relative group">
                                {/* Clean Dashboard Placeholder */}
                                <div className="bg-cream-50 h-[600px] w-full flex flex-col p-10">
                                    <div className="h-4 w-1/4 bg-navy-900/10 mb-12" />
                                    <div className="grid grid-cols-2 gap-8 mb-12">
                                        <div className="h-40 border border-navy-900/5 bg-white p-6">
                                            <div className="w-12 h-1 bg-semrush-orange mb-4" />
                                            <div className="h-2 w-full bg-navy-900/5 mb-2" />
                                            <div className="h-2 w-2/3 bg-navy-900/5" />
                                        </div>
                                        <div className="h-40 border border-navy-900/5 bg-white p-6">
                                            <div className="w-12 h-1 bg-navy-900/20 mb-4" />
                                            <div className="h-2 w-full bg-navy-900/5 mb-2" />
                                            <div className="h-2 w-2/3 bg-navy-900/5" />
                                        </div>
                                    </div>
                                    <div className="flex-1 border border-navy-900/5 bg-white p-8 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-semrush-orange/[0.03] to-transparent" />
                                        <div className="relative z-10 space-y-4">
                                            <div className="h-2 w-full bg-navy-900/5" />
                                            <div className="h-2 w-full bg-navy-900/5" />
                                            <div className="h-2 w-3/4 bg-navy-900/5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
