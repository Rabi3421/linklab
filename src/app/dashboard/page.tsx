import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticatedAppShell from '@/components/common/AuthenticatedAppShell';
import DashboardInteractive from './components/DashboardInteractive';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import { getManagedLinksForUser } from '@/lib/links/service';
import { getBillingUsageSnapshotForUser } from '@/lib/billing/service';

export const metadata: Metadata = {
  title: 'Dashboard - LinkLab',
  description:
    'Manage your shortened links, track analytics, and create new short URLs from your centralized dashboard.',
};

export default async function DashboardPage() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    redirect('/login');
  }

  const initialLinks = await getManagedLinksForUser(authenticatedUser.id);
  const initialQuota = await getBillingUsageSnapshotForUser(
    authenticatedUser.id,
    authenticatedUser.email
  );

  return (
    <AuthenticatedAppShell
      title="Dashboard"
      description="Manage your links, track performance, and create new short URLs."
    >
      <DashboardInteractive initialLinks={initialLinks} initialQuota={initialQuota} />
    </AuthenticatedAppShell>
  );
}
