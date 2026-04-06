"use client";

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#1e2129' }}>
      <style jsx>{`
        @keyframes meshShift3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(15px, -20px) rotate(0.8deg); }
          66% { transform: translate(-20px, 10px) rotate(-0.6deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .cta-mesh { animation: meshShift3 18s ease-in-out infinite; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
        }
        .cta-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
          border: 1px solid rgba(200,205,220,0.15);
          backdrop-filter: blur(20px);
        }
        .cta-primary-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 60%, #dc2626 100%);
          box-shadow: 0 0 32px rgba(245,158,11,0.25), 0 4px 16px rgba(0,0,0,0.4);
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .cta-primary-btn:hover {
          box-shadow: 0 0 48px rgba(245,158,11,0.4), 0 8px 24px rgba(0,0,0,0.5);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />

      {/* Mesh gradient background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 cta-mesh"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 40% at 20% 80%, rgba(99,102,241,0.06) 0%, transparent 60%),
                       radial-gradient(ellipse 35% 35% at 80% 20%, rgba(239,68,68,0.05) 0%, transparent 60%)`,
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

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden rounded-3xl px-8 py-16 lg:px-16 lg:py-20 text-center cta-card">
          {/* Inner glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full glow-pulse"
              style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.06) 50%, transparent 70%)' }}
            />
            <div
              className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }}
            />
            <div
              className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.6) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }}
            />
          </div>

          {/* Inner dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 glow-pulse" />
              <span className="font-body text-sm text-amber-300/70">Start in under 60 seconds</span>
            </div>

            <h2 className="font-heading font-bold text-4xl lg:text-6xl text-white leading-tight mb-6">
              Your URL shortener should do more than shorten
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                better links, QR codes, and analytics
              </span>
            </h2>

            <p className="font-body text-lg text-white/50 mb-10 max-w-[520px] mx-auto">
              Join teams using LinkLab to shorten URLs, create branded links, track campaign clicks, manage custom domains, and scale link workflows without switching platforms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="cta-primary-btn px-8 py-4 font-body font-semibold text-base text-white rounded-xl flex items-center gap-2"
              >
                Get started free
                <Icon name="ArrowRightIcon" size={18} variant="outline" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 font-body font-semibold text-base text-white/70 rounded-xl transition-all duration-250 hover:text-white"
                style={{ border: '1px solid rgba(200,205,220,0.18)', background: 'rgba(255,255,255,0.07)' }}
              >
                Sign in to your account
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/35">
              {['No credit card required', 'Free forever plan', '5-minute setup']?.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon name="CheckCircleIcon" size={15} variant="solid" className="text-emerald-500" />
                  <span className="font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;