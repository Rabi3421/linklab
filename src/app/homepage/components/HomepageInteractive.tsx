'use client';

import { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import ShortenedResult from './ShortenedResult';
import ProblemFramingSection from './ProblemFramingSection';
import HomepageComparisonSection from './HomepageComparisonSection';
import HowItWorksSection from './HowItWorksSection';
import ClientWorkspacesSection from './ClientWorkspacesSection';
import QrOfflineSection from './QrOfflineSection';
import ClientReportingSection from './ClientReportingSection';
import PricingSnippetSection from './PricingSnippetSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import Footer from './Footer';
import type { LinkCreationApiResponse } from '@/lib/links/types';

interface ShortenedLink {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  qrCodeDataUrl: string;
}

const HomepageInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [shortenedLink, setShortenedLink] = useState<ShortenedLink | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleShortenUrl = async (url: string) => {
    if (!isHydrated) return;

    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ originalUrl: url }),
    });

    if (!response.ok) {
      const data = (await response
        .json()
        .catch(() => ({ message: 'Unable to shorten this URL right now.' }))) as {
        message?: string;
      };
      throw new Error(data.message || 'Unable to shorten this URL right now.');
    }

    const payload = (await response.json()) as LinkCreationApiResponse;
    setShortenedLink(payload.link);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseResult = () => {
    if (!isHydrated) return;
    setShortenedLink(null);
  };

  return (
    <div className="min-h-screen bg-[#1e2129]">
      <div className="pt-[60px]">
        {shortenedLink && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <ShortenedResult
              originalUrl={shortenedLink.originalUrl}
              shortCode={shortenedLink.shortCode}
              shortUrl={shortenedLink.shortUrl}
              qrCodeDataUrl={shortenedLink.qrCodeDataUrl}
              onClose={handleCloseResult}
            />
          </div>
        )}
        {/* Section order follows the agency positioning: name the pain, prove we are
            different from the incumbents, show the loop, then the three capability
            blocks, price, and answer objections.

            FeaturesSection, UseCasesSection and SocialProofSection are intentionally
            out of the flow — ClientWorkspacesSection, QrOfflineSection and
            ClientReportingSection replace their generic, all-audiences copy. The files
            are still on disk if any of that content needs to come back. */}
        <HeroSection onShortenUrl={handleShortenUrl} />
        <ProblemFramingSection />
        <HomepageComparisonSection />
        <HowItWorksSection />
        <ClientWorkspacesSection />
        <QrOfflineSection />
        <ClientReportingSection />
        <PricingSnippetSection />
        {/* Testimonials section removed — re-add only with real customer quotes and verified results. */}
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default HomepageInteractive;
