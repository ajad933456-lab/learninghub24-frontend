'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { IconLoader2, IconArrowLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { queryApi } from '@/lib/api';
import type { Query, Board, PreferredMode } from '@/lib/types';

const BOARDS: (Board | '')[] = ['', 'CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];
const MODES: PreferredMode[] = ['online', 'offline', 'both'];

export default function EditQueryPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [board, setBoard] = useState<Board | ''>('');
    const [preferredMode, setPreferredMode] = useState<PreferredMode>('online');
    const [budget, setBudget] = useState('');
    const [status, setStatus] = useState<'open' | 'closed'>('open');

    useEffect(() => {
        queryApi.getOne(id).then((res) => {
            const q = res.data as { query: Query };
            setTitle(q.query.title);
            setDescription(q.query.description);
            setCity(q.query.city);
            setBoard(q.query.board);
            setPreferredMode(q.query.preferredMode);
            setBudget(String(q.query.budget));
            setStatus(q.query.status === 'closed' ? 'closed' : 'open');
        }).catch(() => setError('Could not load query'))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await queryApi.update(id, { title, description, city, board, preferredMode, budget: Number(budget), status });
            router.replace('/student/queries');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>;

    return (
        <div className="max-w-2xl space-y-5">
            <div className="flex items-center gap-3">
                <Link href="/student/queries">
                    <Button variant="ghost" size="icon" id="btn-back"><IconArrowLeft size={18} /></Button>
                </Link>
                <h2 className="text-xl font-bold text-foreground">Edit Query</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6" id="form-edit-query">
                <div className="space-y-1.5">
                    <label htmlFor="edit-title" className="text-sm font-medium text-foreground">Title</label>
                    <input id="edit-title" type="text" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="edit-board" className="text-sm font-medium text-foreground">Board</label>
                        <select id="edit-board" value={board} onChange={(e) => setBoard(e.target.value as Board | '')}
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
                            {BOARDS.map((b) => <option key={b} value={b}>{b || 'Any board'}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="edit-mode" className="text-sm font-medium text-foreground">Mode</label>
                        <select id="edit-mode" value={preferredMode} onChange={(e) => setPreferredMode(e.target.value as PreferredMode)}
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
                            {MODES.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="edit-city" className="text-sm font-medium text-foreground">City</label>
                        <input id="edit-city" type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="edit-budget" className="text-sm font-medium text-foreground">Budget (₹/hr)</label>
                        <input id="edit-budget" type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="edit-status" className="text-sm font-medium text-foreground">Status</label>
                    <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value as 'open' | 'closed')}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="edit-description" className="text-sm font-medium text-foreground">Description</label>
                    <textarea id="edit-description" rows={4} maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)}
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none" />
                </div>

                {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving} id="btn-save-query">
                    {saving && <IconLoader2 size={16} className="animate-spin mr-2" />}
                    Save changes
                </Button>
            </form>
        </div>
    );
}
