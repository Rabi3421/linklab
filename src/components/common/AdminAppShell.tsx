import type { ReactNode } from 'react';
import AuthenticatedWorkspaceHeader from '@/components/common/AuthenticatedWorkspaceHeader';
import AdminSidebar from '@/components/common/AdminSidebar';

interface AdminAppShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AdminAppShell({ title, description, children }: AdminAppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedWorkspaceHeader title={title} description={description} />
      <AdminSidebar />

      <main className="lg:ml-[240px] pt-[72px] pb-[80px] lg:pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                Super Admin
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-base text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
