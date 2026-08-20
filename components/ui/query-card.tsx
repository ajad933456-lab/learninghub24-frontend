'use client';

import { useState } from 'react';
import { IconLock, IconLockOpen, IconMapPin, IconClock, IconCurrencyRupee, IconLoader2 } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { queryApi } from '@/lib/api';
import { ApiError } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Query, User } from '@/lib/types';

interface QueryCardProps {
  query: Query;
  /** If present, the card is in student-view mode (no unlock button) */
  isOwn?: boolean;
  onUnlockSuccess?: (queryId: string, contactData: { fullName: string; email: string; phone: string }) => void;
  onInsufficientCredits?: () => void;
}

const modeColors: Record<string, string> = {
  online: 'bg-blue-100 text-blue-700 border-blue-200',
  offline: 'bg-amber-100 text-amber-700 border-amber-200',
  both: 'bg-green-100 text-green-700 border-green-200',
};

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
  moderated: 'bg-red-100 text-red-700 border-red-200',
};

export function QueryCard({ query, isOwn, onUnlockSuccess, onInsufficientCredits }: QueryCardProps) {
  const [unlocking, setUnlocking] = useState(false);
  const [unlockedContact, setUnlockedContact] = useState<{ fullName: string; email: string; phone: string } | null>(null);
  const isUnlocked = query.isUnlocked || !!unlockedContact;

  const studentObj = typeof query.student === 'object' && query.student !== null ? (query.student as User) : null;
  const studentDisplay = studentObj?.fullName ?? 'Student';
  const displayContact = unlockedContact ?? (query.isUnlocked ? studentObj : null);

  async function handleUnlock() {
    setUnlocking(true);
    try {
      const res = await queryApi.unlock(query._id);
      const data = res.data as { query: { student: { fullName: string; email: string; phone: string } } };
      setUnlockedContact(data.query.student);
      console.log("student", data.query.student)
      onUnlockSuccess?.(query._id, data.query.student);
    } catch (err) {
      if (err instanceof ApiError && err.isInsufficientCredits) {
        onInsufficientCredits?.();
      }
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2">
          {query.title}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[query.status] ?? ''}`}
        >
          {query.status}
        </span>
      </div>

      {/* Subject & Class */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="font-medium">{query.subject}</Badge>
        <Badge variant="outline">{query.class}</Badge>
        {query.board && <Badge variant="outline">{query.board}</Badge>}
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${modeColors[query.preferredMode] ?? ''}`}
        >
          {query.preferredMode}
        </span>
      </div>

      {/* Description */}
      {query.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{query.description}</p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <IconMapPin size={12} />
          {query.city}
        </span>
        <span className="flex items-center gap-1">
          {query.budget == 0 && (
            <>
              <IconCurrencyRupee size={12} />
              <span>Not Disclosed</span>
            </>
          )}
          <IconCurrencyRupee size={12} />
          {query.budget}/hr
        </span>
        <span
          className="flex items-center gap-1"
          title={new Date(query.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        >
          <IconClock size={12} />
          {timeAgo(query.createdAt)} ({new Date(query.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
        </span>
      </div>

      {/* Student info / unlock section */}
      {!isOwn && (
        <div className="border-t border-border pt-4">
          {isUnlocked || displayContact ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
                <IconLockOpen size={14} />
                Contact Revealed
              </div>
              <p className="text-sm font-medium text-foreground">{displayContact?.fullName ?? studentDisplay}</p>
              {displayContact?.email && (
                <p className="text-xs text-muted-foreground">{displayContact.email}</p>
              )}
              {displayContact?.phone && (
                <p className="text-xs text-muted-foreground">{displayContact.phone}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconLock size={14} />
                <span className="font-medium">{studentDisplay}</span>
                <span className="text-xs">(contact hidden)</span>
              </div>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                onClick={handleUnlock}
                disabled={unlocking}
                id={`btn-unlock-${query._id}`}
              >
                {unlocking ? (
                  <IconLoader2 size={13} className="animate-spin" />
                ) : (
                  <IconLockOpen size={13} />
                )}
                {unlocking ? 'Unlocking…' : 'Reveal Contact (1 credit)'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
