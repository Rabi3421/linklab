import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for individuals trying URL shortening for the first time.',
    links: '10 links/month',
    highlight: false,
    features: ['10 shortened links/month', 'Basic click analytics', 'Custom aliases', 'QR code per link', 'SSL on every redirect'],
    cta: 'Start free',
    href: '/register',
    color: 'rgba(200,205,220,0.14)',
  },
  {
    name: 'Starter',
    price: '$1',
    period: '/month',
    description: 'Great for creators, bloggers, and small teams just getting started.',
    links: '100 links/month',
    highlight: false,
    features: ['100 shortened links/month', 'Full click analytics', 'Branded short links', 'Custom aliases', 'API access'],
    cta: 'Get Starter',
    href: '/register',
    color: '#0ea5e9',
  },
  {
    name: 'Growth',
    price: '$10',
    period: '/month',
    description: 'For growing marketing teams running regular campaigns.',
    links: '2,000 links/month',
    highlight: true,
    features: ['2,000 shortened links/month', 'Advanced analytics', 'Custom domains', 'Bulk link creation', 'Priority support'],
    cta: 'Get Growth',
    href: '/register',
    color: '#f59e0b',
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'High-volume agencies and platforms with 100K monthly links.',
    links: '100,000 links/month',
    highlight: false,
    features: ['100,000 shortened links/month', 'Full analytics suite', 'Multiple custom domains', 'Full API access', 'SLA guarantee'],
    cta: 'Get Pro',
    href: '/register',
    color: '#a78bfa',
  },
];

const PricingSnippetSection = () => {
  return (
    <section
      id="pricing-overview"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: '#1e2129' }}
    >
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }
        .plan-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
          border: 1px solid rgba(200,205,220,0.13);
          transition: border-color 0.25s, transform 0.25s;
        }
        .plan-card:hover {
          border-color: rgba(200,205,220,0.24);
          transform: translateY(-3px);
        }
        .plan-card-highlight {
          background: linear-gradient(145deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.07) 100%);
          border: 1px solid rgba(245,158,11,0.3);
        }
        .plan-card-highlight:hover {
          border-color: rgba(245,158,11,0.5);
          transform: translateY(-3px);
        }
        .cta-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          transition: opacity 0.2s, transform 0.2s;
        }
        .cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 55% 50% at 50% 100%, rgba(245,158,11,0.05) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 40% at 0% 50%, rgba(99,102,241,0.04) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="max-w-[640px] mx-auto text-center mb-5">
          <p className="font-body text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            URL shortener plans starting at{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              $1 per month
            </span>
          </h2>
          <p className="font-body text-lg text-white/45 mb-3">
            Start free, scale on your terms. No long contracts, no setup fees. Pay only for the volume of short links and features you actually need.
          </p>
        </div>

        {/* Value callout */}
        <div className="flex justify-center mb-14">
          <div
            className="inline-flex flex-wrap justify-center gap-x-8 gap-y-2 px-6 py-3 rounded-2xl"
            style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)' }}
          >
            {[
              'Free tier forever',
              'Plans from $1/month',
              'No-expiry link credit packs available',
              'Enterprise custom pricing',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-emerald-400" />
                <span className="font-body text-sm text-emerald-300/70">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col relative ${plan.highlight ? 'plan-card-highlight' : 'plan-card'}`}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold font-body text-white"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', whiteSpace: 'nowrap' }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <p
                  className="font-body text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-heading font-bold text-4xl text-white">{plan.price}</span>
                  <span className="font-body text-sm text-white/35 mb-1.5">{plan.period}</span>
                </div>
                <p className="font-body text-sm text-white/40 leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <Icon
                      name="CheckIcon"
                      size={14}
                      variant="solid"
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: plan.color } as React.CSSProperties}
                    />
                    <span className="font-body text-sm text-white/55 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-3 rounded-xl text-center font-body font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'cta-btn text-white'
                    : 'text-white/75 hover:text-white'
                }`}
                style={
                  plan.highlight
                    ? {}
                    : { border: '1px solid rgba(200,205,220,0.18)', background: 'rgba(255,255,255,0.07)' }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footnote / extra options */}
        <div className="mt-10 text-center">
          <p className="font-body text-sm text-white/35 mb-2">
            Need more volume?{' '}
            <Link href="/pricing" className="text-amber-400/80 hover:text-amber-400 transition-colors">
              See all plans
            </Link>{' '}
            including the Scale ($29) plan, 100K Pro plan, and no-expiry one-time link credit packs.
          </p>
          <p className="font-body text-sm text-white/25">
            High-volume teams and enterprises can{' '}
            <a
              href="mailto:hello@linklab.in?subject=Enterprise%20Plan%20Enquiry"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              contact us for custom pricing
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSnippetSection;
