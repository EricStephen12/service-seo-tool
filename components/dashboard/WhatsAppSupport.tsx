"use client";

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WhatsAppSupport() {
    const phoneNumber = "2348000000000"; // Placeholder: User should update this
    const message = "Hello Exricx SEO Support, I need help with my audit.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
            title="Chat with a Veteran"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest">
                Support
            </span>
        </motion.a>
    );
}
