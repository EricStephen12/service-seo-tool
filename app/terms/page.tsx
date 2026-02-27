"use client";

import { Masthead } from "@/components/landing/Masthead";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function TermsPage() {
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
                        <span className="text-label text-semrush-orange mb-4 block">Agreement</span>
                        <h1 className="text-5xl md:text-7xl font-serif italic text-fashion-navy mb-12">Terms of Service.</h1>

                        <div className="prose prose-lg font-light text-fashion-gray space-y-8">
                            <p>
                                By accessing Exricx SEO, you agree to the protocols and standards of our digital intelligence suite.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">1. Use of Service</h2>
                            <p>
                                You agree to use this platform only for auditing websites you own or have explicit permission to audit. Automated crawling of our platform is strictly prohibited.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">2. Intellectual Property</h2>
                            <p>
                                All AI-generated protocols, audit structures, and the "Veteran Protocol" logic are the exclusive intellectual property of Exricx SEO. You are granted a limited license to use the generated reports for your internal SEO improvements.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">3. Limitation of Liability</h2>
                            <p>
                                Exricx SEO provides technical recommendations. While our "Auto-Fix Engine" is high-precision, we are not liable for direct, indirect, or incidental damages resulting from the implementation of these recommendations. Always verify code changes in a staging environment.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">4. Termination</h2>
                            <p>
                                We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior towards our systems.
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
