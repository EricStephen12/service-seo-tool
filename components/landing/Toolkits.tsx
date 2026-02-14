"use client";

import { motion } from 'framer-motion';
import { Search, Globe, Target, BarChart3, Zap, Shield } from 'lucide-react';

const toolkits = [
    {
        title: "Traffic & Market",
        desc: "A meticulous approach to understanding the competitive landscape.",
        items: ["Competitive Gaps", "Keyword Intelligence", "Market Share"],
        icon: Search
    },
    {
        title: "SEO Intelligence",
        desc: "rigorous technical audits and position tracking protocols.",
        items: ["Site Audit", "Rank Tracker", "Backlink Analysis"],
        icon: Globe,
        active: true
    },
    {
        title: "Project Management",
        desc: "Streamlined workflow for service business SEO operations.",
        items: ["Campaign Center", "Automated Reports", "EEAT Signals"],
        icon: Shield
    }
];

export function Toolkits() {
    return (
        <section id="features" className="py-40 bg-cream-50 border-y border-border-light">
            <div className="editorial-container">
                <div className="text-center mb-32">
                    <span className="text-semrush-orange font-bold uppercase tracking-[0.2em] text-[10px] mb-6 block">
                        Expert Toolsets
                    </span>
                    <h2 className="text-5xl md:text-6xl font-serif font-light mb-8 text-navy-900 leading-tight">
                        Curated toolkits for <br />
                        every <span className="italic">Digital mission.</span>
                    </h2>
                    <div className="w-12 h-[1px] bg-semrush-orange mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {toolkits.map((toolkit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`editorial-card p-12 flex flex-col ${toolkit.active ? 'border-semrush-orange border-2' : ''}`}
                        >
                            <div className="mb-10 text-semrush-orange">
                                <toolkit.icon className="w-8 h-8" strokeWidth={1} />
                            </div>
                            <h3 className="font-serif text-3xl mb-6 text-navy-900 italic">{toolkit.title}</h3>
                            <p className="text-slate-600 font-light text-sm leading-relaxed mb-10 pb-8 border-b border-border-light">
                                {toolkit.desc}
                            </p>
                            <ul className="space-y-4 mb-12 flex-1 font-sans">
                                {toolkit.items.map((item, j) => (
                                    <li key={j} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-navy-900">
                                        <div className="w-1 h-1 bg-semrush-orange" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 text-[10px] font-black uppercase tracking-widest transition-all ${toolkit.active ? 'bg-semrush-orange text-white' : 'bg-white text-navy-900 border border-navy-900/10 hover:border-semrush-orange active:scale-95'
                                }`}>
                                Explore Suite
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
