'use client'

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconLoader2, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(msg.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Image src="/logo.jpeg" alt="Logo" height={60} width={60} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-500/20 p-2 text-green-600">
                  <IconCheck size={24} />
                </div>
              </div>
              <p className="text-sm text-green-600 font-medium">
                Reset link sent to {email}
              </p>
              <p className="text-xs text-muted-foreground">
                Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
            
            <Link href="/login" className="block w-full">
              <Button variant="outline" className="w-full">
                Return to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4" id="form-forgot-password">
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              id="btn-forgot-password"
            >
              {loading ? (
                <IconLoader2 size={18} className="animate-spin mr-2" />
              ) : null}
              Send reset link
            </Button>

            <div className="text-center mt-4">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <IconArrowLeft size={16} className="mr-1" />
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
