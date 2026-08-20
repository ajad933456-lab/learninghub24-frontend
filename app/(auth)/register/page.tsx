'use client'

export const dynamic = 'force-dynamic';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  IconLoader2,
  IconUser,
  IconChalkboard,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';
import Image from 'next/image';

export default function RegisterPage() {
  const { signUpWithEmail } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (phone && phone.replace(/\D/g, '').length < 10) {
      setError('Phone number must contain at least 10 digits.');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, role, fullName, phone);
      router.replace('/auth-redirect');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center mb-3">
            <div className="">
              <Image src="/logo.jpeg" alt="logo" height="90" width="90" className="rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join LearningHub24 and start your journey
          </p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select role">
          {(['student', 'teacher'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              id={`role-${r}`}
              onClick={() => setRole(r)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all cursor-pointer ${role === r
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/40 text-muted-foreground'
                }`}
            >
              {r === 'student' ? (
                <IconUser size={24} />
              ) : (
                <IconChalkboard size={24} />
              )}
              <span className="text-sm font-semibold capitalize">{r}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="form-register">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-fullname" className="text-sm font-medium text-foreground">
                Full name
              </label>
              <input
                id="reg-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Sharma"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reg-phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                minLength={10}
                maxLength={13}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-sm font-medium text-foreground">
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
            id="btn-register-submit"
          >
            {loading && <IconLoader2 size={18} className="animate-spin mr-2" />}
            Create account as {role}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
