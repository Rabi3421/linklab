import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthenticatedAppShell from '@/components/common/AuthenticatedAppShell';
import LinkAnalyticsInteractive from './components/LinkAnalyticsInteractive';
import { getServerAuthenticatedUser } from '@/lib/auth/server';
import { getLinkAnalyticsForUser } from '@/lib/links/service';

export const metadata: Metadata = {
  title: 'Link Analytics - LinkLab',
  description: 'View comprehensive performance insights and analytics for your shortened links including click tracking, geographic distribution, device breakdown, and traffic sources.',
};

export default async function LinkAnalyticsPage({ searchParams }: { searchParams?: { code?: string } }) {
  const authenticatedUser = await getServerAuthenticatedUser();

  if (!authenticatedUser) {
    redirect('/login');
  }

  const selectedCode = searchParams?.code;
  const analytics = await getLinkAnalyticsForUser(authenticatedUser.id, selectedCode);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Link Analytics', path: '/link-analytics' }
  ];

  return (
    <AuthenticatedAppShell
      title="Link Analytics"
      description="View detailed performance trends, referrers, geographies, and device breakdowns for each link."
      breadcrumbItems={breadcrumbItems}
      maxWidthClassName="max-w-[1400px]"
    >
      <LinkAnalyticsInteractive analytics={analytics} />
    </AuthenticatedAppShell>
  );
}