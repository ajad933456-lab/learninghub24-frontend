'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import Script from 'next/script';
import { IconCoinRupee, IconLoader2, IconCheck } from '@tabler/icons-react';
import { PlanCard } from '@/components/ui/plan-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { planApi, paymentApi, teacherApi } from '@/lib/api';
import type { Plan } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { gstAmount } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function TeacherPlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const [successCustom, setSuccessCustom] = useState(false);
  const [error, setError] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Payment State
  const [customAmount, setCustomAmount] = useState('');
  const [customBuying, setCustomBuying] = useState(false);

  useEffect(() => {
    Promise.all([planApi.list(), teacherApi.getCredits()]).then(([planRes, credRes]) => {
      const planData = planRes.data as { plans: Plan[] };
      setPlans((planData.plans ?? []).sort((a, b) => a.displayOrder - b.displayOrder));
      setCredits(credRes.data.balance as number);
      console.log("here", credRes, "this", credits)
    }).finally(() => setLoading(false));
  }, []);

  async function handleSelectPlan(plan: Plan) {
    setError('');
    setBuying(plan._id);
    try {
      const res = await paymentApi.createOrder({ paymentType: 'plan', planId: plan._id });
      const { order, payment } = res.data as {
        order: { id: string; amount: number; currency: string };
        payment: { _id: string };
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'LearningHub24',
        description: `${plan.name} Plan — ${plan.credits} Enquiries`,
        order_id: order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            // Refresh credits
            const credRes = await teacherApi.getCredits();
            setCredits((credRes.data.balance as number));
            setSuccessCustom(false);
            setSuccessPlan(plan.name);
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {},
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: false,
        },
        theme: { color: '#10b981' },
        modal: {
          ondismiss: () => setBuying(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setBuying(null);
    }
  }

  async function handleCustomPayment(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCustomBuying(true);
    try {
      const amount = Number(customAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      const res = await paymentApi.createOrder({
        paymentType: 'custom',
        customAmount: Number(amount),
        email: user?.email || '',
        number: user?.phone || '',
        fullName: user?.fullName || '',
      });

      const { order, payment } = res.data as {
        order: { id: string; amount: number; currency: string };
        payment: { _id: string };
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'LearningHub24',
        description: `Custom Payment - ₹${amount}`,
        order_id: order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setSuccessPlan(null);
            setSuccessCustom(true);
            setCustomAmount('');
            setShowCustomModal(false);
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || '',
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
          ondismiss: () => setCustomBuying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create custom order');
    } finally {
      setCustomBuying(false);
    }
  }

  return (
    <>
      {/* Load Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-foreground">Buy Enquiries</h2>
          {credits !== null && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 w-fit">
                <IconCoinRupee size={16} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Current balance: <span className="text-primary">{credits}</span> Enquiries
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowCustomModal(true)}>Custom Payment</Button>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Each credit unlocks one student&apos;s full contact information. Enquiries never expire.
        </p>

        {/* Success message */}
        {successPlan && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <IconCheck size={16} className="text-green-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Payment Successful!</p>
              <p className="text-sm text-green-700">
                {successPlan} plan Enquiries have been added to your account.
              </p>
            </div>
          </div>
        )}

        {successCustom && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <IconCheck size={16} className="text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">Payment Successful!</p>
              <p className="text-sm text-blue-700">
                Your payment has been received. Our admin will process your request and allocate your enquiries shortly.
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <IconLoader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  highlighted={plan.name === 'Gold'}
                  loading={buying === plan._id}
                  onSelect={handleSelectPlan}
                />
              ))}
            </div>

            <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Custom Payment</DialogTitle>
                  <DialogDescription>
                    Need a custom amount of enquiries? Make a payment below and our admin will allocate the credits for you.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCustomPayment} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="customAmount" className="text-sm font-medium text-foreground">
                      Amount (₹)
                    </label>
                    <input
                      id="customAmount"
                      type="number"
                      required
                      min="1"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="e.g. 500"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                    {Number(customAmount) > 0 && (
                      <p className="text-xs text-amber-600 font-medium">
                        + ₹{Math.round(gstAmount(Number(customAmount) * 100) / 100)} GST (18%)
                        &nbsp;· Total ₹{Math.round(Number(customAmount) + gstAmount(Number(customAmount) * 100) / 100)}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={customBuying || loading}
                    className="w-full mt-4"
                  >
                    {customBuying ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Pay Custom Amount'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
}
