'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IconFilter, IconLoader2, IconRefresh } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { QueryCard } from '@/components/ui/query-card';
import { queryApi } from '@/lib/api';
import type { Query } from '@/lib/types';

const MODES = ['', 'online', 'offline', 'both'];
const BOARDS = ['', 'CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];

export default function TeacherBrowseQueriesPage() {
  const router = useRouter();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [subject, setSubject] = useState('');
  const [city, setCity] = useState('');
  const [board, setBoard] = useState('');
  const [preferredMode, setPreferredMode] = useState('');

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (subject) params.subject = subject;
      if (city) params.city = city;
      if (board) params.board = board;
      if (preferredMode) params.preferredMode = preferredMode;
      const res = await queryApi.browse(params);
      setQueries((res.data as { queries: Query[] }).queries ?? []);
    } finally {
      setLoading(false);
    }
  }, [subject, city, board, preferredMode]);

  useEffect(() => { fetchQueries(); }, [fetchQueries]);

  function handleUnlockSuccess(queryId: string, contactData: { fullName: string; email: string; phone: string }) {
    setQueries((prev) =>
      prev.map((q) => q._id === queryId ? { ...q, isUnlocked: true } : q)
    );
  }

  function handleInsufficientCredits() {
    router.push('/teacher/plans');
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Browse Student Queries</h2>
        <Button variant="outline" size="sm" onClick={fetchQueries} className="gap-1.5" id="btn-refresh-queries">
          <IconRefresh size={14} /> Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconFilter size={15} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input
            id="filter-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (e.g. Math)"
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          />
          <input
            id="filter-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          />
          <select
            id="filter-board"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          >
            {BOARDS.map((b) => <option key={b} value={b}>{b || 'Any board'}</option>)}
          </select>
          <select
            id="filter-mode"
            value={preferredMode}
            onChange={(e) => setPreferredMode(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          >
            {MODES.map((m) => <option key={m} value={m}>{m || 'Any mode'}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16">
          <IconLoader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : queries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No queries match your filters. Try clearing some filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {queries.map((q) => (
            <QueryCard
              key={q._id}
              query={q}
              onUnlockSuccess={handleUnlockSuccess}
              onInsufficientCredits={handleInsufficientCredits}
            />
          ))}
        </div>
      )}
    </div>
  );
}
