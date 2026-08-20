'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconLoader2,
  IconMail,
  IconPhone,
  IconCalendar,
  IconShield,
  IconCheck,
  IconX,
  IconToggleLeft,
  IconToggleRight,
  IconCoinRupee,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import type { User } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [creditDelta, setCreditDelta] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [adjustingCredits, setAdjustingCredits] = useState(false);
  const [creditMsg, setCreditMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    adminApi
      .getUserById(id)
      .then((res) => {
        setUser((res.data as { user: User }).user ?? (res.data as User));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleToggle() {
    if (!user) return;
    setToggling(true);
    try {
      await adminApi.toggleUserStatus(user._id);
      setUser((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
    } finally {
      setToggling(false);
    }
  }

  async function handleAdjustCredits(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !creditDelta || !creditReason) return;
    setAdjustingCredits(true);
    setCreditMsg(null);
    try {
      await adminApi.adjustTeacherCredits(user._id, {
        delta: Number(creditDelta),
        reason: creditReason
      });
      setCreditMsg({ type: 'success', text: 'Credits adjusted successfully.' });
      setCreditDelta('');
      setCreditReason('');
    } catch (err: any) {
      setCreditMsg({ type: 'error', text: err.message || 'Failed to adjust credits.' });
    } finally {
      setAdjustingCredits(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <IconLoader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4 text-center py-16">
        <p className="text-muted-foreground">User not found.</p>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          <IconArrowLeft size={16} className="mr-2" /> Back to Users
        </Button>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    pending_details: 'bg-gray-100 text-gray-600 border-gray-200',
    pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header / Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={18} /> Back to Users
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant={user.isActive ? 'outline' : 'default'}
            size="sm"
            onClick={handleToggle}
            disabled={toggling || user.role === 'admin'}
            className="gap-2"
          >
            {toggling ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : user.isActive ? (
              <>
                <IconToggleRight size={18} className="text-primary" /> Deactivate Account
              </>
            ) : (
              <>
                <IconToggleLeft size={18} /> Activate Account
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-start gap-4 pb-6 border-b border-border">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold">
            {user.fullName
              ? user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
              : 'U'}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">{user.fullName || 'User Profile'}</h2>
              <Badge variant="secondary" className="capitalize text-xs font-semibold px-2.5 py-0.5">
                {user.role}
              </Badge>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[user.profileStatus] ?? ''
                  }`}
              >
                {user.profileStatus.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">ID: {user._id}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <IconMail className="text-muted-foreground mt-1" size={18} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Email Address</p>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconPhone className="text-muted-foreground mt-1" size={18} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Phone Number</p>
              <p className="text-sm font-medium text-foreground">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconShield className="text-muted-foreground mt-1" size={18} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Account Status</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                {user.isActive ? (
                  <>
                    <IconCheck size={16} className="text-green-600" /> Active
                  </>
                ) : (
                  <>
                    <IconX size={16} className="text-red-500" /> Inactive / Suspended
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconCalendar className="text-muted-foreground mt-1" size={18} />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Joined Date</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(user.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Adjustment Panel */}
      {user.role === 'teacher' && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <IconCoinRupee size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Adjust Enquiries</h3>
              <p className="text-sm text-muted-foreground">Add or remove Enquiries from this teacher's account.</p>
            </div>
          </div>

          {creditMsg && (
            <div className={`p-3 rounded-lg text-sm border ${creditMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {creditMsg.text}
            </div>
          )}

          <form onSubmit={handleAdjustCredits} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Change in Enquiry</label>
                <input
                  type="number"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. 10 (add) or -5 (remove)"
                  value={creditDelta}
                  onChange={(e) => setCreditDelta(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Reason / Note</label>
                <input
                  type="text"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. Custom payment via UPI"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={adjustingCredits || !creditDelta || !creditReason}
            >
              {adjustingCredits && <IconLoader2 size={16} className="animate-spin mr-2" />}
              Apply Adjustment
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
