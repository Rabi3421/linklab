'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState('2025');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const links = {
    Product: [
      { label: 'Features', href: '/homepage' },
      { label: 'Analytics', href: '/link-analytics' },
      { label: 'API', href: '/developers' },
      { label: 'Pricing', href: '/pricing' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Developers', href: '/developers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/homepage' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/homepage' },
      { label: 'Terms of Service', href: '/homepage' },
      { label: 'Cookie Policy', href: '/homepage' },
    ],
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: '#191c23', borderTop: '1px solid rgba(200,205,220,0.12)' }}>
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.02;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>

      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />

      {/* Mesh gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 50% 60% at 10% 50%, rgba(245,158,11,0.04) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 40% at 90% 30%, rgba(99,102,241,0.04) 0%, transparent 60%)`,
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/homepage" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                <Icon name="LinkIcon" size={16} variant="solid" className="text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-white">LinkLab</span>
            </Link>
            <p className="font-body text-sm text-white/35 max-w-[240px] leading-relaxed mb-6">
              The complete URL management platform for teams that care about their data.
            </p>
            <div className="flex items-center gap-2">
              {[
                { label: 'Twitter', icon: 'XMarkIcon' },
                { label: 'GitHub', icon: 'CodeBracketIcon' },
                { label: 'LinkedIn', icon: 'LinkIcon' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 transition-all duration-250 hover:text-amber-400 hover:border-amber-400/30"
                  style={{ border: '1px solid rgba(200,205,220,0.14)', background: 'rgba(255,255,255,0.06)' }}
                >
                  <Icon name={s.icon as any} size={16} variant="outline" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="font-heading font-semibold text-xs text-white/30 uppercase tracking-widest mb-4">{section}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="font-body text-sm text-white/45 transition-colors duration-200 hover:text-amber-400/80"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(200,205,220,0.12)' }}>
          <p className="font-body text-xs text-white/25">
            &copy; {currentYear} LinkLab. All rights reserved.
          </p>
          <div className="flex items-center gap-1 font-body text-xs text-white/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;