import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticatedAppShell from '@/components/common/AuthenticatedAppShell';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import SettingsWorkspace from './components/SettingsWorkspace';

export const metadata: Metadata = {
  title: 'Settings - LinkLab',
  description: 'Manage profile details, notifications, and workspace defaults inside LinkLab settings.',
};

export default async function SettingsPage() {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    redirect('/login');
  }

  return (
    <AuthenticatedAppShell
      title="Settings"
      description="Update your account defaults, notification preferences, and workspace settings."
      breadcrumbItems={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Settings', path: '/settings' },
      ]}
    >
      <SettingsWorkspace />
    </AuthenticatedAppShell>
  );
}