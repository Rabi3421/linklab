'use client';

import { useState, useCallback } from 'react';
import type { AdminUserRow } from '@/lib/admin/service';

interface PaginatedUsers {
  users: AdminUserRow[];
  total: number;
  page: number;
  limit: number;
}

function roleBadge(role: string) {
  if (role === 'superadmin') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
        Super Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
      User
    </span>
  );
}

function planBadge(plan: string) {
  const isPaid = plan !== 'free';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        isPaid
          ? 'bg-success/10 text-success border-success/30'
          : 'bg-muted text-muted-foreground border-border'
      }`}
    >
      {plan}
    </span>
  );
}

export default function AdminUsersTable({ initialData }: { initialData: PaginatedUsers }) {
  const [data, setData] = useState<PaginatedUsers>(initialData);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (page: number, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', search: q });
      const res = await fetch(`/api/admin/users?${params.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const json = (await res.json()) as PaginatedUsers;
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
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name…"
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

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Plan</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Links</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-50' : ''}>
              {data.users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                data.users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.name ?? '—'}</td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3">{planBadge(u.plan)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{u.linksCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
