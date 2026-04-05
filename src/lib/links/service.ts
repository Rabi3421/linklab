import { createHash } from 'crypto';
import { ObjectId, type WithId } from 'mongodb';
import QRCode from 'qrcode';
import { getDatabase } from '@/lib/mongodb';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import type { AuthUser } from '@/lib/auth/types';
import {
  assertCanCreateLinkForRequest,
  consumeLinkQuotaForRequest,
  getBillingUsageSnapshotForUser,
} from '@/lib/billing/service';
import { resolveQrStyleConfig } from './qr-style';
import type {
  LinkAnalyticsView,
  LinkCreationApiResponse,
  LinkCreationResult,
  LinkStatus,
  ManagedLinkRecord,
} from './types';

interface LinkDocument {
  _id: ObjectId;
  code: string;
  originalUrl: string;
  normalizedUrl: string;
  ownerId?: string;
  ownerEmail?: string;
  customAlias?: string;
  qrCodeDataUrl: string;
  qrStyle?: LinkCreationResult['qrStyle'];
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
  expirationDate?: Date;
  lastClickedAt?: Date;
}

interface LinkClickDocument {
  _id: ObjectId;
  linkId: ObjectId;
  code: string;
  clickedAt: Date;
  referrer: string;
  source: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  country: string;
  visitorFingerprint: string;
}

const LINKS_COLLECTION = 'links';
const CLICKS_COLLECTION = 'link_clicks';
const DEFAULT_BASE_URL = 'http://localhost:4028';

const browserIcons: Record<string, string> = {
  Chrome: '🌐',
  Safari: '🧭',
  Firefox: '🦊',
  Edge: '🔷',
  Opera: '🅾️',
  Other: '🖥️',
};

const sourceIcons: Record<string, string> = {
  'Direct Traffic': '🔗',
  Google: '🔎',
  LinkedIn: '💼',
  Twitter: '🐦',
  X: '🐦',
  Facebook: '📘',
  Instagram: '📷',
  WhatsApp: '💬',
};

const countryFlags: Record<string, string> = {
  India: '🇮🇳',
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  Canada: '🇨🇦',
  Germany: '🇩🇪',
  Australia: '🇦🇺',
  Local: '📍',
  Unknown: '🌍',
};

const normalizeBaseUrl = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const normalizedValue = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    return new URL(normalizedValue).origin;
  } catch {
    return null;
  }
};

const getBaseUrlFromRequest = (request: Request) => {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost?.split(',')[0]?.trim() || request.headers.get('host')?.trim();
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const protocol = forwardedProto?.split(',')[0]?.trim() || 'https';

  if (!host) {
    return null;
  }

  return normalizeBaseUrl(`${protocol}://${host}`);
};

const getBaseUrl = (request?: Request) => {
  const requestBaseUrl = request ? getBaseUrlFromRequest(request) : null;

  if (requestBaseUrl) {
    return requestBaseUrl;
  }

  return (
    normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    normalizeBaseUrl(process.env.APP_URL) ||
    normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeBaseUrl(process.env.VERCEL_URL) ||
    DEFAULT_BASE_URL
  );
};

const getLinksCollection = async () => {
  const database = await getDatabase();
  const collection = database.collection<LinkDocument>(LINKS_COLLECTION);
  await collection.createIndex({ code: 1 }, { unique: true });
  await collection.createIndex({ ownerId: 1, createdAt: -1 });
  return collection;
};

const getClicksCollection = async () => {
  const database = await getDatabase();
  const collection = database.collection<LinkClickDocument>(CLICKS_COLLECTION);
  await collection.createIndex({ linkId: 1, clickedAt: -1 });
  await collection.createIndex({ code: 1, clickedAt: -1 });
  return collection;
};

const normalizeUrl = (input: string) => {
  const value = input.trim();
  const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return new URL(normalized).toString();
};

const formatDisplayDate = (date?: Date) => (date ? date.toLocaleDateString('en-US') : '');

const determineStatus = (expirationDate?: Date): LinkStatus => {
  if (expirationDate && expirationDate.getTime() < Date.now()) {
    return 'expired';
  }

  return 'active';
};

const mapLinkToRecord = (
  link: WithId<LinkDocument>,
  baseUrl = getBaseUrl()
): ManagedLinkRecord => ({
  id: link._id.toHexString(),
  originalUrl: link.originalUrl,
  shortCode: link.code,
  customAlias: link.customAlias || '',
  createdAt: formatDisplayDate(link.createdAt),
  clicks: link.clickCount,
  status: determineStatus(link.expirationDate),
  expirationDate: formatDisplayDate(link.expirationDate),
  shortUrl: `${baseUrl}/${link.code}`,
  qrCodeDataUrl: link.qrCodeDataUrl,
  qrStyle: link.qrStyle,
});

