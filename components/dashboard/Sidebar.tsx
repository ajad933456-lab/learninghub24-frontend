'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconSearch,
  IconCreditCard,
  IconHistory,
  IconUser,
  IconBook,
  IconBell,
  IconUsers,
  IconClipboardList,
  IconSettings,
  IconLayoutDashboard,
  IconShield,
  IconChalkboard,
  IconPackage,
  IconSchool,
  IconCoinRupee,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  student: [
    { href: '/student', label: 'Dashboard', icon: <IconHome size={18} /> },
    { href: '/student/queries', label: 'My Queries', icon: <IconClipboardList size={18} /> },
    { href: '/student/profile', label: 'Profile', icon: <IconUser size={18} /> },
    { href: '/student/notifications', label: 'Notifications', icon: <IconBell size={18} /> },
  ],
  teacher: [
    { href: '/teacher', label: 'Dashboard', icon: <IconHome size={18} /> },
    { href: '/teacher/queries', label: 'Browse Queries', icon: <IconSearch size={18} /> },
    { href: '/teacher/queries/unlocked', label: 'Unlocked Queries', icon: <IconClipboardList size={18} /> },
    { href: '/teacher/plans', label: 'Buy Credits', icon: <IconCreditCard size={18} /> },
    { href: '/teacher/credits', label: 'Credit History', icon: <IconCoinRupee size={18} /> },
    { href: '/teacher/courses', label: 'My Courses', icon: <IconBook size={18} /> },
    { href: '/teacher/profile', label: 'Profile', icon: <IconUser size={18} /> },
    { href: '/teacher/notifications', label: 'Notifications', icon: <IconBell size={18} /> },
  ],
  admin: [
    { href: '/admin', label: 'Overview', icon: <IconLayoutDashboard size={18} /> },
    { href: '/admin/teachers', label: 'Pending Teachers', icon: <IconChalkboard size={18} /> },
    { href: '/admin/users', label: 'All Users', icon: <IconUsers size={18} /> },
    { href: '/admin/queries', label: 'Queries', icon: <IconClipboardList size={18} /> },
    { href: '/admin/plans', label: 'Plans', icon: <IconPackage size={18} /> },
    { href: '/admin/payments', label: 'Payments', icon: <IconCreditCard size={18} /> },
    { href: '/admin/subjects', label: 'Subject Catalog', icon: <IconSchool size={18} /> },
    { href: '/admin/courses', label: 'Courses', icon: <IconBook size={18} /> },
  ],
};

import { IconX } from '@tabler/icons-react';

interface SidebarProps {
  role: UserRole;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ role, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const items = navByRole[role] ?? [];

  const navContent = (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <IconSchool size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black tracking-tight text-foreground">
              LEARNING<span className="text-primary">HUB</span>24
            </p>
            <p className="text-[9px] font-medium tracking-widest text-muted-foreground uppercase">
              {role} portal
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <IconX size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {items.map((item) => {
          const isActive =
            item.href === `/${role}`
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onCloseMobile?.()}
              id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-semibold'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Role badge */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent px-3 py-2.5">
          <IconShield size={16} className="text-primary" />
          <span className="text-xs font-semibold text-muted-foreground capitalize">{role} Account</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative z-10 flex h-full max-w-xs w-full flex-col bg-sidebar shadow-2xl animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
