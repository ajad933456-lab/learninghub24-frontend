'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconLoader2, IconToggleLeft, IconToggleRight, IconSearch, IconEye } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import type { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchId, setSearchId] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (roleFilter) params.role = roleFilter;
    adminApi.users(params).then((res) => {
      setUsers((res.data as { users: User[] }).users ?? []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  async function handleSearchById(e: React.FormEvent) {
    e.preventDefault();
    const id = searchId.trim();
    if (!id) return fetchUsers();
    
    setLoading(true);
    try {
      const res = await adminApi.getUserById(id);
      const user = (res.data as { user: User }).user ?? (res.data as User);
      if (user) {
         setUsers([user]);
      } else {
         setUsers([]);
      }
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(userId: string) {
    setToggling(userId);
    try {
      await adminApi.toggleUserStatus(userId);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isActive: !u.isActive } : u));
    } finally {
      setToggling(null);
    }
  }

  const filtered = users.filter((u) =>
    search
      ? u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    pending_details: 'bg-gray-100 text-gray-600 border-gray-200',
    pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">All Users</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="users-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <form onSubmit={handleSearchById} className="relative flex-1 max-w-sm flex gap-2">
          <input
            id="users-search-id"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by User ID..."
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" disabled={!searchId.trim()} size="sm" className="h-9">Find</Button>
        </form>
        <select
          id="users-role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="flex h-9 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto bg-card shadow-sm">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{u.fullName || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize">{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[u.profileStatus] ?? ''}`}>
                      {u.profileStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(u._id)}
                      disabled={toggling === u._id || u.role === 'admin'}
                      id={`btn-toggle-${u._id}`}
                      className="flex items-center gap-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {toggling === u._id ? (
                        <IconLoader2 size={18} className="animate-spin text-muted-foreground" />
                      ) : u.isActive ? (
                        <IconToggleRight size={22} className="text-primary" />
                      ) : (
                        <IconToggleLeft size={22} className="text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u._id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      <IconEye size={15} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}
