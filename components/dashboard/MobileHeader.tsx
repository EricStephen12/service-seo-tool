"use client";

import Link from 'next/link';
import { Menu, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: "Projects", href: "/dashboard" },
        { label: "Gig Optimizer", href: "/dashboard/gigs" },
        { label: "Intelligence", href: "/dashboard/intelligence" },
        { label: "Rankings", href: "/dashboard/rankings" },
        { label: "Settings", href: "/dashboard/settings" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-fashion-navy text-white z-[70] flex md:hidden items-center justify-between px-6 border-b border-white/5">
            <Link href="/" className="font-serif italic text-xl font-bold tracking-tighter">
                RM.
            </Link>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 text-white/60 hover:text-white transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-16 left-0 right-0 bg-fashion-navy border-b border-white/10 shadow-2xl py-8 px-6 space-y-6"
                    >
                        <nav className="flex flex-col gap-6">
                            {menuItems.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="pt-6 border-t border-white/5">
                            <button className="flex items-center gap-4 text-semrush-orange">
                                <Zap className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">New Protocol</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
