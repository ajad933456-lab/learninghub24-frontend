'use client'

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { IconLoader2, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QueryCard } from '@/components/ui/query-card';
import { queryApi } from '@/lib/api';
import type { Query } from '@/lib/types';

export default function UnlockedQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queryApi.unlocked().then((res) => {
      // Force isUnlocked to true so the QueryCard knows to show contact details
      const fetchedQueries = (res.data as { queries: Query[] }).queries ?? [];
      setQueries(fetchedQueries.map(q => ({ ...q, isUnlocked: true })));
    }).catch(() => {
      // Ignore errors for now
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Unlocked Queries</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <IconLoader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : queries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">You haven't unlocked any queries yet.</p>
          <Link href="/teacher/queries">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" id="btn-browse-queries">
              <IconSearch size={14} /> Browse Queries
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {queries.map((q) => (
            <QueryCard
              key={q._id}
              query={q}
            />
          ))}
        </div>
      )}
    </div>
  );
}
