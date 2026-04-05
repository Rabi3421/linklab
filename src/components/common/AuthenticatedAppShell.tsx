import type { ReactNode } from 'react';
import AuthenticatedWorkspaceHeader from '@/components/common/AuthenticatedWorkspaceHeader';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface AuthenticatedAppShellProps {
  title: string;
  description: string;
  children: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  maxWidthClassName?: string;
}

export default function AuthenticatedAppShell({
  title,
  description,
  children,
  breadcrumbItems,
  maxWidthClassName = 'max-w-[1400px]',
}: AuthenticatedAppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedWorkspaceHeader title={title} description={description} />
      <DashboardSidebar />

      <main className="lg:ml-[240px] pt-[72px] pb-[80px] lg:pb-8">
        <div className={`${maxWidthClassName} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
          <BreadcrumbNavigation customItems={breadcrumbItems} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-base text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}