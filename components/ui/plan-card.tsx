'use client';

import { IconCoinRupee, IconCheck, IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import type { Plan } from '@/lib/types';
import { gstAmount, formatINR } from '@/lib/utils';

interface PlanCardProps {
  plan: Plan;
  highlighted?: boolean;
  loading?: boolean;
  onSelect: (plan: Plan) => void;
}

const tierStyles: Record<string, { ring: string; badge: string; icon: string }> = {
  Silver: {
    ring: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-700',
    icon: '🥈',
  },
  Gold: {
    ring: 'border-yellow-400 shadow-yellow-100 shadow-lg',
    badge: 'bg-yellow-100 text-yellow-700',
    icon: '🥇',
  },
  Diamond: {
    ring: 'border-blue-400 shadow-blue-100 shadow-lg',
    badge: 'bg-blue-100 text-blue-700',
    icon: '💎',
  },
  Custom: {
    ring: 'border-purple-400',
    badge: 'bg-purple-100 text-purple-700',
    icon: '✨',
  },
};

export function PlanCard({ plan, highlighted, loading, onSelect }: PlanCardProps) {
  const style = tierStyles[plan.name] ?? tierStyles.Custom;
  const priceINR = Math.round(plan.price / 100);
  const gstInPaise = gstAmount(plan.price);
  const gstINR = Math.round(gstInPaise / 100);

  return (
    <div
      className={`relative rounded-2xl border-2 bg-card p-6 space-y-5 transition-all hover:scale-[1.02] ${style.ring} ${highlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold text-primary-foreground shadow">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{style.icon}</span>
            <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          </div>
          {plan.description && (
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          )}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>
          {plan.name}
        </span>
      </div>

      {/* Credits */}
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <IconCoinRupee size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-foreground">{plan.credits}</p>
          <p className="text-xs text-muted-foreground">Enquiries</p>
        </div>
      </div>

      {/* What you get */}
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <IconCheck size={14} className="text-primary shrink-0" />
          Unlock up to {plan.credits} student contacts
        </li>
        <li className="flex items-center gap-2">
          <IconCheck size={14} className="text-primary shrink-0" />
          Enquiries never expire
        </li>
        <li className="flex items-center gap-2">
          <IconCheck size={14} className="text-primary shrink-0" />
          Instant activation
        </li>
      </ul>

      {/* Price + CTA */}
      <div className="space-y-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-foreground">₹{priceINR}</span>
            <span className="text-sm text-muted-foreground">one-time</span>
          </div>
          <p className="mt-0.5 text-xs text-amber-600 font-medium">
            + ₹{gstINR} GST (18%) · Total ₹{priceINR + gstINR}
          </p>
        </div>
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => onSelect(plan)}
          disabled={loading}
          id={`btn-buy-plan-${plan._id}`}
        >
          {loading ? (
            <IconLoader2 size={16} className="animate-spin mr-2" />
          ) : null}
          Get {plan.name}
        </Button>
      </div>
    </div>
  );
}
