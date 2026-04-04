import Icon from '@/components/ui/AppIcon';

const FeaturesSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#1e2129' }}>
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
        .features-mesh { animation: meshShift 22s ease-in-out infinite; }
        .features-scanline { animation: scanline 16s linear infinite; }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
        }
        .glass-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
          border: 1px solid rgba(200,205,220,0.14);
          backdrop-filter: blur(12px);
        }
        .glass-card-deep {
          background: linear-gradient(135deg, rgba(30,33,41,0.95) 0%, rgba(35,30,60,0.85) 100%);
          border: 1px solid rgba(200,205,220,0.12);
          backdrop-filter: blur(16px);
        }
      `}</style>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />

      {/* Mesh gradient background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 features-mesh"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 85% 20%, rgba(245,158,11,0.06) 0%, transparent 60%),
                       radial-gradient(ellipse 50% 60% at 15% 70%, rgba(99,102,241,0.07) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 40% at 50% 50%, rgba(239,68,68,0.04) 0%, transparent 60%)`,
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

      {/* Scanline */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-0 opacity-10 features-scanline"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.6) 50%, transparent 100%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="max-w-[560px] mb-16">
          <p className="font-body text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">Platform capabilities</p>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            Built for teams that move fast
          </h2>
          <p className="font-body text-lg text-white/50">
            Every tool you need to create, manage, and measure your links — in one place.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Large card - Analytics */}
          <div
            className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden group glass-card-deep"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <Icon name="ChartBarIcon" size={24} variant="solid" className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-white mb-3">Deep-dive analytics</h3>
              <p className="font-body text-white/50 mb-8 max-w-[400px]">
                See exactly who clicked, from where, on what device, and at what time. Geo-heatmaps, referrer breakdowns, and hourly traffic patterns — all in real-time.
              </p>
              {/* Mini chart mockup */}
              <div className="flex items-end gap-1.5 h-16">
                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100]?.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-300 group-hover:opacity-100"
                    style={{
                      height: `${h}%`,
                      background: i >= 9 ? 'linear-gradient(180deg, #f59e0b, #ef4444)' : 'rgba(245,158,11,0.2)',
                      opacity: 0.8
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Custom aliases */}
          <div className="rounded-2xl p-8 relative overflow-hidden glass-card">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.6) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)' }}>
                <Icon name="SparklesIcon" size={24} variant="solid" className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-3">Branded short links</h3>
              <p className="font-body text-white/50 text-sm mb-6">
                Replace random strings with memorable aliases. Your brand, your URL.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(200,205,220,0.14)' }}>
                  <span className="text-white/30 font-mono text-xs">lnkl.ab/</span>
                  <span className="text-amber-400 font-mono text-xs font-semibold">summer-sale</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(200,205,220,0.14)' }}>
                  <span className="text-white/30 font-mono text-xs">lnkl.ab/</span>
                  <span className="text-purple-400 font-mono text-xs font-semibold">product-launch</span>
                </div>
              </div>
            </div>
          </div>

          {/* API card */}
          <div className="rounded-2xl p-8 relative overflow-hidden glass-card">
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)', transform: 'translate(20%, 20%)' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Icon name="CodeBracketIcon" size={24} variant="solid" className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-3">Developer-first API</h3>
              <p className="font-body text-white/50 text-sm mb-6">
                Full REST API with SDKs, webhooks, and comprehensive docs. Automate everything.
              </p>
              <div className="rounded-lg p-3 font-mono text-xs" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(200,205,220,0.12)' }}>
                <span className="text-purple-400">POST</span>
                <span className="text-white/40"> /api/v1/</span>
                <span className="text-green-400">shorten</span>
                <br />
                <span className="text-white/30">{'{'} url: </span>
                <span className="text-yellow-300">"your-url"</span>
                <span className="text-white/30"> {'}'}</span>
              </div>
            </div>
          </div>

          {/* Large card - Security + Team */}
          <div
            className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden glass-card"
            style={{ background: 'linear-gradient(135deg, rgba(30,33,41,0.95) 0%, rgba(28,36,52,0.9) 100%)' }}
          >
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <Icon name="ShieldCheckIcon" size={24} variant="solid" className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-3">Enterprise security</h3>
                <p className="font-body text-white/50 text-sm">
                  SSL on every link, spam detection, phishing protection, and 99.9% uptime SLA backed by global edge infrastructure.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['SSL', 'SOC 2', 'GDPR', '99.9% SLA']?.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-body font-medium text-white/60" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(200,205,220,0.15)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
                  <Icon name="UserGroupIcon" size={24} variant="solid" className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-3">Team workspaces</h3>
                <p className="font-body text-white/50 text-sm">
                  Shared dashboards, role-based permissions, and audit logs. Manage links across your entire organization without the chaos.
                </p>
                <div className="mt-4 flex -space-x-2">
                  {['#f59e0b','#0ea5e9','#10b981','#ef4444']?.map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: c, borderColor: 'rgba(30,33,41,0.9)' }}>
                      {['A','B','C','+']?.[i]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Speed card */}
          <div className="rounded-2xl p-8 relative overflow-hidden glass-card">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.6) 0%, transparent 70%)', transform: 'translate(-20%, -20%)' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <Icon name="BoltIcon" size={24} variant="solid" className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-3">Edge-speed redirects</h3>
              <p className="font-body text-white/50 text-sm mb-6">
                Sub-50ms redirects from 200+ edge nodes worldwide. Your audience never waits.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(200,205,220,0.15)' }}>
                  <div className="h-full rounded-full w-[92%]" style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)' }} />
                </div>
                <span className="font-mono text-sm text-orange-400 font-bold">&lt;50ms</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;