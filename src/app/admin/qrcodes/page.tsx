import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminAppShell from '@/components/common/AdminAppShell';
import AdminQrCodesGrid from '../components/AdminQrCodesGrid';
import { getServerSuperAdmin, getAdminQrCodes } from '@/lib/admin/service';

export const metadata: Metadata = {
  title: 'QR Codes - Admin | LinkLab',
  description: 'Browse all generated QR codes across the platform.',
};

export default async function AdminQrCodesPage() {
  const admin = await getServerSuperAdmin();
  if (!admin) redirect('/login');

  const initialData = await getAdminQrCodes(1, 24);

  return (
    <AdminAppShell
      title="QR Codes"
      description="All generated QR codes across the platform, with click counts and owner info."
    >
      <AdminQrCodesGrid initialData={initialData} />
    </AdminAppShell>
  );
}
