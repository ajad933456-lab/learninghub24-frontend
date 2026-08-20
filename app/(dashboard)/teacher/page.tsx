'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconCoinRupee, IconSearch, IconArrowRight, IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { teacherApi, queryApi } from '@/lib/api';
import type { Query } from '@/lib/types';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [recentQueries, setRecentQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      teacherApi.getCredits(),
      queryApi.browse({ limit: '5' }),
    ]).then(([credRes, queryRes]) => {
      setCredits((credRes.data.balance as number));
      setRecentQueries((queryRes.data as { queries: Query[] }).queries ?? []);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const firstName = user?.fullName?.split(' ')[0] ?? 'Teacher';
  const isRejected = user?.profileStatus === 'rejected';

  return (
    <div className="space-y-6">
      {/* Rejection banner */}
      {isRejected && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <IconAlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">Profile Rejected</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your profile was not approved. Please update your profile and re-submit.
            </p>
            <Link href="/teacher/profile" className="text-sm text-primary hover:underline mt-1 block">
              Edit profile →
            </Link>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border p-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Welcome back, {firstName}! 👋</h2>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Browse student queries and grow your tutoring business.</p>
      </div>

      {/* Credit balance */}
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 shrink-0">
            <IconCoinRupee size={26} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enquiry</p>
            {loading ? (
              <IconLoader2 size={20} className="animate-spin text-primary mt-1" />
            ) : (
              <p className="text-3xl font-black text-primary tracking-tight">{credits ?? 0}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/teacher/credits" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" id="btn-view-credits">View history</Button>
          </Link>
          <Link href="/teacher/plans" className="flex-1 sm:flex-initial">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" size="sm" id="btn-buy-credits">
              Buy Enquiries
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent queries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <IconSearch size={18} className="text-primary" />
            Latest Student Queries
          </h3>
          <Link href="/teacher/queries" className="flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:underline">
            Browse all <IconArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><IconLoader2 className="animate-spin text-primary" size={24} /></div>
        ) : recentQueries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No open queries right now. Check back soon!
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentQueries.map((q) => (
              <div key={q._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-foreground">{q.subject} · {q.class}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.city} · ₹{q.budget}/hr · {q.preferredMode}</p>
                </div>
                <Link href="/teacher/queries">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0" id={`btn-view-query-${q._id}`}>View Query</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
