"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BarChart2, Globe, Settings, Plus, LogOut, Grid, Zap } from 'lucide-react';

const menuItems = [
    { icon: Grid, label: "Projects", href: "/dashboard" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: LogOut, label: "Billing", href: "/pricing" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.aside
            initial={{ width: "5rem" }}
            animate={{ width: isHovered ? "16rem" : "5rem" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed left-0 top-0 h-screen bg-fashion-navy text-white z-50 hidden md:flex flex-col items-center py-12 overflow-hidden border-r border-white/5 shadow-2xl"
        >
            {/* Brand Monogram */}
            <div className="mb-20 w-full flex items-center justify-center relative px-6">
                <Link href="/" className="font-serif italic text-2xl font-bold tracking-tighter absolute left-6 transition-all duration-300">
                    RM.
                </Link>
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                    className="ml-12 font-serif font-light tracking-widest text-xs whitespace-nowrap"
                >
                    EXRICX SEO INTELLIGENCE
                </motion.span>
            </div>

            {/* Navigation Rail */}
            <nav className="flex-1 w-full px-4 space-y-4">
                {menuItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={i} href={item.href} className="flex items-center group relative p-3 rounded-lg overflow-hidden">
                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className="relative z-10 flex items-center w-full">
                                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-semrush-orange' : 'text-white/40 group-hover:text-white'}`} strokeWidth={1.5} />

                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                                    transition={{ duration: 0.3 }}
                                    className={`ml-6 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}
                                >
                                    {item.label}
                                </motion.span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Action Footer */}
            <div className="w-full px-4 mt-auto">
                <button className="flex items-center w-full p-3 group hover:bg-semrush-orange/10 rounded-lg transition-colors">
                    <Plus className="w-5 h-5 text-semrush-orange shrink-0" strokeWidth={1.5} />
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                        className="ml-6 text-[10px] font-bold uppercase tracking-[0.2em] text-semrush-orange whitespace-nowrap"
                    >
                        New Project
                    </motion.span>
                </button>
            </div>
        </motion.aside>
    );
}