const randomCode = (length = 8) => {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(
    ''
  );
};

const createUniqueCode = async (preferredCode?: string) => {
  const linksCollection = await getLinksCollection();
  const requested = preferredCode?.trim().toLowerCase();

  if (requested) {
    if (!/^[a-z0-9_-]{3,32}$/.test(requested)) {
      throw new Error('Custom alias can only use letters, numbers, hyphens, and underscores.');
    }

    const existingRequestedLink = await linksCollection.findOne({ code: requested });

    if (existingRequestedLink) {
      throw new Error('This custom alias is already taken. Try another one.');
    }

    return requested;
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const generatedCode = randomCode(8);
    const existingLink = await linksCollection.findOne({ code: generatedCode });

    if (!existingLink) {
      return generatedCode;
    }
  }

  throw new Error('Unable to generate a unique short code right now. Please try again.');
};

const generateQrCode = async (shortUrl: string, qrStyle?: LinkCreationResult['qrStyle']) => {
  const resolvedQrStyle = qrStyle ? resolveQrStyleConfig(qrStyle) : null;

  return QRCode.toDataURL(shortUrl, {
    margin: resolvedQrStyle?.frameStyle === 'outline' ? 2 : 1,
    width: 256,
    color: {
      dark: resolvedQrStyle?.foregroundColor || '#F5F5F0',
      light: resolvedQrStyle?.backgroundColor || '#252830',
    },
  });
};

const getVisitorFingerprint = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for') || 'local';
  const ip = forwardedFor.split(',')[0]?.trim() || 'local';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return createHash('sha256').update(`${ip}:${userAgent}`).digest('hex');
};

const detectBrowser = (userAgent: string) => {
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/chrome|crios/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return 'Safari';
  if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
  if (/opr\//i.test(userAgent)) return 'Opera';
  return 'Other';
};

const detectOs = (userAgent: string) => {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad|ios/i.test(userAgent)) return 'iOS';
  if (/mac os/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  return 'Other';
};

const detectDeviceType = (userAgent: string) => {
  if (/ipad|tablet/i.test(userAgent)) return 'Tablet';
  if (/mobi|android|iphone/i.test(userAgent)) return 'Mobile';
  return 'Desktop';
};

const detectCountry = (request: Request) => {
  return (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    (request.headers.get('host')?.includes('localhost') ? 'Local' : 'Unknown')
  );
};

const detectSource = (referrer: string) => {
  if (!referrer) {
    return 'Direct Traffic';
  }

  try {
    const hostname = new URL(referrer).hostname.replace(/^www\./, '');

    if (hostname.includes('google')) return 'Google';
    if (hostname.includes('linkedin')) return 'LinkedIn';
    if (hostname.includes('twitter')) return 'Twitter';
    if (hostname.includes('x.com')) return 'X';
    if (hostname.includes('facebook')) return 'Facebook';
    if (hostname.includes('instagram')) return 'Instagram';
    if (hostname.includes('whatsapp')) return 'WhatsApp';

    return hostname;
  } catch {
    return 'Direct Traffic';
  }
};

const percentage = (value: number, total: number) =>
  total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0;

const trendPercentage = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const summarizeCounts = <T extends string>(items: T[]) => {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    counts.set(item, (counts.get(item) || 0) + 1);
  });

  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
};

const getPeakHourBuckets = (clicks: WithId<LinkClickDocument>[]) => {
  const buckets = [
    { label: '12AM', range: [0, 3] },
    { label: '3AM', range: [3, 6] },
    { label: '6AM', range: [6, 9] },
    { label: '9AM', range: [9, 12] },
    { label: '12PM', range: [12, 15] },
    { label: '3PM', range: [15, 18] },
    { label: '6PM', range: [18, 21] },
    { label: '9PM', range: [21, 24] },
  ];

  return buckets.map((bucket) => ({
    hour: bucket.label,
    clicks: clicks.filter((click) => {
      const hour = click.clickedAt.getHours();
      return hour >= bucket.range[0] && hour < bucket.range[1];
    }).length,
  }));
};

