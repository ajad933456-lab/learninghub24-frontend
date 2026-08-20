"use client";

import type { ComponentType } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export type SubjectTone =
    | "blue"
    | "purple"
    | "orange"
    | "green"
    | "rose"
    | "amber"
    | "teal"
    | "indigo"
    | "cyan"
    | "red"
    | "slate"
    | "emerald";

export interface Subject {
    name: string;
    slug: string;
    description: string;
    tutors: string;
    tone: SubjectTone;
    image: string;
    popular?: boolean;
}

interface SubjectCardProps {
    subject: Subject;
    onSelect?: () => void;
}

const TONE_STYLES: Record<
    SubjectTone,
    { tile: string; icon: string; avatar: string }
> = {
    blue: { tile: "from-blue-50 to-blue-100/60", icon: "text-blue-600", avatar: "bg-blue-600" },
    purple: { tile: "from-purple-50 to-purple-100/60", icon: "text-purple-600", avatar: "bg-purple-600" },
    orange: { tile: "from-orange-50 to-orange-100/60", icon: "text-orange-500", avatar: "bg-orange-500" },
    green: { tile: "from-green-50 to-green-100/60", icon: "text-green-600", avatar: "bg-green-600" },
    rose: { tile: "from-rose-50 to-rose-100/60", icon: "text-rose-600", avatar: "bg-rose-600" },
    amber: { tile: "from-amber-50 to-amber-100/60", icon: "text-amber-600", avatar: "bg-amber-600" },
    teal: { tile: "from-teal-50 to-teal-100/60", icon: "text-teal-600", avatar: "bg-teal-600" },
    indigo: { tile: "from-indigo-50 to-indigo-100/60", icon: "text-indigo-600", avatar: "bg-indigo-600" },
    cyan: { tile: "from-cyan-50 to-cyan-100/60", icon: "text-cyan-600", avatar: "bg-cyan-600" },
    red: { tile: "from-red-50 to-red-100/60", icon: "text-red-600", avatar: "bg-red-600" },
    slate: { tile: "from-slate-50 to-slate-100/60", icon: "text-slate-600", avatar: "bg-slate-600" },
    emerald: { tile: "from-emerald-50 to-emerald-100/60", icon: "text-emerald-600", avatar: "bg-emerald-600" },
};

export default function SubjectCard({ subject, onSelect }: SubjectCardProps) {
    const styles = TONE_STYLES[subject.tone];
    const Icon = subject.image;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
            {/* Illustration tile */}
            <div
                className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${styles.tile}`}
            >
                <img src={subject.image} alt={subject.name} className="w-full h-full object-cover" />
                {subject.popular && (
                    <Badge className="absolute right-3 top-3 rounded-full bg-white/90 font-medium text-foreground shadow-sm hover:bg-white/90">
                        Popular
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2.5">
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${styles.avatar}`}
                    >
                        {subject.name.charAt(0)}
                    </span>
                    <h3 className="font-bold text-foreground">{subject.name}</h3>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {subject.description}
                </p>

                <p className="mt-3 text-xs font-medium text-muted-foreground">
                    <span className="font-bold text-foreground">{subject.tutors}</span> tutors available
                </p>

                {/* CTA row */}
                <div className="mt-4 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onSelect}
                        className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Find a Tutor
                    </button>
                    <button
                        type="button"
                        onClick={onSelect}
                        aria-label={`View details for ${subject.name}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                        <IconChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}