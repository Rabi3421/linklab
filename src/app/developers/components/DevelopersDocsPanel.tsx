'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

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

const endpointCards = [
  {
    method: 'POST',
    path: '/v1/links',
    title: 'Create a branded short link',
    description: 'Create a short link with UTM parameters, tags, and a custom slug in a single request.',
  },
  {
    method: 'GET',
    path: '/v1/links/{id}/analytics',
    title: 'Fetch analytics',
    description: 'Retrieve clicks, referrers, geo, devices, and hourly traffic patterns for a link or campaign.',
  },
  {
    method: 'POST',
    path: '/v1/webhooks',
    title: 'Subscribe to events',
    description: 'Register delivery URLs for click, link.updated, and link.disabled events with retry guarantees.',
  },
] as const;

const sdkList = ['JavaScript / TypeScript', 'Node.js server SDK', 'Python client', 'REST over cURL', 'Webhook verification helpers'] as const;

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

export default function DevelopersDocsPanel() {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useMemo(
    () =>
      Object.fromEntries(
        sidebarLinks.map((item) => [item.id, { current: null as HTMLElement | null }]),
      ) as Record<(typeof sidebarLinks)[number]['id'], { current: HTMLElement | null }>,
    [],
  );
  const [activeSection, setActiveSection] = useState<(typeof sidebarLinks)[number]['id']>('overview');

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    const updateActiveSection = () => {
      const containerTop = contentElement.getBoundingClientRect().top;
      let nextActive = activeSection;

      for (const item of sidebarLinks) {
        const section = sectionRefs[item.id].current;

        if (!section) {
          continue;
        }

        const topOffset = section.getBoundingClientRect().top - containerTop;

        if (topOffset <= 120) {
          nextActive = item.id;
        }
      }

      if (nextActive !== activeSection) {
        setActiveSection(nextActive);
      }
    };

    updateActiveSection();
    contentElement.addEventListener('scroll', updateActiveSection, { passive: true });

    return () => {
      contentElement.removeEventListener('scroll', updateActiveSection);
    };
  }, [activeSection, sectionRefs]);

  const handleNavClick = (sectionId: (typeof sidebarLinks)[number]['id']) => {
    const contentElement = contentRef.current;
    const sectionElement = sectionRefs[sectionId].current;

    if (!contentElement || !sectionElement) {
      return;
    }

    const targetTop = sectionElement.offsetTop - 12;

    contentElement.scrollTo({ top: targetTop, behavior: 'smooth' });
    setActiveSection(sectionId);
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as (typeof sidebarLinks)[number]['id'];

    if (!hash || !sidebarLinks.some((item) => item.id === hash)) {
      return;
    }

    requestAnimationFrame(() => handleNavClick(hash));
  }, []);

  return (
    <section className="relative overflow-hidden py-20 lg:py-10" style={sectionDividerStyle}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] items-start lg:h-[calc(100vh-84px)] lg:overflow-hidden">
        <aside className="lg:sticky lg:top-[92px] lg:h-[calc(100vh-124px)] lg:self-start space-y-4">
          <div className="rounded-3xl p-5" style={glassCardStyle}>
            <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">On this page</div>
            <nav className="space-y-2">
              {sidebarLinks.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left block rounded-xl px-3 py-2 font-body text-sm transition-colors duration-200 ${
                      isActive ? 'text-amber-300 bg-white/6' : 'text-white/55 hover:text-amber-300 hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
            <div className="font-body text-xs uppercase tracking-[0.16em] text-amber-300/75 mb-3">Documentation research notes</div>
            <p className="font-body text-sm leading-relaxed text-white/50">
              Inspired by the quickstart-first layout, SDK surfacing, and operational sections commonly seen in documentation products like Dub and Supabase.
            </p>
          </div>
        </aside>

        <div ref={contentRef} className="space-y-8 min-w-0 lg:h-[calc(100vh-124px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
          <section
            id="overview"
            ref={(element) => {
              sectionRefs.overview.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                <Icon name="BookOpenIcon" size={20} variant="solid" className="text-white" />
              </div>
              <h2 className="font-heading text-3xl font-bold">Overview</h2>
            </div>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              LinkLab exposes a REST API for creating links, organizing campaigns, reading analytics, and subscribing to click events. The design goal is straightforward integration for internal tooling, product workflows, campaign automation, and attribution pipelines.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {endpointCards.map((endpoint) => (
                <div key={endpoint.path} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.12)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] text-white" style={{ background: endpoint.method === 'GET' ? 'rgba(99,102,241,0.7)' : 'rgba(245,158,11,0.85)' }}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-xs text-white/45">{endpoint.path}</span>
                  </div>
                  <div className="font-heading text-lg font-semibold mb-2">{endpoint.title}</div>
                  <p className="font-body text-sm leading-relaxed text-white/50">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="quickstart"
            ref={(element) => {
              sectionRefs.quickstart.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Quickstart</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-5">
              A clean quickstart is one of the most common patterns across effective docs. Start with one token, one endpoint, one copyable request, and one predictable response.
            </p>
            <div className="space-y-3 mb-6">
              {[
                'Generate a workspace API token from the LinkLab dashboard.',
                'Use a bearer token in the `Authorization` header.',
                'Create your first link with a single POST request.',
                'Store returned `id` values for analytics and webhook correlation.',
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    {index + 1}
                  </div>
                  <p className="font-body text-sm text-white/56 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl p-5 overflow-x-auto" style={codeBlockStyle}>
              <pre className="font-mono text-sm text-white/78 whitespace-pre-wrap">{curlExample}</pre>
            </div>
          </section>

          <section
            id="authentication"
            ref={(element) => {
              sectionRefs.authentication.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Authentication</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-5">
              LinkLab uses bearer token authentication. Tokens are scoped to a workspace and should be rotated if they are exposed. For server-to-server integrations, keep tokens in a secret manager or deployment environment variable.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-amber-300/75 mb-3">Header format</div>
                <code className="font-mono text-sm text-white/80">Authorization: Bearer ll_live_xxxxxxxxx</code>
              </div>
              <div className="rounded-2xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-emerald-300/75 mb-3">Recommended model</div>
                <p className="font-body text-sm leading-relaxed text-white/52">Use test tokens for local or staging environments and live tokens only in production workflows.</p>
              </div>
            </div>
          </section>

          <section
            id="api-reference"
            ref={(element) => {
              sectionRefs['api-reference'].current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">API Reference</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              Most developer docs earn trust by showing actual request and response shapes. Below is the first-call response model teams usually need for dashboards, automation, and attribution pipelines.
            </p>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr]">
              <div className="rounded-3xl p-5 overflow-x-auto" style={codeBlockStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">Sample response</div>
                <pre className="font-mono text-sm text-white/78 whitespace-pre-wrap">{responseExample}</pre>
              </div>
              <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">Error model</div>
                <div className="space-y-3">
                  {errorRows.map((row) => (
                    <div key={row.code} className="flex items-start gap-3 rounded-xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <span className="font-mono text-sm text-amber-300/90 min-w-[40px]">{row.code}</span>
                      <span className="font-body text-sm text-white/54">{row.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="webhooks"
            ref={(element) => {
              sectionRefs.webhooks.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Webhooks</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              Strong developer documentation usually covers event delivery semantics, retries, and verification — not just the endpoint shape. LinkLab delivers webhook events with signed headers and exponential retry behavior for transient failures.
            </p>
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">Delivery guarantees</div>
                <div className="space-y-3">
                  {['Signed payloads with timestamp headers', 'Automatic retries on non-2xx responses', 'Idempotent event IDs for safe reprocessing', 'Separate webhook secret per environment'].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-emerald-400 mt-0.5" />
                      <span className="font-body text-sm text-white/54">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl p-5 overflow-x-auto" style={codeBlockStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">Example event</div>
                <pre className="font-mono text-sm text-white/78 whitespace-pre-wrap">{webhookExample}</pre>
              </div>
            </div>
          </section>

          <section
            id="sdks"
            ref={(element) => {
              sectionRefs.sdks.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">SDKs & Integration Paths</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-5">
              Modern docs often surface SDKs early so teams can choose between a lightweight REST integration and higher-level client helpers.
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sdkList.map((sdk) => (
                <div key={sdk} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      <Icon name="CommandLineIcon" size={18} variant="solid" className="text-white" />
                    </div>
                    <span className="font-body text-sm text-white/60">{sdk}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="rate-limits"
            ref={(element) => {
              sectionRefs['rate-limits'].current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Rate Limits</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              Clear rate-limit docs reduce support load and help integrators design resilient clients. LinkLab communicates rate limit state via response headers and recommends exponential backoff on `429` responses.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Free', '60 req/min', 'Good for prototypes and light internal tooling.'],
                ['Launch & Growth', '300 req/min', 'Enough for campaign workflows, sync jobs, and analytics pulls.'],
                ['Scale & Enterprise', 'Custom', 'Higher burst and sustained limits for platform-level integrations.'],
              ].map(([tier, limit, copy]) => (
                <div key={tier} className="rounded-2xl p-5" style={glassCardSoftStyle}>
                  <div className="font-body text-xs uppercase tracking-[0.14em] text-amber-300/75 mb-2">{tier}</div>
                  <div className="font-heading text-2xl font-bold mb-2">{limit}</div>
                  <p className="font-body text-sm leading-relaxed text-white/52">{copy}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
