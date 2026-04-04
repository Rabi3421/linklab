import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import Footer from '@/app/homepage/components/Footer';
import CTASection from '@/app/homepage/components/CTASection';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'About LinkLab - Built for Better Link Intelligence',
  description:
    'Learn about LinkLab, our mission, and the team principles behind a modern URL platform built for growth, clarity, and dependable analytics.',
};

const noiseOverlayStyle = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
  opacity: 0.022,
} as const;

const glassCardStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
  border: '1px solid rgba(200,205,220,0.14)',
  backdropFilter: 'blur(18px)',
} as const;

const glassCardSoftStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
  border: '1px solid rgba(200,205,220,0.12)',
  backdropFilter: 'blur(14px)',
} as const;

const labelChipStyle = {
  background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
  border: '1px solid rgba(245,158,11,0.24)',
} as const;

const stats = [
  { value: '10M+', label: 'links shortened', detail: 'across campaigns, launches, and evergreen content' },
  { value: '500K+', label: 'active teams', detail: 'from solo founders to globally distributed orgs' },
  { value: '99.9%', label: 'uptime SLA', detail: 'supported by resilient infrastructure and observability' },
];

const values = [
  {
    title: 'Clarity over clutter',
    description: 'We design every workflow so teams can move from raw click data to useful decisions without digging through noise.',
    icon: 'ChartBarIcon',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    title: 'Built for teams',
    description: 'Sharing, governance, and visibility are part of the foundation so collaboration feels natural as your company grows.',
    icon: 'UserGroupIcon',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    title: 'Fast by default',
    description: 'Every redirect, dashboard, and reporting surface is shaped to feel responsive and dependable under real traffic.',
    icon: 'BoltIcon',
    gradient: 'linear-gradient(135deg, #fb923c, #f59e0b)',
  },
  {
    title: 'Trust is a feature',
    description: 'Security, uptime, and transparent systems health matter just as much as elegant interfaces and rich analytics.',
    icon: 'ShieldCheckIcon',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
] as const;

const principles = [
  {
    step: '01',
    title: 'Create with intent',
    copy: 'Short links should feel branded, memorable, and connected to a real campaign goal from the start.',
  },
  {
    step: '02',
    title: 'Measure what matters',
    copy: 'We focus on the signals that help teams adjust messaging, channel mix, and timing with confidence.',
  },
  {
    step: '03',
    title: 'Scale without friction',
    copy: 'As your library of links grows, LinkLab keeps structure, speed, and visibility intact for the whole team.',
  },
];

export default function AboutPage() {
  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0" style={noiseOverlayStyle} />
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 20% 20%, rgba(245,158,11,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 45% 50% at 80% 18%, rgba(99,102,241,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 40% 45% at 50% 82%, rgba(239,68,68,0.05) 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8" style={labelChipStyle}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                    About LinkLab
                  </span>
                </div>

                <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.04em] mb-6 text-white">
                  We help every link
                  <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    explain the story behind the click.
                  </span>
                </h1>

                <p className="max-w-[640px] font-body text-lg lg:text-xl leading-relaxed text-white/58 mb-10">
                  LinkLab was created for modern teams that need more than a short URL. We combine branded link creation,
                  fast infrastructure, and practical analytics so marketing, product, and operations can move from traffic to insight.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl p-5" style={glassCardSoftStyle}>
                      <div className="font-heading text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="font-body text-sm font-semibold uppercase tracking-[0.12em] text-white/68 mb-2">
                        {stat.label}
                      </div>
                      <p className="font-body text-sm leading-relaxed text-white/42">{stat.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] p-6 lg:p-8" style={glassCardStyle}>
                <div className="grid gap-5">
                  <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.12)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                        <Icon name="RocketLaunchIcon" size={22} variant="solid" className="text-white" />
                      </div>
                      <div>
                        <div className="font-heading text-xl font-semibold text-white">Why we started</div>
                        <div className="font-body text-sm text-white/40">A smarter layer between links and decisions</div>
                      </div>
                    </div>
                    <p className="font-body text-base leading-relaxed text-white/55">
                      Most teams were juggling generic shorteners, spreadsheets, and dashboards that never fully connected. LinkLab brings those workflows together in one calm, reliable workspace.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.12)' }}>
                      <div className="font-body text-xs uppercase tracking-[0.14em] text-amber-300/70 mb-3">Our mission</div>
                      <p className="font-body text-sm leading-relaxed text-white/52">
                        Give teams link intelligence that is beautiful to use, easy to share, and useful in daily decisions.
                      </p>
                    </div>
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.12)' }}>
                      <div className="font-body text-xs uppercase tracking-[0.14em] text-emerald-300/75 mb-3">Our promise</div>
                      <p className="font-body text-sm leading-relaxed text-white/52">
                        Keep performance, clarity, and trust at the center of every feature we ship.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,205,220,0.12)' }}>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="font-body text-xs uppercase tracking-[0.14em] text-white/35">Operating principles</span>
                      <span className="font-body text-xs text-emerald-300/75">All systems operational</span>
                    </div>
                    <div className="space-y-3">
                      {['Move fast, but make data readable', 'Design for teams, not only power users', 'Keep infrastructure calm under pressure'].map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="font-body text-sm text-white/56">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={{ borderTop: '1px solid rgba(200,205,220,0.1)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[620px] mb-14">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">What guides us</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Principles that shape the platform</h2>
              <p className="font-body text-lg text-white/52 leading-relaxed">
                We build LinkLab around a few clear beliefs so the product keeps feeling focused, fast, and trustworthy as it grows.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="rounded-3xl p-7 h-full" style={glassCardSoftStyle}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: value.gradient }}>
                    <Icon name={value.icon as never} size={24} variant="solid" className="text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-white/52">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={{ borderTop: '1px solid rgba(200,205,220,0.08)' }}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-start">
              <div>
                <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">How we think</p>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                  A product mindset built for steady growth.
                </h2>
                <p className="font-body text-lg leading-relaxed text-white/52 max-w-[560px]">
                  The best analytics products do not just display numbers — they create confidence. Our workflow is built to make teams faster, clearer, and more aligned around what actually matters.
                </p>
              </div>

              <div className="grid gap-4">
                {principles.map((principle) => (
                  <div key={principle.step} className="rounded-3xl p-6 lg:p-7" style={glassCardStyle}>
                    <div className="flex items-start gap-5">
                      <div className="font-heading text-4xl font-bold leading-none text-white/18">{principle.step}</div>
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-white mb-2">{principle.title}</h3>
                        <p className="font-body text-base leading-relaxed text-white/52">{principle.copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
        <Footer />
      </main>
    </>
  );
}
