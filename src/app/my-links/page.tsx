import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticatedAppShell from '@/components/common/AuthenticatedAppShell';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import MyLinksWorkspace from './components/MyLinksWorkspace';
import { getManagedLinksForUser } from '@/lib/links/service';

export const metadata: Metadata = {
  title: 'My Links - LinkLab',
  description: 'Review, filter, and manage all of your short links from a single LinkLab workspace.',
};

export default async function MyLinksPage() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    redirect('/login');
  }

  const initialLinks = await getManagedLinksForUser(authenticatedUser.id);

  return (
    <AuthenticatedAppShell
      title="My Links"
      description="Search, filter, and manage the links you have already published."
      breadcrumbItems={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'My Links', path: '/my-links' },
      ]}
    >
      <MyLinksWorkspace initialLinks={initialLinks} />
    </AuthenticatedAppShell>
  );
}