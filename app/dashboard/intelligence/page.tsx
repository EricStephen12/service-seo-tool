"use client";

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Globe, Zap, Activity } from 'lucide-react';

const marketMovers = [
    { domain: "competitor-a.com", delta: "+12", rank: 4, status: "volatile" },
    { domain: "nyc-plumbing-kings.com", delta: "-3", rank: 15, status: "stable" },
    { domain: "elite-services.net", delta: "+5", rank: 2, status: "surging" },
    { domain: "budget-fixes.org", delta: "-8", rank: 45, status: "dropping" },
];

const volatility = [
    { sector: "Plumbing", score: "High", value: 8.4 },
    { sector: "Legal", score: "Low", value: 2.1 },
    { sector: "Medical", score: "Med", value: 5.6 },
];

export default function IntelligencePage() {
    return (
        <div className="min-h-screen bg-fashion-light pl-24 pr-8 py-12 md:pl-32 md:pr-12 md:py-20">

            {/* Header */}
            <div className="flex justify-between items-end mb-20 border-b border-black/5 pb-8">
                <div>
                    <span className="text-label text-semrush-orange">Global Data</span>
                    <h1 className="text-5xl md:text-6xl font-serif italic mt-4 text-fashion-black">
                        Market Intelligence
                    </h1>
                </div>
                <div className="hidden md:flex gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-serif">24h</span>
                        <span className="text-label text-fashion-gray">Timeframe</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-serif text-semrush-orange">High</span>
                        <span className="text-label text-fashion-gray">Volatility</span>
                    </div>
                </div>
            </div>

            {/* Volatility Ticker */}
            <div className="mb-20">
                <h3 className="text-label mb-8">Sector Volatility Index</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {volatility.map((v, i) => (
                        <div key={i} className="bg-white p-8 border-l-2 border-black/10 flex justify-between items-center group hover:border-semrush-orange transition-colors">
                            <div>
                                <span className="text-2xl font-serif italic block mb-1">{v.sector}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${v.score === 'High' ? 'text-semrush-orange' : 'text-fashion-gray'}`}>
                                    {v.score} Risk
                                </span>
                            </div>
                            <span className="text-4xl font-light opacity-20 group-hover:opacity-100 transition-opacity">{v.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Market Movers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gainers/Losers List as 'Fashion Spec Sheet' */}
                <div className="bg-white p-12 shadow-sm">
                    <div className="flex justify-between items-center mb-12">
                        <h3 className="text-2xl font-serif italic">Movement Ledger</h3>
                        <Activity className="w-5 h-5 text-semrush-orange" />
                    </div>

                    <div className="space-y-6">
                        {marketMovers.map((mover, i) => (
                            <div key={i} className="flex justify-between items-center pb-6 border-b border-black/5 group hover:pl-4 transition-all duration-300 cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold uppercase text-fashion-gray w-8">0{i + 1}</span>
                                    <span className="font-serif text-lg group-hover:text-semrush-orange transition-colors">{mover.domain}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-bold">{mover.rank}</span>
                                    <div className={`flex items-center gap-1 text-xs font-bold w-16 justify-end ${mover.delta.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                        {mover.delta.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                        {mover.delta}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 'Global Map' Placeholder - Styled as abstract art */}
                <div className="bg-black text-white p-12 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,100,45,0.2)_0%,transparent_50%)]" />

                    <div className="relative z-10">
                        <span className="text-label text-semrush-orange mb-2 block">Global Sensor</span>
                        <h3 className="text-4xl font-serif italic">Network Status</h3>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-8 mt-12">
                        <div>
                            <span className="text-3xl font-light block mb-2">98.4%</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-60">Crawl Success</span>
                        </div>
                        <div>
                            <span className="text-3xl font-light block mb-2">12ms</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-60">Latency</span>
                        </div>
                    </div>

                    {/* Abstract Map Dots */}
                    <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20">
                        <Globe className="w-full h-full stroke-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
