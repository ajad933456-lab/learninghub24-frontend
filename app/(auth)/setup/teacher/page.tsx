'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconLoader2, IconPlus, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { SubjectPicker } from '@/components/ui/subject-picker';
import { subjectApi, teacherApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { SubjectCatalogResponse, TeacherProfile } from '@/lib/types';
import { catalogArrayToRecord } from '@/lib/types';

const MODES = ['online', 'offline', 'both'] as const;

export default function TeacherSetupPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [subjectsTaught, setSubjectsTaught] = useState<Record<string, string[]>>({});
  const [qualifications, setQualifications] = useState<string[]>(['']);
  const [experienceYears, setExperienceYears] = useState('');
  const [teachingMode, setTeachingMode] = useState<'online' | 'offline' | 'both'>('online');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    // Fetch the public catalog independently from the authenticated profile
    // so a 401 on getProfile() (token not yet ready on first render) does NOT
    // prevent setCatalog() from running.
    subjectApi.catalog()
      .then((catRes) => {
        const { classes } = catRes.data as SubjectCatalogResponse;
        setCatalog(catalogArrayToRecord(classes));
      })
      .catch(() => {})
      .finally(() => setCatalogLoading(false));

    // Separately pre-fill the form if a saved profile exists.
    // Errors are silently ignored (new teacher has no profile yet).
    teacherApi.getProfile()
      .then((profRes) => {
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
      })
      .catch(() => {});
  }, []);

  function addQualification() {
    setQualifications((q) => [...q, '']);
  }
  function removeQualification(i: number) {
    setQualifications((q) => q.filter((_, idx) => idx !== i));
  }
  function updateQualification(i: number, val: string) {
    setQualifications((q) => q.map((v, idx) => (idx === i ? val : v)));
  }

  function removeSummarySubject(className: string, subject: string) {
    setSubjectsTaught((prev) => ({
      ...prev,
      [className]: (prev[className] ?? []).filter((s) => s !== subject),
    }));
  }


  const classCount = Object.keys(subjectsTaught).length;
  const subjectCount = Object.values(subjectsTaught).reduce((sum, arr) => sum + arr.length, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.keys(subjectsTaught).length === 0) {
      setError('Please add at least one class and subject.');
      return;
    }
    const hasSubjects = Object.values(subjectsTaught).some((arr) => arr.length > 0);
    if (!hasSubjects) {
      setError('Please select at least one subject for the added class(es).');
      return;
    }
    setError('');
    setSaving(true);
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
      router.replace('/pending-approval');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6s">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Set up your teacher profile</h1>
          <p className="text-sm text-muted-foreground">
            Share your expertise. Students will discover you based on your profile.
          </p>
        </div>

        {catalogLoading ? (
          <div className="rounded-2xl border border-border bg-card shadow-xl p-8 flex justify-center py-12">
            <IconLoader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left column: form */}
            <div className=" rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6 ">
              <form onSubmit={handleSubmit} className="space-y-6" id="form-teacher-setup">


                {/* Qualifications */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Qualifications</label>
                  {qualifications.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        id={`qual-${i}`}
                        type="text"
                        value={q}
                        onChange={(e) => updateQualification(i, e.target.value)}
                        placeholder={i === 0 ? 'e.g. B.Tech from IIT Delhi' : 'Additional qualification'}
                        className="flex-1 h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                      />
                      {qualifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQualification(i)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                        >
                          <IconX size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQualification}
                    id="btn-add-qualification"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <IconPlus size={14} />
                    Add another qualification
                  </button>
                </div>

                {/* Experience + Mode */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="teacher-exp" className="text-sm font-medium text-foreground text-nowrap">
                      Years of experience
                    </label>
                    <input
                      id="teacher-exp"
                      type="number"
                      min="0"
                      required
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="e.g. 5"
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="teacher-mode" className="text-sm font-medium text-foreground">
                      Teaching mode
                    </label>
                    <select
                      id="teacher-mode"
                      value={teachingMode}
                      onChange={(e) => setTeachingMode(e.target.value as typeof teachingMode)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    >
                      {MODES.map((m) => (
                        <option key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City + Hourly Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="teacher-city" className="text-sm font-medium text-foreground">City</label>
                    <input
                      id="teacher-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Delhi"
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="teacher-rate" className="text-sm font-medium text-foreground">Hourly rate (₹)</label>
                    <input
                      id="teacher-rate"
                      type="number"
                      min="0"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="e.g. 500"
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label htmlFor="teacher-bio" className="text-sm font-medium text-foreground">
                    Bio <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="teacher-bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your teaching style, achievements, and what students can expect…"
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={saving}
                  id="btn-teacher-setup-save"
                >
                  {saving && <IconLoader2 size={16} className="animate-spin mr-2" />}
                  Submit for review
                </Button>
              </form>
            </div>

            {/* Right column: live profile summary */}
            <div className='rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6 h-full max-h-[75vh] overflow-y-scroll'>

              {/* <div className="lg:sticky space-y-4 h-fit">
                <p className="text-sm font-medium text-foreground">Profile snapshot</p>

                <div className="flex gap-6">
                  <div>
                    <div className="text-2xl font-semibold text-foreground">{classCount}</div>
                    <div className="text-xs text-muted-foreground">Classes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-foreground">{subjectCount}</div>
                    <div className="text-xs text-muted-foreground">Subjects</div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  {Object.entries(subjectsTaught)
                    .filter(([, subs]) => subs.length > 0)
                    .map(([className, subs]) => (
                      <div key={className}>
                        <p className="text-xs text-muted-foreground mb-1.5">{className}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {subs.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 text-xs rounded-full bg-primary/10 text-primary pl-2.5 pr-1.5 py-1"
                            >
                              {s}
                              <button
                                type="button"
                                onClick={() => removeSummarySubject(className, s)}
                                aria-label={`Remove ${s}`}
                                className="hover:text-destructive"
                              >
                                <IconX size={11} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  {subjectCount === 0 && (
                    <p className="text-xs text-muted-foreground">Selected subjects will appear here.</p>
                  )}
                </div>

                {(city || experienceYears || hourlyRate) && (
                  <div className="border-t border-border pt-4 space-y-1 text-xs text-muted-foreground">
                    {city && <p>{city} · {teachingMode}</p>}
                    {experienceYears && <p>{experienceYears} yrs experience</p>}
                    {hourlyRate && <p>₹{hourlyRate}/hr</p>}
                  </div>
                )}
              </div> */}
              {/* Subjects taught */}
              <div className="space-y-6">
                <label className="text-sm font-medium text-foreground">
                  Classes & subjects you teach
                  <span className="ml-1 text-muted-foreground font-normal">(add multiple classes)</span>
                </label>
                <SubjectPicker
                  catalog={catalog}
                  value={subjectsTaught}
                  onChange={setSubjectsTaught}
                />
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}