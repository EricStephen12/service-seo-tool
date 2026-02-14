"use client";

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: "The Specialist",
        price: "15",
        description: "For individual service providers aiming for local dominance.",
        features: [
            "3 Active Projects",
            "Daily Rank Tracking",
            "Fiverr Gig Optimization",
            "Bi-Weekly Site Audits",
            "Professional PDF Briefings"
        ]
    },
    {
        name: "The Agency",
        price: "39",
        description: "For teams managing a portfolio of high-value clients.",
        featured: true,
        features: [
            "Unlimited Projects",
            "Real-time Intelligence",
            "Competitor Market Sensors",
            "Full API Access",
            "Priority Technical Support",
            "White-label Dossiers"
        ]
    },
    {
        name: "The Enterprise",
        price: "Custom",
        description: "Architectural solutions for large-scale operations.",
        features: [
            "Custom Data Modeling",
            "Dedicated Strategist",
            "Advanced Global Tracking",
            "Custom Webhooks",
            "Enterprise Grade Security"
        ]
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-fashion-white pt-32 pb-20 couture-container">

            {/* Header */}
            <div className="mb-32 text-center max-w-4xl mx-auto">
                <span className="text-label text-semrush-orange mb-4 block">The Investment</span>
                <h1 className="text-display-large font-serif italic mb-8">Access the Intelligence Engine</h1>
                <p className="font-light text-fashion-gray text-xl max-w-2xl mx-auto leading-relaxed italic">
                    Select the protocol that aligns with your pursuit of search dominance.
                </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
                {tiers.map((tier, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-white p-12 md:p-16 flex flex-col h-full ${tier.featured ? 'relative z-10 shadow-2xl' : ''}`}
                    >
                        {tier.featured && (
                            <span className="absolute top-0 right-0 bg-semrush-orange text-white text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-2">
                                Most Popular
                            </span>
                        )}

                        <span className="text-label opacity-40 mb-12 block">{tier.name}</span>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-6xl font-serif italic">{tier.price === 'Custom' ? '' : '$'}{tier.price}</span>
                            {tier.price !== 'Custom' && <span className="text-sm font-light text-fashion-gray tracking-widest uppercase">/ Month</span>}
                        </div>

                        <p className="text-sm font-light text-fashion-gray h-16 italic mb-12">
                            {tier.description}
                        </p>

                        <div className="space-y-6 mb-16 flex-1">
                            {tier.features.map((feature, j) => (
                                <div key={j} className="flex items-center gap-4 group">
                                    <Check className="w-4 h-4 text-semrush-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/register"
                            className={`block w-full text-center py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${tier.featured
                                ? 'bg-black text-white hover:bg-semrush-orange hover:border-semrush-orange border border-black'
                                : 'border border-black text-black hover:bg-black hover:text-white'
                                }`}
                        >
                            Initiate Protocol
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Trust Quote */}
            <div className="mt-40 text-center max-w-2xl mx-auto border-t border-black/5 pt-20">
                <p className="text-2xl font-serif italic mb-8 leading-relaxed">
                    "RankMost isn't just a tool; it's the architectural foundation of our search presence."
                </p>
                <span className="text-label opacity-40">— The Gallery NYC</span>
            </div>
        </div>
    );
}
