"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface DecisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'destructive' | 'info';
}

export function DecisionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Proceed",
    variant = 'info'
}: DecisionModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white border border-black/10 max-w-lg w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden"
                    >
                        {/* Decorative Header Bar */}
                        <div className={`h-2 w-full ${variant === 'destructive' ? 'bg-red-500' : 'bg-semrush-orange'}`} />

                        <div className="p-12">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-fashion-light rounded-sm">
                                    {variant === 'destructive' ? (
                                        <ShieldAlert className="w-6 h-6 text-red-500" />
                                    ) : (
                                        <AlertTriangle className="w-6 h-6 text-semrush-orange" />
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-fashion-gray hover:text-black transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-3xl font-serif italic text-fashion-black mb-4">
                                {title}
                            </h3>
                            <p className="text-sm font-light leading-relaxed text-fashion-gray mb-12">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${variant === 'destructive'
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-black text-white hover:bg-semrush-orange'
                                        }`}
                                >
                                    {confirmLabel}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] border border-black/5 text-fashion-gray hover:text-black hover:bg-fashion-light transition-all text-center"
                                >
                                    Abort Action
                                </button>
                            </div>
                        </div>

                        {/* Aesthetic Footer Log */}
                        <div className="bg-fashion-light px-12 py-4 border-t border-black/5">
                            <div className="flex items-center gap-2 opacity-30 text-[8px] font-mono uppercase tracking-[0.2em]">
                                <span className="w-1 h-1 rounded-full bg-black animate-pulse" />
                                Authority Check Required
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
