import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticatedAppShell from '@/components/common/AuthenticatedAppShell';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import ApiKeysWorkspace from './components/ApiKeysWorkspace';

export const metadata: Metadata = {
  title: 'API Keys - LinkLab',
  description: 'Generate, rotate, and revoke your LinkLab API key for programmatic link creation and analytics access.',
};

export default async function ApiKeysPage() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    redirect('/login');
  }

  return (
    <AuthenticatedAppShell
      title="API Keys"
      description="Generate and manage your API key for programmatic access to LinkLab."
      breadcrumbItems={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'API Keys', path: '/api-keys' },
      ]}
    >
      <ApiKeysWorkspace />
    </AuthenticatedAppShell>
  );
}
