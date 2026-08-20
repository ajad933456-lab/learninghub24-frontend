'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconBell, IconLoader2, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { notificationApi } from '@/lib/api';
import type { Notification } from '@/lib/types';

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationApi.list().then((res) => {
      setNotifications((res.data as { notifications: Notification[] }).notifications ?? []);
    }).finally(() => setLoading(false));
  }, []);

  async function markAll() {
    await notificationApi.markAllRead();
    setNotifications((n) => n.map((notif) => ({ ...notif, isRead: true })));
  }

  async function markOne(id: string) {
    await notificationApi.markRead(id);
    setNotifications((n) => n.map((notif) => notif._id === id ? { ...notif, isRead: true } : notif));
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <IconBell size={20} className="text-primary" />
          Notifications
          {unread > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </h2>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAll} id="btn-mark-all-read" className="gap-1.5">
            <IconCheck size={13} /> Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`rounded-xl border border-border bg-card p-4 space-y-1 transition-colors ${!notif.isRead ? 'bg-primary/5 border-primary/20' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                {!notif.isRead && (
                  <button onClick={() => markOne(notif._id)} id={`btn-read-${notif._id}`}
                    className="shrink-0 text-xs text-primary hover:underline">Mark read</button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{notif.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(notif.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
