import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    number: '01',
    icon: 'ClipboardDocumentIcon',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    title: 'Paste your long URL',
    description:
      'Copy any long URL — a landing page, product link, blog post, file share, or campaign destination — and paste it into the LinkLab URL shortener.',
    detail: 'Works with any URL from any website or platform.',
  },
  {
    number: '02',
    icon: 'PencilSquareIcon',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    title: 'Customise your short link',
    description:
      'Set a custom alias to create a branded short link, choose an expiry date, add UTM parameters for campaign tracking, or let LinkLab generate a short code automatically.',
    detail: 'Example: linklab.in/summer-sale or linklab.in/launch-2026',
  },
  {
    number: '03',
    icon: 'ShareIcon',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    title: 'Share on any channel',
    description:
      'Share your branded short link in social media posts, email campaigns, SMS messages, paid ads, printed materials, or embed it as a QR code for offline campaigns.',
    detail: 'One link works everywhere — online and offline.',
  },
  {
    number: '04',
    icon: 'ChartBarIcon',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    title: 'Track every click in real time',
    description:
      'Monitor click counts, geographic locations, devices, browsers, referral sources, and time-based traffic patterns from your link analytics dashboard. No extra tools needed.',
    detail: 'Real-time short link analytics for every link you create.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#181b22' }}>
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }
        .step-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
          border: 1px solid rgba(200,205,220,0.13);
          transition: border-color 0.2s;
        }
        .step-card:hover {
          border-color: rgba(200,205,220,0.22);
        }
        .connector-line {
          border-top: 1px dashed rgba(200,205,220,0.14);
        }
      `}</style>

      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 60%)`,
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
        <div className="max-w-[600px] mx-auto text-center mb-16">
          <p className="font-body text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            Shorten, share, and track in 4 simple steps
          </h2>
          <p className="font-body text-lg text-white/45">
            From pasting a URL to reading real-time click analytics — the full workflow takes under a minute.
          </p>
        </div>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Desktop connector */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] connector-line z-0" />

          {steps.map((step, i) => (
            <div key={i} className="step-card rounded-2xl p-7 relative">
              {/* Step number */}
              <div
                className="absolute top-5 right-5 font-mono text-xs font-bold tracking-widest"
                style={{ color: 'rgba(200,205,220,0.18)' }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                style={{ background: step.gradient, boxShadow: `0 8px 24px ${step.color}30` }}
              >
                <Icon name={step.icon as any} size={26} variant="solid" className="text-white" />
              </div>

              {/* Content */}
              <h3 className="font-heading font-bold text-lg text-white mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="font-body text-sm text-white/45 leading-relaxed mb-4">
                {step.description}
              </p>
              <p
                className="font-body text-xs font-medium"
                style={{ color: step.color, opacity: 0.8 }}
              >
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom reassurance strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-white/35">
          {[
            { icon: 'CheckCircleIcon', text: 'No credit card required to start' },
            { icon: 'ClockIcon', text: 'First short link in under 60 seconds' },
            { icon: 'LockClosedIcon', text: 'SSL on every redirect, always' },
            { icon: 'ArrowPathIcon', text: 'Links work forever unless you disable them' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 font-body">
              <Icon name={item.icon as any} size={15} variant="solid" className="text-emerald-400/70" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
