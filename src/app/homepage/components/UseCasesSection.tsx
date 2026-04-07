import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

const useCases = [
  {
    icon: 'MegaphoneIcon',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    audience: 'Marketing teams',
    title: 'Track every campaign click',
    description:
      'Create branded short links for email campaigns, paid ads, and social posts. Measure click-through rates, compare channels, and optimise spend with per-link analytics that show location, device, and referral data.',
    tags: ['Email campaigns', 'Paid ads', 'Social media', 'UTM tracking'],
    link: '/register',
  },
  {
    icon: 'CodeBracketIcon',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    audience: 'Developers & product teams',
    title: 'Automate link creation with our API',
    description:
      'Integrate the LinkLab REST API into your backend to shorten URLs, generate branded links, retrieve analytics data, and manage link lifecycles programmatically. Full API documentation and sandbox available.',
    tags: ['REST API', 'Webhooks', 'Bulk shortening', 'Analytics API'],
    link: '/developers',
  },
  {
    icon: 'BuildingStorefrontIcon',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    audience: 'E-commerce & retail brands',
    title: 'Branded links for product pages',
    description:
      'Replace long, messy product URLs with clean branded short links and QR codes for packaging, receipts, and in-store materials. Drive traffic, measure offline-to-online conversions, and maintain brand consistency.',
    tags: ['Custom domains', 'QR codes', 'Offline campaigns', 'Product links'],
    link: '/register',
  },
  {
    icon: 'UsersIcon',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    audience: 'Agencies & content creators',
    title: 'Manage hundreds of links from one workspace',
    description:
      'Organise links by campaign, client, or channel from a shared dashboard. Create, edit, disable, and track links at scale without switching between spreadsheets and platforms.',
    tags: ['Shared workspace', 'Bulk creation', 'Link management', 'Team permissions'],
    link: '/register',
  },
  {
    icon: 'PrinterIcon',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    audience: 'Events & offline campaigns',
    title: 'QR codes for print, signage, and events',
    description:
      'Generate custom QR codes for every short link. Print them on flyers, posters, merchandise, and event badges. Track scan counts and geographic data to measure offline campaign reach.',
    tags: ['QR code generator', 'Offline tracking', 'Event marketing', 'Print campaigns'],
    link: '/register',
  },
  {
    icon: 'ChartPieIcon',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
    audience: 'Analysts & growth teams',
    title: 'Deep link analytics for data-driven decisions',
    description:
      'Get click timelines, peak traffic hours, top countries, device breakdowns, browser distributions, and referral source tracking for every link. Export data and connect to your analytics stack.',
    tags: ['Click analytics', 'Geo data', 'Device tracking', 'Referral sources'],
    link: '/link-analytics',
  },
];

const UseCasesSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#181b22' }}>
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }
        .uc-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
          border: 1px solid rgba(200,205,220,0.13);
          transition: border-color 0.25s, transform 0.25s;
        }
        .uc-card:hover {
          border-color: rgba(200,205,220,0.22);
          transform: translateY(-3px);
        }
      `}</style>

      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 100% 50%, rgba(99,102,241,0.05) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 40% at 0% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)`,
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
        <div className="max-w-[620px] mx-auto text-center mb-16">
          <p className="font-body text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">
            Who uses LinkLab
          </p>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            URL shortener built for every team and use case
          </h2>
          <p className="font-body text-lg text-white/45">
            Whether you're a solo creator or an enterprise team, LinkLab gives you the branded links, analytics, API, and QR codes you need to manage link traffic at any scale.
          </p>
        </div>

        {/* Use case cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map((uc, i) => (
            <div key={i} className="uc-card rounded-2xl p-7 flex flex-col">
              {/* Icon + audience */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: uc.gradient, boxShadow: `0 6px 20px ${uc.color}28` }}
                >
                  <Icon name={uc.icon as any} size={22} variant="solid" className="text-white" />
                </div>
                <span
                  className="font-body text-xs font-bold uppercase tracking-widest"
                  style={{ color: uc.color }}
                >
                  {uc.audience}
                </span>
              </div>

              {/* Title & description */}
              <h3 className="font-heading font-bold text-lg text-white leading-snug mb-3">
                {uc.title}
              </h3>
              <p className="font-body text-sm text-white/45 leading-relaxed mb-5 flex-1">
                {uc.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {uc.tags.map((tag, ti) => (
                  <span
                    key={ti}
                    className="px-2.5 py-1 rounded-md font-body text-xs font-medium text-white/50"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(200,205,220,0.14)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA link */}
              <Link
                href={uc.link}
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium transition-colors"
                style={{ color: uc.color }}
              >
                Learn more
                <Icon name="ArrowRightIcon" size={14} variant="outline" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
