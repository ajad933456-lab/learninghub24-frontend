'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconCoinRupee, IconLoader2, IconArrowUp, IconArrowDown, IconEye } from '@tabler/icons-react';
import { teacherApi, paymentApi } from '@/lib/api';
import type { Payment, EnquiryTransaction, Plan } from '@/lib/types';
import { PaymentDetailsModal } from '@/components/ui/payment-details-modal';
import { gstAmount, formatINR } from '@/lib/utils';

export default function TeacherCreditsPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transactions, setTransactions] = useState<EnquiryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ledger' | 'payments'>('ledger');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    Promise.all([
      teacherApi.getCredits(),
      paymentApi.myPayments(),
      paymentApi.creditHistory(),
    ]).then(([credRes, payRes, txRes]) => {
      setCredits((credRes.data.balance as number));
      setPayments((payRes.data as { payments: Payment[] }).payments ?? []);
      setTransactions((txRes.data as { transactions: EnquiryTransaction[] }).transactions ?? []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Enquiries & Payment History</h2>

      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <IconCoinRupee size={24} />
          <span className="text-sm font-medium opacity-90">Current Balance</span>
        </div>
        {loading ? (
          <IconLoader2 size={28} className="animate-spin" />
        ) : (
          <p className="text-5xl font-extrabold">{credits ?? 0}</p>
        )}
        <p className="text-sm opacity-75 mt-1">Enquiries</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
        {(['ledger', 'payments'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            id={`tab-${t}`}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {t === 'ledger' ? 'Credit Ledger' : 'Payment History'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : tab === 'ledger' ? (
        <div className="space-y-2.5">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No credit transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {tx.type === 'credit' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                  <p className={`text-sm font-extrabold ${tx.type === 'credit' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.credits}
                  </p>
                  <p className="text-xs text-muted-foreground">Balance: {tx.balanceAfter}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No payments yet.</p>
          ) : (
            payments.map((payment) => {
              const plan = payment.plan as Plan;
              const priceINR = Math.round(payment.amount / 100);
              return (
                <div key={payment._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {typeof plan === 'object' ? plan.name : payment.paymentType === 'custom' ? 'Custom' : 'Plan'} Payment
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {typeof plan === 'object' ? `${plan.credits} credits · ` : ''}
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-border gap-2 sm:gap-1">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{formatINR(payment.amount)}</p>
                      <p className="text-xs text-amber-600 font-medium">+{formatINR(gstAmount(payment.amount))} GST (18%)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${payment.status === 'paid' ? 'border-emerald-200 bg-emerald-100 text-emerald-700' :
                        payment.status === 'failed' ? 'border-rose-200 bg-rose-100 text-rose-700' :
                          'border-gray-200 bg-gray-100 text-gray-600'
                        }`}>{payment.status}</span>
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="View Details"
                      >
                        <IconEye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <PaymentDetailsModal
        payment={selectedPayment}
        open={!!selectedPayment}
        onOpenChange={(open) => !open && setSelectedPayment(null)}
      />
    </div>
  );
}
