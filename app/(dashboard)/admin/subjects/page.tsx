'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconLoader2, IconPlus, IconTrash, IconX, IconPencil } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import type { SubjectCatalogResponse } from '@/lib/types';
import { catalogArrayToRecord } from '@/lib/types';

export default function AdminSubjectsPage() {
  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Add class form
  const [newClass, setNewClass] = useState('');
  const [newSubjects, setNewSubjects] = useState('');
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [editSubjects, setEditSubjects] = useState('');

  useEffect(() => {
    adminApi.subjects().then((res) => {
      const { classes } = res.data as SubjectCatalogResponse;
      setCatalog(catalogArrayToRecord(classes));
    }).finally(() => setLoading(false));
  }, []);

  async function handleAddClass() {
    if (!newClass.trim()) return;
    const subjects = newSubjects.split(',').map((s) => s.trim()).filter(Boolean);
    setSaving(true);
    try {
      await adminApi.updateSubjectClass(newClass.trim(), subjects);
      setCatalog((prev) => ({ ...prev, [newClass.trim()]: subjects }));
      setNewClass('');
      setNewSubjects('');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteClass(className: string) {
    if (!confirm(`Delete "${className}" and all its subjects?`)) return;
    await adminApi.deleteSubjectClass(className);
    setCatalog((prev) => {
      const next = { ...prev };
      delete next[className];
      return next;
    });
  }

  async function handleUpdateClass(className: string) {
    const subjects = editSubjects.split(',').map((s) => s.trim()).filter(Boolean);
    setSaving(true);
    try {
      await adminApi.updateSubjectClass(className, subjects);
      setCatalog((prev) => ({ ...prev, [className]: subjects }));
      setEditingClass(null);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(className: string) {
    setEditingClass(className);
    setEditSubjects(catalog[className].join(', '));
  }

  const classes = Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">Subject Catalog</h2>
      <p className="text-sm text-muted-foreground">
        Manage the platform-wide class → subjects map. Teachers and students use this for profile and query forms.
      </p>

      {/* Add new class */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Add / Update a Class</h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
          <input
            id="new-class-name"
            type="text"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Class name (e.g. Class 10)"
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            id="new-class-subjects"
            type="text"
            value={newSubjects}
            onChange={(e) => setNewSubjects(e.target.value)}
            placeholder="Subjects comma-separated (e.g. Math, Physics, Chemistry)"
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button
            onClick={handleAddClass}
            disabled={saving || !newClass.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            id="btn-add-class-catalog"
          >
            {saving ? <IconLoader2 size={14} className="animate-spin" /> : <IconPlus size={14} />}
            Add
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="space-y-2">
          {classes.map(([className, subjects]) => (
            <div key={className} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground text-sm">{className}</p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(className)} id={`btn-edit-class-${className.replace(/\s+/g, '-')}`}
                    className="text-muted-foreground hover:text-primary transition-colors">
                    <IconPencil size={14} />
                  </button>
                  <button onClick={() => handleDeleteClass(className)} id={`btn-del-class-${className.replace(/\s+/g, '-')}`}
                    className="text-muted-foreground hover:text-destructive transition-colors">
                    <IconTrash size={14} />
                  </button>
                </div>
              </div>

              {editingClass === className ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editSubjects}
                    onChange={(e) => setEditSubjects(e.target.value)}
                    id={`edit-subjects-${className.replace(/\s+/g, '-')}`}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdateClass(className)} disabled={saving}
                      className="bg-primary text-primary-foreground hover:bg-primary/90" id={`btn-save-class-${className.replace(/\s+/g, '-')}`}>
                      {saving && <IconLoader2 size={13} className="animate-spin mr-1" />}Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingClass(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((s) => (
                    <span key={s} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {classes.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-6">No classes in catalog yet. Add one above.</p>
          )}
        </div>
      )}
    </div>
  );
}
