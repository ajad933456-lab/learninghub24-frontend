import { notFound } from "next/navigation";
import { tutors } from "@/lib/tutors";
import Image from "next/image";
import Link from "next/link";
import {
    IconCheck,
    IconStarFilled,
    IconUsers,
    IconBriefcase,
    IconLanguage,
    IconBook,
    IconCalendarEvent,
    IconMessageCircle
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function TeacherProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const tutor = tutors.find((t) => t.slug === resolvedParams.slug);

    if (!tutor) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
            {/* Header/Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 text-white py-16 relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-40 w-40 md:h-48 md:w-48 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-white flex items-center justify-center">
                                <Image
                                    src={tutor.img}
                                    alt={tutor.name}
                                    width={192}
                                    height={192}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1.5 ring-4 ring-blue-900" title="Verified Tutor">
                                <IconCheck className="w-5 h-5 text-white stroke-[3]" />
                            </div>
                        </div>

                        {/* Title Info */}
                        <div className="flex-1 text-center md:text-left mt-4 md:mt-6">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-3 backdrop-blur-md px-3 py-1 text-xs">
                                {tutor.subject}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{tutor.name}</h1>
                            <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl">
                                {tutor.title}
                            </p>

                            {/* Stats inline */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <IconStarFilled className="w-5 h-5 text-amber-400" />
                                    <span className="font-bold">{tutor.rating}</span>
                                    <span className="text-white/80 text-sm">Rating</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <IconUsers className="w-5 h-5 text-emerald-300" />
                                    <span className="font-bold">{tutor.students}</span>
                                    <span className="text-white/80 text-sm">Students Taught</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <IconBriefcase className="w-5 h-5 text-blue-300" />
                                    <span className="font-bold">{tutor.experience}</span>
                                    <span className="text-white/80 text-sm">Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column (Details) */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Quote Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/50 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-3xl"></div>
                            <h3 className="text-xl font-medium text-foreground/80 italic leading-relaxed pl-4">
                                &quot;{tutor.quote}&quot;
                            </h3>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/50">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <IconBook className="w-6 h-6 text-primary" />
                                About {tutor.name.split(" ")[0]}
                            </h2>
                            <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                                {tutor.description}
                            </p>

                            <div className="flex items-center gap-3 mt-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <IconLanguage className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Languages</p>
                                    <p className="font-semibold text-foreground">{tutor.language}</p>
                                </div>
                            </div>
                        </div>

                        {/* Specializations Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/50">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <IconCheck className="w-6 h-6 text-emerald-500" />
                                Specializations
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {tutor.specializations.map((spec, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100 transition-colors hover:bg-emerald-50/50 hover:border-emerald-100">
                                        <div className="mt-0.5 bg-emerald-100 rounded-full p-1 shrink-0">
                                            <IconCheck className="w-4 h-4 text-emerald-600 stroke-[3]" />
                                        </div>
                                        <span className="text-foreground/90 font-medium">{spec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sticky Booking Widget) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-lg border border-border/60">
                            <h3 className="text-xl font-bold mb-2">Book a Free Trial Class</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                Experience personalized learning with {tutor.name.split(" ")[0]}. Schedule your free introductory session today.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm">
                                    <IconCheck className="w-5 h-5 text-emerald-500" />
                                    <span>One-on-One Live Session</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <IconCheck className="w-5 h-5 text-emerald-500" />
                                    <span>Personalized Study Plan</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <IconCheck className="w-5 h-5 text-emerald-500" />
                                    <span>Doubt Clearing Session</span>
                                </div>
                            </div>

                            <Link href="/register" className="w-full">
                                <Button size="lg" className="w-full rounded-full bg-primary hover:bg-primary/90 text-white h-14 font-semibold text-lg gap-2 shadow-md hover:shadow-lg transition-all">
                                    <IconCalendarEvent className="w-5 h-5" />
                                    Book Free Trial
                                </Button>
                            </Link>

                            <Link href="/contact" className="w-full block mt-3">
                                <Button size="lg" variant="outline" className="w-full rounded-full h-14 font-semibold text-primary border-primary/20 hover:bg-primary/5 gap-2 transition-all">
                                    <IconMessageCircle className="w-5 h-5" />
                                    Ask a Question
                                </Button>
                            </Link>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-muted-foreground">
                                    No credit card required for the trial class.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
