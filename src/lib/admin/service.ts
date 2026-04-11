import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { getServerAuthenticatedUser } from '@/lib/auth/server';

// ─── Auth guard ────────────────────────────────────────────────────────────────

/**
 * Returns the authenticated user only when they are a superadmin.
 * Returns null otherwise (treat as 401/403 in the caller).
 */
export const getServerSuperAdmin = async () => {
  const user = await getServerAuthenticatedUser();
  if (!user || user.role !== 'superadmin') return null;
  return user;
};

// ─── Stats overview ────────────────────────────────────────────────────────────

export const getAdminOverviewStats = async () => {
  const db = await getDatabase();

  const [totalUsers, totalLinks, totalClicks, totalSubscriptions] = await Promise.all([
    db.collection('users').countDocuments(),
    db.collection('links').countDocuments(),
    db
      .collection('link_clicks')
      .countDocuments(),
    db
      .collection('workspace_subscriptions')
      .countDocuments({ status: 'active' }),
  ]);

  // New signups in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsersThisMonth = await db
    .collection('users')
    .countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  const newLinksThisMonth = await db
    .collection('links')
    .countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  const clicksThisMonth = await db
    .collection('link_clicks')
    .countDocuments({ clickedAt: { $gte: thirtyDaysAgo } });

  return {
    totalUsers,
    totalLinks,
    totalClicks,
    totalSubscriptions,
    newUsersThisMonth,
    newLinksThisMonth,
    clicksThisMonth,
  };
};

// ─── Users list ───────────────────────────────────────────────────────────────

export interface AdminUserRow {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  linksCount: number;
  plan: string;
}

export const getAdminUsers = async (page = 1, limit = 20, search = '') => {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const filter = search
    ? {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.collection('users').find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    db.collection('users').countDocuments(filter),
  ]);

  // For each user, get their link count and plan
  const enriched = await Promise.all(
    users.map(async (u) => {
      const userId = (u._id as ObjectId).toHexString();
      const [linksCount, subscription] = await Promise.all([
        db.collection('links').countDocuments({ ownerId: userId }),
        db
          .collection('workspace_subscriptions')
          .findOne({ ownerId: userId }, { projection: { planId: 1, status: 1 } }),
      ]);

      const plan =
        subscription?.status === 'active' ? (subscription.planId as string) : 'free';

      return {
        id: userId,
        email: u.email as string,
        name: u.name as string | undefined,
        role: (u.role as string | undefined) ?? 'user',
        createdAt: (u.createdAt as Date).toISOString(),
        linksCount,
        plan,
      } satisfies AdminUserRow;
    }),
  );

  return { users: enriched, total, page, limit };
};

// ─── Links list ───────────────────────────────────────────────────────────────

export interface AdminLinkRow {
  id: string;
  shortCode: string;
  originalUrl: string;
  ownerEmail: string;
  clicks: number;
  status: string;
  createdAt: string;
}

export const getAdminLinks = async (page = 1, limit = 20, search = '') => {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const filter = search
    ? {
        $or: [
          { originalUrl: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { ownerEmail: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [links, total] = await Promise.all([
    db.collection('links').find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    db.collection('links').countDocuments(filter),
  ]);

  const rows: AdminLinkRow[] = links.map((l) => ({
    id: (l._id as ObjectId).toHexString(),
    shortCode: l.code as string,
    originalUrl: l.originalUrl as string,
    ownerEmail: (l.ownerEmail as string | undefined) ?? 'anonymous',
    clicks: (l.clickCount as number | undefined) ?? 0,
    status: l.expirationDate
      ? new Date(l.expirationDate as Date) < new Date()
        ? 'expired'
        : 'active'
      : 'active',
    createdAt: (l.createdAt as Date).toISOString(),
  }));

  return { links: rows, total, page, limit };
};

// ─── Payments/Subscriptions list ──────────────────────────────────────────────

export interface AdminPaymentRow {
  id: string;
  ownerEmail: string;
  planId: string;
  status: string;
  paymentStatus: string;
  paymentProvider: string;
  activatedAt: string;
  currentPeriodEnd: string;
}

export const getAdminPayments = async (page = 1, limit = 20) => {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const [subs, total] = await Promise.all([
    db
      .collection('workspace_subscriptions')
      .find({})
      .sort({ activatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('workspace_subscriptions').countDocuments(),
  ]);

  const rows: AdminPaymentRow[] = subs.map((s) => ({
    id: (s._id as ObjectId).toHexString(),
    ownerEmail: (s.ownerEmail as string | undefined) ?? s.ownerId as string,
    planId: s.planId as string,
    status: s.status as string,
    paymentStatus: s.paymentStatus as string,
    paymentProvider: s.paymentProvider as string,
    activatedAt: (s.activatedAt as Date).toISOString(),
    currentPeriodEnd: (s.currentPeriodEnd as Date).toISOString(),
  }));

  return { payments: rows, total, page, limit };
};

// ─── QR codes list ────────────────────────────────────────────────────────────

export interface AdminQrRow {
  id: string;
  shortCode: string;
  ownerEmail: string;
  hasCustomStyle: boolean;
  createdAt: string;
  clicks: number;
  qrCodeDataUrl: string;
}

export const getAdminQrCodes = async (page = 1, limit = 20) => {
  const db = await getDatabase();
  const skip = (page - 1) * limit;

  const [links, total] = await Promise.all([
    db
      .collection('links')
      .find({ qrCodeDataUrl: { $exists: true, $ne: '' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('links').countDocuments({ qrCodeDataUrl: { $exists: true, $ne: '' } }),
  ]);

  const rows: AdminQrRow[] = links.map((l) => ({
    id: (l._id as ObjectId).toHexString(),
    shortCode: l.code as string,
    ownerEmail: (l.ownerEmail as string | undefined) ?? 'anonymous',
    hasCustomStyle: !!(l.qrStyle),
    createdAt: (l.createdAt as Date).toISOString(),
    clicks: (l.clickCount as number | undefined) ?? 0,
    qrCodeDataUrl: l.qrCodeDataUrl as string,
  }));

  return { qrCodes: rows, total, page, limit };
};
