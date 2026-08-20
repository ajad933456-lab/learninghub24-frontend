import { IconShieldCheck, IconStarFilled, IconUsers, IconUserCheck } from "@tabler/icons-react";

const bannerStats = [
    {
        icon: IconUsers,
        value: "50K+",
        label: "Happy Students",
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20"
    },
    {
        icon: IconUserCheck,
        value: "100+",
        label: "Expert Tutors",
        color: "text-blue-400 bg-blue-400/10 border-blue-500/20"
    },
    {
        icon: IconStarFilled,
        value: "4.8/5",
        label: "Average Rating",
        color: "text-amber-400 bg-amber-400/10 border-amber-500/20"
    },
    {
        icon: IconShieldCheck,
        value: "100%",
        label: "Safe & Secure",
        color: "text-teal-400 bg-teal-400/10 border-teal-500/20"
    },
];

export default function StatsBanner() {
    return (
        <section className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Banner Container */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-900/10">

                    {/* Subtle Ambient Background Gradients */}
                    <div className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

                    {/* Grid Layout with Responsive Borders */}
                    <div className="relative grid grid-cols-2 gap-y-8 gap-x-4 lg:grid-cols-4 lg:gap-x-8">
                        {bannerStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className={`flex flex-col items-center sm:flex-row sm:items-start lg:items-center gap-4 text-center sm:text-left ${
                                        /* Subtle vertical border on desktop for separation */
                                        index !== 0 ? "lg:border-l lg:border-slate-800 lg:pl-8" : ""
                                        }`}
                                >
                                    {/* Icon Badge Container */}
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${stat.color} backdrop-blur-sm shadow-sm transition-transform duration-300 hover:scale-105`}>
                                        <Icon size={24} />
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-0.5">
                                        <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs font-medium text-slate-400 sm:text-sm">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}