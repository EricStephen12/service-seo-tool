"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white pt-40 pb-12 border-t border-fashion-navy text-fashion-navy">
      <div className="couture-container">

        {/* Top Section - Brand Statement */}
        <div className="mb-32 flex flex-col md:flex-row justify-between items-start">
          <div className="max-w-md">
            <h2 className="text-4xl font-serif italic mb-8">Exricx SEO.</h2>
            <p className="text-lg font-light text-fashion-gray leading-relaxed">
              An intelligence suite for the modern digital estate. <br />
              Designed in New York.
            </p>
          </div>
          <div className="mt-12 md:mt-0">
            <span className="text-display-large font-serif leading-none opacity-5">2026</span>
          </div>
        </div>

        {/* architectural Index - SIMPLIFIED */}
        <div className="pt-12 border-t border-black/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-12">
              <Link href="/privacy" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Privacy Policy</Link>
              <Link href="/refund" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Refund Policy</Link>
              <Link href="/terms" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Terms & Conditions</Link>
            </div>

            <div className="text-[10px] uppercase tracking-widest font-bold text-fashion-gray opacity-50">
              © 2026 Exricx SEO Intelligence — Designed in New York
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
