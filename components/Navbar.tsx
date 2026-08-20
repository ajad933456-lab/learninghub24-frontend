'use client';

import { useEffect, useState } from 'react';
import { IconBell, IconMenu2, IconLayoutDashboard, IconLogout, IconLogin, IconUserPlus, IconCreditCard } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { notificationApi } from '@/lib/api';
import type { Notification } from '@/lib/types';
import { legalLinks } from './Footer2';
import PublicPaymentModal from './PublicPaymentModal';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Find Tutors', href: '/#tutors' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPayModal, setShowPayModal] = useState(false);

  // Fetch notifications on mount if user is logged in
  useEffect(() => {
    if (user) {
      notificationApi
        .list()
        .then((res) => {
          const data = res.data as { notifications: Notification[] };
          setNotifications(data.notifications ?? []);
        })
        .catch(() => { });
    }
  }, [user]);

  const initials = user?.fullName
    ? user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : '?';

  async function handleSignOut() {
    setShowUserMenu(false);
    await signOut();
    router.push('/');
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" id="nav-logo">
          <div className="flex h-14 w-14 items-center justify-center text-white overflow-hidden rounded-full">
            <Image src="/logo.jpeg" height={50} width={50} alt="Logo" />
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium transition-colors hover:text-primary text-foreground/70"
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary text-foreground/70 outline-none cursor-pointer flex items-center gap-1">
              More
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 border-black/20 border w-40 text-white">
              {legalLinks.map((link) => (
                <DropdownMenuItem key={link.text} className="text-white focus:text-white focus:bg-white/10 cursor-pointer" render={<Link href={link.href} />}>
                  {link.text}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            id="nav-pay-now"
            onClick={() => setShowPayModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <IconCreditCard size={15} />
            Pay Now
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            /* Authenticated: show Notification Bell + User Dropdown */
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="btn-notifications"
                  onClick={() => {
                    setShowNotifs((v) => !v);
                    setShowUserMenu(false);
                  }}
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
                            setNotifications((n) =>
                              n.map((notif) => ({ ...notif, isRead: true }))
                            );
                          }}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-border">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                          No notifications
                        </p>
                      ) : (
                        notifications.slice(0, 10).map((notif) => (
                          <div
                            key={notif._id}
                            className={`px-4 py-3 transition-colors ${notif.isRead ? '' : 'bg-primary/5'
                              }`}
                          >
                            <p className="text-sm font-medium text-foreground">{notif.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
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

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu((v) => !v);
                    setShowNotifs(false);
                  }}
                  id="nav-user-menu"
                  className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {user.fullName?.split(' ')[0] ?? 'Me'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-border bg-popover shadow-lg overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href={`/${user.role}`}
                        onClick={() => setShowUserMenu(false)}
                        id="nav-goto-dashboard"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-medium"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        id="nav-sign-out"
                        className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guest: show Sign In + Sign Up */
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex" id="nav-sign-in">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-5"
                  id="nav-sign-up"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              id="nav-mobile-toggle"
              aria-label="Toggle navigation menu"
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors touch-manipulation select-none focus:outline-none"
            >
              <IconMenu2 size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 border-black/20 border text-white">
              {/* Nav links */}
              <DropdownMenuGroup>
                {NAV_LINKS.map((link) => (
                  <DropdownMenuItem key={link.label} className="text-white focus:text-white focus:bg-white/10 cursor-pointer" render={<Link href={link.href} />}>
                    {link.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-white focus:text-white focus:bg-white/10 cursor-pointer">
                    More
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48 bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 border-black/20 border text-white">
                    {legalLinks.map((link) => (
                      <DropdownMenuItem key={link.text} className="text-white focus:text-white focus:bg-white/10 cursor-pointer" render={<Link href={link.href} />}>
                        {link.text}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  className="text-white focus:text-white focus:bg-white/10 cursor-pointer font-semibold"
                  onClick={() => setShowPayModal(true)}
                >
                  <IconCreditCard size={14} className="mr-2" />
                  Pay Now
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Auth actions */}
              {user ? (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-white/70">{user.fullName}</DropdownMenuLabel>
                  <DropdownMenuItem className="text-white focus:text-white focus:bg-white/10 cursor-pointer" render={<Link href={`/${user.role}`} />}>
                    <IconLayoutDashboard size={14} className="mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300 focus:bg-white/10 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <IconLogout size={14} className="mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-white focus:text-white focus:bg-white/10 cursor-pointer" render={<Link href="/login" />}>
                    <IconLogin size={14} className="mr-2" />
                    Sign in
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white focus:text-white focus:bg-white/10 cursor-pointer" render={<Link href="/register" />}>
                    <IconUserPlus size={14} className="mr-2" />
                    Sign up
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


      <PublicPaymentModal open={showPayModal} onOpenChange={setShowPayModal} />
    </header>
  );
}