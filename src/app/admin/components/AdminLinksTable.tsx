'use client';

import { useState, useCallback } from 'react';
import type { AdminLinkRow } from '@/lib/admin/service';

interface PaginatedLinks {
  links: AdminLinkRow[];
  total: number;
  page: number;
  limit: number;
}

function statusBadge(status: string) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        status === 'active'
          ? 'bg-success/10 text-success border-success/30'
          : 'bg-error/10 text-error border-error/30'
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminLinksTable({ initialData }: { initialData: PaginatedLinks }) {
  const [data, setData] = useState<PaginatedLinks>(initialData);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (page: number, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', search: q });
      const res = await fetch(`/api/admin/links?${params.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const json = (await res.json()) as PaginatedLinks;
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchPage(1, search);
  };

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by URL, short code, or owner email…"
          className="flex-1 bg-card border border-border rounded-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); void fetchPage(1, ''); }}
            className="px-4 py-2 rounded-md bg-muted text-foreground text-sm font-medium hover:bg-muted/70 transition"
          >
            Clear
          </button>
        )}
      </form>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Short Code</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Original URL</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Clicks</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-50' : ''}>
              {data.links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No links found.
                  </td>
                </tr>
              ) : (
                data.links.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-primary">{l.shortCode}</td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <a
                        href={l.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary truncate block transition-colors"
                        title={l.originalUrl}
                      >
                        {l.originalUrl.length > 50 ? l.originalUrl.slice(0, 50) + '…' : l.originalUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{l.ownerEmail}</td>
                    <td className="px-4 py-3">{statusBadge(l.status)}</td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">{l.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(l.createdAt).toLocaleDateString()}
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
              onClick={() => void fetchPage(data.page - 1, search)}
              className="px-3 py-1.5 rounded-md bg-muted text-foreground disabled:opacity-40 hover:bg-muted/70 transition"
            >
              ← Prev
            </button>
            <button
              disabled={data.page >= totalPages || loading}
              onClick={() => void fetchPage(data.page + 1, search)}
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
