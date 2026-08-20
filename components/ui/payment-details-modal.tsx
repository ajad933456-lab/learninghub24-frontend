import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Payment, User, Plan } from '@/lib/types';
import { gstAmount, formatINR } from '@/lib/utils';

interface PaymentDetailsModalProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailsModal({ payment, open, onOpenChange }: PaymentDetailsModalProps) {
  if (!payment) return null;

  const teacher = payment.teacher as User | undefined;
  const plan = payment.plan as Plan | undefined;
  const isCustom = payment.paymentType === 'custom';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about this payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm mt-4">
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-b border-border pb-4">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-medium text-right text-foreground truncate" title={payment._id}>{payment._id}</span>

            <span className="text-muted-foreground">Type</span>
            <span className="font-medium text-right capitalize text-foreground">{payment.paymentType || 'plan'}</span>

            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-right capitalize text-foreground">{payment.status}</span>

            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium text-right text-foreground">{formatINR(payment.amount)} {payment.currency}</span>

            <span className="text-muted-foreground">GST (18%)</span>
            <span className="font-medium text-right text-amber-600">+{formatINR(gstAmount(payment.amount))}</span>

            <span className="text-muted-foreground">Total (incl. GST)</span>
            <span className="font-medium text-right text-foreground">{formatINR(payment.amount + gstAmount(payment.amount))}</span>

            <span className="text-muted-foreground">Created At</span>
            <span className="font-medium text-right text-foreground">
              {new Date(payment.createdAt).toLocaleString('en-IN')}
            </span>

            {payment.paidAt && (
              <>
                <span className="text-muted-foreground">Paid At</span>
                <span className="font-medium text-right text-foreground">
                  {new Date(payment.paidAt).toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-b border-border pb-4">
            <span className="text-muted-foreground">Razorpay Order ID</span>
            <span className="font-medium text-right truncate text-foreground" title={payment.razorpayOrderId}>{payment.razorpayOrderId || '—'}</span>

            <span className="text-muted-foreground">Razorpay Payment ID</span>
            <span className="font-medium text-right truncate text-foreground" title={payment.razorpayPaymentId}>{payment.razorpayPaymentId || '—'}</span>
          </div>

          {teacher && typeof teacher === 'object' && (
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-b border-border pb-4">
              <span className="font-semibold col-span-2 text-foreground mb-1">Teacher Details</span>
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium text-right text-foreground">{teacher.fullName}</span>
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-right truncate text-foreground" title={teacher.email}>{teacher.email}</span>
            </div>
          )}

          {isCustom && payment.customDetails && (
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 pb-4">
              <span className="font-semibold col-span-2 text-foreground mb-1">Custom Payment Details</span>
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium text-right text-foreground">{payment.customDetails.fullName}</span>
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-right truncate text-foreground" title={payment.customDetails.email}>{payment.customDetails.email}</span>
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium text-right text-foreground">{payment.customDetails.number}</span>
            </div>
          )}

          {!isCustom && plan && typeof plan === 'object' && (
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 pb-4">
              <span className="font-semibold col-span-2 text-foreground mb-1">Plan Details</span>
              <span className="text-muted-foreground">Plan Name</span>
              <span className="font-medium text-right text-foreground">{plan.name}</span>
              <span className="text-muted-foreground">Enquiries</span>
              <span className="font-medium text-right text-foreground">{plan.credits}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
