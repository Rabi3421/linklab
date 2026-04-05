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
  { id: 'create-link', label: 'Create Link' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'plan-limits', label: 'Plan Limits' },
  { id: 'errors', label: 'Errors' },
] as const;

const endpointCards = [
  {
    method: 'POST',
    path: '/api/links',
    title: 'Create a short link',
    description:
      'Create a short link with an optional alias, expiration date, and saved QR style using either a session or API key.',
  },
  {
    method: 'GET',
    path: '/api/links/{id}/analytics',
    title: 'Read link analytics',
    description:
      'Fetch clicks, devices, browsers, countries, referrers, and timeline insights for a link you own.',
  },
  {
    method: 'POST',
    path: '/api/developers/api-key',
    title: 'Generate your API key',
    description:
      'Create or rotate one API key from the dashboard. The key automatically inherits your current pricing plan.',
  },
] as const;

const quickstartSteps = [
  'Log in to LinkLab and open Settings → API access.',
  'Generate one API key and store it safely — it is only shown once.',
  'Send the API key in `Authorization: Bearer <key>` or `x-api-key`.',
  'Create links with `POST /api/links` and store the returned `link.id` for analytics requests.',
] as const;

const createLinkCurl = `curl -X POST https://www.linklab.in/api/links \\
  -H "Authorization: Bearer ll_live_xxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/campaigns/spring-launch?utm_source=api",
    "customAlias": "spring-launch",
    "expirationDate": "2026-05-01",
    "qrStyle": {
      "presetId": "ocean-glow",
      "foregroundColor": "#2563eb",
      "backgroundColor": "#eff6ff",
      "cornerColor": "#0f172a",
      "dotStyle": "dots",
      "cornerStyle": "classy-rounded",
      "frameStyle": "glass"
    }
  }'`;

const createLinkResponse = `{
  "link": {
    "id": "67fd9e4f2aa4a7e1d763e101",
    "originalUrl": "https://example.com/campaigns/spring-launch?utm_source=api",
    "shortCode": "spring-launch",
    "customAlias": "spring-launch",
    "createdAt": "4/5/2026",
    "clicks": 0,
    "status": "active",
    "expirationDate": "5/1/2026",
    "shortUrl": "https://www.linklab.in/spring-launch",
    "qrCodeDataUrl": "data:image/png;base64,..."
  },
  "quota": {
    "planId": "launch",
    "planName": "Launch",
    "subscriptionStatus": "active",
    "isPaid": true,
    "quotaSubject": "account",
    "monthlyLinkLimit": 500,
    "linksUsedThisMonth": 42,
    "linksRemainingThisMonth": 458,
    "upgradeRequired": false,
    "currentPeriodKey": "2026-04",
    "resetAt": "2026-05-01T00:00:00.000Z"
  }
}`;

const analyticsCurl = `curl -X GET https://www.linklab.in/api/links/67fd9e4f2aa4a7e1d763e101/analytics \\
  -H "x-api-key: ll_live_xxxxxxxxxxxxxxxxx"`;

const analyticsResponse = `{
  "analytics": {
    "selectedCode": "spring-launch",
    "metrics": [
      { "title": "Total Clicks", "value": "128", "subtitle": "84 in the last 7 days" },
      { "title": "Unique Visitors", "value": "91", "subtitle": "63 unique visitors this week" }
    ],
    "timeline": [
      { "date": "04/01", "clicks": 12, "uniqueVisitors": 9 },
      { "date": "04/02", "clicks": 18, "uniqueVisitors": 14 }
    ],
    "linkDetails": {
      "originalUrl": "https://example.com/campaigns/spring-launch?utm_source=api",
      "shortUrl": "https://www.linklab.in/spring-launch",
      "shortCode": "spring-launch",
      "createdDate": "4/5/2026",
      "status": "active",
      "qrCodeDataUrl": "data:image/png;base64,..."
    }
  }
}`;

const errorRows = [
  { code: '400', meaning: 'Invalid payload, malformed URL, or unsupported alias format.' },
  { code: '401', meaning: 'Missing session or invalid API key.' },
  { code: '402', meaning: 'Monthly shortening quota reached for the current pricing plan.' },
  { code: '404', meaning: 'Requested link was not found for the authenticated owner.' },
  { code: '500', meaning: 'Unexpected platform issue. Safe to retry with backoff.' },
] as const;

