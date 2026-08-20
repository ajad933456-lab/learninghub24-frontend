'use client';

import { useState } from 'react';
import { IconLoader2, IconCheck, IconX, IconCreditCard } from '@tabler/icons-react';
import { gstAmount } from '@/lib/utils';

/** Dynamically loads the Razorpay checkout script and resolves when ready. */
function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.getElementById('razorpay-script');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

async function publicCreateOrder(payload: {
  amount: number;
  fullName: string;
  email: string;
  phone: string;
}) {
  const res = await fetch(`${BASE_URL}/api/public/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Failed to create order');
  return json;
}

async function publicVerifyPayment(payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const res = await fetch(`${BASE_URL}/api/public/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Verification failed');
  return json;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PublicPaymentModal({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  function resetForm() {
    setStep('form');
    setError('');
    setFullName('');
    setEmail('');
    setPhone('');
    setAmount('');
    setLoading(false);
  }

  function handleClose(open: boolean) {
    if (!open) resetForm();
    onOpenChange(open);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      await loadRazorpay();

      const data = await publicCreateOrder({
        amount: parsedAmount,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      const { order } = data.data ?? data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency ?? 'INR',
        name: 'LearningHub24',
        description: `Custom Payment - ₹${parsedAmount}`,
        order_id: order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await publicVerifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setStep('success');
          } catch {
            setError('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: fullName.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: false,
        },
        theme: { color: '#10b981' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      setLoading(false);
    }
  }

  return (
    <>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-600">
                <IconCreditCard size={18} className="text-white" />
              </div>
              <DialogTitle className="text-lg font-bold">Make a Payment</DialogTitle>
            </div>
            <DialogDescription>
              Fill in your details and the amount you&apos;d like to pay. Our admin will process your request and allocate your Enquiries shortly.
            </DialogDescription>
          </DialogHeader>

          {step === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <IconCheck size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Payment Successful!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your payment has been received. Our admin will process your request and allocate your enquiries shortly.
                </p>
              </div>
              <Button
                className="mt-2 w-full bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 text-white hover:opacity-90"
                onClick={() => handleClose(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
                  <IconX size={14} className="mt-0.5 shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="pub-full-name" className="text-sm font-medium text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="pub-full-name"
                    type="text"
                    required
                    placeholder="Anshul Singh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pub-phone" className="text-sm font-medium text-foreground">
                    Phone <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="pub-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pub-email" className="text-sm font-medium text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  id="pub-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pub-amount" className="text-sm font-medium text-foreground">
                  Amount (₹) <span className="text-destructive">*</span>
                </label>
                <input
                  id="pub-amount"
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {Number(amount) > 0 && (
                  <p className="text-xs text-amber-600 font-medium">
                    + ₹{Math.round(gstAmount(Number(amount) * 100) / 100)} GST (18%)
                    &nbsp;· Total ₹{Math.round(Number(amount) + gstAmount(Number(amount) * 100) / 100)}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 text-white hover:opacity-90 transition-opacity mt-2"
              >
                {loading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <IconCreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
