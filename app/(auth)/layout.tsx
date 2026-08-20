import type { Metadata } from 'next';

// Auth pages are client-only — never statically pre-render (Firebase needs browser env).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LearningHub24 — Sign In',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
