import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import LinkAnalyticsInteractive from './components/LinkAnalyticsInteractive';

export const metadata: Metadata = {
  title: 'Link Analytics - LinkLab',
  description: 'View comprehensive performance insights and analytics for your shortened links including click tracking, geographic distribution, device breakdown, and traffic sources.',
};

export default function LinkAnalyticsPage() {
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Link Analytics', path: '/link-analytics' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationAwareHeader isAuthenticated={true} />
      
      <main className="pt-[60px]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <BreadcrumbNavigation customItems={breadcrumbItems} />
          <LinkAnalyticsInteractive linkCode="abc123" />
        </div>
      </main>
    </div>
  );
}