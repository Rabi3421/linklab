import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticatedAppShell from '@/components/common/AuthenticatedAppShell';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import CreateLinkWorkspace from './components/CreateLinkWorkspace';
import { getManagedLinksForUser } from '@/lib/links/service';
import { getBillingUsageSnapshotForUser } from '@/lib/billing/service';

export const metadata: Metadata = {
  title: 'Create Link - LinkLab',
  description:
    'Create branded short links, set custom aliases, and manage expirations from your LinkLab workspace.',
};

export default async function CreateLinkPage() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    redirect('/login');
  }

  const initialLinks = await getManagedLinksForUser(authenticatedUser.id, 10);
  const initialQuota = await getBillingUsageSnapshotForUser(
    authenticatedUser.id,
    authenticatedUser.email
  );

  return (
    <AuthenticatedAppShell
      title="Create Link"
      description="Shorten URLs, choose branded aliases, and launch trackable links in seconds."
      breadcrumbItems={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Create Link', path: '/create-link' },
      ]}
    >
      <CreateLinkWorkspace initialLinks={initialLinks} initialQuota={initialQuota} />
    </AuthenticatedAppShell>
  );
}
