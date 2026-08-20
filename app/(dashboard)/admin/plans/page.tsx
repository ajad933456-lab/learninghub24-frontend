'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconLoader2, IconPlus, IconPencil, IconTrash, IconX, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import type { Plan } from '@/lib/types';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [price, setPrice] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');

  useEffect(() => {
    adminApi.plans().then((res) => {
      setPlans((res.data as { plans: Plan[] }).plans ?? []);
    }).finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditId(null);
    setName(''); setDescription(''); setCredits(''); setPrice(''); setDisplayOrder('0');
    setShowForm(true);
  }

  function openEdit(plan: Plan) {
    setEditId(plan._id);
    setName(plan.name); setDescription(plan.description);
    setCredits(String(plan.credits)); setPrice(String(plan.price / 100));
    setDisplayOrder(String(plan.displayOrder));
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, description, credits: Number(credits), price: Number(price) * 100, displayOrder: Number(displayOrder) };
      if (editId) {
        await adminApi.updatePlan(editId, payload);
      } else {
        await adminApi.createPlan(payload);
      }
      const res = await adminApi.plans();
      setPlans((res.data as { plans: Plan[] }).plans ?? []);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this plan?')) return;
    await adminApi.deletePlan(id);
    setPlans((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Manage Plans</h2>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" id="btn-create-plan">
          <IconPlus size={16} /> New Plan
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-5 space-y-4" id="form-plan">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editId ? 'Edit Plan' : 'Create Plan'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><IconX size={18} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input id="plan-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. Gold)"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="plan-order" type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} placeholder="Display order"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="plan-credits" type="number" min="1" required value={credits} onChange={(e) => setCredits(e.target.value)} placeholder="Credits"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="plan-price" type="number" min="1" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (₹)"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <input id="plan-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
              className="col-span-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" id="btn-save-plan">
              {saving && <IconLoader2 size={14} className="animate-spin" />}
              {editId ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto bg-card shadow-sm">
          <table className="w-full min-w-[500px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Enquiries</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {plans.map((p) => (
                <tr key={p._id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-foreground">{p.credits}</td>
                  <td className="px-4 py-3 text-foreground">₹{Math.round(p.price / 100)}</td>
                  <td className="px-4 py-3">
                    {p.isActive ? <IconCheck size={16} className="text-green-600" /> : <IconX size={16} className="text-muted-foreground" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} id={`btn-edit-plan-${p._id}`} className="text-muted-foreground hover:text-primary transition-colors"><IconPencil size={15} /></button>
                      <button onClick={() => handleDelete(p._id)} id={`btn-del-plan-${p._id}`} className="text-muted-foreground hover:text-destructive transition-colors"><IconTrash size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
