'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { SubjectPicker } from '@/components/ui/subject-picker';
import { subjectApi, studentApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { SubjectCatalogResponse, StudentProfile, Board } from '@/lib/types';
import { catalogArrayToRecord } from '@/lib/types';

const BOARDS: Board[] = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];
const MODES = ['online', 'offline', 'both'] as const;
const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];

export default function StudentProfilePage() {
  const { refreshUser } = useAuth();
  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [subjectMap, setSubjectMap] = useState<Record<string, string[]>>({});
  const [board, setBoard] = useState<Board>('CBSE');
  const [city, setCity] = useState('');
  const [preferredMode, setPreferredMode] = useState<'online' | 'offline' | 'both'>('online');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<string[]>(['English']);
  const [learningGoal, setLearningGoal] = useState('');

  useEffect(() => {
    Promise.all([subjectApi.catalog(), studentApi.getProfile()])
      .then(([catRes, profRes]) => {
        setCatalog(catalogArrayToRecord((catRes.data as SubjectCatalogResponse).classes));
        const p = profRes.data as { profile: StudentProfile };
        if (p?.profile) {
          const prof = p.profile;
          setSubjectMap({ [prof.class]: prof.subjectsInterested });
          setBoard(prof.board);
          setCity(prof.city);
          setPreferredMode(prof.preferredMode);
          setBudgetMin(String(prof.budgetRange?.min ?? ''));
          setBudgetMax(String(prof.budgetRange?.max ?? ''));
          setPreferredLanguage(prof.preferredLanguage);
          setLearningGoal(prof.learningGoal);
        }
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function toggleLanguage(lang: string) {
    setPreferredLanguage((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const selectedClass = Object.keys(subjectMap)[0] ?? '';
      await studentApi.upsertProfile({
        class: selectedClass,
        board,
        city,
        subjectsInterested: subjectMap[selectedClass] ?? [],
        preferredMode,
        budgetRange: { min: Number(budgetMin) || 0, max: Number(budgetMax) || 0 },
        preferredLanguage,
        learningGoal,
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

  if (loading) return <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>;

  return (
    <div className="max-w-2xl space-y-5">
      <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6" id="form-student-profile">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Class & subjects of interest</label>
          <SubjectPicker catalog={catalog} value={subjectMap} onChange={setSubjectMap} singleClass />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="prof-board" className="text-sm font-medium text-foreground">Board</label>
            <select id="prof-board" value={board} onChange={(e) => setBoard(e.target.value as Board)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="prof-mode" className="text-sm font-medium text-foreground">Preferred mode</label>
            <select id="prof-mode" value={preferredMode} onChange={(e) => setPreferredMode(e.target.value as typeof preferredMode)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {MODES.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="prof-city" className="text-sm font-medium text-foreground">City</label>
          <input id="prof-city" type="text" required value={city} onChange={(e) => setCity(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Budget range (₹/hr)</label>
          <div className="grid grid-cols-2 gap-3">
            <input id="prof-budget-min" type="number" min="0" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="Min"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="prof-budget-max" type="number" min="0" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="Max"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Preferred languages</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${preferredLanguage.includes(lang) ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary/50'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="prof-goal" className="text-sm font-medium text-foreground">Learning goal</label>
          <textarea id="prof-goal" rows={3} value={learningGoal} onChange={(e) => setLearningGoal(e.target.value)}
            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
        </div>
        {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
        {saved && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">✓ Profile saved!</p>}
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving} id="btn-save-profile">
          {saving && <IconLoader2 size={16} className="animate-spin mr-2" />}
          Save profile
        </Button>
      </form>
    </div>
  );
}
