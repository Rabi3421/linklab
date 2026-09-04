import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { capabilities } from '@/lib/marketing/positioning';

/**
 * Analytics block, reframed around the artefact an agency actually needs:
 * the numbers they hand to a client at the end of the month.
 *
 * Honesty note: the analytics themselves are real and live. White-label report
 * export is NOT built (see capabilities.whiteLabelReports) and is marked as such.
 */

const reportableMetrics = [
  {
    icon: 'CursorArrowRaysIcon',
    label: 'Clicks and scans',
    detail: 'Total taps per link, with QR scans counted the same way as clicks.',
  },
  {
    icon: 'GlobeAltIcon',
    label: 'Where they came from',
    detail: 'Country and region breakdowns, so a client can see which market responded.',
  },
  {
    icon: 'DevicePhoneMobileIcon',
    label: 'Device and browser split',
    detail: 'Mobile versus desktop share — the number that settles landing-page arguments.',
  },
  {
    icon: 'ArrowTrendingUpIcon',
    label: 'Referrers and timing',
    detail: 'Which platform sent the traffic, and the hours the client’s audience is awake.',
  },
];

const ClientReportingSection = () => {
  const { whiteLabelReports } = capabilities;

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: '#1e2129' }}>
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }
        .metric-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%);
          border: 1px solid rgba(200,205,220,0.12);
        }
      `}</style>

      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 85% 25%, rgba(99,102,241,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-[700px] text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-widest text-amber-400">
            Client reporting
          </p>
          <h2 className="mb-4 font-heading text-4xl font-bold leading-tight text-white lg:text-5xl">
            Numbers you can send your client, not another dashboard
          </h2>
          <p className="font-body text-lg leading-relaxed text-white/45">
            Your client does not want a login. They want to know whether the campaign worked.
            LinkLab records the evidence per link so the answer takes minutes to assemble, not an
            afternoon of spreadsheet archaeology.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportableMetrics.map((metric) => (
            <div key={metric.label} className="metric-card rounded-2xl p-6">
              <div
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.26)' }}
              >
                <Icon name={metric.icon} size={19} variant="solid" className="text-indigo-300" />
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-white/85">
                {metric.label}
              </h3>
              <p className="font-body text-sm leading-relaxed text-white/45">{metric.detail}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-[900px] flex-col gap-4 sm:flex-row">
          <div
            className="flex-1 rounded-2xl p-6"
            style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.18)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-emerald-400" />
              <span className="font-body text-[0.68rem] font-semibold uppercase tracking-widest text-emerald-300">
                Available today
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed text-white/50">
              Full per-link analytics in the dashboard — clicks, QR scans, geography, devices,
              browsers, referrers, and time-of-day patterns, with retention that scales by plan.
            </p>
          </div>

          {!whiteLabelReports.shipped && (
            <div
              className="flex-1 rounded-2xl p-6"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon name="WrenchScrewdriverIcon" size={16} variant="solid" className="text-indigo-300" />
                <span className="font-body text-[0.68rem] font-semibold uppercase tracking-widest text-indigo-300">
                  {whiteLabelReports.badge}
                </span>
              </div>
              <p className="font-body text-sm leading-relaxed text-white/50">
                White-label client reports — your agency’s logo, one client’s links, exported and
                ready to send — are being built. Today you can pull the same figures from each
                link’s analytics view.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/link-analytics"
            className="inline-flex items-center gap-2 font-body text-base font-medium text-amber-400 transition-all duration-250 hover:-translate-y-0.5 hover:text-amber-300"
          >
            See what link analytics covers
            <Icon name="ArrowRightIcon" size={16} variant="outline" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClientReportingSection;