export const createShortLink = async (input: {
  originalUrl: string;
  customAlias?: string;
  expirationDate?: string;
  ownerId?: string;
  ownerEmail?: string;
  baseUrl?: string;
  qrStyle?: LinkCreationResult['qrStyle'];
}) => {
  const linksCollection = await getLinksCollection();
  const normalizedUrl = normalizeUrl(input.originalUrl);
  const code = await createUniqueCode(input.customAlias);
  const baseUrl = input.baseUrl || getBaseUrl();
  const shortUrl = `${baseUrl}/${code}`;
  const qrStyle = input.qrStyle ? resolveQrStyleConfig(input.qrStyle) : undefined;
  const qrCodeDataUrl = await generateQrCode(shortUrl, qrStyle);
  const expirationDate = input.expirationDate ? new Date(input.expirationDate) : undefined;
  const now = new Date();

  const document: LinkDocument = {
    _id: new ObjectId(),
    code,
    originalUrl: input.originalUrl.trim(),
    normalizedUrl,
    ownerId: input.ownerId,
    ownerEmail: input.ownerEmail,
    customAlias: input.customAlias?.trim(),
    qrCodeDataUrl,
    qrStyle,
    clickCount: 0,
    createdAt: now,
    updatedAt: now,
    expirationDate,
  };

  await linksCollection.insertOne(document);

  return mapLinkToRecord(document, baseUrl);
};

export const updateLinkForUser = async (
  ownerId: string,
  linkId: string,
  input: {
    originalUrl?: string;
    customAlias?: string;
    expirationDate?: string;
    baseUrl?: string;
    qrStyle?: LinkCreationResult['qrStyle'];
  }
) => {
  if (!ObjectId.isValid(linkId)) {
    return null;
  }

  const linksCollection = await getLinksCollection();
  const existingLink = await linksCollection.findOne({ _id: new ObjectId(linkId), ownerId });

  if (!existingLink) {
    return null;
  }

  const requestedAlias =
    input.customAlias !== undefined ? input.customAlias.trim().toLowerCase() : undefined;
  const nextCode =
    requestedAlias === undefined || requestedAlias === '' || requestedAlias === existingLink.code
      ? existingLink.code
      : await createUniqueCode(requestedAlias);

  const baseUrl = input.baseUrl || getBaseUrl();
  const shortUrl = `${baseUrl}/${nextCode}`;
  const normalizedUrl = input.originalUrl
    ? normalizeUrl(input.originalUrl)
    : existingLink.normalizedUrl;
  const qrStyle = input.qrStyle ? resolveQrStyleConfig(input.qrStyle) : existingLink.qrStyle;
  const shouldRegenerateQr =
    nextCode !== existingLink.code ||
    JSON.stringify(qrStyle) !== JSON.stringify(existingLink.qrStyle);
  const qrCodeDataUrl = shouldRegenerateQr
    ? await generateQrCode(shortUrl, qrStyle)
    : existingLink.qrCodeDataUrl;

  const expirationDate =
    input.expirationDate === ''
      ? undefined
      : input.expirationDate
        ? new Date(input.expirationDate)
        : existingLink.expirationDate;

  await linksCollection.updateOne(
    { _id: existingLink._id },
    {
      $set: {
        code: nextCode,
        customAlias: requestedAlias !== undefined ? requestedAlias : existingLink.customAlias,
        originalUrl: input.originalUrl?.trim() || existingLink.originalUrl,
        normalizedUrl,
        expirationDate,
        qrCodeDataUrl,
        qrStyle,
        updatedAt: new Date(),
      },
    }
  );

  const updatedLink = await linksCollection.findOne({ _id: existingLink._id });

  return updatedLink ? mapLinkToRecord(updatedLink, baseUrl) : null;
};

export const deleteLinkForUser = async (ownerId: string, linkId: string) => {
  if (!ObjectId.isValid(linkId)) {
    return false;
  }

  const linksCollection = await getLinksCollection();
  const clicksCollection = await getClicksCollection();
  const objectId = new ObjectId(linkId);

  const existingLink = await linksCollection.findOne({ _id: objectId, ownerId });

  if (!existingLink) {
    return false;
  }

  await Promise.all([
    linksCollection.deleteOne({ _id: objectId, ownerId }),
    clicksCollection.deleteMany({ linkId: objectId }),
  ]);

  return true;
};

export const getLinkByCode = async (code: string) => {
  const linksCollection = await getLinksCollection();
  return linksCollection.findOne({ code: code.toLowerCase() });
};

