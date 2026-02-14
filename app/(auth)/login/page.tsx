"use client";

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignInPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGoogle = () => {
        setLoading(true);
        signIn('google', { callbackUrl: '/dashboard' });
    };

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Please try again.");
                setLoading(false);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">

            {/* EDITORIAL COLUMN (Left) - Desktop Only */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-fashion-navy text-white items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 mix-blend-overlay" />
                <div className="relative z-10 p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.4em] mb-4 block">The Agency</span>
                        <h1 className="text-display-large font-serif italic mb-6">RankMost.</h1>
                        <p className="font-light text-xl opacity-80 max-w-md mx-auto leading-relaxed">
                            "Intelligence is the ultimate luxury."<br />
                            Access your dashboard to view the latest market movements.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* INTERFACE COLUMN (Right) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">

                {/* Mobile Background Ambience */}
                <div className="lg:hidden absolute inset-0 bg-fashion-light z-0" />

                <div className="w-full max-w-md relative z-10 bg-white lg:bg-transparent p-8 rounded-2xl lg:p-0 shadow-xl lg:shadow-none">

                    <div className="mb-12 text-center lg:text-left">
                        <Link href="/" className="font-serif italic font-bold text-2xl tracking-tighter mb-8 block lg:hidden">
                            RankMost.
                        </Link>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-semrush-orange mb-2 block">Restricted Access</span>
                        <h2 className="text-4xl font-serif italic text-fashion-black">Member Login</h2>
                    </div>

                    <div className="space-y-6">

                        {/* Social Login */}
                        <button
                            onClick={handleGoogle}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 border border-black/10 hover:border-black hover:bg-fashion-light transition-all duration-300 rounded-none group"
                        >
                            <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-widest">Continue with Google</span>
                        </button>

                        <div className="flex items-center gap-4 opacity-50 my-8">
                            <div className="h-[1px] bg-black/20 flex-1" />
                            <span className="text-[10px] uppercase">Or via Email</span>
                            <div className="h-[1px] bg-black/20 flex-1" />
                        </div>

                        {/* Traditional Form */}
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide border border-red-200">
                                    {error}
                                </div>
                            )}
                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-2 group-focus-within:text-black transition-colors">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full border-b border-black/10 py-2 text-lg font-serif outline-none focus:border-black transition-colors bg-transparent placeholder:text-black/20"
                                    placeholder="editor@rankmost.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-2 group-focus-within:text-black transition-colors">
                                    Password
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
                                className="w-full bg-fashion-navy text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-semrush-orange transition-colors shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Authenticating...' : 'Authenticate'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-fashion-gray font-light">
                            Not on the list?{' '}
                            <Link href="/register" className="underline decoration-1 underline-offset-4 hover:text-black transition-colors">
                                Apply for Access
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
