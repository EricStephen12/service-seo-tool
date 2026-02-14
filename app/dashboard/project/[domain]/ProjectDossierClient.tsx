"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Search, ArrowUpRight, ShieldCheck, AlertTriangle, Terminal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/ui/Notification';
import { DecisionModal } from '@/components/ui/DecisionModal';

interface DossierData {
    id: string;
    health: number;
    authority: string | number;
    backlinks: string;
    keywords: string;
    traffic: string;
    problems: any[];
    isSecure: boolean;
    rankings: any[];
    screenshot?: string;
    reportMarkdown?: string;
}

interface ProjectDossierClientProps {
    domain: string;
    data: DossierData;
}

const chapters = [
    { id: 'brain', label: 'The Brain' },
    { id: 'overview', label: 'Strategy' },
    { id: 'trust', label: 'Trust' },
    { id: 'audit', label: 'Health' },
    { id: 'rankings', label: 'Visibility' },
    { id: 'competitors', label: 'Rivals' }
];

export default function ProjectDossierClient({ domain, data }: ProjectDossierClientProps) {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [activeChapter, setActiveChapter] = useState('overview');
    const [filter, setFilter] = useState('All');
    const [fixingIssue, setFixingIssue] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedFixes, setGeneratedFixes] = useState<Record<number, { content: string, instructions?: string }>>({});
    const [isGenerating, setIsGenerating] = useState<number | null>(null);

    const filteredProblems = data.problems.filter(p =>
        filter === 'All' || p.category === filter
    );

    // Filter for Trust/E-E-A-T issues specifically
    const trustIssues = data.problems.filter(p => p.category === 'E-E-A-T' || p.category === 'Local SEO' || p.issue.includes('SSL'));
    const schemaIssue = trustIssues.find(p => p.issue.includes('Schema') || p.issue.includes('Structured Data'));
    const legalIssue = trustIssues.find(p => p.issue.includes('Privacy') || p.issue.includes('Terms'));
    const contactIssue = trustIssues.find(p => p.issue.includes('Contact') || p.issue.includes('About'));
    const sslIssue = trustIssues.find(p => p.issue.includes('SSL') || p.issue.includes('HTTP'));

    const fetchFix = async (index: number, problem: any) => {
        if (generatedFixes[index] || isGenerating === index) return;

        setIsGenerating(index);
        try {
            const res = await fetch('/api/generate-fix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    issue: problem,
                    context: {
                        url: domain,
                        content: "Targeting structural optimization..."
                    }
                }),
            });

            if (!res.ok) throw new Error('Generation failed');
            const result = await res.json();
            setGeneratedFixes(prev => ({ ...prev, [index]: result.fix }));
            showNotification("Fix Protocol Generated Successfully", "success");
        } catch (err) {
            console.error(err);
            showNotification("Failed to generate correction protocol", "error");
        } finally {
            setIsGenerating(null);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/project/${encodeURIComponent(domain)}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to delete');
            }

            showNotification(`Project ${domain} has been purged.`, "success");

            // Short delay to show the "Done" state
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 1500);
        } catch (err: any) {
            showNotification(err.message, "error");
            setIsDeleting(false);
        }
    };

    return (
        <div className={`min-h-screen bg-fashion-light pl-6 pr-6 py-8 md:pl-32 md:pr-12 md:py-20`}>

            <DecisionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Terminate Protocol"
                variant="destructive"
                confirmLabel="Purge Repository"
                message={`You are about to permanently delete ${domain} and all associated intelligence node data. This action is irreversible and will deallocate all synchronized tracking buffers.`}
            />

            {/* Termination Overlay */}
            <AnimatePresence>
                {isDeleting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white backdrop-blur-xl"
                    >
                        <div className="max-w-xl w-full px-6 md:px-12 text-center">
                            <div className="w-full h-[1px] bg-white/10 mb-20 relative overflow-hidden">
                                <motion.div
                                    animate={{ x: ['100%', '-100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent w-1/2"
                                />
                            </div>

                            <h2 className="text-4xl md:text-7xl font-serif italic mb-6 tracking-tight">
                                Terminating <br /> Protocol...
                            </h2>

                            <div className="flex items-center justify-center gap-4 text-red-500">
                                <Activity className="w-4 h-4 animate-pulse" />
                                <span className="font-bold tracking-[0.3em] uppercase text-[10px]">
                                    Purging Intelligence Data
                                </span>
                            </div>

                            <div className="mt-20 opacity-30 px-4">
                                <div className="text-[9px] font-mono uppercase tracking-wider">
                                    &gt; WIPING_ENCRYPTED_DB_ENTRIES... DONE
                                </div>
                                <div className="text-[9px] font-mono uppercase tracking-wider mt-1">
                                    &gt; DEALLOCATING_COMPUTE_RESOURCES... DONE
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dossier Header */}
            <div className="mb-12 md:mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
                    <div>
                        <span className="text-label text-semrush-orange mb-2 block">Dossier Access</span>
                        <h1 className="text-4xl md:text-7xl font-serif italic text-fashion-black tracking-tight break-all">
                            {domain}
                        </h1>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 border-t md:border-t-0 pt-6 md:pt-0">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-[10px] font-bold uppercase tracking-widest text-fashion-gray hover:text-red-500 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Terminate
                            </button>
                        </div>
                        <div className="flex gap-12">
                            <div className="flex flex-col items-end border-l border-black/5 pl-6 md:pl-12">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                                    <span className="text-5xl md:text-7xl font-serif leading-none text-red-500">
                                        {data.problems.length}
                                    </span>
                                </div>
                                <span className="text-[8px] md:text-label text-red-500/60 uppercase tracking-widest">Critical Issues</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Intelligence Chapters (Tabs) */}
            <div className="flex gap-8 md:gap-12 mb-12 md:mb-16 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                {chapters.map((chapter) => (
                    <button
                        key={chapter.id}
                        onClick={() => setActiveChapter(chapter.id)}
                        className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap pb-2 transition-all border-b-2 ${activeChapter === chapter.id ? 'border-semrush-orange text-black' : 'border-transparent text-fashion-gray hover:text-black'}`}
                    >
                        {chapter.label}
                    </button>
                ))}
            </div>

            {/* Chapter Content Rendering */}
            <AnimatePresence mode="wait">
                {activeChapter === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {/* Vital Signs Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10 mb-12 md:mb-20">
                            <div className="bg-white p-6 md:p-12 aspect-square flex flex-col justify-between group hover:bg-fashion-navy hover:text-white transition-colors duration-500">
                                <div className="flex justify-between items-start">
                                    <Activity className="w-5 md:w-6 h-5 md:h-6 text-semrush-orange" strokeWidth={1.5} />
                                    <span className="text-[8px] md:text-label opacity-40 uppercase">Vital Sign</span>
                                </div>
                                <div>
                                    <span className="text-3xl md:text-5xl font-serif italic block mb-1 md:mb-2">{data.authority}</span>
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-60">Authority</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-12 aspect-square flex flex-col justify-between group hover:bg-black hover:text-white transition-colors duration-500">
                                <div className="flex justify-between items-start">
                                    <Globe className="w-5 md:w-6 h-5 md:h-6 text-semrush-orange" strokeWidth={1.5} />
                                    <span className="text-[8px] md:text-label opacity-40 uppercase">Reach</span>
                                </div>
                                <div>
                                    <span className="text-3xl md:text-5xl font-serif italic block mb-1 md:mb-2">{data.traffic}</span>
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-60">Traffic</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-12 aspect-square flex flex-col justify-between group hover:bg-black hover:text-white transition-colors duration-500">
                                <div className="flex justify-between items-start">
                                    <Search className="w-5 md:w-6 h-5 md:h-6 text-semrush-orange" strokeWidth={1.5} />
                                    <span className="text-[8px] md:text-label opacity-40 uppercase">Visibility</span>
                                </div>
                                <div>
                                    <span className="text-3xl md:text-5xl font-serif italic block mb-1 md:mb-2">{data.keywords}</span>
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-60">Target Coverage</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-12 aspect-square flex flex-col justify-between group hover:bg-black hover:text-white transition-colors duration-500">
                                <div className="flex justify-between items-start">
                                    <ShieldCheck className="w-5 md:w-6 h-5 md:h-6 text-semrush-orange" strokeWidth={1.5} />
                                    <span className="text-[8px] md:text-label opacity-40 uppercase">Security</span>
                                </div>
                                <div>
                                    <span className="text-3xl md:text-5xl font-serif italic block mb-1 md:mb-2">{data.isSecure ? "Secure" : "At Risk"}</span>
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-60">Security</span>
                                </div>
                            </div>
                        </div>

                        {/* Critical Alerts - "Strategic Priorities" */}
                        <div className="grid grid-cols-1 gap-12">
                            <div className="w-full">
                                <h3 className="text-3xl font-serif italic mb-8 flex items-center gap-4">
                                    Top Priorities
                                    <span className="text-xs font-sans font-bold bg-semrush-orange text-white px-2 py-1 rounded-sm not-italic tracking-wider">
                                        ACTION REQUIRED
                                    </span>
                                </h3>

                                <div className="space-y-4">
                                    {/* Filter for Strategic Issues Only (Trust, Security, High Severity) */}
                                    {data.problems.filter(p => p.category === 'E-E-A-T' || p.category === 'Security' || p.severity === 'high').length > 0 ? (
                                        data.problems
                                            .filter(p => p.category === 'E-E-A-T' || p.category === 'Security' || p.severity === 'high')
                                            .slice(0, 3) // Only show top 3 strategic issues
                                            .map((alert, i) => (
                                                <div key={i} className="flex flex-col gap-2 p-6 bg-white border-l-2 border-black/10 hover:border-semrush-orange transition-colors group cursor-pointer shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-6">
                                                            <AlertTriangle className="w-5 h-5 text-fashion-gray group-hover:text-semrush-orange transition-colors" />
                                                            <span className="text-sm font-bold uppercase tracking-tight">{alert.issue || "Strategic Alert"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Priority</span>
                                                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                    {alert.explanation && (
                                                        <div className="pl-11 space-y-2 mt-1">
                                                            {typeof alert.explanation === 'string' ? (
                                                                <p className="text-xs text-fashion-gray font-light leading-relaxed">
                                                                    {alert.explanation}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    <p className="text-xs text-fashion-gray font-light leading-relaxed">
                                                                        <span className="font-bold text-black opacity-60">Impact:</span> {alert.explanation.problem}
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                    ) : (
                                        <div className="p-12 text-center bg-white border border-black/5 opacity-50">
                                            <p className="text-sm uppercase tracking-widest font-bold">No Strategic Risks Detected</p>
                                            <p className="text-xs text-fashion-gray mt-2">Your foundation is solid.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeChapter === 'trust' && (
                    <motion.div key="trust" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Card 1: Legitimacy Triad */}
                            <div className="bg-white border border-black/10 p-8 lg:p-12 relative overflow-hidden group">
                                <h3 className="text-2xl font-serif italic mb-2">Legal Pages</h3>
                                <p className="text-xs text-fashion-gray mb-8">Required by Google to build trust.</p>

                                <div className="space-y-6">
                                    <TrustCheckItem
                                        label="Privacy Policy"
                                        status={!allUrlsHave(data, 'privacy') ? 'missing' : 'verified'}
                                        onFix={() => legalIssue && fetchFix(data.problems.indexOf(legalIssue), legalIssue)}
                                        isFixing={legalIssue && isGenerating === data.problems.indexOf(legalIssue)}
                                        fixContent={legalIssue && generatedFixes[data.problems.indexOf(legalIssue)]}
                                    />
                                    <TrustCheckItem
                                        label="Terms of Service"
                                        status={!allUrlsHave(data, 'terms') ? 'missing' : 'verified'}
                                        onFix={() => legalIssue && fetchFix(data.problems.indexOf(legalIssue), legalIssue)}
                                        isFixing={false}
                                    />
                                    <TrustCheckItem
                                        label="Contact Page"
                                        status={!allUrlsHave(data, 'contact') ? 'missing' : 'verified'}
                                        onFix={() => contactIssue && fetchFix(data.problems.indexOf(contactIssue), contactIssue)}
                                        isFixing={contactIssue && isGenerating === data.problems.indexOf(contactIssue)}
                                        fixContent={contactIssue && generatedFixes[data.problems.indexOf(contactIssue)]}
                                    />
                                </div>
                            </div>

                            {/* Card 2: Entity Core */}
                            <div className="bg-white border border-black/10 p-8 lg:p-12 relative overflow-hidden group">
                                <h3 className="text-2xl font-serif italic mb-2">Business Identity</h3>
                                <p className="text-xs text-fashion-gray mb-8">Proving you are a real business.</p>

                                <div className="space-y-6">
                                    <TrustCheckItem
                                        label="LocalBusiness Schema"
                                        status={schemaIssue ? 'missing' : 'verified'}
                                        onFix={() => schemaIssue && fetchFix(data.problems.indexOf(schemaIssue), schemaIssue)}
                                        isFixing={schemaIssue && isGenerating === data.problems.indexOf(schemaIssue)}
                                        fixContent={schemaIssue && generatedFixes[data.problems.indexOf(schemaIssue)]}
                                    />
                                    <TrustCheckItem
                                        label="SSL Certificate"
                                        status={sslIssue ? 'critical' : 'verified'}
                                        isFixing={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeChapter === 'audit' && (
                    <motion.div
                        key="audit"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                            <div className="lg:col-span-4">
                                <div className="sticky top-32 space-y-2">
                                    <h3 className="hidden lg:block text-2xl font-serif italic mb-6">Audit Index</h3>
                                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
                                        {['All', 'Technical SEO', 'Content Quality', 'Page Speed', 'E-E-A-T'].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setFilter(cat)}
                                                className={`whitespace-nowrap lg:w-full text-left px-4 py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest border-l-2 md:border-l-2 transition-all ${filter === cat ? 'border-semrush-orange bg-white text-black' : 'border-transparent text-fashion-gray hover:text-black hover:bg-black/5'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-8">
                                <div className="space-y-6">
                                    {filteredProblems.length > 0 ? (
                                        filteredProblems.map((problem, i) => (
                                            <div key={i} className="bg-white border border-black/5 p-6 md:p-8 group shadow-sm">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm mb-2 inline-block ${problem.severity === 'high' ? 'bg-red-500 text-white' : 'bg-fashion-light text-fashion-gray'}`}>
                                                            {problem.severity} priority
                                                        </span>
                                                        <h4 className="text-xl md:text-2xl font-serif italic">{problem.issue}</h4>
                                                    </div>
                                                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-30">{problem.category}</span>
                                                </div>

                                                <p className="text-xs md:text-sm text-fashion-gray font-light mb-8 leading-relaxed">
                                                    {problem.explanation?.problem || "System audit detected a structural discrepancy in this node."}
                                                </p>

                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => {
                                                            const isOpen = fixingIssue === i;
                                                            setFixingIssue(isOpen ? null : i);
                                                            if (!isOpen) fetchFix(i, problem);
                                                        }}
                                                        className="px-6 py-3 bg-fashion-navy text-white text-[9px] font-bold uppercase tracking-widest hover:bg-semrush-orange transition-colors flex items-center gap-2"
                                                    >
                                                        {isGenerating === i ? (
                                                            <>
                                                                <Activity className="w-3 h-3 animate-spin" />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            fixingIssue === i ? 'Close Fix' : 'View Protocol Fix'
                                                        )}
                                                    </button>
                                                </div>

                                                <AnimatePresence>
                                                    {fixingIssue === i && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-8 pt-8 border-t border-black/5 bg-fashion-light p-4 md:p-6">
                                                                <div className="flex items-center gap-2 mb-4 opacity-40">
                                                                    <Terminal className="w-3 h-3" />
                                                                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">AI Correction Engine</span>
                                                                </div>
                                                                <div className="text-[10px] md:text-xs font-mono text-fashion-black leading-relaxed space-y-4">
                                                                    <p><span className="text-semrush-orange">&gt; IMPACT:</span> {problem.impact || "Ranking uplift pending..."}</p>

                                                                    {generatedFixes[i] && (
                                                                        <div className="mt-6 border-l-2 border-semrush-orange pl-4">
                                                                            <p className="text-[8px] font-bold uppercase tracking-widest text-semrush-orange mb-2">How to Implement</p>
                                                                            <p className="text-[10px] md:text-xs font-sans italic opacity-60">
                                                                                {generatedFixes[i].instructions || "Apply this fix to your website source code."}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <div className="p-4 bg-white border border-black/10 rounded-sm italic whitespace-pre-wrap text-[10px] md:text-xs">
                                                                        {isGenerating === i ? (
                                                                            <span className="animate-pulse">Analyzing...</span>
                                                                        ) : (
                                                                            generatedFixes[i]?.content || problem.explanation?.suggested_fix || "System is aggregating fix..."
                                                                        )}
                                                                    </div>

                                                                    {generatedFixes[i] && (
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(generatedFixes[i].content);
                                                                                showNotification("Instruction copied to briefcase.", "success");
                                                                            }}
                                                                            className="text-[8px] font-bold uppercase tracking-widest text-semrush-orange hover:underline"
                                                                        >
                                                                            [ Copy to Briefcase ]
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-white border border-black/5 p-12 md:p-20 text-center opacity-30">
                                            <p className="text-label">System Clear</p>
                                            <p className="text-lg md:text-xl font-serif italic mt-2">No items detected.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Visual Pulse - Screenshot Evidence */}
                            <div className="lg:col-span-4 self-start">
                                <h3 className="text-3xl font-serif italic mb-8">Visual Pulse</h3>
                                <div className="bg-white border border-black/5 p-4 md:p-8 shadow-sm group relative overflow-hidden">
                                    <div className="aspect-[16/10] bg-fashion-light overflow-hidden relative border border-black/5">
                                        {data.screenshot ? (
                                            <img
                                                src={`data:image/webp;base64,${data.screenshot}`}
                                                alt="Site Pulse Screenshot"
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-black/5 opacity-20">
                                                <Globe className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="mt-8">
                                        <span className="text-label text-fashion-gray opacity-40 block mb-2 uppercase tracking-widest text-[9px]">Captured Node</span>
                                        <div className="flex justify-between items-center text-[10px] md:text-xs">
                                            <span className="font-serif italic text-fashion-black translate-x-0 group-hover:translate-x-2 transition-transform duration-500">
                                                {domain}
                                            </span>
                                            <span className="text-semrush-orange font-bold uppercase tracking-widest text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">Live</span>
                                        </div>
                                    </div>
                                    {/* Scan Line Detail */}
                                    <motion.div
                                        animate={{ y: [0, 200, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-0 left-0 right-0 h-px bg-semrush-orange/20 z-10 pointer-events-none opacity-0 group-hover:opacity-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeChapter === 'rankings' && (
                    <motion.div
                        key="rankings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="bg-white border border-black/10 p-6 md:p-12">
                            <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-serif italic mb-2">Search Intent Gap</h2>
                                    <p className="text-fashion-gray text-xs">A list of target keywords you should own based on detected search intent.</p>
                                </div>
                                <div className="md:text-right border-t md:border-t-0 pt-6 md:pt-0">
                                    <span className="text-3xl font-serif italic text-semrush-orange">Top 100</span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Global Ranking</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {data.rankings.length > 0 ? (
                                    data.rankings.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-black/5 group hover:bg-fashion-light px-2 md:px-4 transition-colors gap-4">
                                            <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                                                <span className="text-[8px] md:text-[10px] font-mono opacity-20 hidden sm:block">{String(i + 1).padStart(2, '0')}</span>
                                                <span className="font-serif italic lowercase truncate">{item.keyword}</span>
                                            </div>
                                            <div className="flex gap-6 md:gap-12 text-right shrink-0">
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Current Position</p>
                                                    <p className="text-[10px] md:text-xs">{item.position > 0 ? `#${item.position}` : 'Not Ranked'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Target</p>
                                                    <p className="text-[10px] md:text-xs font-bold text-semrush-orange">#1-3</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center opacity-30">
                                        <Activity className="w-8 h-8 mx-auto mb-4 animate-spin" />
                                        <p className="text-label uppercase tracking-widest">Scanning Search Nodes...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeChapter === 'competitors' && (
                    <motion.div
                        key="competitors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white border border-black/10 p-6 md:p-12">
                                <h3 className="text-xl md:text-2xl font-serif italic mb-8">Competitive Authority</h3>
                                <div className="space-y-8">
                                    {(domain.toLowerCase().includes('farm') || domain.toLowerCase().includes('agri') ? [
                                        { name: domain, current: true, type: 'Your Business' },
                                        { name: 'Olam Agri', current: false, type: 'Market Leader' },
                                        { name: 'ALMAT Farms', current: false, type: 'Direct Competitor' },
                                        { name: 'Vegfarm Nigeria', current: false, type: 'Local Challenger' },
                                    ] : [
                                        { name: domain, current: true, type: 'Your Business' }
                                    ]).map((comp, i) => (
                                        <div key={i} className={`space-y-2 ${comp.current ? 'opacity-100' : 'opacity-60'}`}>
                                            <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                                                <span className="truncate max-w-[200px]">{comp.name} {comp.current && '(YOU)'}</span>
                                                <span className={`${comp.current ? 'text-semrush-orange' : 'opacity-40'}`}>{comp.type}</span>
                                            </div>
                                            <div className="h-px bg-black/10 w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-fashion-navy text-white p-8 md:p-12 flex flex-col justify-between min-h-[300px]">
                                <div>
                                    <p className="text-label text-semrush-orange mb-4">Competitor Gap Analysis</p>
                                    <h4 className="text-2xl md:text-3xl font-serif italic mb-6">Search Landscape Briefing</h4>
                                    <p className="text-xs md:text-sm font-light leading-relaxed opacity-70">
                                        Your site {data.authority !== 'N/A' ? `currently commands a ${data.authority}% authority index.` : 'is currently being benchmarked against the search index.'} Comparing your footprint to market leaders reveals your "Search Intent Gap". Closing this gap requires immediate application of the content strategy found in The Brain.
                                    </p>
                                </div>
                                <div className="pt-8 border-t border-white/10 mt-8 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <ShieldCheck className="w-4 h-4 text-semrush-orange" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Index Synchronized</span>
                                    </div>
                                    <button className="text-[8px] font-bold uppercase tracking-widest hover:text-semrush-orange transition-colors">
                                        Deep Scan Briefing &gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                {activeChapter === 'brain' && (
                    <motion.div
                        key="brain"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="bg-white border border-black/10 p-8 md:p-12 font-serif">
                            <div className="flex justify-between items-center mb-8 border-b border-black/5 pb-8">
                                <div>
                                    <h2 className="text-3xl md:text-5xl italic mb-2">RankMost Intelligence</h2>
                                    <p className="text-xs text-fashion-gray uppercase tracking-widest">Master System Analysis</p>
                                </div>
                                <Terminal className="w-6 h-6 text-semrush-orange" />
                            </div>

                            {data.reportMarkdown ? (
                                <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:italic prose-a:text-semrush-orange font-sans">
                                    {data.reportMarkdown.split('\n').map((line, i) => {
                                        // Basic Custom Markdown Parser for "Consultancy" Look

                                        // Headers
                                        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-8 mb-4 uppercase tracking-widest">{line.replace('### ', '')}</h3>;
                                        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-serif italic mt-10 mb-6 border-l-4 border-semrush-orange pl-4">{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-serif italic mb-8">{line.replace('# ', '')}</h1>;

                                        // Dividers
                                        if (line.includes('━━━')) return <hr key={i} className="my-8 border-black/10" />;

                                        // Lists
                                        if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-semrush-orange pl-2 mb-2">{line.replace('- ', '')}</li>;
                                        if (line.trim().startsWith('→ ')) return <div key={i} className="flex gap-4 items-start mb-3 ml-2"><span className="text-semrush-orange font-bold">→</span><span>{line.replace('→ ', '')}</span></div>;

                                        // Bold/Italic (Basic)
                                        const parts = line.split(/(\*\*.*?\*\*)/g);

                                        return (
                                            <p key={i} className="mb-4 leading-relaxed text-fashion-black/80">
                                                {parts.map((part, j) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={j} className="font-bold text-black">{part.slice(2, -2)}</strong>;
                                                    }
                                                    return part;
                                                })}
                                            </p>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-20 text-center opacity-50">
                                    <Activity className="w-12 h-12 mx-auto mb-6 animate-pulse text-semrush-orange" />
                                    <h3 className="text-xl font-serif italic mb-2">Awaiting Intelligence</h3>
                                    <p className="text-xs uppercase tracking-widest">Run a new scan to activate The Brain.</p>
                                    <button
                                        onClick={() => window.location.href = `/dashboard?new_scan=${domain}`}
                                        className="mt-8 px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-semrush-orange transition-colors"
                                    >
                                        Initialize Scan
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

function TrustCheckItem({ label, status, onFix, isFixing, fixContent }: any) {
    const isMissing = status === 'missing' || status === 'critical';
    return (
        <div className="border-b border-black/5 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
                <span className="font-serif italic text-lg">{label}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${isMissing ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {status}
                </span>
            </div>
            {isMissing && (
                <div>
                    {fixContent ? (
                        <div className="mt-2 text-xs bg-fashion-light p-2 rounded">
                            <p className="italic opacity-60 mb-2">{fixContent.instructions}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(fixContent.content)}
                                className="text-semrush-orange font-bold uppercase tracking-widest text-[8px] hover:underline"
                            >
                                Copy Code
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onFix}
                            disabled={isFixing}
                            className="text-[9px] font-bold uppercase tracking-widest text-fashion-gray hover:text-red-500 flex items-center gap-2 mt-1"
                        >
                            {isFixing ? 'Generating...' : '[ Generate Asset ]'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function allUrlsHave(data: any, string: string) {
    const relevantProblem = data.problems.find((p: any) => p.issue.toLowerCase().includes(string));
    return !relevantProblem;
}
