"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 4000);
    }, []);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className="bg-white border border-black/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] p-6 flex items-start gap-4 relative overflow-hidden group">
                                {/* Accent Bar */}
                                <div className={`absolute top-0 left-0 w-[2px] h-full ${n.type === 'success' ? 'bg-green-500' :
                                        n.type === 'error' ? 'bg-red-500' :
                                            'bg-semrush-orange'
                                    }`} />

                                <div className="mt-1">
                                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                    {n.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    {n.type === 'info' && <Info className="w-4 h-4 text-semrush-orange" />}
                                </div>

                                <div className="flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-1">
                                        {n.type} Notification
                                    </p>
                                    <p className="text-sm font-serif italic text-fashion-black leading-relaxed">
                                        {n.message}
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeNotification(n.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-fashion-light rounded-sm"
                                >
                                    <X className="w-3 h-3 text-fashion-gray" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
