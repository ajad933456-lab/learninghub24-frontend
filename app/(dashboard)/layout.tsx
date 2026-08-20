'use client';

// All dashboard pages are authenticated client-side pages — never statically pre-render.
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { IconLoader2, IconMenu2 } from '@tabler/icons-react';
import type { UserRole } from '@/lib/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
    } else if (firebaseUser && !firebaseUser.emailVerified) {
      router.replace('/verify-email');
    } else if (!user.isActive) {
      router.replace('/suspended');
    } else if (user.profileStatus === 'pending_details') {
      router.replace(`/setup/${user.role}`);
    } else if (user.profileStatus === 'pending_approval') {
      router.replace('/pending-approval');
    }
  }, [user, firebaseUser, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <IconLoader2 size={36} className="animate-spin text-primary" />
      </div>
    );
  }

  // Generate page title from route path
  const pathSegments = pathname.split('/').filter(Boolean);
  let pageTitle = 'Dashboard';
  if (pathSegments.length > 1) {
    const lastSeg = pathSegments[pathSegments.length - 1];
    pageTitle = lastSeg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } else if (pathSegments.length === 1) {
    pageTitle = `${user.role.toUpperCase()} Overview`;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        role={user.role as UserRole}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <DashboardHeader
          title={pageTitle}
          onOpenMobileMenu={() => setMobileOpen(true)}
        /> */}

        <div className="flex items-center gap-3 p-4 lg:hidden">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            id="btn-mobile-menu-trigger"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted md:hidden transition-colors"
          >
            <IconMenu2 size={20} />
          </button>

          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
            {pageTitle || 'Dashboard'}
          </h1>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
