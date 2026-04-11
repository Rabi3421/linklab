'use client';

import { useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

// ── helpers ────────────────────────────────────────────────────────────────

const METHOD_STYLES: Record<string, string> = {
  POST:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  GET:    'bg-sky-500/15    text-sky-400    border-sky-500/20',
  PATCH:  'bg-amber-500/15  text-amber-400  border-amber-500/20',
  DELETE: 'bg-red-500/15    text-red-400    border-red-500/20',
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-bold ${METHOD_STYLES[method] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {method}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      <Icon name={copied ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={12} variant="outline" className={copied ? 'text-success' : ''} />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  return (
    <div className="relative group">
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto rounded-xl border border-border bg-[#0d1117] px-5 py-4 font-mono text-xs leading-relaxed text-[#e6edf3]">
        {code}
      </pre>
    </div>
  );
}

function ParamRow({ name, type, required, desc }: { name: string; type: string; required?: boolean; desc: string }) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-border last:border-0">
      <div className="w-40 flex-shrink-0">
        <code className="text-xs font-mono text-foreground">{name}</code>
        {required && <span className="ml-1.5 text-[10px] font-semibold uppercase text-error">required</span>}
      </div>
      <div className="w-24 flex-shrink-0">
        <span className="text-xs font-mono text-amber-400">{type}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function ResponseRow({ field, type, desc }: { field: string; type: string; desc: string }) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-border last:border-0">
      <div className="w-44 flex-shrink-0">
        <code className="text-xs font-mono text-foreground">{field}</code>
      </div>
      <div className="w-20 flex-shrink-0">
        <span className="text-xs font-mono text-sky-400">{type}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

// ── section ids ────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'authentication', label: 'Authentication' },
  { id: 'create-link',    label: 'Create link' },
  { id: 'list-links',     label: 'List links' },
  { id: 'get-link',       label: 'Get link' },
  { id: 'update-link',    label: 'Update link' },
  { id: 'delete-link',    label: 'Delete link' },
  { id: 'analytics',      label: 'Link analytics' },
  { id: 'errors',         label: 'Errors & limits' },
] as const;

// ── main component ─────────────────────────────────────────────────────────

export default function ApiDocsPanel() {
  const [activeSection, setActiveSection] = useState<string>('authentication');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const container = scrollContainerRef.current;
    const target = container?.querySelector(`#doc-${id}`) as HTMLElement | null;
    if (container && target) {
      container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <Icon name="CodeBracketSquareIcon" size={20} variant="solid" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">API Reference</h2>
          <p className="text-xs text-muted-foreground">
            Base URL: <code className="font-mono text-foreground">https://www.linklab.in</code>
          </p>
        </div>
      </div>

      <div className="flex min-h-[600px]">
        {/* sticky left nav */}
        <aside className="hidden w-48 flex-shrink-0 border-r border-border lg:block">
          <nav className="sticky top-0 p-4 space-y-0.5">
            {NAV_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
                  activeSection === s.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* scrollable content */}
        <div ref={scrollContainerRef} className="min-w-0 flex-1 divide-y divide-border overflow-x-hidden overflow-y-auto max-h-[680px]">

          {/* ── AUTHENTICATION ──────────────────────────────────── */}
          <section id="doc-authentication" className="px-6 py-7 space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">Authentication</h3>
              <p className="text-sm leading-relaxed text-foreground font-semibold">Send your API key in every request header.</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Generate a key on this page. Include it via <code className="font-mono text-foreground">Authorization: Bearer</code> or <code className="font-mono text-foreground">x-api-key</code>. Both are accepted everywhere.
              </p>
            </div>
            <CodeBlock code={`# Option 1 — Authorization header (recommended)
Authorization: Bearer ll_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Option 2 — x-api-key header
x-api-key: ll_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`} />
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/6 px-4 py-3">
              <p className="text-xs leading-relaxed text-amber-300">
                <span className="font-semibold">Important:</span> API keys inherit your account's plan quotas and monthly link limits. Requests made via API count against the same quota as dashboard actions.
              </p>
            </div>
          </section>

          {/* ── CREATE LINK ─────────────────────────────────────── */}
          <section id="doc-create-link" className="px-6 py-7 space-y-5">
            <div className="flex items-center gap-3">
              <MethodBadge method="POST" />
              <code className="text-sm font-mono text-foreground">/api/links</code>
              <span className="text-xs text-muted-foreground">Create a short link</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Creates a new short link for the authenticated account. Returns the created link object and your updated quota snapshot.
            </p>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Request body</p>
              <div className="rounded-xl border border-border overflow-hidden">
                <ParamRow name="originalUrl"     type="string"        required desc="The long URL to shorten. Must be a valid http or https URL." />
                <ParamRow name="customAlias"     type="string"               desc="Optional branded slug (e.g. my-launch). Letters, numbers, hyphens, underscores only. Min 3 chars." />
                <ParamRow name="expirationDate"  type="string (date)"        desc="Optional expiry in YYYY-MM-DD format. Link becomes inactive after midnight UTC on this date." />
                <ParamRow name="qrStyle"         type="object"               desc="Optional QR code styling config. See QrStyleConfig schema below." />
              </div>
            </div>

            <CodeBlock code={`curl -X POST https://www.linklab.in/api/links \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/campaigns/spring-2026",
    "customAlias": "spring-2026",
    "expirationDate": "2026-06-01"
  }'`} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Response — 201 Created</p>
              <CodeBlock code={`{
  "link": {
    "id": "67fd9e4f2aa4a7e1d763e101",
    "originalUrl": "https://example.com/campaigns/spring-2026",
    "shortCode": "spring-2026",
    "customAlias": "spring-2026",
    "shortUrl": "https://www.linklab.in/spring-2026",
    "qrCodeDataUrl": "data:image/png;base64,...",
    "clicks": 0,
    "status": "active",
    "createdAt": "4/11/2026",
    "expirationDate": "6/1/2026"
  },
  "quota": {
    "planName": "Launch",
    "monthlyLinkLimit": 500,
    "linksUsedThisMonth": 3,
    "linksRemainingThisMonth": 497,
    "upgradeRequired": false,
    "resetAt": "2026-05-01T00:00:00.000Z"
  }
}`} lang="json" />
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-muted/30 px-4 py-2 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">QrStyleConfig schema (optional)</p>
              </div>
              <div className="px-4">
                <ParamRow name="presetId"        type="string"  desc={`Preset name. One of: "brand-sunset" | "slate-pro" | "ocean-glow" | "emerald-pop"`} />
                <ParamRow name="foregroundColor" type="string"  desc='Hex colour for QR dots. e.g. "#F97316"' />
                <ParamRow name="backgroundColor" type="string"  desc='Hex colour for QR background. e.g. "#F5F5F0"' />
                <ParamRow name="cornerColor"     type="string"  desc='Hex colour for corner squares. e.g. "#F59E0B"' />
                <ParamRow name="dotStyle"        type="string"  desc={`"rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"`} />
                <ParamRow name="cornerStyle"     type="string"  desc={`"dot" | "square" | "extra-rounded" | "rounded" | "dots" | "classy" | "classy-rounded"`} />
                <ParamRow name="frameStyle"      type="string"  desc={`"soft" | "glass" | "outline"`} />
              </div>
            </div>
          </section>

          {/* ── LIST LINKS ──────────────────────────────────────── */}
          <section id="doc-list-links" className="px-6 py-7 space-y-5">
            <div className="flex items-center gap-3">
              <MethodBadge method="GET" />
              <code className="text-sm font-mono text-foreground">/api/links</code>
              <span className="text-xs text-muted-foreground">List all your links</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Returns all short links owned by the authenticated account, ordered newest first. Supports optional query-string filters.
            </p>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Query parameters (all optional)</p>
              <div className="rounded-xl border border-border overflow-hidden">
                <ParamRow name="status"     type="string" desc={`Filter by link status. "active" | "expired"`} />
                <ParamRow name="search"     type="string" desc="Full-text search across original URL, short code, and alias." />
                <ParamRow name="startDate"  type="string" desc="ISO date string. Return links created on or after this date." />
                <ParamRow name="endDate"    type="string" desc="ISO date string. Return links created on or before this date." />
              </div>
            </div>

            <CodeBlock code={`# Fetch all active links
curl "https://www.linklab.in/api/links?status=active" \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx"

# Search links containing "spring"
curl "https://www.linklab.in/api/links?search=spring" \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx"

# Filter by date range
curl "https://www.linklab.in/api/links?startDate=2026-04-01&endDate=2026-04-30" \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx"`} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Response — 200 OK</p>
              <CodeBlock code={`{
  "links": [
    {
      "id": "67fd9e4f2aa4a7e1d763e101",
      "originalUrl": "https://example.com/campaigns/spring-2026",
      "shortCode": "spring-2026",
      "customAlias": "spring-2026",
      "shortUrl": "https://www.linklab.in/spring-2026",
      "clicks": 142,
      "status": "active",
      "createdAt": "4/11/2026",
      "expirationDate": "6/1/2026"
    },
    ...
  ]
}`} lang="json" />
            </div>
          </section>

          {/* ── GET LINK ────────────────────────────────────────── */}
          <section id="doc-get-link" className="px-6 py-7 space-y-5">
            <div className="flex items-center gap-3">
              <MethodBadge method="GET" />
              <code className="text-sm font-mono text-foreground">/api/links/<span className="text-amber-400">{'<id>'}</span></code>
              <span className="text-xs text-muted-foreground">Get a single link</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Fetches a single short link by its <code className="font-mono text-foreground">id</code>. Returns 404 if the link does not belong to the authenticated account.
            </p>

            <CodeBlock code={`curl https://www.linklab.in/api/links/67fd9e4f2aa4a7e1d763e101 \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx"`} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Response — 200 OK</p>
              <CodeBlock code={`{
  "id": "67fd9e4f2aa4a7e1d763e101",
  "originalUrl": "https://example.com/campaigns/spring-2026",
  "shortCode": "spring-2026",
  "customAlias": "spring-2026",
  "shortUrl": "https://www.linklab.in/spring-2026",
  "clicks": 142,
  "status": "active",
  "createdAt": "4/11/2026",
  "expirationDate": "6/1/2026"
}`} lang="json" />
            </div>
          </section>

          {/* ── UPDATE LINK ─────────────────────────────────────── */}
          <section id="doc-update-link" className="px-6 py-7 space-y-5">
            <div className="flex items-center gap-3">
              <MethodBadge method="PATCH" />
              <code className="text-sm font-mono text-foreground">/api/links/<span className="text-amber-400">{'<id>'}</span></code>
              <span className="text-xs text-muted-foreground">Update a link</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Partially updates a link you own. Only include the fields you want to change — all fields are optional. Returns the updated link object.
            </p>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Request body (all fields optional)</p>
              <div className="rounded-xl border border-border overflow-hidden">
                <ParamRow name="originalUrl"    type="string"        desc="Change the destination URL. Must be a valid http/https URL." />
                <ParamRow name="customAlias"    type="string"        desc="Update the branded slug. Leave empty string to remove it." />
                <ParamRow name="expirationDate" type="string (date)" desc="Change or clear the expiry date. Pass empty string to remove expiry." />
                <ParamRow name="qrStyle"        type="object"        desc="Update the QR code styling. See QrStyleConfig schema in Create Link." />
              </div>
            </div>

            <CodeBlock code={`# Change destination URL and remove expiry
curl -X PATCH https://www.linklab.in/api/links/67fd9e4f2aa4a7e1d763e101 \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/campaigns/summer-2026",
    "expirationDate": ""
  }'`} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Response — 200 OK</p>
              <CodeBlock code={`{
  "id": "67fd9e4f2aa4a7e1d763e101",
  "originalUrl": "https://example.com/campaigns/summer-2026",
  "shortCode": "spring-2026",
  "customAlias": "spring-2026",
  "shortUrl": "https://www.linklab.in/spring-2026",
  "clicks": 142,
  "status": "active",
  "createdAt": "4/11/2026",
  "expirationDate": ""
}`} lang="json" />
            </div>
          </section>

          {/* ── DELETE LINK ─────────────────────────────────────── */}
          <section id="doc-delete-link" className="px-6 py-7 space-y-5">
            <div className="flex items-center gap-3">
              <MethodBadge method="DELETE" />
              <code className="text-sm font-mono text-foreground">/api/links/<span className="text-amber-400">{'<id>'}</span></code>
              <span className="text-xs text-muted-foreground">Delete a link</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Permanently deletes a short link you own. This action is irreversible — the short code becomes available for reuse. All associated click data is also removed.
            </p>

            <CodeBlock code={`curl -X DELETE https://www.linklab.in/api/links/67fd9e4f2aa4a7e1d763e101 \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx"`} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Response — 200 OK</p>
              <CodeBlock code={`{ "success": true }`} lang="json" />
            </div>

            <div className="rounded-xl border border-red-500/25 bg-red-500/6 px-4 py-3">
              <p className="text-xs leading-relaxed text-red-300">
                <span className="font-semibold">Warning:</span> Deletion is permanent. Any QR codes or shared URLs pointing to this short link will immediately return a 404.
              </p>
            </div>
          </section>

          {/* ── ANALYTICS ───────────────────────────────────────── */}
          <section id="doc-analytics" className="px-6 py-7 space-y-5">
            <div className="flex items-center gap-3">
              <MethodBadge method="GET" />
              <code className="text-sm font-mono text-foreground">/api/links/<span className="text-amber-400">{'<id>'}</span>/analytics</code>
              <span className="text-xs text-muted-foreground">Link analytics</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Returns full analytics for a link you own: click timeline, referrers, devices, countries, browsers, and peak traffic hours.
            </p>

            <CodeBlock code={`curl https://www.linklab.in/api/links/67fd9e4f2aa4a7e1d763e101/analytics \\
  -H "Authorization: Bearer ll_live_xxxxxxxxx"`} />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Response — 200 OK</p>
              <CodeBlock code={`{
  "analytics": {
    "selectedCode": "spring-2026",
    "metrics": [
      { "title": "Total Clicks", "value": 142 },
      { "title": "Unique Visitors", "value": 98 }
    ],
    "timeline": [
      { "date": "2026-04-11", "clicks": 34, "uniqueVisitors": 22 },
      { "date": "2026-04-12", "clicks": 51, "uniqueVisitors": 38 }
    ],
    "referrers": [
      { "source": "instagram.com", "clicks": 64, "percentage": 45, "icon": "instagram" }
    ],
    "devices": [
      { "name": "Mobile", "value": 88, "color": "#f59e0b" },
      { "name": "Desktop", "value": 54, "color": "#6366f1" }
    ],
    "countries": [
      { "country": "India", "clicks": 72, "percentage": 50, "flag": "🇮🇳" }
    ],
    "browsers": [
      { "browser": "Chrome", "clicks": 91, "percentage": 64, "icon": "chrome" }
    ],
    "peakHours": [
      { "hour": "18:00", "clicks": 28 },
      { "hour": "20:00", "clicks": 35 }
    ],
    "linkDetails": {
      "originalUrl": "https://example.com/campaigns/spring-2026",
      "shortUrl": "https://www.linklab.in/spring-2026",
      "shortCode": "spring-2026",
      "createdDate": "4/11/2026",
      "status": "active"
    }
  }
}`} lang="json" />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Response fields</p>
              <div className="rounded-xl border border-border overflow-hidden">
                <ResponseRow field="analytics.metrics"     type="array"  desc="Key performance numbers: total clicks, unique visitors, top referrer, top country." />
                <ResponseRow field="analytics.timeline"    type="array"  desc="Daily click and unique visitor counts for the link's lifetime." />
                <ResponseRow field="analytics.referrers"   type="array"  desc="Traffic sources ranked by click volume with percentage share." />
                <ResponseRow field="analytics.devices"     type="array"  desc="Device breakdown (Mobile, Desktop, Tablet) with counts and chart colours." />
                <ResponseRow field="analytics.countries"   type="array"  desc="Top countries by click count with flag emoji and percentage." />
                <ResponseRow field="analytics.browsers"    type="array"  desc="Browser breakdown (Chrome, Safari, Firefox…) with click counts." />
                <ResponseRow field="analytics.peakHours"   type="array"  desc="Hourly traffic pattern — useful for scheduling campaigns." />
                <ResponseRow field="analytics.linkDetails" type="object" desc="Snapshot of the link metadata at time of query." />
              </div>
            </div>
          </section>

          {/* ── ERRORS & LIMITS ─────────────────────────────────── */}
          <section id="doc-errors" className="px-6 py-7 space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">Errors &amp; Rate Limits</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                All errors return a JSON object with a <code className="font-mono text-foreground">message</code> field. HTTP status codes follow REST conventions.
              </p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[80px_1fr] bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground border-b border-border">
                <span>Status</span><span>Meaning</span>
              </div>
              {[
                { code: '400', color: 'text-amber-400',  meaning: 'Bad request — missing required field, invalid URL, or malformed JSON body.' },
                { code: '401', color: 'text-red-400',    meaning: 'Unauthorized — API key is missing, invalid, or has been revoked.' },
                { code: '402', color: 'text-orange-400', meaning: 'Payment required — your monthly link quota has been reached. Upgrade your plan.' },
                { code: '403', color: 'text-red-400',    meaning: 'Forbidden — you do not have access to this resource (e.g. another account\'s link).' },
                { code: '404', color: 'text-muted-foreground', meaning: 'Not found — the link ID does not exist or belongs to another account.' },
                { code: '429', color: 'text-orange-400', meaning: 'Too many requests — you have exceeded the API rate limit. Back off and retry.' },
                { code: '500', color: 'text-red-400',    meaning: 'Server error — a temporary platform issue. Safe to retry with exponential backoff.' },
              ].map((row) => (
                <div key={row.code} className="grid grid-cols-[80px_1fr] items-start px-4 py-3 border-b border-border last:border-0">
                  <code className={`font-mono text-xs font-bold ${row.color}`}>{row.code}</code>
                  <p className="text-xs leading-relaxed text-muted-foreground">{row.meaning}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Error response shape</p>
              <CodeBlock code={`// Quota exceeded (402)
{
  "message": "Monthly link creation limit reached.",
  "quota": {
    "planName": "Free",
    "monthlyLinkLimit": 25,
    "linksUsedThisMonth": 25,
    "linksRemainingThisMonth": 0,
    "upgradeRequired": true
  }
}

// Generic error (400 / 404)
{
  "message": "Original URL is required."
}`} lang="json" />
            </div>

            <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">Rate limits</p>
              <ul className="space-y-1.5">
                {[
                  'Monthly link creation is limited by your plan (Free: 25 · Starter: 100 · Launch: 500 · Growth: 2 000).',
                  'API requests beyond your monthly quota return HTTP 402.',
                  'Excessive repeated requests may trigger HTTP 429. Use exponential backoff.',
                  'Analytics and read endpoints do not count against your link creation quota.',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Icon name="ChevronRightIcon" size={12} variant="outline" className="mt-0.5 flex-shrink-0 text-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
