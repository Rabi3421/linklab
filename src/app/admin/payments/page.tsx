import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminAppShell from '@/components/common/AdminAppShell';
import AdminPaymentsTable from '../components/AdminPaymentsTable';
import { getServerSuperAdmin, getAdminPayments } from '@/lib/admin/service';

export const metadata: Metadata = {
  title: 'Payments - Admin | LinkLab',
  description: 'Review all subscriptions and billing records across the platform.',
};

export default async function AdminPaymentsPage() {
  const admin = await getServerSuperAdmin();
  if (!admin) redirect('/login');

  const initialData = await getAdminPayments(1, 20);

  return (
    <AdminAppShell
      title="Payments & Subscriptions"
      description="All subscription and billing records across the platform."
    >
      <AdminPaymentsTable initialData={initialData} />
    </AdminAppShell>
  );
}
