"use client";

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';

const tiers = [
    {
        name: "The Clinical",
        price: "3",
        description: "Surgical precision for your flagship domain.",
        features: [
            "1 Active Website Audit",
            "AI Correction Engine",
            "Trust Signal Validation",
            "Metadata Surgical Fixes",
            "Mobile Ready Check"
        ]
    },
    {
        name: "The Surgical",
        price: "12",
        description: "Elite intelligence for growing digital portfolios.",
        featured: true,
        features: [
            "5 Active Website Audits",
            "Deep Rival Recon",
            "Keyword Discovery Suite",
            "Priority Audit Speed",
            "Weekly Health Snapshots"
        ]
    },
    {
        name: "The Intelligence",
        price: "49",
        description: "Full scale intelligence for modern digital estates.",
        features: [
            "50 Active Projects",
            "White-label Reports",
            "Custom Schema Modeling",
            "Link Architecture Audit",
            "24/7 Security Monitoring"
        ]
    }
];

export default function PricingPage() {
    const { data: session } = useSession();

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
                            <span className="text-6xl font-serif italic">${tier.price}</span>
                            <span className="text-sm font-light text-fashion-gray tracking-widest uppercase">/ Month</span>
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

                        <button
                            onClick={() => {
                                if (!session) {
                                    window.location.href = '/register';
                                } else {
                                    alert(`Initializing ${tier.name} Protocol... Transferring to Secure Checkout.`);
                                    window.location.href = '/dashboard/settings';
                                }
                            }}
                            className={`block w-full text-center py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${tier.featured
                                ? 'bg-black text-white hover:bg-semrush-orange hover:border-semrush-orange border border-black'
                                : 'border border-black text-black hover:bg-black hover:text-white'
                                }`}
                        >
                            {session ? 'Initialize Protocol' : 'Initiate Protocol'}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Trust Quote */}
            <div className="mt-40 text-center max-w-2xl mx-auto border-t border-black/5 pt-20">
                <p className="text-2xl font-serif italic mb-8 leading-relaxed">
                    "Exricx SEO isn't just a tool; it's the architectural foundation of our search presence."
                </p>
                <span className="text-label opacity-40">— The Gallery NYC</span>
            </div>
        </div>
    );
}
