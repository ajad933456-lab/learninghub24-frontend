'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconLoader2, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SubjectPicker } from '@/components/ui/subject-picker';
import { subjectApi, queryApi } from '@/lib/api';
import type { SubjectCatalogResponse, Board, PreferredMode } from '@/lib/types';
import { catalogArrayToRecord } from '@/lib/types';

const BOARDS: (Board | '')[] = ['', 'CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];
const MODES: PreferredMode[] = ['online', 'offline', 'both'];

export default function NewQueryPage() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectMap, setSubjectMap] = useState<Record<string, string[]>>({});
  const [board, setBoard] = useState<Board | ''>('');
  const [city, setCity] = useState('');
  const [preferredMode, setPreferredMode] = useState<PreferredMode>('online');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    subjectApi.catalog().then((res) => {
      const { classes } = res.data as SubjectCatalogResponse;
      setCatalog(catalogArrayToRecord(classes));
    }).finally(() => setCatalogLoading(false));
  }, []);

  const selectedClass = Object.keys(subjectMap)[0] ?? '';
  const selectedSubjects = selectedClass ? (subjectMap[selectedClass] ?? []) : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClass) { setError('Please select your class.'); return; }
    if (selectedSubjects.length === 0) { setError('Please select at least one subject.'); return; }
    setError('');
    setSaving(true);
    try {
      await queryApi.create({
        title,
        subject: selectedSubjects[0], // primary subject
        class: selectedClass,
        description,
        board,
        city,
        preferredMode,
        budget: Number(budget) || 0,
      });
      router.replace('/student/queries');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to post query');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/student/queries">
          <Button variant="ghost" size="icon" id="btn-back-queries">
            <IconArrowLeft size={18} />
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-foreground">Post a New Query</h2>
      </div>

      {catalogLoading ? (
        <div className="flex justify-center py-16">
          <IconLoader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6" id="form-new-query">
          <div className="space-y-1.5">
            <label htmlFor="query-title" className="text-sm font-medium text-foreground">
              Query title <span className="text-muted-foreground font-normal">(max 200 chars)</span>
            </label>
            <input
              id="query-title"
              type="text"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Need a Math tutor for Class 10 CBSE"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Class & primary subject</label>
            <SubjectPicker catalog={catalog} value={subjectMap} onChange={setSubjectMap} singleClass />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="query-board" className="text-sm font-medium text-foreground">Board</label>
              <select
                id="query-board"
                value={board}
                onChange={(e) => setBoard(e.target.value as Board | '')}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              >
                {BOARDS.map((b) => <option key={b} value={b}>{b || 'Any board'}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="query-mode" className="text-sm font-medium text-foreground">Preferred mode</label>
              <select
                id="query-mode"
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value as PreferredMode)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              >
                {MODES.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="query-city" className="text-sm font-medium text-foreground">City</label>
              <input
                id="query-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Delhi"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="query-budget" className="text-sm font-medium text-foreground">Budget (₹/hr)</label>
              <input
                id="query-budget"
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="500"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="query-description" className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground font-normal">(optional, max 2000 chars)</span>
            </label>
            <textarea
              id="query-description"
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your needs in detail…"
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
            id="btn-submit-query"
          >
            {saving && <IconLoader2 size={16} className="animate-spin mr-2" />}
            Post Query
          </Button>
        </form>
      )}
    </div>
  );
}
