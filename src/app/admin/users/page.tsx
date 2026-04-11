import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminAppShell from '@/components/common/AdminAppShell';
import AdminUsersTable from '../components/AdminUsersTable';
import { getServerSuperAdmin, getAdminUsers } from '@/lib/admin/service';

export const metadata: Metadata = {
  title: 'Users - Admin | LinkLab',
  description: 'Manage all registered users on the LinkLab platform.',
};

export default async function AdminUsersPage() {
  const admin = await getServerSuperAdmin();
  if (!admin) redirect('/login');

  const initialData = await getAdminUsers(1, 20);

  return (
    <AdminAppShell
      title="All Users"
      description="Browse, search, and inspect every registered account on the platform."
    >
      <AdminUsersTable initialData={initialData} />
    </AdminAppShell>
  );
}
