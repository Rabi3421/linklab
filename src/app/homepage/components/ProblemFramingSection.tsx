import Icon from '@/components/ui/AppIcon';

const painPoints = [
  {
    icon: 'ArrowsRightLeftIcon',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    title: 'Client links get mixed up',
    description:
      'One shared account, one flat list, and a dozen aliases that all look alike. The wrong link goes into the wrong client’s WhatsApp broadcast, and you find out from the client.',
  },
  {
    icon: 'DocumentChartBarIcon',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    title: 'There is no client-level view',
    description:
      'Reporting day means filtering a spreadsheet by hand, copying click counts per link, and rebuilding the same deck for every client because the dashboard only thinks in links.',
  },
  {
    icon: 'UserIcon',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    title: 'The tools are built for one brand',
    description:
      'Bitly, Dub, and Rebrandly assume you are a single company shortening your own links. Agencies pay per seat for features built for in-house teams, and still do the client bookkeeping manually.',
  },
];

const ProblemFramingSection = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: '#181b22' }}>
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }
        .pain-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%);
          border: 1px solid rgba(200,205,220,0.12);
          transition: border-color 0.25s;
        }
        .pain-card:hover {
          border-color: rgba(200,205,220,0.22);
        }
      `}</style>

      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 0%, rgba(239,68,68,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-[680px] text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-widest text-amber-400">
            The agency problem
          </p>
          <h2 className="mb-4 font-heading text-4xl font-bold leading-tight text-white lg:text-5xl">
            Managing links for 15 clients in one shared account is chaos
          </h2>
          <p className="font-body text-lg leading-relaxed text-white/45">
            Every campaign adds links. Every client wants their own numbers. The tooling was never
            built for the way an agency actually works.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {painPoints.map((point) => (
            <div key={point.title} className="pain-card rounded-2xl p-7">
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: point.gradient, boxShadow: `0 8px 24px ${point.color}30` }}
              >
                <Icon name={point.icon} size={22} variant="solid" className="text-white" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-bold leading-snug text-white">
                {point.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-white/45">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemFramingSection;
