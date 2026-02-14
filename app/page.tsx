import { Hero } from '@/components/landing/Hero';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { Journey } from '@/components/landing/Journey';
import { CapabilitiesIndex } from '@/components/landing/CapabilitiesIndex';
import { VisualEvidence } from '@/components/landing/StatsSection';
import { FAQ } from '@/components/landing/FAQ';
import { TheInvitation } from '@/components/landing/FinalCTA';
import { Masthead } from '@/components/landing/Masthead';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-fashion-navy selection:text-white overflow-x-hidden">
      <Masthead />

      <main>
        <Hero />

        <ProductShowcase />

        <div id="protocol">
          <Journey />
        </div>

        <div id="specs">
          <CapabilitiesIndex />
        </div>

        <div id="evidence">
          <VisualEvidence />
        </div>

        <div id="faq">
          <FAQ />
        </div>

        <TheInvitation />
      </main>

      <Footer />
    </div>
  );
}
