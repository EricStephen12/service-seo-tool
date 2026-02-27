"use client";

import { Masthead } from "@/components/landing/Masthead";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <main className="bg-white min-h-screen">
            <Masthead />

            <section className="pt-40 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-label text-semrush-orange mb-4 block">Legal</span>
                        <h1 className="text-5xl md:text-7xl font-serif italic text-fashion-navy mb-12">Privacy Policy.</h1>

                        <div className="prose prose-lg font-light text-fashion-gray space-y-8">
                            <p>
                                At Exricx SEO, we treat your data with the same clinical precision as our audits. Your trust is the foundation of our intelligence suite.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">1. Data Collection</h2>
                            <p>
                                We collect only what is necessary to perform surgical SEO audits:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Account information (Email, Name) via Google or Email registration.</li>
                                <li>Website URLs provided for analysis.</li>
                                <li>Publicly available technical metadata from the domains you audit.</li>
                            </ul>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">2. Usage of Information</h2>
                            <p>
                                Your data is used exclusively to generate technical reports, track search visibility, and provide AI-driven correction protocols. We do not sell your data to third-party marketing firms.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">3. Security Protcols</h2>
                            <p>
                                All sensitive data is encrypted. We use industry-standard security measures to protect your account and audit history from unauthorized access.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">4. Updates</h2>
                            <p>
                                This policy may be updated as our intelligence suite evolves. Significant changes will be communicated via your registered email.
                            </p>

                            <p className="pt-12 text-sm italic opacity-50">
                                Last updated: February 2026
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
