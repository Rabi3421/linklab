'use client';

import { useState, useCallback } from 'react';
import type { AdminQrRow } from '@/lib/admin/service';

interface PaginatedQrCodes {
  qrCodes: AdminQrRow[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminQrCodesGrid({ initialData }: { initialData: PaginatedQrCodes }) {
  const [data, setData] = useState<PaginatedQrCodes>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '24' });
      const res = await fetch(`/api/admin/qrcodes?${params.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const json = (await res.json()) as PaginatedQrCodes;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data.total.toLocaleString()} QR code{data.total !== 1 ? 's' : ''} generated
        </p>
      </div>

      {/* Grid */}
      {data.qrCodes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-lg border border-border">
          No QR codes found.
        </div>
      ) : (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 ${loading ? 'opacity-50' : ''}`}>
          {data.qrCodes.map((qr) => (
            <div
              key={qr.id}
              className="bg-card border border-border rounded-lg p-3 flex flex-col items-center gap-2 hover:border-primary/40 hover:shadow-md transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr.qrCodeDataUrl}
                alt={`QR for ${qr.shortCode}`}
                className="w-20 h-20 rounded object-contain bg-white p-1"
              />
              <p className="font-mono text-xs font-semibold text-primary truncate w-full text-center">
                {qr.shortCode}
              </p>
              <p className="text-xs text-muted-foreground truncate w-full text-center" title={qr.ownerEmail}>
                {qr.ownerEmail.length > 20 ? qr.ownerEmail.slice(0, 18) + '…' : qr.ownerEmail}
              </p>
              <p className="text-xs text-muted-foreground">
                {qr.clicks.toLocaleString()} clicks
              </p>
              {qr.hasCustomStyle && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  Custom
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {data.page} of {totalPages} ({data.total} total)
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
