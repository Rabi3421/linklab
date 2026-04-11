'use client';

import { useState, useCallback } from 'react';
import type { AdminPaymentRow } from '@/lib/admin/service';

interface PaginatedPayments {
  payments: AdminPaymentRow[];
  total: number;
  page: number;
  limit: number;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/30',
    expired: 'bg-error/10 text-error border-error/30',
    canceled: 'bg-warning/10 text-warning border-warning/30',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        map[status] ?? 'bg-muted text-muted-foreground border-border'
      }`}
    >
      {status}
    </span>
  );
}

function paymentStatusBadge(ps: string) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        ps === 'paid'
          ? 'bg-success/10 text-success border-success/30'
          : 'bg-error/10 text-error border-error/30'
      }`}
    >
      {ps}
    </span>
  );
}

export default function AdminPaymentsTable({ initialData }: { initialData: PaginatedPayments }) {
  const [data, setData] = useState<PaginatedPayments>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/payments?${params.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const json = (await res.json()) as PaginatedPayments;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Provider</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Activated</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Period End</th>
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-50' : ''}>
              {data.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                data.payments.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{p.ownerEmail}</td>
                    <td className="px-4 py-3 capitalize text-foreground font-medium">{p.planId}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3">{paymentStatusBadge(p.paymentStatus)}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{p.paymentProvider}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.activatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.currentPeriodEnd).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(data.page - 1) * data.limit + 1}–
            {Math.min(data.page * data.limit, data.total)} of {data.total}
          </span>
          <div className="flex gap-2">
            <button
              disabled={data.page <= 1 || loading}
              onClick={() => void fetchPage(data.page - 1)}
              className="px-3 py-1.5 rounded-md bg-muted text-foreground disabled:opacity-40 hover:bg-muted/70 transition"
            >
              ← Prev
            </button>
            <button
              disabled={data.page >= totalPages || loading}
              onClick={() => void fetchPage(data.page + 1)}
              className="px-3 py-1.5 rounded-md bg-muted text-foreground disabled:opacity-40 hover:bg-muted/70 transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
