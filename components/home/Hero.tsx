import { IconArrowRight, IconBook, IconShieldCheck, IconStarFilled, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const stats = [
    { icon: <IconUser size={28} />, value: "50K+", label: "Happy Students" },
    { icon: <IconStarFilled size={28} className="text-yellow-400" />, value: "4.8", label: "Average Rating" },
    { icon: <IconBook size={28} />, value: "100+", label: "Courses" },
    { icon: <IconShieldCheck size={28} />, value: "100%", label: "Trusted" },
];

export default function trusHero() {
    return (
        <>
            <section className="relative overflow-hidden overflow-x-clip bg-white pt-4">
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(12deg); }
                        50% { transform: translateY(-15px) rotate(16deg); }
                    }
                    @keyframes float-delay {
                        0%, 100% { transform: translateY(0px) rotate(-12deg); }
                        50% { transform: translateY(-15px) rotate(-8deg); }
                    }
                    @keyframes float-circle {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    .animate-float { animation: float 6s ease-in-out infinite; }
                    .animate-float-delay { animation: float-delay 7s ease-in-out 3.5s infinite; }
                    .animate-float-circle { animation: float-circle 8s ease-in-out infinite; }
                `}</style>

                {/* Floating decorative elements */}
                <div className="pointer-events-none absolute top-4 left-[5%] w-[3rem] h-[3rem] lg:top-16 lg:left-[10%] lg:w-[6rem] lg:h-[6rem] bg-[#e6ffcc] rounded-xl lg:rounded-[1.5rem] animate-float opacity-80 z-0"></div>
                <div className="pointer-events-none absolute top-12 left-[75%] w-[2.5rem] h-[2.5rem] lg:top-10 lg:left-[26%] lg:w-[4.5rem] lg:h-[4.5rem] bg-[#f8b47f] rounded-lg lg:rounded-[1.2rem] animate-float-delay opacity-90 z-0"></div>
                <div className="pointer-events-none absolute top-32 right-[5%] lg:right-auto w-[2.5rem] h-[2.5rem] lg:top-2 lg:left-[44%] lg:w-[6.5rem] lg:h-[6.5rem] bg-[#f4cbe0] rounded-full animate-float-circle opacity-90 z-0"></div>
                <div className="pointer-events-none absolute top-[15%] right-[-50%] w-[300px] h-[300px] lg:top-[2%] lg:right-[-10%] lg:w-[800px] lg:h-[800px] bg-[#e1f5d6] rounded-full z-0"></div>

                <div className="flex min-h-[480px] flex-col lg:flex-row z-10 relative">
                    {/* Left text column */}
                    <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:max-w-[52%] lg:pl-[max(2rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-10">
                        <Badge className="mb-5 w-fit gap-1.5 bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full px-3 py-1 text-xs font-semibold">
                            <IconStarFilled size={12} className="text-yellow-500" />
                            India&apos;s Fast-Growing Learning Platform
                        </Badge>

                        <h1 className="mb-2 text-4xl font-black leading-[1.12] tracking-tight text-foreground sm:text-5xl">
                            Upgrade Your Skills.
                        </h1>
                        <h1 className="mb-2 text-4xl font-black leading-[1.12] tracking-tight text-primary sm:text-5xl">
                            Build Your
                        </h1>
                        <h1 className="mb-1 text-4xl font-black leading-[1.12] tracking-tight text-primary sm:text-5xl">
                            Dream Career.
                        </h1>
                        <div className="mb-5 mt-2 h-1 w-10 rounded-full bg-primary" />

                        <p className="mb-8 max-w-sm text-base text-foreground/70 leading-relaxed">
                            Join{" "}
                            <span className="font-bold text-primary">50,000+ students</span>{" "}
                            learning from top educators across India.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="bg-primary text-white hover:bg-primary/90 rounded-full gap-2 px-7 font-semibold"
                                >
                                    Start Learning Now
                                    <IconArrowRight size={18} />
                                </Button>
                            </Link>
                            <Link href="/courses" passHref>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-7 border-2 border-primary text-primary hover:bg-primary/5 font-semibold"
                                >
                                    Explore Courses
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right image column — fills edge-to-edge with stats card overlapping bottom */}
                    <div className="relative flex-1 items-center lg:max-w-[48%]">
                        <div className="h-[420px] w-full overflow-visible lg:h-full lg:rounded-none">
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                                <div className="h-[420px]  w-[420px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.45)_0%,rgba(16,185,129,0.3)_35%,rgba(59,130,246,0.15)_60%,transparent_80%)] blur-3xl" />
                            </div>

                            <img
                                src="header.png"
                                alt="Students learning together"
                                className="h-full w-full object-cover z-20 relative drop-shadow-2xl rounded-3xl"
                            />
                        </div>

                        {/* Floating stats card — overlaps bottom of image */}
                        <div className="absolute z-30 -bottom-0 w-full px-4 lg:bottom-[2rem] lg:px-14">
                            <div className="flex items-stretch rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden lg:ml-">
                                {stats.map((s, i) => (
                                    <div
                                        key={s.label}
                                        className={`flex flex-1 flex-col items-center justify-center gap-0.5 px-3 py-4 text-center ${i < stats.length - 1 ? "border-r border-gray-100" : ""
                                            }`}
                                    >
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${i === 0 ? "bg-green-600" :
                                            i === 1 ? "bg-orange-400" :
                                                i === 2 ? "bg-purple-600" :
                                                    "bg-blue-600"
                                            } text-white mb-1`}>
                                            {s.icon}
                                        </div>
                                        <p className="text-sm font-black text-foreground leading-none">{s.value}</p>
                                        <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}