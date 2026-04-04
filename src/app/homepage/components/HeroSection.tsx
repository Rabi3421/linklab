'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface HeroSectionProps {
  onShortenUrl: (url: string) => void;
}

const HeroSection = ({ onShortenUrl }: HeroSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateUrl = (input: string): boolean => {
    try {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return urlPattern.test(input);
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) { setError('Paste a URL to shorten'); return; }
    if (!validateUrl(url)) { setError("That doesn't look like a valid URL"); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onShortenUrl(url);
    }, 600);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  const recentLinks = [
    { original: 'figma.com/design/xK9mP2...', short: 'lnk.lab/figma-q4', clicks: 2841, trend: '+18%' },
    { original: 'notion.so/workspace/product...', short: 'lnk.lab/notion-prd', clicks: 1204, trend: '+7%' },
    { original: 'docs.google.com/spreadsheets...', short: 'lnk.lab/q4-metrics', clicks: 5670, trend: '+34%' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{ background: '#1e2129' }}
    >
      <style jsx>{`
        @keyframes meshShift {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, -15px) rotate(1deg); }
          66% { transform: translate(-10px, 20px) rotate(-0.5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .anim-1 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .anim-2 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .anim-3 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .anim-4 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .anim-5 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.7s both; }
        .anim-right { animation: fadeSlideRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .ticker-track { animation: tickerScroll 22s linear infinite; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        .mesh-bg { animation: meshShift 18s ease-in-out infinite; }
        .label-chip {
          background: linear-gradient(135deg, rgba(250,204,21,0.12) 0%, rgba(251,146,60,0.08) 100%);
          border: 1px solid rgba(250,204,21,0.2);
        }
        .cta-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 60%, #dc2626 100%);
          box-shadow: 0 0 32px rgba(245,158,11,0.25), 0 4px 16px rgba(0,0,0,0.4);
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .cta-btn:hover {
          box-shadow: 0 0 48px rgba(245,158,11,0.4), 0 8px 24px rgba(0,0,0,0.5);
          transform: translateY(-1px);
        }
        .input-wrap {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(200,205,220,0.15);
          transition: border-color 0.2s;
        }
        .input-wrap:focus-within {
          border-color: rgba(245,158,11,0.45);
          background: rgba(255,255,255,0.10);
        }
        .card-panel {
          background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
          border: 1px solid rgba(200,205,220,0.15);
          backdrop-filter: blur(20px);
        }
        .stat-divider { border-left: 1px solid rgba(200,205,220,0.15); }
        .link-row { border-bottom: 1px solid rgba(200,205,220,0.10); }
        .link-row:last-child { border-bottom: none; }
        .trend-up { color: #4ade80; }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
        }
      `}</style>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />

      {/* Mesh gradient background — cursor reactive */}
      <div
        className="absolute inset-0 pointer-events-none z-0 mesh-bg"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${mousePos.x}% ${mousePos.y}%, rgba(245,158,11,0.07) 0%, transparent 60%),
                       radial-gradient(ellipse 50% 50% at 80% 20%, rgba(239,68,68,0.06) 0%, transparent 55%),
                       radial-gradient(ellipse 60% 70% at 10% 80%, rgba(99,102,241,0.05) 0%, transparent 60%)`,
        }}
      />

      {/* Subtle horizontal scanline */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-0 opacity-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.8) 50%, transparent 100%)',
          animation: 'scanline 12s linear infinite',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-0 min-h-screen flex items-center">
        <div className="w-full grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-12 xl:gap-20 items-center">

          {/* LEFT — Copy & CTA */}
          <div className="flex flex-col">
            {/* Label chip */}
            <div className="anim-1 inline-flex items-center gap-2.5 self-start px-3.5 py-1.5 rounded-full label-chip mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 glow-pulse" />
              <span className="text-amber-300/80 text-xs font-medium tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                10M+ links shortened this month
              </span>
            </div>

            {/* Headline */}
            <h1
              className="anim-2 font-bold leading-[1.02] tracking-[-0.03em] mb-6"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                color: '#f5f5f0',
              }}
            >
              Every link tells{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                a story.
              </span>
              <br />
              Make yours{' '}
              <span style={{ color: 'rgba(245,245,240,0.45)' }}>count.</span>
            </h1>

            {/* Sub-copy */}
            <p
              className="anim-3 mb-10 leading-relaxed max-w-[520px]"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1.05rem',
                color: 'rgba(245,245,240,0.45)',
              }}
            >
              Shorten, brand, and track your links with click-level precision. Know exactly who clicked, from where, and on what device — before your next campaign debrief.
            </p>

            {/* URL Input */}
            <div className="anim-4 w-full max-w-[600px] mb-3">
              <div className="input-wrap rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Icon name="LinkIcon" size={17} variant="outline" className="text-white/25 flex-shrink-0" />
                  <input
                    type="text"
                    value={url}
                    onChange={handleInputChange}
                    placeholder="Paste your long URL here…"
                    className="w-full py-3.5 bg-transparent text-white/85 placeholder-white/25 focus:outline-none text-[0.95rem]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                    aria-label="URL input"
                    disabled={!isHydrated}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  disabled={isLoading || !isHydrated}
                  className="cta-btn flex-shrink-0 px-7 py-3.5 rounded-xl font-semibold text-white text-[0.95rem] flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Icon name="BoltIcon" size={16} variant="solid" />
                      Shorten
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1.5 pl-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                  {error}
                </p>
              )}
            </div>

            <p
              className="anim-4 mb-12 pl-2"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'rgba(245,245,240,0.28)' }}
            >
              Free forever · No credit card · SSL on every link
            </p>

            {/* Stats row */}
            <div className="anim-5 flex items-center gap-0">
              {[
                { value: '10M+', label: 'Links created' },
                { value: '500K+', label: 'Active users' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '150+', label: 'Countries' },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col px-6 first:pl-0 ${i > 0 ? 'stat-divider' : ''}`}
                >
                  <span
                    className="font-bold leading-none mb-1"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '1.5rem',
                      color: '#f5f5f0',
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.72rem',
                      color: 'rgba(245,245,240,0.35)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Live dashboard mockup */}
          <div className="hidden lg:block anim-right">
            <div className="card-panel rounded-2xl overflow-hidden" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(200,205,220,0.15)' }}>
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(200,205,220,0.12)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 glow-pulse" />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'rgba(245,245,240,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Live Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(200,205,220,0.25)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(200,205,220,0.25)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(200,205,220,0.25)' }} />
                </div>
              </div>

              {/* Mini sparkline chart */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-end justify-between mb-1">
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(245,245,240,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Clicks this week</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: '#4ade80' }}>↑ 24% vs last week</span>
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#f5f5f0', lineHeight: 1.1 }} className="mb-3">
                  48,291
                </div>
                {/* SVG sparkline */}
                <svg viewBox="0 0 320 60" className="w-full" style={{ height: 56 }}>
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,45 L45,38 L90,30 L135,35 L180,20 L225,15 L270,8 L320,4" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0,45 L45,38 L90,30 L135,35 L180,20 L225,15 L270,8 L320,4 L320,60 L0,60 Z" fill="url(#sparkGrad)" />
                  {/* Data point dots */}
                  {[[45,38],[90,30],[135,35],[180,20],[225,15],[270,8],[320,4]].map(([x,y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill="#f59e0b" opacity="0.7" />
                  ))}
                </svg>
              </div>

              {/* Links list */}
              <div className="px-5 pb-2" style={{ borderTop: '1px solid rgba(200,205,220,0.10)' }}>
                <div className="flex items-center justify-between py-3 mb-1">
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'rgba(245,245,240,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Links</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'rgba(245,245,240,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Clicks</span>
                </div>
                {recentLinks.map((link, i) => (
                  <div key={i} className="link-row flex items-center justify-between py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className="truncate mb-0.5"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#f5f5f0', fontWeight: 500 }}
                      >
                        {link.short}
                      </div>
                      <div
                        className="truncate"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(245,245,240,0.3)' }}
                      >
                        {link.original}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#f5f5f0', fontWeight: 600 }}>
                        {link.clicks.toLocaleString()}
                      </span>
                      <span className="trend-up" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', fontWeight: 500 }}>
                        {link.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom geo bar */}
              <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(200,205,220,0.10)', background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-center justify-between mb-2.5">
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'rgba(245,245,240,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top Regions</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { region: 'United States', pct: 42, color: '#f59e0b' },
                    { region: 'United Kingdom', pct: 18, color: '#ef4444' },
                    { region: 'Germany', pct: 11, color: '#a78bfa' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(245,245,240,0.45)', width: 110, flexShrink: 0 }}>{r.region}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(200,205,220,0.15)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${r.pct}%`, background: r.color, opacity: 0.8 }}
                        />
                      </div>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(245,245,240,0.35)', width: 28, textAlign: 'right' }}>{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge below card */}
            <div className="flex items-center justify-center mt-4 gap-2">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 glow-pulse" />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(74,222,128,0.7)' }}>
                  All systems operational
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;