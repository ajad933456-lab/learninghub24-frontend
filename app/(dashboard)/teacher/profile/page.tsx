'use client'

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { IconLoader2, IconPlus, IconX, IconUser, IconMapPin, IconBriefcase, IconClock, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { SubjectPicker } from '@/components/ui/subject-picker';
import { subjectApi, teacherApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { SubjectCatalogResponse, TeacherProfile } from '@/lib/types';
import { catalogArrayToRecord } from '@/lib/types';

const MODES = ['online', 'offline', 'both'] as const;

export default function TeacherProfilePage() {
  const { user, refreshUser } = useAuth();
  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [subjectsTaught, setSubjectsTaught] = useState<Record<string, string[]>>({});
  const [qualifications, setQualifications] = useState<string[]>(['']);
  const [experienceYears, setExperienceYears] = useState('');
  const [teachingMode, setTeachingMode] = useState<'online' | 'offline' | 'both'>('online');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    Promise.all([subjectApi.catalog(), teacherApi.getProfile()])
      .then(([catRes, profRes]) => {
        setCatalog(catalogArrayToRecord((catRes.data as SubjectCatalogResponse).classes));
        const p = profRes.data as { profile: TeacherProfile };
        if (p?.profile) {
          const prof = p.profile;
          setSubjectsTaught(prof.subjectsTaught ?? {});
          setQualifications(prof.qualifications?.length ? prof.qualifications : ['']);
          setExperienceYears(String(prof.experienceYears ?? ''));
          setTeachingMode(prof.teachingMode ?? 'online');
          setCity(prof.city ?? '');
          setBio(prof.bio ?? '');
          setHourlyRate(String(prof.hourlyRate ?? ''));
        }
      }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await teacherApi.upsertProfile({
        subjectsTaught,
        qualifications: qualifications.filter(Boolean),
        experienceYears: Number(experienceYears) || 0,
        teachingMode,
        city,
        bio,
        hourlyRate: Number(hourlyRate) || 0,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-24"><IconLoader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="w-full max-w-[2400px] mx-auto space-y-6 p-2 lg:p-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Edit Teacher Profile</h1>
          <p className="text-sm text-muted-foreground">Update your teaching details, subjects, and rate for admin review.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 font-medium animate-in fade-in duration-200">
              <IconCheck size={16} /> Saved & re-submitted!
            </span>
          )}
          <Button
            form="form-teacher-profile"
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
            disabled={saving}
            id="btn-save-teacher-profile-top"
          >
            {saving && <IconLoader2 size={16} className="animate-spin mr-2" />}
            Save & re-submit
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} id="form-teacher-profile">
        {/* Ultrawide 3-Column Layout: Live Preview | Core Selection | Attributes & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 2xl:grid-cols-12 gap-6 items-start ">
          {/* Details & Settings */}
          <div className="lg:col-span-12 2xl:col-span-4 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-semibold text-foreground border-b border-border pb-3">Teaching Details & Pricing</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="t-exp" className="text-xs font-medium text-foreground">Experience (Years)</label>
                  <input
                    id="t-exp"
                    type="number"
                    min="0"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="t-mode" className="text-xs font-medium text-foreground">Teaching Mode</label>
                  <select
                    id="t-mode"
                    value={teachingMode}
                    onChange={(e) => setTeachingMode(e.target.value as typeof teachingMode)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring capitalize"
                  >
                    {MODES.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="t-city" className="text-xs font-medium text-foreground">City</label>
                  <input
                    id="t-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="t-rate" className="text-xs font-medium text-foreground">Hourly Rate (₹)</label>
                  <input
                    id="t-rate"
                    type="number"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="t-bio" className="text-xs font-medium text-foreground">Teacher Bio</label>
                <textarea
                  id="t-bio"
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Introduce yourself to prospective students and highlight your teaching strategy..."
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}

            </div>
          </div>

          {/* Subjects & Qualifications (Heavy Content) */}
          <div className="lg:col-span-12 2xl:col-span-4 space-y-6 ">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Classes & Subjects You Teach</label>
                <p className="text-xs text-muted-foreground">Select the grade levels and subjects you are available to tutor.</p>
                <SubjectPicker catalog={catalog} value={subjectsTaught} onChange={setSubjectsTaught} />
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <label className="text-sm font-semibold text-foreground">Qualifications</label>
                <div className="space-y-2">
                  {qualifications.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => {
                          const next = [...qualifications];
                          next[i] = e.target.value;
                          setQualifications(next);
                        }}
                        placeholder="e.g. B.Tech IIT Delhi"
                        className="flex-1 h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                      />
                      {qualifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setQualifications(qualifications.filter((_, idx) => idx !== i))}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <IconX size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setQualifications([...qualifications, ''])}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline pt-1"
                >
                  <IconPlus size={15} /> Add another qualification
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}