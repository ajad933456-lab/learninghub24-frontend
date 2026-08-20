'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconLoader2, IconSearch } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import type { Query, User } from '@/lib/types';

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    adminApi.queries(params).then((res) => {
      setQueries((res.data as { queries: Query[] }).queries ?? []);
    }).finally(() => setLoading(false));
  }, [statusFilter]);

  async function moderateQuery(id: string, status: string, note?: string) {
    setModeratingId(id);
    try {
      await adminApi.moderateQuery(id, { status, moderationNote: note });
      setQueries((prev) => prev.map((q) => q._id === id ? { ...q, status: status as Query['status'] } : q));
    } finally {
      setModeratingId(null);
    }
  }

  const statusColor: Record<string, string> = {
    open: 'border-green-200 bg-green-100 text-green-700',
    closed: 'border-gray-200 bg-gray-100 text-gray-600',
    moderated: 'border-red-200 bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">All Queries</h2>
        <select
          id="queries-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-9 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="moderated">Moderated</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="space-y-3">
          {queries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">No queries found.</div>
          ) : (
            queries.map((q) => {
              const student = q.student as User;
              return (
                <div key={q._id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{q.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by {typeof student === 'object' ? student.fullName : 'Student'} · {q.city} · ₹{q.budget}/hr
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[q.status] ?? ''}`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{q.subject}</Badge>
                    <Badge variant="outline">{q.class}</Badge>
                    {q.board && <Badge variant="outline">{q.board}</Badge>}
                    <Badge variant="outline">{q.preferredMode}</Badge>
                  </div>
                  {q.status !== 'moderated' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => moderateQuery(q._id, 'moderated', 'Moderated by admin')}
                      disabled={moderatingId === q._id}
                      id={`btn-moderate-${q._id}`}
                      className="gap-1.5"
                    >
                      {moderatingId === q._id && <IconLoader2 size={12} className="animate-spin" />}
                      Suspend
                    </Button>
                  )}
                  {q.status === 'moderated' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moderateQuery(q._id, 'open')}
                      disabled={moderatingId === q._id}
                      id={`btn-reopen-${q._id}`}
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
