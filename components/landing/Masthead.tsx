"use client";

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export function Masthead() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-black/5 h-20 flex items-center"
        >
            <div className="couture-container w-full flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="font-serif italic font-bold text-3xl tracking-tighter hover:text-semrush-orange transition-colors">
                        Exricx SEO.
                    </Link>
                    <div className="hidden md:flex gap-8">
                        <Link href="#protocol" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-semrush-orange transition-colors">The Protocol</Link>
                        <Link href="/pricing" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-semrush-orange transition-colors">Pricing</Link>
                        <Link href="#evidence" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-semrush-orange transition-colors">Evidence</Link>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <Link href="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-semrush-orange transition-colors">Sign In</Link>
                    <Link href="/dashboard" className="px-6 py-3 bg-fashion-navy text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-semrush-orange transition-colors border border-fashion-navy hover:border-semrush-orange">
                        Start
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
