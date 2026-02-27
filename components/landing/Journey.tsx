"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
    {
        id: "01",
        title: "The Diagnosis",
        subtitle: "Identification",
        desc: "We find the cracks. Every broken link, slow page, and missing keyword that’s costing you customers.",
        detail: "50+ Technical Checks",
        image: "/journey_step_01_diagnosis_1770894091568.png"
    },
    {
        id: "02",
        title: "The Correction",
        subtitle: "Optimization",
        desc: "We fix them. Our AI doesn't just point at problems; it generates the exact solution, making your site as fast and clean as a flagship store.",
        detail: "AI Auto-Fix Engine",
        image: "/journey_step_02_correction_1770894116848.png"
    },
    {
        id: "03",
        title: "The Ascension",
        subtitle: "Domination",
        desc: "You rise. Watch your authority climb as your technical health score stabilizes. No more guessing—just pure, clinical growth.",
        detail: "Continuous Health Monitoring",
        image: "/journey_step_03_ascension_1770894136411.png"
    }
];

function JourneyStep({ step, index }: { step: typeof steps[0], index: number }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [2, -2]);

    return (
        <div ref={containerRef} className="min-h-screen flex items-center border-b border-fashion-navy/5 sticky top-0 bg-white overflow-hidden">
            <div className="couture-container w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative py-20 lg:py-0">

                {/* Floating Visual Asset */}
                <motion.div
                    style={{ y, rotate }}
                    className={`absolute w-[280px] h-[400px] md:w-[400px] md:h-[550px] z-0 opacity-10 md:opacity-100 ${index % 2 === 0 ? 'right-0 -mr-16 md:-mr-20' : 'left-0 -ml-16 md:-ml-20'}`}
                >
                    <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out">
                        <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover shadow-2xl border border-fashion-navy/10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                    </div>
                </motion.div>

                <div className="lg:col-span-4 relative z-10">
                    <span className="text-display-giant font-serif italic opacity-10 leading-none block">
                        {step.id}
                    </span>
                    <span className="text-label text-semrush-orange ml-2 tracking-widest">{step.subtitle}</span>
                </div>

                <div className="lg:col-span-6 lg:col-start-6 relative z-10">
                    <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-7xl font-serif text-fashion-navy mb-12"
                    >
                        {step.title}
                    </motion.h3>
                    <p className="text-xl md:text-2xl font-light text-fashion-gray leading-relaxed max-w-2xl mb-12">
                        {step.desc}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] w-12 bg-fashion-navy" />
                        <span className="text-label text-fashion-navy">{step.detail}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Journey() {
    return (
        <section className="relative">
            <div className="py-20 text-center bg-fashion-light">
                <span className="text-label">The Protocol</span>
                <h2 className="text-4xl font-serif italic mt-4">Your Path to Authority</h2>
            </div>

            {steps.map((step, i) => (
                <JourneyStep key={i} step={step} index={i} />
            ))}
        </section>
    );
}
