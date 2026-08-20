import { IconChevronRight, IconQuote, IconStarFilled, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const testimonials = [
    {
        rating: 5,
        text: "LearningHub24 helped me score 95% in my board exams. The tutors are amazing and always available to help!",
        name: "Ananya P.",
        role: "Class 12th Student",
        initials: "AP",
        avatar: "/students/student1.png",
    },
    {
        rating: 5,
        text: "Best platform for JEE preparation. Concept clarity like never before! I cracked JEE with a great rank.",
        name: "Rahul T.",
        role: "JEE Aspirant",
        initials: "RT",
        avatar: "/students/student2.png",
    },
    {
        rating: 5,
        text: "The English spoken courses are fantastic. Highly recommended for anyone wanting to improve their fluency.",
        name: "Sneha M.",
        role: "B.A. Student",
        initials: "SM",
        avatar: "/students/student3.png",
    },
];

export default function Testimonials() {
    return (
        <section className="py-16 md:py-20 bg-slate-50/70 dark:bg-slate-950/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                            Student Success Stories
                        </span>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            What <span className="text-emerald-600 dark:text-emerald-400">Students Say</span>
                        </h2>
                    </div>
                    <Link
                        href="/reviews"
                        className="group inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                        View All Reviews
                        <IconChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t) => (
                        <Card
                            key={t.name}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none"
                        >
                            <CardContent className="p-0 flex flex-col justify-between h-full space-y-6">

                                {/* Top Section: Big Quote Graphic + Star Rating */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Oversized Styled Quote Icon from Image */}
                                            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none select-none">
                                                “
                                            </span>
                                            {/* Green Star Rating */}
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: t.rating }).map((_, i) => (
                                                    <IconStarFilled
                                                        key={i}
                                                        size={18}
                                                        className="text-emerald-600 dark:text-emerald-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Verified Student Badge */}
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                                            <IconCheck size={12} strokeWidth={3} /> Verified
                                        </span>
                                    </div>

                                    {/* Body Text */}
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                        {t.text}
                                    </p>
                                </div>

                                {/* Bottom Section: Author Avatar + Name & Role */}
                                <div className="flex items-center gap-3.5 pt-2">
                                    <Avatar className="h-12 w-12 border-2 border-emerald-500/20 shadow-xs shrink-0">
                                        <AvatarImage src={t.avatar} alt={t.name} className="object-cover" />
                                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                                            {t.initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                            {t.name}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                            {t.role}
                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
}