import { IconBook, IconSearch, IconUserCheck, IconArrowRight, IconUsers } from "@tabler/icons-react";

const steps = [
    {
        num: "1",
        icon: IconSearch,
        title: "Search Course",
        desc: "Explore from 100+ courses",
    },
    {
        num: "2",
        icon: IconUsers,
        title: "Connect with Tutor",
        desc: "Choose the best tutor for you",
    },
    {
        num: "3",
        icon: IconBook,
        title: "Start Learning",
        desc: "Learn anytime, anywhere",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center justify-center gap-4 mb-12 md:mb-16">
                    <span className="h-px w-10 bg-slate-300" aria-hidden="true" />
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                        How It Works
                    </h2>
                    <span className="h-px w-10 bg-slate-300" aria-hidden="true" />
                </div>

                {/* Steps */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.title} className="flex md:flex-1 items-center md:items-start gap-x-4">

                                {/* Icon + number badge */}
                                <div className="relative shrink-0">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                                        <Icon size={26} className="text-emerald-700" stroke={2.4} />
                                    </div>
                                    <span className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white ring-2 ring-white">
                                        {step.num}
                                    </span>
                                </div>

                                {/* Text */}
                                <div className="text-left">
                                    <h3 className="text-base font-bold text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="mt-0.5 text-sm text-slate-500 leading-snug">
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Connector — desktop only, skip after last item */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:flex flex-1 items-center justify-center px-2 self-center mt-0 -translate-y-2">
                                        <span className="h-0 w-full border-t-2 border-dashed border-emerald-300" aria-hidden="true" />
                                        <IconArrowRight size={16} className="text-emerald-400 -ml-1 shrink-0" stroke={2} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}