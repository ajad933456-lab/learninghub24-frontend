'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  IconBell,
  IconLogout,
  IconUser,
  IconChevronDown,
  IconMenu2,
} from '@tabler/icons-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { notificationApi } from '@/lib/api';
import type { Notification } from '@/lib/types';

interface DashboardHeaderProps {
  title?: string;
  onOpenMobileMenu?: () => void;
}

export function DashboardHeader({ title, onOpenMobileMenu }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);

  useEffect(() => {
    notificationApi.list().then((res) => {
      const data = res.data as { notifications: Notification[] };
      setNotifications(data.notifications ?? []);
    }).catch(() => { });
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => { setShowNotifs((v) => !v); setShowUser(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <IconBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-11 z-50 w-72 sm:w-80 rounded-xl border border-border bg-popover shadow-xl overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      await notificationApi.markAllRead();
                      setNotifications((n) => n.map((notif) => ({ ...notif, isRead: true })));
                    }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif._id}
                      className={`px-4 py-3 transition-colors ${notif.isRead ? '' : 'bg-primary/5'}`}
                    >
                      <p className="text-sm font-medium text-foreground">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-border px-4 py-2 bg-muted/20">
                <Link
                  href={`/${user?.role}/notifications`}
                  className="block text-center text-xs font-medium text-primary hover:underline py-1"
                  onClick={() => setShowNotifs(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            id="btn-user-menu"
            onClick={() => { setShowUser((v) => !v); setShowNotifs(false); }}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 hover:bg-muted transition-colors"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {user?.fullName?.split(' ')[0] ?? 'Me'}
            </span>
            <IconChevronDown size={14} className="text-muted-foreground hidden sm:block" />
          </button>

          {showUser && (
            <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-border bg-popover shadow-xl overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-sm font-semibold text-foreground truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href={`/${user?.role}/profile`}
                  onClick={() => setShowUser(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-medium"
                >
                  <IconUser size={15} />
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  id="btn-sign-out"
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium"
                >
                  <IconLogout size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
