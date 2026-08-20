'use client';

import {
  IconUser,
  IconChalkboard,
  IconCheck,
  IconX,
  IconShoppingBag,
  IconSearch,
  IconCoinRupee,
  IconAlertCircle,
  IconUserCheck,
  IconUserX,
  IconCreditCard,
} from '@tabler/icons-react';
import type { ActivityLog, ActivityType } from '@/lib/types';

const activityConfig: Record<
  ActivityType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  teacher_login: { icon: <IconChalkboard size={14} />, color: 'text-blue-600', bg: 'bg-blue-100' },
  student_login: { icon: <IconUser size={14} />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  teacher_registered: { icon: <IconChalkboard size={14} />, color: 'text-green-600', bg: 'bg-green-100' },
  student_registered: { icon: <IconUser size={14} />, color: 'text-green-600', bg: 'bg-green-100' },
  teacher_profile_submitted: { icon: <IconChalkboard size={14} />, color: 'text-amber-600', bg: 'bg-amber-100' },
  teacher_approved: { icon: <IconUserCheck size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  teacher_rejected: { icon: <IconUserX size={14} />, color: 'text-red-600', bg: 'bg-red-100' },
  query_posted: { icon: <IconSearch size={14} />, color: 'text-violet-600', bg: 'bg-violet-100' },
  query_unlocked: { icon: <IconCoinRupee size={14} />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  payment_initiated: { icon: <IconShoppingBag size={14} />, color: 'text-sky-600', bg: 'bg-sky-100' },
  payment_success: { icon: <IconCheck size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  payment_failed: { icon: <IconX size={14} />, color: 'text-red-600', bg: 'bg-red-100' },
  plan_purchased: { icon: <IconShoppingBag size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  user_suspended: { icon: <IconAlertCircle size={14} />, color: 'text-red-600', bg: 'bg-red-100' },
  user_activated: { icon: <IconCheck size={14} />, color: 'text-green-600', bg: 'bg-green-100' },
  query_created: { icon: <IconSearch size={14} />, color: 'text-violet-600', bg: 'bg-violet-100' },
  payment_made: { icon: <IconCoinRupee size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  guest_payment_made: { icon: <IconCreditCard size={14} />, color: 'text-teal-600', bg: 'bg-teal-100' },
  credits_adjusted: { icon: <IconCoinRupee size={14} />, color: 'text-amber-600', bg: 'bg-amber-100' },
};

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeedItem({ activity }: { activity: ActivityLog }) {
  const config = activityConfig[activity.type] ?? {
    icon: <IconUser size={14} />,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  };

  // Extract payer object if present (guest_payment_made logs store payer details nested)
  const payer = activity.metadata?.payer as Record<string, unknown> | undefined;

  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bg} ${config.color}`}
      >
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{activity.message}</p>

        <p className="text-xs text-muted-foreground mt-0.5">
          {activity.type} · {timeAgo(activity.createdAt)}
        </p>

        {/* Payer details — rendered as clean labeled pills */}
        {payer && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {payer.fullName != null && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                <span className="font-medium">Name:</span> {String(payer.fullName)}
              </span>
            )}
            {payer.email != null && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded">
                <span className="font-medium">Email:</span> {String(payer.email)}
              </span>
            )}
            {(payer.phone ?? payer.number) != null && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-violet-50 text-violet-800 border border-violet-200 px-2 py-0.5 rounded">
                <span className="font-medium">Phone:</span> {String(payer.phone ?? payer.number)}
              </span>
            )}
            {payer.amountINR != null && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                ₹{String(payer.amountINR)}
              </span>
            )}
          </div>
        )}

        {/* Generic metadata pills for other activity types */}
        {!payer && activity.metadata && Object.keys(activity.metadata).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(activity.metadata).map(([key, value]) => {
              if (value === null || value === undefined) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 text-[11px] font-mono bg-muted/60 text-muted-foreground px-2 py-0.5 rounded border border-border/40"
                >
                  <span className="font-medium text-foreground/80">{key}:</span>
                  <span>
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
