'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState, useCallback } from 'react';
import {
  IconUsers, IconChalkboard, IconClipboardList, IconCoinRupee,
  IconLoader2, IconRefresh,
} from '@tabler/icons-react';
import { ActivityFeedItem } from '@/components/ui/activity-feed';
import { adminApi } from '@/lib/api';
import type { AdminStats, ActivityLog } from '@/lib/types';

import Link from 'next/link';

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        adminApi.stats(),
        adminApi.activity({ page: 1, limit: 20 }),
      ]);
      setStats(statsRes.data as AdminStats);
      setActivities((activityRes.data as any)?.activity?.activities || []);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds per system design
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const cards: StatCard[] = stats
    ? [
      { label: 'Total Users', value: stats.users.total, icon: <IconUsers size={20} />, color: 'bg-blue-50 text-blue-600 border-blue-100', href: '/admin/users' },
      { label: 'Students', value: stats.users.students, icon: <IconUsers size={20} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', href: '/admin/users?role=student' },
      { label: 'Teachers', value: stats.users.teachers, icon: <IconChalkboard size={20} />, color: 'bg-primary/10 text-primary border-primary/20', href: '/admin/users?role=teacher' },
      { label: 'Pending Appr`oval', value: stats.teachers.pending, icon: <IconChalkboard size={20} />, color: 'bg-amber-50 text-amber-600 border-amber-100', href: '/admin/teachers' },
      { label: 'Open Queries', value: stats.queries.total, icon: <IconClipboardList size={20} />, color: 'bg-violet-50 text-violet-600 border-violet-100', href: '/admin/queries' },
      { label: 'Total Revenue', value: stats.revenue.totalPaise, icon: <IconCoinRupee size={20} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', href: '/admin/payments' },
    ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Platform Metrics</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Real-time overview of users, activity, and transactions.</p>
        </div>
        <button
          onClick={fetchData}
          id="btn-refresh-dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all shadow-sm"
        >
          <IconRefresh size={14} className={loading ? 'animate-spin text-primary' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      {loading && !stats ? (
        <div className="flex justify-center py-12"><IconLoader2 className="animate-spin text-primary" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.color} transition-transform group-hover:scale-105`}>
                  {card.icon}
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {card.label === 'Total Revenue'
                    ? `₹${Math.round((card.value || 0) / 100).toLocaleString('en-IN')}`
                    : (card.value || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Activity feed */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between bg-muted/20">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Recent Platform Activity</h3>
          <span className="text-[11px] font-medium text-muted-foreground">Auto-refreshes every 30s</span>
        </div>
        <div className="divide-y divide-border px-5">
          {activities.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No activity logs recorded yet.</p>
          ) : (
            activities.map((a) => <ActivityFeedItem key={a._id} activity={a} />)
          )}
        </div>
      </div>
    </div>
  );
}
