import {
    IconArrowRight,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandWhatsapp,
    IconBrandYoutube,
    IconProgressCheck,
} from "@tabler/icons-react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const highlights = [
    "Learn from the best",
    "Achieve your dreams",
    "Build a brighter future",
];

const socials = [
    { icon: IconBrandYoutube, href: "https://www.youtube.com/@learninghub24-e1w", label: "YouTube" },
    { icon: IconBrandInstagram, href: "#", label: "Instagram" },
    { icon: IconBrandFacebook, href: "#", label: "Facebook" },
    { icon: IconBrandLinkedin, href: "https://www.linkedin.com/in/learning-hub-6082543b8", label: "LinkedIn" },
];

export default function CtaBanner() {
    return (
        <section className="bg-white py-8 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 to-green-900 px-6 sm:px-10 lg:px-12 shadow-xl shadow-emerald-950/20">

                    {/* Ambient accent */}
                    <div className="pointer-events-none absolute -top-16 right-1/3 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-6 lg:divide-x lg:divide-white/10">

                        {/* Illustration */}
                        <div className="shrink-0 lg:pr-6">
                            <div className="flex items-center justify-center rounded-2xl">
                                {/* <IconSchool size={44} className="text-emerald-300" stroke={1.5} /> */}
                                <Image height={200} width={200} src="/book.png" alt="Learning Hub" />
                            </div>
                        </div>

                        {/* Headline + checklist */}
                        <div className="flex-1 text-center lg:text-left lg:px-6">
                            <h2 className="text-xl sm:text-2xl font-extrabold leading-snug text-white">
                                Start Your{" "}
                                <span className="text-amber-400">Learning</span>
                                <br className="hidden sm:inline" /> Journey Today!
                            </h2>
                            <ul className="mt-3 flex flex-col items-center lg:items-start gap-1.5 text-sm text-slate-300">
                                {highlights.map((item) => (
                                    <li key={item} className="flex items-center gap-2">
                                        <IconProgressCheck size={16} strokeWidth={3} className="text-yellow-400 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-start gap-3 shrink-0 lg:px-6">
                            <Link
                                href="/register"
                                className={cn(
                                    buttonVariants({ size: "lg" }),
                                    "group gap-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] p-8"
                                )}
                            >
                                Join Now
                                <IconArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a
                                href="https://api.whatsapp.com/send/?phone=918178312085&text&type=phone_number&app_absent=0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                            >
                                <span className="flex items-start justify-center rounded-full bg-white/10">
                                    <IconBrandWhatsapp size={50} className="text-emerald-400" />
                                </span>
                                <span className="text-left leading-tight">
                                    Chat with us<br />on WhatsApp
                                </span>
                            </a>
                        </div>

                        {/* Brand block */}
                        <div className="flex flex-col items-center lg:items-start gap-2 shrink-0 lg:pl-6">
                            <div className="flex items-center gap-2">
                                {/* <IconSchool size={22} className="text-amber-400" stroke={1.75} /> */}
                                <Image height={44} width={44} src="/logo.jpeg" alt="Learning Hub" className="rounded-full" />
                                <div>
                                    {/* <span className="text-base font-extrabold text-white leading-none">
                                        LEARNING<span className="text-emerald-400">HUB24</span>
                                    </span>
                                    <span className="text-[10px] font-semibold tracking-widest text-white">
                                        — BRIGHT FUTURE —
                                    </span> */}
                                    <p className="text-xs text-white text-center lg:text-left leading-relaxed lg:max-w-[200px]">
                                        Empowering students with quality education and expert guidance.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                {socials.map(({ icon: Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                    >
                                        <Icon size={14} />
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}