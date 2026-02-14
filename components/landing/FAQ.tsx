"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        q: "How does this differ from standard enterprise platforms?",
        a: "Most tools are generalist platforms designed for everyone. RankMost is precision-engineered for Service Businesses and Fiverr Sellers. We strip away the enterprise bloat and focus 100% on the metrics that drive service revenue: Local POV, Gig Rankings, and Automated Technical Fixes."
    },
    {
        q: "Do I need technical SEO knowledge?",
        a: "Zero. That is the purpose of our 'Auto-Fix Engine'. The system diagnoses the issue (e.g., 'Missing Schema') and generates the exact code or solution for you to copy-paste. It acts as your technical lead."
    },
    {
        q: "Can I track Fiverr Gig rankings?",
        a: "Yes. We are the only platform with a dedicated 'Gig Rank Tracker' that monitors your position in specific Fiverr categories and search terms, alerting you to market movements daily."
    },
    {
        q: "Is there a contract?",
        a: "Never. Access is granted on a monthly basis. You serve at the pleasure of your own growth. Cancel anytime with a single click."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-40 bg-fashion-light">
            <div className="couture-container">
                <div className="mb-20">
                    <span className="text-label text-semrush-orange">Inquiries</span>
                    <h2 className="text-display-large font-serif italic mt-4">Common Questions</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 lg:col-start-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border-b border-black/10">
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full py-10 flex justify-between items-center text-left hover:text-semrush-orange transition-colors"
                                >
                                    <span className="text-2xl md:text-3xl font-serif italic pr-8">{faq.q}</span>
                                    <span className="shrink-0 text-fashion-navy">
                                        {openIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-10 text-lg font-light text-fashion-gray leading-relaxed max-w-2xl">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