export const getManagedLinksForUser = async (ownerId: string, limit = 50) => {
  const linksCollection = await getLinksCollection();
  const links = await linksCollection
    .find({ ownerId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return links.map((link) => mapLinkToRecord(link));
};

export const getDashboardLinksForCurrentUser = async () => {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return [] as ManagedLinkRecord[];
  }

  return getManagedLinksForUser(authenticatedUser.id, 50);
};

export const recordLinkClick = async (link: WithId<LinkDocument>, request: Request) => {
  if (link.expirationDate && link.expirationDate.getTime() < Date.now()) {
    return { expired: true };
  }

  const clicksCollection = await getClicksCollection();
  const linksCollection = await getLinksCollection();
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referrer = request.headers.get('referer') || '';
  const clickDocument: LinkClickDocument = {
    _id: new ObjectId(),
    linkId: link._id,
    code: link.code,
    clickedAt: new Date(),
    referrer,
    source: detectSource(referrer),
    userAgent,
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    deviceType: detectDeviceType(userAgent),
    country: detectCountry(request),
    visitorFingerprint: getVisitorFingerprint(request),
  };

  await clicksCollection.insertOne(clickDocument);
  await linksCollection.updateOne(
    { _id: link._id },
    {
      $inc: { clickCount: 1 },
      $set: {
        updatedAt: new Date(),
        lastClickedAt: clickDocument.clickedAt,
      },
    }
  );

  return { expired: false };
};

export const getLinkAnalyticsForUser = async (
  ownerId: string,
  code?: string
): Promise<LinkAnalyticsView | null> => {
  const linksCollection = await getLinksCollection();
  const clicksCollection = await getClicksCollection();

  const selectedLink = code
    ? await linksCollection.findOne({ ownerId, code })
    : await linksCollection.findOne({ ownerId }, { sort: { createdAt: -1 } });

  if (!selectedLink) {
    return null;
  }

  const clicks = await clicksCollection
    .find({ linkId: selectedLink._id })
    .sort({ clickedAt: 1 })
    .toArray();
  const now = new Date();
  const last7DaysStart = new Date(now);
  last7DaysStart.setDate(now.getDate() - 6);
  last7DaysStart.setHours(0, 0, 0, 0);

  const previous7DaysStart = new Date(last7DaysStart);
  previous7DaysStart.setDate(last7DaysStart.getDate() - 7);
  const previous7DaysEnd = new Date(last7DaysStart);

  const currentPeriodClicks = clicks.filter((click) => click.clickedAt >= last7DaysStart).length;
  const previousPeriodClicks = clicks.filter(
    (click) => click.clickedAt >= previous7DaysStart && click.clickedAt < previous7DaysEnd
  ).length;

  const currentUniqueVisitors = new Set(
    clicks
      .filter((click) => click.clickedAt >= last7DaysStart)
      .map((click) => click.visitorFingerprint)
  ).size;

  const last30DaysClicks = clicks.filter(
    (click) => click.clickedAt >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  );
  const directClicks = clicks.filter((click) => click.source === 'Direct Traffic').length;
  const mobileClicks = clicks.filter((click) => click.deviceType === 'Mobile').length;

  const timeline = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(last7DaysStart);
    date.setDate(last7DaysStart.getDate() + offset);
    const dateLabel = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    const clicksOnDay = clicks.filter(
      (click) => click.clickedAt.toDateString() === date.toDateString()
    );

    return {
      date: dateLabel,
      clicks: clicksOnDay.length,
      uniqueVisitors: new Set(clicksOnDay.map((click) => click.visitorFingerprint)).size,
    };
  });

  const referrerData = summarizeCounts(clicks.map((click) => click.source))
    .slice(0, 5)
    .map(([source, count]) => ({
      source,
      clicks: count,
      percentage: percentage(count, clicks.length),
      icon: sourceIcons[source] || '🌐',
    }));

  const deviceColors: Record<string, string> = {
    Desktop: '#2563EB',
    Mobile: '#F59E0B',
    Tablet: '#10B981',
  };

  const devices = summarizeCounts(clicks.map((click) => click.deviceType)).map(([name, value]) => ({
    name,
    value,
    color: deviceColors[name] || '#8B5CF6',
  }));

  const countries = summarizeCounts(clicks.map((click) => click.country))
    .slice(0, 5)
    .map(([country, count]) => ({
      country,
      clicks: count,
      percentage: percentage(count, clicks.length),
      flag: countryFlags[country] || countryFlags.Unknown,
    }));

  const browsers = summarizeCounts(clicks.map((click) => click.browser))
    .slice(0, 5)
    .map(([browser, count]) => ({
      browser,
      clicks: count,
      percentage: percentage(count, clicks.length),
      icon: browserIcons[browser] || browserIcons.Other,
    }));

  const peakHours = getPeakHourBuckets(clicks);
  const topHour = peakHours.reduce(
    (best, current) => (current.clicks > best.clicks ? current : best),
    peakHours[0] || { hour: '12AM', clicks: 0 }
  );

  return {
    selectedCode: selectedLink.code,
    metrics: [
      {
        title: 'Total Clicks',
        value: clicks.length.toLocaleString(),
        subtitle: `${currentPeriodClicks.toLocaleString()} in the last 7 days`,
        trend: {
          value: Math.abs(trendPercentage(currentPeriodClicks, previousPeriodClicks)),
          isPositive: trendPercentage(currentPeriodClicks, previousPeriodClicks) >= 0,
        },
      },
      {
        title: 'Unique Visitors',
        value: new Set(clicks.map((click) => click.visitorFingerprint)).size.toLocaleString(),
        subtitle: `${currentUniqueVisitors.toLocaleString()} unique visitors this week`,
      },
      {
        title: 'Direct Traffic Share',
        value: `${percentage(directClicks, clicks.length)}%`,
        subtitle: 'Visits with no identifiable external referrer',
      },
      {
        title: 'Mobile Share',
        value: `${percentage(mobileClicks, clicks.length)}%`,
        subtitle: 'Clicks coming from mobile devices',
      },
    ],
    timeline,
    referrers: referrerData,
    devices,
    countries,
    browsers,
    peakHours,
    linkDetails: {
      originalUrl: selectedLink.originalUrl,
      shortUrl: `${getBaseUrl()}/${selectedLink.code}`,
      shortCode: selectedLink.code,
      createdDate: formatDisplayDate(selectedLink.createdAt),
      expiryDate: formatDisplayDate(selectedLink.expirationDate),
      status: determineStatus(selectedLink.expirationDate),
      qrCodeDataUrl: selectedLink.qrCodeDataUrl,
      qrStyle: selectedLink.qrStyle,
    },
    additionalInsights: [
      {
        label: 'Visitor retention signal',
        value: `${percentage(new Set(clicks.map((click) => click.visitorFingerprint)).size, clicks.length)}%`,
        note: 'Higher unique-visitor share usually means the link is reaching new audiences.',
        positive: true,
      },
      {
        label: 'Peak traffic window',
        value: topHour.hour,
        note: 'Use this time range for retargeting and distribution experiments.',
        positive: true,
      },
      {
        label: '30-day activity',
        value: `${last30DaysClicks.length.toLocaleString()} clicks`,
        note: 'Use rolling 30-day totals to benchmark campaign momentum.',
        positive: last30DaysClicks.length > 0,
      },
    ],
  };
};

