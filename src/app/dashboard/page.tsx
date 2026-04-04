import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'Dashboard - LinkLab',
  description: 'Manage your shortened links, track analytics, and create new short URLs from your centralized dashboard.',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthenticationAwareHeader isAuthenticated={true} />
      <DashboardSidebar />
      
      <main className="lg:ml-[240px] pt-[60px] pb-[80px] lg:pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-base text-muted-foreground">
              Manage your links, track performance, and create new short URLs
            </p>
          </div>

          <DashboardInteractive />
        </div>
      </main>
    </div>
  );
}