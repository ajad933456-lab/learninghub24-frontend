'use client'

export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { SubjectPicker } from '@/components/ui/subject-picker';
import { subjectApi, studentApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { SubjectCatalogResponse, Board } from '@/lib/types';
import { catalogArrayToRecord } from '@/lib/types';

const BOARDS: Board[] = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];
const MODES = ['online', 'offline', 'both'] as const;
const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];

export default function StudentSetupPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [subjectMap, setSubjectMap] = useState<Record<string, string[]>>({});
  const [board, setBoard] = useState<Board>('CBSE');
  const [city, setCity] = useState('');
  const [preferredMode, setPreferredMode] = useState<'online' | 'offline' | 'both'>('online');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<string[]>(['English']);
  const [learningGoal, setLearningGoal] = useState('');

  useEffect(() => {
    subjectApi.catalog().then((res) => {
      const { classes } = res.data as SubjectCatalogResponse;
      setCatalog(catalogArrayToRecord(classes));
    }).finally(() => setCatalogLoading(false));
  }, []);

  // Derive class from single-class subject picker
  const selectedClass = Object.keys(subjectMap)[0] ?? '';
  const selectedSubjects = selectedClass ? (subjectMap[selectedClass] ?? []) : [];

  function toggleLanguage(lang: string) {
    setPreferredLanguage((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClass) { setError('Please select your class.'); return; }
    if (selectedSubjects.length === 0) { setError('Please select at least one subject.'); return; }
    setError('');
    setSaving(true);
    try {
      await studentApi.upsertProfile({
        class: selectedClass,
        board,
        city,
        subjectsInterested: selectedSubjects,
        preferredMode,
        budgetRange: { min: Number(budgetMin) || 0, max: Number(budgetMax) || 0 },
        preferredLanguage,
        learningGoal,
      });
      await refreshUser();
      router.replace('/student');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Set up your student profile</h1>
            <p className="text-sm text-muted-foreground">
              Tell us about your learning needs so teachers can find you.
            </p>
          </div>

          {catalogLoading ? (
            <div className="flex justify-center py-8">
              <IconLoader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" id="form-student-setup">
              {/* Class + Subjects */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Your class & subjects of interest
                </label>
                <SubjectPicker
                  catalog={catalog}
                  value={subjectMap}
                  onChange={setSubjectMap}
                  singleClass
                />
              </div>

              {/* Board */}
              <div className="space-y-1.5">
                <label htmlFor="student-board" className="text-sm font-medium text-foreground">
                  Board / Curriculum
                </label>
                <select
                  id="student-board"
                  value={board}
                  onChange={(e) => setBoard(e.target.value as Board)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                >
                  {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* City + Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="student-city" className="text-sm font-medium text-foreground">City</label>
                  <input
                    id="student-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="student-mode" className="text-sm font-medium text-foreground">Preferred mode</label>
                  <select
                    id="student-mode"
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value as typeof preferredMode)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  >
                    {MODES.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Budget range (₹/hour)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="student-budget-min"
                    type="number"
                    min="0"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="Min ₹200"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                  <input
                    id="student-budget-max"
                    type="number"
                    min="0"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="Max ₹1000"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preferred languages</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      id={`btn-lang-${lang}`}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        preferredLanguage.includes(lang)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Goal */}
              <div className="space-y-1.5">
                <label htmlFor="student-goal" className="text-sm font-medium text-foreground">
                  Learning goal <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="student-goal"
                  rows={3}
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="I want to improve my Physics for the JEE entrance exam…"
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
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
                id="btn-student-setup-save"
              >
                {saving && <IconLoader2 size={16} className="animate-spin mr-2" />}
                Save & go to dashboard
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
