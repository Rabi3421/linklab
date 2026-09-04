import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { capabilities, USP_LINE } from '@/lib/marketing/positioning';

/**
 * Client organization block — replaces the old generic "Link management for teams" card.
 *
 * Honesty note: grouped client workspaces are not built yet (see
 * capabilities.clientWorkspaces). Until they ship, this section describes the
 * naming-convention workflow that genuinely works today and marks the grouped
 * view as in development. Do not rewrite this in the present tense before the
 * feature exists.
 */

const todayWorkflow = [
  {
    icon: 'TagIcon',
    title: 'Client-prefixed aliases',
    description:
      'Give every link a readable alias that starts with the client — acme-diwali, acme-webinar, nova-launch — so the client is visible at a glance in the list and in the link itself.',
  },
  {
    icon: 'PencilSquareIcon',
    title: 'Editable destinations',
    description:
      'Repoint any link to a new destination without changing the short code. The link you already sent to a client’s audience keeps working.',
  },
  {
    icon: 'ChartBarIcon',
    title: 'Per-link analytics',
    description:
      'Every link carries its own click timeline, referrers, devices, and locations — the raw material for a client’s numbers.',
  },
];

const sampleClients = [
  { name: 'Acme Retail', links: 14, accent: '#f59e0b' },
  { name: 'Nova Skincare', links: 9, accent: '#0ea5e9' },
  { name: 'Bright Cafe', links: 6, accent: '#34d399' },
];

const ClientWorkspacesSection = () => {
  const { clientWorkspaces } = capabilities;

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: '#1e2129' }}>
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }
        .glass-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
          border: 1px solid rgba(200,205,220,0.13);
        }
        .client-row {
          border-bottom: 1px solid rgba(200,205,220,0.09);
        }
        .client-row:last-child { border-bottom: none; }
      `}</style>

      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 15% 30%, rgba(245,158,11,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_460px]">
          {/* Copy */}
          <div>
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-widest text-amber-400">
              Built around your client roster
            </p>
            <h2 className="mb-5 font-heading text-4xl font-bold leading-tight text-white lg:text-5xl">
              Your clients are the unit of work, not your links
            </h2>
            <p className="mb-6 font-body text-lg leading-relaxed text-white/48">
              {USP_LINE} Everything you make for a client — the branded links, the QR codes on their
              packaging, the numbers you send them at month end — belongs to that client and stays
              readable to whoever on your team picks it up next.
            </p>

            <div className="mb-8 space-y-5">
              {todayWorkflow.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.22)' }}
                  >
                    <Icon name={item.icon} size={17} variant="solid" className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-heading text-base font-semibold text-white/85">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-white/45">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 font-body text-base font-medium text-amber-400 transition-all duration-250 hover:-translate-y-0.5 hover:text-amber-300"
            >
              Set up your first client
              <Icon name="ArrowRightIcon" size={16} variant="outline" />
            </Link>
          </div>

          {/* Illustrative client list — sample data, clearly labelled. */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <span
                className="font-body text-xs uppercase tracking-widest text-white/35"
              >
                Clients
              </span>
              <span
                className="rounded-md px-2.5 py-1 font-body text-[0.65rem] uppercase tracking-widest text-white/40"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,205,220,0.18)' }}
              >
                Sample data
              </span>
            </div>

            <div className="mb-6">
              {sampleClients.map((client) => (
                <div key={client.name} className="client-row flex items-center gap-3 py-3.5">
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-heading text-xs font-bold text-white"
                    style={{ background: client.accent, opacity: 0.85 }}
                  >
                    {client.name.charAt(0)}
                  </span>
                  <span className="flex-1 font-body text-sm text-white/75">{client.name}</span>
                  <span className="font-body text-xs text-white/35">{client.links} links</span>
                </div>
              ))}
            </div>

            {!clientWorkspaces.shipped && (
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon name="WrenchScrewdriverIcon" size={14} variant="solid" className="text-indigo-300" />
                  <span className="font-body text-[0.68rem] font-semibold uppercase tracking-widest text-indigo-300">
                    {clientWorkspaces.badge}
                  </span>
                </div>
                <p className="font-body text-xs leading-relaxed text-white/45">
                  Grouped client workspaces — one folder per client, with roll-up totals — are being
                  built now. Today you can organise the same way with client-prefixed aliases.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientWorkspacesSection;
