'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconPlus, IconPencil, IconTrash, IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { queryApi } from '@/lib/api';
import type { Query } from '@/lib/types';

export default function StudentQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  async function fetchQueries() {
    try {
      const res = await queryApi.myQueries();
      const data = res.data as { queries: Query[] };
      setQueries(data.queries ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this query?')) return;
    setDeletingId(id);
    try {
      await queryApi.remove(id);
      setQueries((prev) => prev.filter((q) => q._id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">My Queries</h2>
        <Link href="/student/queries/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" id="btn-new-query">
            <IconPlus size={16} />
            New Query
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <IconLoader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : queries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No queries posted yet.</p>
          <Link href="/student/queries/new">
            <Button size="sm" className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" id="btn-post-first">
              <IconPlus size={14} /> Post your first query
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {queries.map((q) => (
            <div key={q._id} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground">{q.title}</h3>
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  q.status === 'open' ? 'border-green-200 bg-green-100 text-green-700' :
                  q.status === 'closed' ? 'border-gray-200 bg-gray-100 text-gray-600' :
                  'border-red-200 bg-red-100 text-red-700'
                }`}>{q.status}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{q.subject}</Badge>
                <Badge variant="outline">{q.class}</Badge>
                {q.board && <Badge variant="outline">{q.board}</Badge>}
                <Badge variant="outline">{q.city}</Badge>
              </div>

              {q.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{q.description}</p>
              )}

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground">
                  Posted {new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div className="flex gap-2">
                  <Link href={`/student/queries/${q._id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-1.5" id={`btn-edit-${q._id}`}>
                      <IconPencil size={13} /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(q._id)}
                    disabled={deletingId === q._id}
                    id={`btn-delete-${q._id}`}
                  >
                    {deletingId === q._id ? <IconLoader2 size={13} className="animate-spin" /> : <IconTrash size={13} />}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
