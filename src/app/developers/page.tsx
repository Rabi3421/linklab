import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import Footer from '@/app/homepage/components/Footer';
import CTASection from '@/app/homepage/components/CTASection';
import Icon from '@/components/ui/AppIcon';
import DevelopersDocsPanel from './components/DevelopersDocsPanel';

export const metadata: Metadata = {
  title: 'Developers - LinkLab Documentation',
  description:
    'Read LinkLab developer documentation for API key setup, link creation, analytics access, plan-based quotas, and production integration guidance.',
};

const noiseOverlayStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
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

const codeBlockStyle = {
  background: 'rgba(10, 12, 18, 0.52)',
  border: '1px solid rgba(200,205,220,0.12)',
} as const;

const labelChipStyle = {
  background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
  border: '1px solid rgba(245,158,11,0.24)',
} as const;

const sectionDividerStyle = {
  borderTop: '1px solid rgba(200,205,220,0.10)',
} as const;

const sidebarLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'sdks', label: 'SDKs' },
  { id: 'rate-limits', label: 'Rate Limits' },
] as const;

const docsHighlights = [
  {
    title: 'Real API quickstart',
    description:
      'Generate one API key from Settings, create one short link, and reuse the returned link ID for analytics requests.',
    icon: 'RocketLaunchIcon',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    title: 'Current endpoint surface',
    description:
      'The docs now describe the actual endpoints available today: API key management, link creation, and owner-scoped analytics.',
    icon: 'CodeBracketSquareIcon',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    title: 'Plan-aware automation',
    description:
      'API requests automatically inherit the owner account’s pricing plan, monthly limits, and analytics access controls.',
    icon: 'ShieldCheckIcon',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
] as const;

const endpointCards = [
  {
    method: 'POST',
    path: '/v1/links',
    title: 'Create a branded short link',
    description:
      'Create a short link with UTM parameters, tags, and a custom slug in a single request.',
  },
  {
    method: 'GET',
    path: '/v1/links/{id}/analytics',
    title: 'Fetch analytics',
    description:
      'Retrieve clicks, referrers, geo, devices, and hourly traffic patterns for a link or campaign.',
  },
  {
    method: 'POST',
    path: '/v1/webhooks',
    title: 'Subscribe to events',
    description:
      'Register delivery URLs for click, link.updated, and link.disabled events with retry guarantees.',
  },
] as const;

const sdkList = [
  'JavaScript / TypeScript',
  'Node.js server SDK',
  'Python client',
  'REST over cURL',
  'Webhook verification helpers',
] as const;

const curlExample = `curl -X POST https://api.linklab.dev/v1/links \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/campaign/spring-launch",
    "domain": "go.example.com",
    "slug": "spring-launch",
    "tags": ["spring", "paid-social"],
    "utm": {
      "source": "instagram",
      "medium": "paid",
      "campaign": "spring_launch"
    }
  }'`;

const responseExample = `{
  "id": "lnk_01JZ0Y7M9D4H1A6R8K2P3Q9W",
  "shortUrl": "https://go.example.com/spring-launch",
  "destinationUrl": "https://example.com/campaign/spring-launch",
  "createdAt": "2026-04-04T14:05:22.923Z",
  "utm": {
    "source": "instagram",
    "medium": "paid",
    "campaign": "spring_launch"
  },
  "tags": ["spring", "paid-social"]
}`;

const webhookExample = `{
  "id": "evt_01JZ0YH9C5NX4MEZW1C9T6SR",
  "type": "link.click",
  "createdAt": "2026-04-04T14:07:11.120Z",
  "data": {
    "linkId": "lnk_01JZ0Y7M9D4H1A6R8K2P3Q9W",
    "shortUrl": "https://go.example.com/spring-launch",
    "country": "IN",
    "device": "mobile",
    "referrer": "instagram.com"
  }
}`;

const errorRows = [
  { code: '400', meaning: 'Invalid payload or unsupported destination URL' },
  { code: '401', meaning: 'Missing or invalid bearer token' },
  { code: '403', meaning: 'Plan does not include requested capability' },
  { code: '429', meaning: 'Rate limit exceeded for your workspace or token' },
  { code: '500', meaning: 'Temporary platform issue — safe to retry with backoff' },
] as const;

export default function DevelopersPage() {
  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0" style={noiseOverlayStyle} />
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 18% 20%, rgba(245,158,11,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 45% 50% at 82% 16%, rgba(99,102,241,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 38% 42% at 50% 82%, rgba(239,68,68,0.05) 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-24">
            <div className="max-w-[900px]">
              <div
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8"
                style={labelChipStyle}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                  Developer documentation
                </span>
              </div>

              <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.04em] mb-6">
                LinkLab for developers,
                <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  in a real documentation format.
                </span>
              </h1>

              <p className="max-w-[760px] font-body text-lg lg:text-xl leading-relaxed text-white/58 mb-10">
                Generate an API key from LinkLab Settings, create short links from your backend, and
                fetch owner-scoped analytics with the same plan limits shown in your dashboard.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {docsHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl p-5" style={glassCardSoftStyle}>
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: item.gradient }}
                    >
                      <Icon
                        name={item.icon as never}
                        size={22}
                        variant="solid"
                        className="text-white"
                      />
                    </div>
                    <h2 className="font-heading text-xl font-bold mb-2">{item.title}</h2>
                    <p className="font-body text-sm leading-relaxed text-white/52">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <DevelopersDocsPanel />

        <CTASection />
        <Footer />
      </main>
    </>
  );
}