export const getLinkAnalyticsByIdForUser = async (
  ownerId: string,
  linkId: string
): Promise<LinkAnalyticsView | null> => {
  if (!ObjectId.isValid(linkId)) {
    return null;
  }

  const linksCollection = await getLinksCollection();
  const link = await linksCollection.findOne({ _id: new ObjectId(linkId), ownerId });

  if (!link) {
    return null;
  }

  return getLinkAnalyticsForUser(ownerId, link.code);
};

export const getLinkAnalyticsForCurrentUser = async (code?: string) => {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return null;
  }

  return getLinkAnalyticsForUser(authenticatedUser.id, code);
};

export const getLinkForRedirect = async (code: string) => {
  const link = await getLinkByCode(code.toLowerCase());

  if (!link) {
    return null;
  }

  return link;
};

export const createShortLinkForCurrentRequest = async (
  request: Request,
  body: {
    originalUrl: string;
    customAlias?: string;
    expirationDate?: string;
    qrStyle?: LinkCreationResult['qrStyle'];
  },
  authenticatedUser?: AuthUser | null
) => {
  const resolvedUser = authenticatedUser ?? (await getServerAuthenticatedUser());
  const baseUrl = getBaseUrl(request);

  await assertCanCreateLinkForRequest(request, resolvedUser);

  const link = await createShortLink({
    ...body,
    ownerId: resolvedUser?.id,
    ownerEmail: resolvedUser?.email,
    baseUrl,
  });

  const quota = await consumeLinkQuotaForRequest(request, resolvedUser);

  return {
    link,
    quota,
  } satisfies LinkCreationApiResponse;
};

export const getBillingUsageForCurrentUser = async () => {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    return null;
  }

  return getBillingUsageSnapshotForUser(authenticatedUser.id, authenticatedUser.email);
};
