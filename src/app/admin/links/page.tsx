import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminAppShell from '@/components/common/AdminAppShell';
import AdminLinksTable from '../components/AdminLinksTable';
import { getServerSuperAdmin, getAdminLinks } from '@/lib/admin/service';

export const metadata: Metadata = {
  title: 'Links - Admin | LinkLab',
  description: 'Browse and manage every short link created on the platform.',
};

export default async function AdminLinksPage() {
  const admin = await getServerSuperAdmin();
  if (!admin) redirect('/login');

  const initialData = await getAdminLinks(1, 20);

  return (
    <AdminAppShell
      title="All Links"
      description="Browse every short link created on the platform, with click counts and owner info."
    >
      <AdminLinksTable initialData={initialData} />
    </AdminAppShell>
  );
}
