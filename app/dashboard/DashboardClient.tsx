"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Activity, Terminal, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { DecisionModal } from '@/components/ui/DecisionModal';

interface Project {
    id: string;
    domain: string;
    grade: string;
    rank: string;
    issues: number;
    createdAt: string;
}

const statusMessages = [
    "[SYSTEM] Initializing secure handshake...",
    "[SCANNER] Connection established to target...",
    "[SPY] Identifying top competitor in search index...",
    "[CRAWLER] Extracting metadata from target...",
    "[VISION] 📸 Capturing hero image for analysis...",
    "[BRAIN] Calculating Trust Score (Phase 2)...",
    "[VERDICT] Audit complete. access_granted."
];

export function DashboardClient({ initialProjects }: { initialProjects: Project[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showNotification } = useNotification();
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [statusIndex, setStatusIndex] = useState(0);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<{ domain: string, id: string } | null>(null);

    // Sync state with props
    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    useEffect(() => {
        const domainToScan = searchParams.get('new_scan');
        if (domainToScan) {
            handleNewScan(domainToScan);
        }
    }, [searchParams]);

    // Cycle through status messages during scan
    useEffect(() => {
        let interval: any;
        if (isScanning) {
            interval = setInterval(() => {
                setStatusIndex((prev) => (prev + 1) % statusMessages.length);
            }, 3500);
        } else {
            setStatusIndex(0);
        }
        return () => clearInterval(interval);
    }, [isScanning]);

    const handleNewScan = async (url: string) => {
        if (isScanning) return;
        setIsScanning(true);
        setScanError(null);

        try {
            const res = await fetch('/api/scan-website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to scan');
            }

            // Success - clear param and refresh data
            const params = new URLSearchParams(searchParams.toString());
            params.delete('new_scan');
            router.replace(`/dashboard?${params.toString()}`);
            router.refresh();

        } catch (err: any) {
            setScanError(err.message);
            showNotification(err.message, "error");
        } finally {
            setIsScanning(false);
        }
    };

    const handleInitiateDelete = (domain: string, id: string) => {
        setProjectToDelete({ domain, id });
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete || deletingId) return;

        const { domain, id } = projectToDelete;
        setDeletingId(id);
        setIsModalOpen(false);

        try {
            const res = await fetch(`/api/project/${encodeURIComponent(domain)}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to delete');
            }

            showNotification(`Protocol ${domain} terminated.`, "success");
            // Optimistic update
            setProjects(prev => prev.filter(p => p.id !== id));
            router.refresh();
        } catch (err: any) {
            showNotification(err.message, "error");
        } finally {
            setDeletingId(null);
            setProjectToDelete(null);
        }
    };

    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newUrl, setNewUrl] = useState("");

    const handleNewProjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUrl) {
            handleNewScan(newUrl);
            setShowNewProjectModal(false);
            setNewUrl("");
        }
    };

    return (
        <div className="min-h-screen bg-fashion-light pl-6 pr-6 py-8 md:pl-32 md:pr-12 md:py-20 relative">

            <DecisionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Terminate Protocol"
                variant="destructive"
                confirmLabel="Purge Repository"
                message={`This action will permanently purge all intelligence data for ${projectToDelete?.domain}. This protocol cannot be reversed once cleared.`}
            />

            {/* Scanning Overlay (Terminal Style) */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center text-white backdrop-blur-xl font-mono"
                    >
                        <div className="max-w-2xl w-full px-8">
                            <div className="border border-white/20 bg-black rounded-lg shadow-2xl overflow-hidden">
                                {/* Terminal Header */}
                                <div className="bg-white/10 px-4 py-2 flex items-center justify-between border-b border-white/10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">RankMost Intelligence Node v2.0</span>
                                </div>

                                {/* Terminal Body */}
                                <div className="p-6 h-[400px] flex flex-col justify-end gap-2 font-mono text-xs md:text-sm">
                                    <div className="opacity-50 mb-4 text-[10px]">
                                        Last login: {new Date().toUTCString()} on ttys001
                                    </div>

                                    {statusMessages.slice(0, statusIndex + 1).map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-green-500"
                                        >
                                            <span className="text-white/50 mr-2">{`>`}</span>
                                            {msg}
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="h-4 w-2.5 bg-green-500 mt-1"
                                    />
                                </div>
                            </div>

                            <p className="text-center mt-8 text-[10px] uppercase tracking-[0.3em] opacity-30 animate-pulse">
                                Do not close window. Intelligence gathering in progress.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Project Modal */}
            <AnimatePresence>
                {showNewProjectModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/95 flex flex-col items-center justify-center backdrop-blur-md"
                    >
                        <button
                            onClick={() => setShowNewProjectModal(false)}
                            className="absolute top-12 right-12 text-sm font-bold uppercase tracking-widest hover:text-semrush-orange transition-colors"
                        >
                            [ Close ]
                        </button>

                        <div className="w-full max-w-2xl px-8">
                            <span className="text-label text-semrush-orange mb-4 block">New Protocol</span>
                            <h2 className="text-5xl md:text-6xl font-serif italic mb-12">Initiate Analysis</h2>

                            <form onSubmit={handleNewProjectSubmit} className="relative group">
                                <input
                                    autoFocus
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    type="text"
                                    placeholder="Enter domain (e.g. kyliecosmetics.com)..."
                                    className="w-full bg-transparent border-b-2 border-black/10 py-8 text-3xl md:text-5xl font-serif italic outline-none focus:border-black transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 bottom-8 text-black hover:text-semrush-orange transition-colors"
                                >
                                    <ArrowRight className="w-12 h-12" />
                                </button>
                            </form>
                            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-fashion-gray">
                                Enter the domain you wish to audit for technical and search performance.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between items-end mb-20 border-b border-black/5 pb-8">
                <div>
                    <span className="text-label text-semrush-orange">Portfolio</span>
                    <h1 className="text-5xl md:text-6xl font-serif italic mt-4 text-fashion-black">
                        Command Center
                    </h1>
                </div>
                <div className="hidden md:block">
                    <span className="text-label text-fashion-gray">Est. 2026</span>
                </div>
            </div>

            {/* Error Message */}
            {scanError && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-bold uppercase tracking-wide">
                    Error: {scanError}
                </div>
            )}

            {/* Project Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* New Project Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setShowNewProjectModal(true)}
                    className="aspect-[4/3] border border-black/10 rounded-sm bg-transparent flex flex-col justify-center items-center group cursor-pointer hover:border-black transition-colors"
                >
                    <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                        <span className="font-serif text-3xl italic">+</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-fashion-gray group-hover:text-black">Initiate Project</span>
                </motion.div>

                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (i + 2) * 0.1 }}
                        className={`aspect-[4/3] bg-white p-8 md:p-12 flex flex-col justify-between shadow-sm group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative ${deletingId === project.id ? 'pointer-events-none' : ''}`}
                    >
                        {/* Deletion Overlay for Card */}
                        {deletingId === project.id && (
                            <div className="absolute inset-0 z-10 bg-black/90 flex flex-col items-center justify-center text-white text-center p-6">
                                <Activity className="w-6 h-6 text-red-500 animate-pulse mb-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">
                                    Terminating <br /> Protocol
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-start">
                            <span className="text-label opacity-40">Monitored Site</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleInitiateDelete(project.domain, project.id);
                                    }}
                                    className="text-fashion-gray hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className={`w-3 h-3 rounded-full ${project.issues > 0 ? 'bg-semrush-orange' : 'bg-green-500'}`} />
                            </div>
                        </div>

                        <Link href={`/dashboard/project/${project.domain}`} className="flex-1 flex flex-col justify-center">
                            <div className="text-center">
                                <h3 className="text-2xl font-serif italic mb-2 group-hover:text-semrush-orange transition-colors truncate max-w-full">
                                    {project.domain}
                                </h3>
                                <div className="flex justify-center items-baseline gap-2 mt-6">
                                    <span className="text-6xl font-serif font-light">{project.grade}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-fashion-gray">Health Score</span>
                                </div>
                            </div>
                        </Link>

                        <div className="flex justify-between items-end border-t border-black/5 pt-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-1">Rank</span>
                                <span className="text-xl font-serif">{project.rank}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-fashion-gray mb-1">Issues</span>
                                <span className="text-xl font-serif">{project.issues}</span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Generating Professional PDF Briefing... [Mock]");
                            }}
                            className="mt-8 py-3 border border-black/5 text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all text-center"
                        >
                            Export Dossier (PDF)
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
