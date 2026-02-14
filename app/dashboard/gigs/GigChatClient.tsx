"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Zap, ArrowRight, Loader2, AlertCircle, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    attachment?: any; // The Optimized Gig Data
}

export default function GigChatClient() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            role: 'assistant',
            content: "**Gig Doctor Online.**\n\nI'm ready to operate. Paste your Fiverr Gig URL, and I'll tear it down and rebuild it for higher conversions.",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeAnalysis, setActiveAnalysis] = useState<any>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // CHECK FOR URL
        if (userMsg.content.includes('fiverr.com/')) {
            await handleAnalysis(userMsg.content);
        } else {
            await handleNormalChat(userMsg);
        }
    };

    const handleAnalysis = async (url: string) => {
        setIsAnalyzing(true);
        // Extract URL just in case there is text around it
        const urlMatch = url.match(/https?:\/\/[^\s]+/);
        const cleanUrl = urlMatch ? urlMatch[0] : url;

        try {
            // 1. Add temporary "Scouting" message
            setMessages(prev => [...prev, {
                id: 'system-scout',
                role: 'system',
                content: "🕵️ **Scouting Competitors...** Scanning top 10 ranking gigs in this niche...",
                timestamp: new Date()
            }]);

            // 2. Call Optimization API
            const res = await fetch('/api/optimize-fiverr-gig', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gig_url: cleanUrl })
            });

            if (!res.ok) throw new Error("Failed to analyze gig");

            const data = await res.json();
            const optimized = data.data;
            setActiveAnalysis(optimized);

            // 3. Add "Success" message with Attachment
            const reportMsg: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `**Analysis Complete.**\n\nI found ${data.data.competitionLevel} competition. Your old title was invisible. \n\nHere is your **Optimization Report**:`,
                timestamp: new Date(),
                attachment: optimized
            };

            setIsAnalyzing(false);
            setMessages(prev => prev.filter(m => m.id !== 'system-scout').concat(reportMsg));
            setIsTyping(false);

        } catch (error) {
            setIsAnalyzing(false);
            setIsTyping(false);
            setMessages(prev => prev.filter(m => m.id !== 'system-scout').concat({
                id: 'error',
                role: 'assistant',
                content: "❌ I couldn't access that link. Make sure it's a valid public Fiverr URL.",
                timestamp: new Date()
            }));
        }
    };

    const handleNormalChat = async (userMsg: Message) => {
        try {
            const res = await fetch('/api/chat/gig', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.concat(userMsg).map(m => ({ role: m.role, content: m.content })),
                    context: activeAnalysis
                })
            });

            const data = await res.json();

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleChipClick = (text: string) => {
        setInputValue(text);
        // Optional: Auto-send or just fill input
        // For smoother UX, let's auto-send
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        if (text.includes('fiverr.com/')) {
            handleAnalysis(text);
        } else {
            handleNormalChat(userMsg);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-fashion-light pl-0 md:pl-20 lg:pl-32 transition-all duration-300">
            {/* Header */}
            <div className="h-16 border-b border-black/5 bg-white/50 backdrop-blur flex items-center px-6 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-semrush-orange" />
                    </div>
                    <div>
                        <h1 className="font-serif italic font-bold text-lg leading-none">The Gig Doctor</h1>
                        <span className="text-[10px] uppercase tracking-widest text-semrush-orange font-bold">Marketplace Intelligence</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-2xl ${m.role === 'user'
                            ? 'bg-white border border-black/5 rounded-2xl rounded-tr-sm p-4 shadow-sm'
                            : m.role === 'system'
                                ? 'bg-transparent text-center w-full text-slate-400 text-sm italic'
                                : 'bg-black text-white rounded-2xl rounded-tl-sm p-5 shadow-xl'
                            }`}>
                            {m.role !== 'system' && (
                                <div className="prose prose-sm md:prose-base max-w-none break-words">
                                    <ReactMarkdown
                                        components={{
                                            p: ({ node, ...props }) => <p className={m.role === 'user' ? 'text-slate-800' : 'text-slate-200'} {...props} />,
                                            strong: ({ node, ...props }) => <strong className={m.role === 'user' ? 'text-black font-bold' : 'text-semrush-orange font-bold'} {...props} />,
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {m.role === 'system' && (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{m.content}</span>
                                </div>
                            )}

                            {/* ATTACHMENT: OPTIMIZED GIG CARD */}
                            {m.attachment && <OptimizedGigCard data={m.attachment} />}
                        </div>
                    </div>
                ))}

                {/* SUGGESTION CHIPS (Only show if last message is from Assistant) */}
                {messages[messages.length - 1].role === 'assistant' && !isTyping && !isAnalyzing && (
                    <div className="flex flex-wrap gap-2 ml-2">
                        <button onClick={() => handleChipClick("Simulate a scaling journey for a detailed Logo Designer")} className="text-xs bg-white border border-black/10 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-colors">
                            📈 Simulate Scaling Journey
                        </button>
                        <button onClick={() => handleChipClick("How do I get my first 5 orders?")} className="text-xs bg-white border border-black/10 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-colors">
                            🚀 Get First 5 Orders
                        </button>
                        <button onClick={() => handleChipClick("Analyze this demo: https://www.fiverr.com/demo/gig")} className="text-xs bg-white border border-black/10 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-colors">
                            🔍 Analyze Demo Gig
                        </button>
                    </div>
                )}

                {isTyping && !isAnalyzing && (
                    <div className="flex justify-start">
                        <div className="bg-black/80 rounded-full px-4 py-2 flex gap-1">
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-white rounded-full" />
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>


            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white border-t border-black/5">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Paste a Fiverr URL or ask me anything..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-5 pr-14 outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all font-medium"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Powered by RankMost Intelligence
                </div>
            </div>
        </div>
    );
}

function OptimizedGigCard({ data }: { data: any }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`TITLE: ${data.title}\n\nDESCRIPTION:\n${data.description}\n\nTAGS: ${data.tags.join(', ')}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-4 bg-white/10 border border-white/20 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="bg-semrush-orange/10 p-3 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-semrush-orange" />
                    <span className="text-xs font-bold text-semrush-orange uppercase tracking-wider">Optimized Asset</span>
                </div>
                <button onClick={handleCopy} className="text-white/60 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <span className="text-[10px] text-white/50 uppercase font-bold">New Title</span>
                    <h3 className="text-white font-bold leading-tight mt-1">{data.title}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded">
                        <span className="text-[10px] text-white/50 uppercase font-bold block">Tags</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {data.tags.slice(0, 3).map((t: string, i: number) => (
                                <span key={i} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">{t}</span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-black/40 p-2 rounded">
                        <span className="text-[10px] text-white/50 uppercase font-bold block">Neuro-Hooks</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {data.improvements && data.improvements.slice(0, 2).map((t: string, i: number) => (
                                <span key={i} className="text-[10px] text-green-300 block">• {t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
