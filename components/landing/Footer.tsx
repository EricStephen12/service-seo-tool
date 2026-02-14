"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white pt-40 pb-12 border-t border-fashion-navy text-fashion-navy">
      <div className="couture-container">

        {/* Top Section - Brand Statement */}
        <div className="mb-32 flex flex-col md:flex-row justify-between items-start">
          <div className="max-w-md">
            <h2 className="text-4xl font-serif italic mb-8">RankMost.</h2>
            <p className="text-lg font-light text-fashion-gray leading-relaxed">
              An intelligence suite for the modern digital estate. <br />
              Designed in New York.
            </p>
          </div>
          <div className="mt-12 md:mt-0">
            <span className="text-display-large font-serif leading-none opacity-5">2026</span>
          </div>
        </div>

        {/* architectural Index */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 pt-12 border-t border-black/10">
          <div className="col-span-1">
            <span className="text-label block mb-8 text-fashion-gray">Index 01 — Suite</span>
            <ul className="space-y-4">
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Site Audit</Link></li>
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Rank Tracker</Link></li>
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Market Share</Link></li>
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Fix Engine</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <span className="text-label block mb-8 text-fashion-gray">Index 02 — Journal</span>
            <ul className="space-y-4">
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Case Studies</Link></li>
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Methodology</Link></li>
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Trends 26</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <span className="text-label block mb-8 text-fashion-gray">Index 03 — Company</span>
            <ul className="space-y-4">
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">About</Link></li>
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Careers</Link></li>
              <li><Link href="#" className="font-serif text-xl hover:text-semrush-orange transition-colors italic">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <span className="text-label block mb-8 text-fashion-gray">Newsletter</span>
            <div className="flex flex-col gap-6">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border-b border-fashion-navy py-4 outline-none font-serif italic text-lg focus:border-semrush-orange transition-colors bg-transparent"
              />
              <button className="self-start text-[10px] font-bold uppercase tracking-[0.2em] hover:text-semrush-orange transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-40 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-bold text-fashion-gray max-w-full">
          <div className="flex gap-8 mb-4 md:mb-0">
            <Link href="#" className="hover:text-fashion-navy">Privacy</Link>
            <Link href="#" className="hover:text-fashion-navy">Terms</Link>
            <Link href="#" className="hover:text-fashion-navy">Sitemap</Link>
          </div>
          <div>
            © RankMost Intelligence
          </div>
        </div>

      </div>
    </footer>
  );
}
