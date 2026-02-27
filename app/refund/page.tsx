"use client";

import { Masthead } from "@/components/landing/Masthead";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function RefundPage() {
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
                        <span className="text-label text-semrush-orange mb-4 block">Policy</span>
                        <h1 className="text-5xl md:text-7xl font-serif italic text-fashion-navy mb-12">Refund Policy.</h1>

                        <div className="prose prose-lg font-light text-fashion-gray space-y-8">
                            <p>
                                We provide surgical technical audits. Our commitment is to the accuracy and actionable nature of our intelligence.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">1. Digital Nature</h2>
                            <p>
                                Due to the immediate delivery of digital intelligence (audits, technical fix engine protocols, and keyword data), we generally do not offer refunds once an audit has been successfully generated.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">2. Satisfaction Guarantee</h2>
                            <p>
                                If our system fails to provide a report or if there is a verified technical error in the data delivery, please contact our support team. We will either fix the error or provide a credit to your account.
                            </p>

                            <h2 className="text-2xl font-serif italic text-fashion-navy mt-12 mb-4">3. Subscriptions</h2>
                            <p>
                                Recurring subscriptions can be canceled at any time via your dashboard. Cancellation will stop future billings, but previous payments for used periods are non-refundable.
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
