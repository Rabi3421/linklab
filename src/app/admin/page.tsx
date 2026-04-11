import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminAppShell from '@/components/common/AdminAppShell';
import AdminOverviewInteractive from './components/AdminOverviewInteractive';
import { getServerSuperAdmin } from '@/lib/admin/service';
import { getAdminOverviewStats } from '@/lib/admin/service';

export const metadata: Metadata = {
  title: 'Admin Overview - LinkLab',
  description: 'Super admin overview: users, links, QR codes, and payments across the platform.',
};

export default async function AdminPage() {
  const admin = await getServerSuperAdmin();

  if (!admin) {
    redirect('/login');
  }

  const stats = await getAdminOverviewStats();

  return (
    <AdminAppShell
      title="Admin Overview"
      description="Platform-wide stats: users, links, QR codes, and payments."
    >
      <AdminOverviewInteractive stats={stats} />
    </AdminAppShell>
  );
}
