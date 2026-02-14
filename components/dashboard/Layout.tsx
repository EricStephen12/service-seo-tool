import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#F4F5F9] text-[#191B23] font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-14 border-b border-semrush-border bg-white flex items-center justify-between px-8 z-20 shrink-0">
                    <div className="flex items-center gap-4 text-xs font-sans">
                        <span className="text-semrush-gray-medium font-medium hover:text-semrush-navy cursor-pointer transition-colors">Projects</span>
                        <span className="text-semrush-border">/</span>
                        <span className="text-semrush-gray-medium font-medium hover:text-semrush-navy cursor-pointer transition-colors">Brooklyn Plumbing Co.</span>
                        <span className="text-semrush-border">/</span>
                        <span className="font-bold">Project Overview</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-semrush-gray-light" />
                            ))}
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-semrush-orange flex items-center justify-center text-[8px] text-white font-bold">+</div>
                        </div>
                        <div className="h-4 w-[1px] bg-semrush-border mx-2" />
                        <div className="w-8 h-8 rounded bg-semrush-navy flex items-center justify-center text-white font-bold text-xs cursor-pointer">EC</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
