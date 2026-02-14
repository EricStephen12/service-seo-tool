"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export function TheInvitation() {
    return (
        <section className="py-60 bg-fashion-navy text-white relative overflow-hidden">
            <div className="couture-container relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <span className="text-semrush-orange font-bold uppercase tracking-[0.4em] text-[10px] mb-12 block">
                        The Invitation
                    </span>
                    <h2 className="text-display-giant font-serif italic mb-20 leading-[0.8]">
                        Command <br />
                        Your Market.
                    </h2>

                    <div className="flex flex-col items-center gap-12">
                        <Link
                            href="/dashboard"
                            className="btn-couture bg-white text-black border-white hover:bg-semrush-orange hover:text-white hover:border-semrush-orange px-20 py-6"
                        >
                            Accept Access
                        </Link>
                        <p className="text-[10px] font-bold tracking-[0.5em] opacity-30 uppercase">
                            Limited Availability for 2026
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Abstract Background Element */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-white opacity-[0.02] rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
}
