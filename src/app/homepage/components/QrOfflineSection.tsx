import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { capabilities } from '@/lib/marketing/positioning';

/**
 * QR + offline campaigns block, sharpened toward the channels agency clients
 * actually run in India: WhatsApp, Instagram, and printed packaging/signage.
 *
 * Dynamic QR is a real, shipped capability — PATCH /api/links/[id] rewrites the
 * destination while the short code (and therefore the printed QR) stays valid.
 */

const channels = [
  {
    icon: 'ChatBubbleLeftRightIcon',
    color: '#25D366',
    label: 'WhatsApp',
    title: 'Broadcasts that do not look like spam',
    description:
      'A clean branded link in a WhatsApp broadcast gets opened. Send one link per client campaign and see exactly how many of their customers tapped it, on which handset, and when.',
  },
  {
    icon: 'CameraIcon',
    color: '#E1306C',
    label: 'Instagram',
    title: 'One bio link you can repoint',
    description:
      'Swap the destination behind a client’s bio or story link when the campaign changes — same link, new landing page, no scrambling to update every post.',
  },
  {
    icon: 'ArchiveBoxIcon',
    color: '#f97316',
    label: 'Packaging & print',
    title: 'QR codes that survive the print run',
    description:
      'Put a QR on a client’s packaging, menu, flyer, or shop signage. When the offer expires, repoint the code instead of reprinting the whole batch.',
  },
];

const QrOfflineSection = () => {
  const { dynamicQr } = capabilities;

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: '#181b22' }}>
      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.022;
        }
        .channel-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
          border: 1px solid rgba(200,205,220,0.13);
          transition: border-color 0.25s, transform 0.25s;
        }
        .channel-card:hover {
          border-color: rgba(200,205,220,0.22);
          transform: translateY(-3px);
        }
      `}</style>

      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 100%, rgba(249,115,22,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-[700px] text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-widest text-amber-400">
            WhatsApp, Instagram & offline
          </p>
          <h2 className="mb-4 font-heading text-4xl font-bold leading-tight text-white lg:text-5xl">
            The channels your clients actually sell in
          </h2>
          <p className="font-body text-lg leading-relaxed text-white/45">
            Agency work in India runs through WhatsApp broadcasts, Instagram profiles, and printed
            material in the real world. Every LinkLab link ships with a matching QR code, and the
            destination behind it stays yours to change.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {channels.map((channel) => (
            <div key={channel.label} className="channel-card rounded-2xl p-7">
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${channel.color}1f`, border: `1px solid ${channel.color}44` }}
                >
                  <Icon
                    name={channel.icon}
                    size={20}
                    variant="solid"
                    style={{ color: channel.color }}
                  />
                </div>
                <span
                  className="font-body text-xs font-semibold uppercase tracking-widest"
                  style={{ color: channel.color, opacity: 0.85 }}
                >
                  {channel.label}
                </span>
              </div>
              <h3 className="mb-3 font-heading text-lg font-bold leading-snug text-white">
                {channel.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-white/45">
                {channel.description}
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic QR callout — this one is real, so it gets to speak in the present tense. */}
        {dynamicQr.shipped && (
          <div
            className="mx-auto flex max-w-[860px] flex-col items-start gap-6 rounded-2xl p-7 sm:flex-row sm:items-center"
            style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }}
            >
              <Icon name="QrCodeIcon" size={26} variant="solid" className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-heading text-lg font-bold text-white">
                Dynamic QR codes — printed once, repointed any time
              </h3>
              <p className="font-body text-sm leading-relaxed text-white/50">
                The QR encodes the short link, not the destination. Change where a link goes and
                every code already printed on a client’s packaging, poster, or standee follows it —
                no reprint, no dead scan.
              </p>
            </div>
            <Link
              href="/qr-code-generator"
              className="inline-flex flex-shrink-0 items-center gap-2 font-body text-sm font-medium text-emerald-300 transition-all duration-250 hover:-translate-y-0.5 hover:text-emerald-200"
            >
              Try the QR generator
              <Icon name="ArrowRightIcon" size={15} variant="outline" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default QrOfflineSection;
