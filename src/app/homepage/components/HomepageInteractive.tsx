'use client';

import { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import ShortenedResult from './ShortenedResult';
import FeaturesSection from './FeaturesSection';
import SocialProofSection from './SocialProofSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import Footer from './Footer';

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
      const data = (await response.json().catch(() => ({ message: 'Unable to shorten this URL right now.' }))) as { message?: string };
      throw new Error(data.message || 'Unable to shorten this URL right now.');
    }

    const createdLink = (await response.json()) as ShortenedLink;
    setShortenedLink(createdLink);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseResult = () => {
    if (!isHydrated) return;
    setShortenedLink(null);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#1e2129]">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }} />
            <div className="h-3 w-24 bg-white/10 rounded mx-auto" />
          </div>
        </div>
      </div>
    );
  }

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
        <HeroSection onShortenUrl={handleShortenUrl} />
        <FeaturesSection />
        <SocialProofSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default HomepageInteractive;