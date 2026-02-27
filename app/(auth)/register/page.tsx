"use client";

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to register');
            }

            // Immediately sign in after registration
            const loginRes = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (loginRes?.error) {
                router.push('/login'); // Should not happen ideally
            } else {
                router.push('/dashboard');
                router.refresh();
            }

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">

            {/* INTERFACE COLUMN (Left) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative order-2 lg:order-1">

                {/* Mobile Background Ambience */}
                <div className="lg:hidden absolute inset-0 bg-fashion-light z-0" />

                <div className="w-full max-w-md relative z-10 bg-white lg:bg-transparent p-8 rounded-2xl lg:p-0 shadow-xl lg:shadow-none">

                    <div className="mb-12 text-center lg:text-left">
                        <Link href="/" className="font-serif italic font-bold text-2xl tracking-tighter mb-8 block lg:hidden">
                            Exricx SEO.
                        </Link>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-semrush-orange mb-2 block">Application Protocol</span>
                        <h2 className="text-4xl font-serif italic text-fashion-black">Join the Agency</h2>
                    </div>

                    <div className="space-y-6">

                        {/* Traditional Form */}
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide border border-red-200">
                                    {error}
                                </div>
                            )}
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-2 group-focus-within:text-black transition-colors">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-b border-black/10 py-2 text-lg font-serif outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/20"
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-2 group-focus-within:text-black transition-colors">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full border-b border-black/10 py-2 text-lg font-serif outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/20"
                                    placeholder="editor@exricx.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-2 group-focus-within:text-black transition-colors">
                                    Set Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full border-b border-black/10 py-2 text-lg font-serif outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/20"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-semrush-orange transition-colors shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Submit Application'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-fashion-gray font-light">
                            Already an agent?{' '}
                            <Link href="/login" className="underline decoration-1 underline-offset-4 hover:text-black transition-colors">
                                Access Terminal
                            </Link>
                        </p>

                    </div>
                </div>
            </div>

            {/* EDITORIAL COLUMN (Right) - Desktop Only */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-fashion-black text-white items-center justify-center overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 mix-blend-overlay" />
                <div className="relative z-10 p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.4em] mb-4 block">New Membership</span>
                        <h1 className="text-display-large font-serif italic mb-6">Ascend.</h1>
                        <p className="font-light text-xl opacity-80 max-w-md mx-auto leading-relaxed">
                            "Data is the new haute couture."<br />
                            Begin your journey to digital dominance.
                        </p>
                    </motion.div>
                </div>
            </div>

        </div>
    );
}
