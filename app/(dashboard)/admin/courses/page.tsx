'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconLoader2, IconTrash, IconPencil, IconX } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import type { Course, User } from '@/lib/types';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editPublished, setEditPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.courses().then((res) => {
      setCourses((res.data as { courses: Course[] }).courses ?? []);
    }).finally(() => setLoading(false));
  }, []);

  function startEdit(course: Course) {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditPrice(String(course.price));
    setEditSubject(course.subject);
    setEditPublished(course.isPublished);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCourse) return;
    setSaving(true);
    try {
      const payload = {
        title: editTitle,
        price: Number(editPrice),
        subject: editSubject,
        isPublished: editPublished,
      };
      await adminApi.updateCourse(editingCourse._id, payload);
      setCourses((prev) =>
        prev.map((c) => (c._id === editingCourse._id ? { ...c, ...payload } : c))
      );
      setEditingCourse(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course?')) return;
    setDeletingId(id);
    try {
      await adminApi.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">All Courses</h2>

      {/* Edit Form Modal/Card */}
      {editingCourse && (
        <form onSubmit={handleSaveEdit} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-base">Edit Course</h3>
            <button
              type="button"
              onClick={() => setEditingCourse(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <IconX size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject</label>
              <input
                type="text"
                required
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (₹)</label>
              <input
                type="number"
                required
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="edit-published"
                checked={editPublished}
                onChange={(e) => setEditPublished(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="edit-published" className="text-sm font-medium text-foreground cursor-pointer">
                Is Published
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingCourse(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving && <IconLoader2 size={14} className="animate-spin mr-1.5" />} Save Changes
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
          No courses yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto bg-card shadow-sm">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {courses.map((c) => {
                const teacher = c.teacher as User;
                return (
                  <tr key={c._id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground max-w-48 truncate">{c.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {typeof teacher === 'object' ? teacher.fullName : '—'}
                    </td>
                    <td className="px-4 py-3"><Badge variant="secondary">{c.subject}</Badge></td>
                    <td className="px-4 py-3 text-foreground">₹{c.price}</td>
                    <td className="px-4 py-3">
                      {c.isPublished ? (
                        <span className="rounded-full border border-green-200 bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Published</span>
                      ) : (
                        <span className="rounded-full border border-gray-200 bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-medium">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(c)}
                          id={`btn-edit-course-admin-${c._id}`}
                          className="h-8 w-8 p-0"
                        >
                          <IconPencil size={15} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(c._id)}
                          disabled={deletingId === c._id}
                          id={`btn-del-course-admin-${c._id}`}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingId === c._id ? <IconLoader2 size={13} className="animate-spin" /> : <IconTrash size={15} />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
