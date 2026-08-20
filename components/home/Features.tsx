import { IconCertificate, IconClock, IconShieldCheck, IconUserCheck } from "@tabler/icons-react";

const features = [
    {
        icon: IconCertificate,
        title: "100+ Courses",
        subtitle: "For all learning goals",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
        icon: IconUserCheck,
        title: "Expert Tutors",
        subtitle: "Learn from industry pros",
        color: "text-blue-600 bg-blue-50 border-blue-200/60 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
        icon: IconClock,
        title: "Learn Anytime",
        subtitle: "100% self-paced access",
        color: "text-purple-600 bg-purple-50 border-purple-200/60 group-hover:bg-purple-600 group-hover:text-white",
    },
    {
        icon: IconShieldCheck,
        title: "100% Trusted",
        subtitle: "Safe & secure platform",
        color: "text-amber-600 bg-amber-50 border-amber-200/60 group-hover:bg-amber-600 group-hover:text-white",
    },
];

export default function Features() {
    return (
        <section className="border-y border-slate-200/80 bg-slate-50/50 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className="group relative flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {/* Icon Container with Smooth Hover Fill */}
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${f.color} transition-all duration-300 shadow-xs`}
                                >
                                    <Icon size={24} strokeWidth={2} />
                                </div>

                                {/* Text Block */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {f.title}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {f.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}