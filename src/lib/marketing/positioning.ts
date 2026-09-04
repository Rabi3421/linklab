/**
 * Homepage positioning constants.
 *
 * LinkLab is positioned for small marketing agencies running multiple clients'
 * WhatsApp, Instagram, and offline campaigns.
 *
 * IMPORTANT — read before editing homepage copy:
 * Every capability the homepage names must map to something that actually ships.
 * `shipped: false` entries are rendered with a visible "In development" badge and
 * must never be described in the present tense as though a customer can use them
 * today. Flip a flag to `true` only once the feature is live in the product, then
 * update the copy in the matching section component.
 */

export const USP_LINE =
  'Unlike Bitly, Dub, or Rebrandly, LinkLab is organized around your clients, not your links.';

export interface CapabilityStatus {
  /** Whether the capability exists in the product today. */
  shipped: boolean;
  /** Shown next to the heading when `shipped` is false. */
  badge?: string;
  /** Why this is or is not shipped — kept here so copy edits stay grounded. */
  note: string;
}

export const capabilities = {
  /**
   * Verified: PATCH /api/links/[id] accepts `originalUrl` and updateLinkForUser
   * rewrites the destination while keeping the same shortCode, so a printed QR
   * keeps working and points somewhere new.
   */
  dynamicQr: {
    shipped: true,
    note: 'Editable destination behind a stable short code — see updateLinkForUser in src/lib/links/service.ts.',
  },
  /** Verified: custom aliases + per-link analytics + link editing all ship today. */
  brandedLinks: {
    shipped: true,
    note: 'Custom aliases and per-link click analytics are live.',
  },
  /**
   * NOT BUILT. ManagedLinkRecord has no client/folder/group/tag field, and there
   * is no grouping API or UI. Agencies can only approximate this today with an
   * alias naming convention, which is what the copy describes.
   */
  clientWorkspaces: {
    shipped: false,
    badge: 'In development',
    note: 'No client/folder field on ManagedLinkRecord; no grouping API or UI exists yet.',
  },
  /**
   * NOT BUILT. There is no report export anywhere in the codebase — no PDF, no
   * CSV, no scheduled send. "White-label" appears only as an Enterprise plan label.
   */
  whiteLabelReports: {
    shipped: false,
    badge: 'In development',
    note: 'No PDF/CSV/report export exists in src/lib or src/app/api.',
  },
  /**
   * NOT BUILT as per-client routing. Custom domains appear as plan entitlements
   * in src/lib/billing/plans.ts, but middleware.ts has no host-based resolution.
   */
  perClientDomains: {
    shipped: false,
    badge: 'On the roadmap',
    note: 'Plan labels exist; middleware.ts has no host-based domain routing.',
  },
} satisfies Record<string, CapabilityStatus>;
