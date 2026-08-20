'use client'

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { IconCheck, IconX, IconLoader2, IconUser } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import type { User, TeacherProfile } from '@/lib/types';

// Updated interface to match your actual backend object structure
interface PendingTeacher extends User {
  teacherProfile?: TeacherProfile;
}

export default function AdminPendingTeachersPage() {
  const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    adminApi.pendingTeachers().then((res) => {
      // Assuming res.data contains { teachers: [...] } or direct array
      const data = (res.data as { teachers: PendingTeacher[] })?.teachers ?? (res.data as PendingTeacher[]) ?? [];
      setTeachers(data);
    }).finally(() => setLoading(false));
  }, []);

  async function handleApprove(userId: string) {
    setActionId(userId);
    try {
      await adminApi.approveTeacher(userId);
      setTeachers((prev) => prev.filter((t) => t._id !== userId));
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(userId: string) {
    if (!rejectReason.trim()) return;
    setActionId(userId);
    try {
      await adminApi.rejectTeacher(userId, rejectReason);
      setTeachers((prev) => prev.filter((t) => t._id !== userId));
      setRejectId(null);
      setRejectReason('');
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">
        Pending Teacher Approvals
        {!loading && (
          <span className="ml-2 rounded-full bg-amber-100 text-amber-700 px-2.5 py-0.5 text-sm font-semibold">
            {teachers.length}
          </span>
        )}
      </h2>

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : teachers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <IconCheck size={32} className="text-green-500 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No pending approvals! All caught up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teachers.map((teacher) => {
            const profile = teacher.teacherProfile;

            return (
              <div key={teacher._id} className="rounded-xl border border-border bg-card p-5 space-y-4">
                {/* Teacher info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <IconUser size={18} className="text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{teacher.fullName}</p>
                    <p className="text-sm text-muted-foreground">{teacher.email} · {teacher.phone}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                </div>

                {/* Profile details */}
                {profile && (
                  <div className="rounded-lg bg-muted/40 p-4 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Experience</span>
                        <p className="font-medium">{profile.experienceYears} years</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Mode</span>
                        <p className="font-medium capitalize">{profile.teachingMode}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">City</span>
                        <p className="font-medium">{profile.city}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Hourly rate</span>
                        <p className="font-medium">₹{profile.hourlyRate}/hr</p>
                      </div>
                    </div>
                    {profile.qualifications && profile.qualifications.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Qualifications</span>
                        <p className="font-medium">{profile.qualifications.join(', ')}</p>
                      </div>
                    )}
                    {profile.subjectsTaught && Object.keys(profile.subjectsTaught).length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Subjects</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(profile.subjectsTaught).map(([cls, subjects]) => (
                            <span key={cls} className="rounded-lg border border-border bg-background px-2 py-0.5 text-xs">
                              {cls}: {(subjects as string[]).join(', ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.bio && <p className="text-muted-foreground italic text-xs line-clamp-2">{profile.bio}</p>}
                  </div>
                )}

                {/* Actions */}
                {rejectId === teacher._id ? (
                  <div className="space-y-2">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection…"
                      rows={2}
                      id={`textarea-reject-${teacher._id}`}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(teacher._id)}
                        disabled={actionId === teacher._id || !rejectReason.trim()}
                        id={`btn-confirm-reject-${teacher._id}`}
                      >
                        {actionId === teacher._id ? <IconLoader2 size={13} className="animate-spin mr-1" /> : null}
                        Confirm Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setRejectId(null); setRejectReason(''); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                      onClick={() => handleApprove(teacher._id)}
                      disabled={actionId === teacher._id}
                      id={`btn-approve-${teacher._id}`}
                    >
                      {actionId === teacher._id ? <IconLoader2 size={13} className="animate-spin" /> : <IconCheck size={13} />}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1.5"
                      onClick={() => setRejectId(teacher._id)}
                      id={`btn-reject-${teacher._id}`}
                    >
                      <IconX size={13} /> Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}