const planRows = [
  [
    'Free',
    '5 links / month',
    'Session or API key requests count against the same account quota once you are logged in.',
  ],
  [
    'Launch',
    '500 links / month',
    'Best for small products, internal tools, and lightweight automations.',
  ],
  ['Growth', '5,000 links / month', 'Built for campaign automation and recurring analytics pulls.'],
  [
    'Scale',
    '25,000 links / month',
    'Supports larger teams and high-volume link provisioning workflows.',
  ],
] as const;

export default function DevelopersDocsPanel() {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useMemo(
    () =>
      Object.fromEntries(
        sidebarLinks.map((item) => [item.id, { current: null as HTMLElement | null }])
      ) as Record<(typeof sidebarLinks)[number]['id'], { current: HTMLElement | null }>,
    []
  );
  const [activeSection, setActiveSection] =
    useState<(typeof sidebarLinks)[number]['id']>('overview');

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

    contentElement.scrollTo({ top: sectionElement.offsetTop - 12, behavior: 'smooth' });
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
            <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">
              On this page
            </div>
            <nav className="space-y-2">
              {sidebarLinks.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left block rounded-xl px-3 py-2 font-body text-sm transition-colors duration-200 ${
                      isActive
                        ? 'text-amber-300 bg-white/6'
                        : 'text-white/55 hover:text-amber-300 hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
            <div className="font-body text-xs uppercase tracking-[0.16em] text-amber-300/75 mb-3">
              Current integration model
            </div>
            <p className="font-body text-sm leading-relaxed text-white/50">
              LinkLab currently supports API-key authentication for server-side link creation and
              analytics retrieval. Pricing and monthly quota are enforced automatically per account.
            </p>
          </div>
        </aside>

        <div
          ref={contentRef}
          className="space-y-8 min-w-0 lg:h-[calc(100vh-124px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar"
        >
          <section
            id="overview"
            ref={(element) => {
              sectionRefs.overview.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
              >
                <Icon name="BookOpenIcon" size={20} variant="solid" className="text-white" />
              </div>
              <h2 className="font-heading text-3xl font-bold">Overview</h2>
            </div>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              LinkLab exposes a practical REST API on the same application domain you already use in
              the dashboard. Logged-in users can generate one API key, and that key automatically
              inherits the current pricing plan, monthly shortening allowance, and analytics access
              of the owning account.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {endpointCards.map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(200,205,220,0.12)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
                      style={{
                        background:
                          endpoint.method === 'GET'
                            ? 'rgba(99,102,241,0.7)'
                            : 'rgba(245,158,11,0.85)',
                      }}
                    >
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-xs text-white/45">{endpoint.path}</span>
                  </div>
                  <div className="font-heading text-lg font-semibold mb-2">{endpoint.title}</div>
                  <p className="font-body text-sm leading-relaxed text-white/50">
                    {endpoint.description}
                  </p>
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
              The shortest path to integration is intentionally simple: generate one API key, create
              one link, store the returned `link.id`, and use that identifier for analytics.
            </p>
            <div className="space-y-3">
              {quickstartSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl px-4 py-4"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(200,205,220,0.10)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                  >
                    {index + 1}
                  </div>
                  <p className="font-body text-sm text-white/56 leading-relaxed">{step}</p>
                </div>
              ))}
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
              API keys are owned by one account and are not scoped separately from the account’s
              current plan. If the plan changes, the API key immediately inherits the updated
              monthly limit and access behavior.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-amber-300/75 mb-3">
                  Preferred header
                </div>
                <code className="font-mono text-sm text-white/80 break-all">
                  Authorization: Bearer ll_live_xxxxxxxxxxxxxxxxx
                </code>
              </div>
              <div className="rounded-2xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-emerald-300/75 mb-3">
                  Alternative header
                </div>
                <code className="font-mono text-sm text-white/80 break-all">
                  x-api-key: ll_live_xxxxxxxxxxxxxxxxx
                </code>
              </div>
            </div>
            <div className="mt-5 rounded-2xl p-5" style={glassCardSoftStyle}>
              <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-3">
                Key management endpoints
              </div>
              <div className="space-y-2 text-sm text-white/56 font-mono">
                <div>GET /api/developers/api-key</div>
                <div>POST /api/developers/api-key</div>
                <div>DELETE /api/developers/api-key</div>
              </div>
              <p className="mt-3 text-sm text-white/50">
                These management endpoints require a logged-in dashboard session. They are intended
                for the LinkLab UI, not for third-party public use.
              </p>
            </div>
          </section>

          <section
            id="create-link"
            ref={(element) => {
              sectionRefs['create-link'].current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Create Link</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              `POST /api/links` accepts the same core shape used by the LinkLab dashboard. When an
              API key is present, the created link is owned by that account and the request counts
              against that account’s monthly quota.
            </p>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
              <div className="rounded-3xl p-5 overflow-x-auto" style={codeBlockStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">
                  Request example
                </div>
                <pre className="font-mono text-sm text-white/78 whitespace-pre-wrap">
                  {createLinkCurl}
                </pre>
              </div>
              <div className="rounded-3xl p-5 overflow-x-auto" style={codeBlockStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">
                  Response example
                </div>
                <pre className="font-mono text-sm text-white/78 whitespace-pre-wrap">
                  {createLinkResponse}
                </pre>
              </div>
            </div>
          </section>

          <section
            id="analytics"
            ref={(element) => {
              sectionRefs.analytics.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Analytics</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              Use the `link.id` returned from link creation with `GET /api/links/{'{id}'}/analytics`
              to fetch performance data. Analytics access is restricted to links owned by the
              authenticated account behind the API key.
            </p>
            <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="rounded-3xl p-5 overflow-x-auto" style={codeBlockStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">
                  Request example
                </div>
                <pre className="font-mono text-sm text-white/78 whitespace-pre-wrap">
                  {analyticsCurl}
                </pre>
              </div>
              <div className="rounded-3xl p-5 overflow-x-auto" style={codeBlockStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">
                  Response example
                </div>
                <pre className="font-mono text-sm text-white/78 whitespace-pre-wrap">
                  {analyticsResponse}
                </pre>
              </div>
            </div>
          </section>

          <section
            id="plan-limits"
            ref={(element) => {
              sectionRefs['plan-limits'].current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Plan Limits</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              The API key does not have its own separate quota bucket. It shares the same monthly
              shortening allowance already shown in the dashboard and settings UI.
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {planRows.map(([plan, limit, copy]) => (
                <div key={plan} className="rounded-2xl p-5" style={glassCardSoftStyle}>
                  <div className="font-body text-xs uppercase tracking-[0.14em] text-amber-300/75 mb-2">
                    {plan}
                  </div>
                  <div className="font-heading text-2xl font-bold mb-2">{limit}</div>
                  <p className="font-body text-sm leading-relaxed text-white/52">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="errors"
            ref={(element) => {
              sectionRefs.errors.current = element;
            }}
            className="rounded-[28px] p-6 lg:p-8"
            style={glassCardStyle}
          >
            <h2 className="font-heading text-3xl font-bold mb-4">Errors</h2>
            <p className="font-body text-base leading-relaxed text-white/56 mb-6">
              LinkLab uses simple JSON error payloads with a `message` field. Link creation may also
              return a `quota` snapshot when the current plan limit has been reached.
            </p>
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">
                  Error codes
                </div>
                <div className="space-y-3">
                  {errorRows.map((row) => (
                    <div
                      key={row.code}
                      className="flex items-start gap-3 rounded-xl px-3 py-3"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <span className="font-mono text-sm text-amber-300/90 min-w-[40px]">
                        {row.code}
                      </span>
                      <span className="font-body text-sm text-white/54">{row.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.14em] text-white/35 mb-4">
                  Operational notes
                </div>
                <div className="space-y-3 text-sm text-white/54">
                  <div className="flex items-start gap-3">
                    <Icon
                      name="CheckCircleIcon"
                      size={18}
                      variant="solid"
                      className="text-emerald-400 mt-0.5"
                    />
                    <span>Invalid API keys return `401` and do not fall back to guest mode.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon
                      name="CheckCircleIcon"
                      size={18}
                      variant="solid"
                      className="text-emerald-400 mt-0.5"
                    />
                    <span>
                      When quota is exhausted, the create endpoint returns `402` with the latest
                      usage snapshot so clients can prompt for an upgrade.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon
                      name="CheckCircleIcon"
                      size={18}
                      variant="solid"
                      className="text-emerald-400 mt-0.5"
                    />
                    <span>
                      Analytics access is owner-scoped, so an API key can only read links created by
                      the same LinkLab account.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
