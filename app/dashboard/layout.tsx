import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "RankMost | Project Center",
    description: "High-fashion SEO intelligence.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-fashion-light">
            <Sidebar />
            <MobileHeader />
            <main className="flex-1 w-full relative z-0 mt-16 md:mt-0">
                {children}
            </main>
        </div>
    );
}
