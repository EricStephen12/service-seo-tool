"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const capabilities = [
    {
        category: "01 — Technical SEO",
        tools: [
            { name: "Site Audit", desc: "50+ point technical health check." },
            { name: "Auto-Fix Engine", desc: "AI-driven correction protocols." },
            { name: "Core Web Vitals", desc: "Real-time performance metrics." },
            { name: "HTTPS Security", desc: "Encryption & protocol validation." }
        ]
    },
    {
        category: "02 — Conversion Intel",
        tools: [
            { name: "Keyword Discovery", desc: "AI-driven search intent extraction." },
            { name: "Trust Validation", desc: "NAP & structural authority checks." },
            { name: "Selling Narratives", desc: "AI-driven page content rewriting." },
            { name: "Rival Recon", desc: "Structural competitor audit." }
        ]
    },
    {
        category: "03 — Visibility & Ranks",
        tools: [
            { name: "Position Tracker", desc: "Google Desktop & Mobile tracking." },
            { name: "Search Authority", desc: "Domain-wide visibility monitoring." },
            { name: "Volatility Radar", desc: "Planned — Deployment Q3 2026." },
            { name: "Local Maps", desc: "Planned — Deployment Q4 2026." }
        ]
    },
    {
        category: "04 — Engineering Suite",
        tools: [
            { name: "Schema Generator", desc: "AI-driven JSON-LD structural data." },
            { name: "Link Architect", desc: "Internal linking map & audit." },
            { name: "Metadata Forge", desc: "Surgical Title & Meta description fix." },
            { name: "Alt-Text Recon", desc: "Accessibility & image SEO check." }
        ]
    }
];

export function CapabilitiesIndex() {
    return (
        <section className="py-40 bg-white border-t border-black/5">
            <div className="couture-container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <div>
                        <span className="text-label text-semrush-orange">Specifications</span>
                        <h2 className="text-display-large font-serif italic mt-4">Full Capabilities</h2>
                    </div>
                    <p className="text-xl font-light max-w-md text-right hidden md:block text-fashion-gray">
                        A comprehensive index of every intelligence tool available in the suite.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
                    {capabilities.map((cat, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest border-b border-black text-fashion-black pb-4 mb-8">
                                {cat.category}
                            </span>
                            <div className="space-y-8">
                                {cat.tools.map((tool, j) => (
                                    <div key={j} className="group cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-serif text-2xl italic text-fashion-black group-hover:text-semrush-orange transition-colors">
                                                {tool.name}
                                            </h4>
                                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-semrush-orange" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-fashion-gray opacity-60">
                                            {tool.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto pt-8">
                                <span className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-20">View All {cat.tools.length} Tools</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
