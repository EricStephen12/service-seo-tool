"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Paperclip, Minimize2, Maximize2, X, ArrowUpRight, Activity, Globe, Shield, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ReportCard from '@/components/chat/ReportCard';

interface DossierData {
    id: string;
    health: number;
    authority: string | number;
    rankings: any[];
    problems: any[];
    [key: string]: any;
}

interface Message {
    id: string;
    role: 'system' | 'user' | 'assistant';
    content: string;
    avg_wpm?: number;
    timestamp: Date;
    attachments?: MessageAttachment[];
}

interface MessageAttachment {
    type: 'report_card';
    data: any;
}


export default function ProjectChatClient({ domain, data }: { domain: string, data: DossierData }) {
    // State
    // If we have history, use it. Otherwise, wait for the useEffect to trigger the first audit.
    const [messages, setMessages] = useState<Message[]>(data.chatHistory || []);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const hasInitialized = useRef(false);

    // Initial "Briefing" from RankMost (The Audit Report)
    useEffect(() => {
        // We trigger this only on first load
        if (messages.length > 0 || hasInitialized.current) return;

        hasInitialized.current = true;

        // Use the AI-generated report if available (The "Assignment" / Deep Analysis)
        // Otherwise fallback to the generic greeting
        const content = data.reportMarkdown || `**Protocol Initiated: ${domain}**\n\nI have completed the deep-scan of your digital perimeter. \n\nI detected **${data.problems.filter(p => p.severity === 'high').length} critical faults** that are preventing you from dominating the local index.\n\nHere is your **Executive Summary**:`;

        const briefingMessage: Message = {
            id: 'init-audit-1',
            role: 'assistant',
            content: content,
            timestamp: new Date(),
            attachments: [{
                type: 'report_card',
                data: data
            }]
        };

        // Small delay to simulate "connection"
        setTimeout(async () => {
            setMessages([briefingMessage]);

            // Persist this initial message to the database
            try {
                await fetch('/api/chat/persist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        websiteId: data.id,
                        role: briefingMessage.role,
                        content: briefingMessage.content,
                        metadata: { attachments: briefingMessage.attachments }
                    })
                });
            } catch (err) {
                console.error("Failed to save briefing:", err);
            }
        }, 800);
    }, [data, domain]); // Removed messages dependency to avoid loops, explicit check inside

    // Scroll to bottom effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleSendMessage = async (overrideContent?: string) => {
        const contentToSend = overrideContent || inputValue;
        if (!contentToSend.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: contentToSend.trim(),
            timestamp: new Date()
        };

        const currentMessages = [...messages, newUserMsg];
        setMessages(currentMessages);
        setInputValue('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
                    context: {
                        id: data.id,
                        domain,
                        health: data.health,
                        authority: data.authority,
                        problems: data.problems,
                        rankings: data.rankings,
                        keywords: data.keywords
                    }
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            if (!response.body) throw new Error('No response body');

            const responseData = await response.json();
            const assistantMessage = responseData.message;

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: assistantMessage,
                timestamp: new Date()
            }]);

            setIsTyping(false);

        } catch (error) {
            console.error('Chat Error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "**Connection Error**: I lost connection to the intelligence node. Please try again.",
                timestamp: new Date()
            }]);
        }

    };

    // Thinking Steps Logic
    const [thinkingStep, setThinkingStep] = useState(0);
    const thinkingSteps = [
        "Analyzing your input...",
        "Scanning live competitors...",
        "Running Vision Model on homepage...",
        "Checking Trust Signals...",
        "Applying 7-Phase Diagnostic...",
        " drafting verdict..."
    ];

    useEffect(() => {
        if (!isTyping) {
            setThinkingStep(0);
            return;
        }

        const interval = setInterval(() => {
            setThinkingStep((prev) => (prev + 1) % thinkingSteps.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [isTyping]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-fashion-light text-fashion-black font-sans overflow-hidden">
            {/* Header / Top Bar */}
            <header className="flex-none px-6 py-4 md:px-12 md:py-6 border-b border-black/5 bg-white/50 backdrop-blur-md z-10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                        <span className="font-serif italic font-bold text-xl">R</span>
                    </div>
                    <div>
                        <h1 className="font-serif italic text-lg leading-none">RankMost</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[9px] uppercase tracking-widest opacity-40">Online • Senior Consultant</span>
                        </div>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Active Session</p>
                    <p className="font-serif italic text-sm">{domain}</p>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-8 pb-12">
                    {messages.map((msg, idx) => (
                        <div key={msg.id} className="space-y-2">
                            <div className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`flex-none w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs border ${msg.role === 'assistant'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-fashion-gray border-black/10'
                                    }`}>
                                    {msg.role === 'assistant' ? <span className="font-serif italic">R</span> : <User size={14} />}
                                </div>

                                {/* Bubble */}
                                <div className={`flex-1 max-w-[90%] md:max-w-2xl group`}>
                                    <div className={`relative px-4 py-3 md:px-8 md:py-6 text-sm md:text-base leading-relaxed break-words shadow-sm ${msg.role === 'user'
                                        ? 'bg-white text-fashion-black border border-black/5 rounded-2xl rounded-tr-sm'
                                        : 'bg-blue-50 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-blue-100'
                                        }`}>
                                        {msg.role === 'assistant' ? (
                                            <div className="prose prose-p:leading-relaxed prose-headings:font-serif prose-headings:italic prose-a:text-blue-600 max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        // Code blocks
                                                        code: ({ node, inline, className, children, ...props }: any) => {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return !inline ? (
                                                                <div className="relative group my-4 rounded-lg overflow-hidden bg-[#1e293b] border border-blue-900/10 text-white">
                                                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <span className="text-[10px] text-white/40 uppercase tracking-wider">{match ? match[1] : 'code'}</span>
                                                                    </div>
                                                                    <code className={`${className} block p-4 text-sm font-mono overflow-x-auto`} {...props}>
                                                                        {children}
                                                                    </code>
                                                                </div>
                                                            ) : (
                                                                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-mono text-xs border border-blue-200" {...props}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        },
                                                        // Headers
                                                        h1: ({ node, ...props }) => <h1 className="text-xl font-serif italic mb-4 mt-6 text-slate-900" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-5 text-slate-800" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2 mt-4 text-slate-800" {...props} />,
                                                        // Blockquotes
                                                        blockquote: ({ node, ...props }: any) => (
                                                            <div className="my-6 pl-4 border-l-2 border-blue-500 bg-white p-4 rounded-r-lg shadow-sm border border-blue-100">
                                                                <blockquote className="not-italic text-slate-700" {...props} />
                                                            </div>
                                                        ),
                                                        // Lists
                                                        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 space-y-1 my-4 text-slate-700" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-4 space-y-1 my-4 text-slate-700" {...props} />,
                                                        // Links
                                                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline decoration-1 underline-offset-2 font-medium" {...props} />,
                                                        // Paragraphs
                                                        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-slate-700 last:mb-0" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p>{msg.content}</p>
                                        )}

                                        {/* Timestamp */}
                                        <span className={`absolute bottom-2 right-4 text-[9px] uppercase tracking-widest opacity-30 ${msg.role === 'assistant' ? 'text-slate-500' : 'text-black'
                                            }`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* ATTACHMENTS */}
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="mt-2 text-left">
                                            {msg.attachments.map((att, i) => (
                                                att.type === 'report_card' && <ReportCard key={i} data={att.data} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Thinking Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 md:gap-6"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black text-white flex items-center justify-center border border-black animate-pulse">
                                <span className="font-serif italic text-xs">R</span>
                            </div>
                            <div className="bg-blue-50 px-6 py-4 rounded-2xl rounded-tl-sm flex flex-col gap-2 shadow-sm border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-blue-400 animate-pulse">
                                    {thinkingSteps[thinkingStep]}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main >

            {/* Input Area */}
            < footer className="flex-none bg-white border-t border-black/5 p-4 md:p-8" >
                <div className="max-w-3xl mx-auto relative">
                    {/* Suggestion Chips */}
                    {messages.length < 3 && (
                        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {[
                                "Fix my top critical error",
                                "Who are my main competitors?",
                                "Explain my Authority Score",
                                "Draft a blog post to rank higher"
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="whitespace-nowrap px-4 py-2 bg-white border border-black/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm flex-none"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-end gap-2 bg-fashion-light border border-black/10 rounded-xl p-2 transition-all focus-within:ring-1 focus-within:ring-black/20 focus-within:border-black/20 shadow-inner">
                        <button className="p-3 text-fashion-gray hover:text-fashion-black transition-colors rounded-lg hover:bg-black/5">
                            <Paperclip size={18} />
                        </button>

                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask RankMost anything..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 text-fashion-black placeholder:text-fashion-gray/50 max-h-32 text-sm md:text-base scrollbar-hide"
                            rows={1}
                        />

                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isTyping}
                            className={`p-3 rounded-lg transition-all duration-200 ${inputValue.trim()
                                ? 'bg-black text-white hover:bg-semrush-orange'
                                : 'bg-black/5 text-fashion-gray cursor-not-allowed'
                                }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <div className="text-center mt-3">
                        <p className="text-[9px] uppercase tracking-widest text-fashion-gray opacity-40">
                            RankMost Brain v2.0 • Context Window: 15k Tokens • {domain}
                        </p>
                    </div>
                </div>
            </footer >
        </div >
    );
}
