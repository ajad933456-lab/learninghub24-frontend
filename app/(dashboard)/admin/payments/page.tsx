'use client'

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { IconLoader2, IconEye } from '@tabler/icons-react';
import { adminApi } from '@/lib/api';
import type { Payment, User, Plan } from '@/lib/types';
import { PaymentDetailsModal } from '@/components/ui/payment-details-modal';
import { gstAmount, formatINR } from '@/lib/utils';

const statusColor: Record<string, string> = {
  paid: 'border-green-200 bg-green-100 text-green-700',
  failed: 'border-red-200 bg-red-100 text-red-700',
  created: 'border-gray-200 bg-gray-100 text-gray-600',
  refunded: 'border-amber-200 bg-amber-100 text-amber-700',
};

const typeColor: Record<string, string> = {
  plan: 'border-blue-200 bg-blue-50 text-blue-700',
  custom: 'border-violet-200 bg-violet-50 text-violet-700',
  guest: 'border-teal-200 bg-teal-50 text-teal-700',
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    adminApi.payments().then((res) => {
      setPayments((res.data as { payments: Payment[] }).payments ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const total = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">All Payments</h2>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-sm w-fit">
          <span className="text-emerald-700 font-semibold">Total Revenue: ₹{Math.round(total / 100).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><IconLoader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto bg-card shadow-sm">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Payer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Enquies</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {payments.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-muted-foreground text-sm">No payments yet.</td></tr>
              ) : (
                payments.map((p) => {
                  const teacher = typeof p.teacher === 'object' ? p.teacher as User : null;
                  const plan = p.plan as Plan;
                  // For guest payments, fall back to customDetails for display
                  const displayName = teacher?.fullName ?? p.customDetails?.fullName ?? '—';
                  const displayEmail = teacher?.email ?? p.customDetails?.email ?? p.customDetails?.phone ?? '';
                  return (
                    <tr key={p._id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{displayEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        {p.paymentType && (
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${typeColor[p.paymentType] ?? ''}`}>
                            {p.paymentType}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">{typeof plan === 'object' ? plan.name : '—'}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{formatINR(p.amount)}</p>
                        <p className="text-xs text-amber-600 font-medium">+{formatINR(gstAmount(p.amount))} GST (18%)</p>
                      </td>
                      <td className="px-4 py-3 text-foreground">{p.creditsGranted}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium text-nowrap ${statusColor[p.status] ?? ''}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {p.paidAt
                          ? new Date(p.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="View Details"
                        >
                          <IconEye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
