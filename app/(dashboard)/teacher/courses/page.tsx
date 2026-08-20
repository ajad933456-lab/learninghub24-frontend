'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconPlus, IconLoader2, IconPencil, IconTrash, IconEye, IconEyeOff } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { courseApi } from '@/lib/api';
import type { Course } from '@/lib/types';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState<'online' | 'offline' | 'both'>('online');
  const [cls, setCls] = useState('');
  const [language, setLanguage] = useState('English');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [board, setBoard] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    courseApi.getMyCourses().then((res) => {
      setCourses((res.data as { courses: Course[] }).courses ?? []);
    }).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await courseApi.create({ title, subject, description, price: Number(price), mode, class: cls, language, thumbnailUrl, board, isPublished });
      const res = await courseApi.getMyCourses();
      setCourses((res.data as { courses: Course[] }).courses ?? []);
      setShowForm(false);
      setTitle(''); setSubject(''); setDescription(''); setPrice('');
      setThumbnailUrl(''); setBoard(''); setIsPublished(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course?')) return;
    await courseApi.remove(id);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  }

  async function handleTogglePublish(id: string, currentStatus: boolean) {
    try {
      await courseApi.update(id, { isPublished: !currentStatus });
      setCourses((prev) => prev.map((c) => c._id === id ? { ...c, isPublished: !currentStatus } : c));
    } catch (err: unknown) {
      alert('Failed to update course status');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">My Courses</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" id="btn-add-course">
          <IconPlus size={16} /> New Course
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-5 space-y-4" id="form-new-course">
          <h3 className="font-semibold text-foreground">Add New Course</h3>
          <div className="grid grid-cols-2 gap-3">
            <input id="course-title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring col-span-2" />
            <input id="course-subject" type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="course-class" type="text" value={cls} onChange={(e) => setCls(e.target.value)} placeholder="Class / Level"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="course-price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (₹)"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <select id="course-mode" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="both">Both</option>
            </select>
            <input id="course-board" type="text" value={board} onChange={(e) => setBoard(e.target.value)} placeholder="Board (e.g. CBSE)"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="course-thumbnail" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="Thumbnail URL (Optional)"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <textarea id="course-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course description"
              className="col-span-2 flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
            <div className="flex items-center gap-2 col-span-2">
              <input id="course-published" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="course-published" className="text-sm font-medium text-foreground">Publish immediately</label>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90" id="btn-save-course">
              {saving && <IconLoader2 size={14} className="animate-spin mr-1" />}Save
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} id="btn-cancel-course">Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
          No courses yet. Create your first one!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((c) => (
            <div key={c._id} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground text-sm">{c.title}</h3>
                <div className="flex gap-1">
                  <button onClick={() => handleTogglePublish(c._id, !!c.isPublished)} id={`btn-toggle-publish-${c._id}`} title={c.isPublished ? "Unpublish course" : "Publish course"}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    {c.isPublished ? <IconEyeOff size={13} /> : <IconEye size={13} />}
                  </button>
                  <button onClick={() => handleDelete(c._id)} id={`btn-del-course-${c._id}`} title="Delete course"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <IconTrash size={13} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{c.subject}</Badge>
                {c.class && <Badge variant="outline">{c.class}</Badge>}
                <Badge variant="outline">{c.mode}</Badge>
                {c.isPublished ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">Published</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">₹{c.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
