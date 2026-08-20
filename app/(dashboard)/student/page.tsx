'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconPlus, IconClipboardList, IconLoader2, IconArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { queryApi } from '@/lib/api';
import type { Query } from '@/lib/types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queryApi.myQueries().then((res) => {
      const data = res.data as { queries: Query[] };
      setQueries(data.queries ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const open = queries.filter((q) => q.status === 'open');
  const firstName = user?.fullName?.split(' ')[0] ?? 'Student';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border p-6">
        <h2 className="text-2xl font-bold text-foreground">Welcome back, {firstName}! 👋</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          You have <strong>{open.length}</strong> open {open.length === 1 ? 'query' : 'queries'} waiting for tutors.
        </p>
        <div className="mt-4">
          <Link href="/student/queries/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" id="btn-post-query">
              <IconPlus size={16} />
              Post a new query
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Queries', value: queries.length, color: 'text-primary' },
          { label: 'Open Queries', value: open.length, color: 'text-emerald-600' },
          { label: 'Closed Queries', value: queries.filter((q) => q.status === 'closed').length, color: 'text-muted-foreground' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className={`text-3xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent queries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <IconClipboardList size={18} className="text-primary" />
            Recent Queries
          </h3>
          <Link href="/student/queries" className="flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:underline">
            View all <IconArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <IconLoader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : queries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground text-sm">No queries yet. Post one to find a tutor!</p>
            <Link href="/student/queries/new">
              <Button size="sm" className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-sm" id="btn-post-first-query">
                <IconPlus size={14} />
                Post query
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {queries.slice(0, 5).map((q) => (
              <div key={q._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/30 transition-all">
                <div className="space-y-1.5 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{q.title}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">{q.subject}</Badge>
                    <Badge variant="outline" className="text-xs">{q.class}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    q.status === 'open' ? 'border-emerald-200 bg-emerald-100 text-emerald-700' :
                    q.status === 'closed' ? 'border-gray-200 bg-gray-100 text-gray-600' :
                    'border-rose-200 bg-rose-100 text-rose-700'
                  }`}>{q.status}</span>
                  <Link href={`/student/queries/${q._id}/edit`}>
                    <Button variant="outline" size="sm" id={`btn-edit-query-${q._id}`}>Edit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
