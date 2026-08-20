import type { ComponentType, ReactNode } from "react";
import {
    IconChalkboard,
    IconShieldCheck,
    IconTarget,
    IconClock,
    IconCheck,
    IconBooks,
    IconSchool,
    IconBuildingBank,
    IconUsers,
    IconStar,
    IconBrandWhatsapp,
    IconArrowRight,
    IconUserCheck,
    type IconProps,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Tone = "green" | "blue" | "purple";

type TablerIcon = ComponentType<IconProps>;

const DIFFERENTIATORS = [
    "Experienced & Qualified Tutors",
    "Personalized Tutor Matching",
    "Home & Online Tuition Options",
    "Flexible Learning Schedules",
    "Class 1 to Class 12 Support",
    "Multiple Subjects & Academic Boards",
    "One-to-One Learning Options",
    "Student-Centric Teaching Approach",
    "Convenient & Hassle-Free Process",
    "Dedicated Support for Parents & Students",
];

const SUBJECTS = [
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "Social Science",
    "Computer Science",
    "Coding",
    "Accountancy",
    "Economics",
    "Business Studies",
    "History",
    "Geography",
    "Commerce",
    "French",
    "Sanskrit",
];
const SUBJECTS_VISIBLE = 10;

const CLASS_STAGES = [
    "Primary School",
    "Middle School",
    "Secondary School",
    "Senior Secondary",
];

const BOARDS = ["CBSE", "ICSE", "State Boards", "International Curriculum"];

const STATS = [
    { icon: IconUsers, value: "50K+", label: "Happy Students" },
    { icon: IconStar, value: "4.8/5", label: "Average Rating" },
    { icon: IconUserCheck, value: "100+", label: "Expert Tutors" },
    { icon: IconShieldCheck, value: "100%", label: "Safe & Secure" },
];

/** Small filled colored pill used across the subjects/classes/boards modules */
interface PillProps {
    children: ReactNode;
    tone?: Tone;
}

function Pill({ children, tone = "green" }: PillProps) {
    const tones: Record<Tone, string> = {
        green: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
        blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
        purple: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
        >
            {children}
        </span>
    );
}

/** Icon + heading + item-count header used at the top of each module card */
interface ModuleHeaderProps {
    icon: TablerIcon;
    tone: Tone;
    title: string;
    count: string;
}

function ModuleHeader({ icon: Icon, tone, title, count }: ModuleHeaderProps) {
    const tones: Record<Tone, string> = {
        green: "bg-green-600",
        blue: "bg-blue-600",
        purple: "bg-purple-600",
    };
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${tones[tone]}`}
                >
                    <Icon className="h-4.5 w-4.5" size={18} stroke={2} />
                </span>
                <h4 className="font-bold text-foreground">{title}</h4>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{count}</span>
        </div>
    );
}

/** "LearningHub24" rendered with the site's two-tone wordmark treatment */
function Brand() {
    return (
        <>
            <span className="text-card">Learning</span>
            <span className="text-card">Hub24</span>
        </>
    );
}

export default function TuitionOverviewSection() {
    const hiddenSubjects = SUBJECTS.length - SUBJECTS_VISIBLE;

    return (
        <section className="bg-background py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                        <IconStar className="h-3.5 w-3.5 fill-amber-500 text-amber-500" size={14} />
                        India&rsquo;s Trusted Learning Platform
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        India&rsquo;s Trusted Home Tuition &amp;{" "}
                        <span className="relative inline-block text-primary">
                            Online Learning
                            <svg
                                viewBox="0 0 200 12"
                                className="absolute -bottom-1 left-0 h-2.5 w-full text-primary/50"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M2 9c40-8 156-8 196 0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>{" "}
                        Platform
                    </h2>
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                        <Brand /> is a modern education platform that connects students and parents with
                        qualified, experienced, and verified tutors across India. We make personalized
                        education simple, accessible, and convenient through carefully matched home tuition
                        and online learning solutions. From foundational learning to senior secondary
                        education, our goal is to help every student learn better, perform stronger, and
                        grow with confidence.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-green-50 shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex flex-col items-center gap-3 px-5 pt-8 pb-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                                <IconChalkboard size={24} stroke={1.75} />
                            </div>
                            <h3 className="font-bold text-foreground">Qualified &amp; Experienced Tutors</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Connect with knowledgeable educators who bring strong subject expertise,
                                effective teaching methodologies, and a student-focused approach to every class.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-blue-50 shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex flex-col items-center gap-3 px-5 pt-8 pb-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <IconShieldCheck size={24} stroke={1.75} />
                            </div>
                            <h3 className="font-bold text-foreground">Verified &amp; Trusted Profiles</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                We focus on reliable tutor profiles and relevant academic information to help
                                parents make informed decisions when choosing a tutor.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-purple-50 shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex flex-col items-center gap-3 px-5 pt-8 pb-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                                <IconTarget size={24} stroke={1.75} />
                            </div>
                            <h3 className="font-bold text-foreground">Personalized Learning</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Every student learns differently. Our tuition solutions are designed around
                                individual learning levels, academic requirements, goals, and areas that need
                                improvement.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-orange-50 shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex flex-col items-center gap-3 px-5 pt-8 pb-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                                <IconClock size={24} stroke={1.75} />
                            </div>
                            <h3 className="font-bold text-foreground">Flexible Learning Options</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Choose learning arrangements that fit your family&rsquo;s schedule, including
                                home tuition and online classes, with convenient timings.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Why choose + Complete learning solutions */}
                <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left column */}
                    <div>
                        <h3 className="text-2xl font-extrabold text-foreground">
                            Why Choose <Brand />?
                        </h3>
                        <p className="mt-2 text-sm font-semibold text-primary">
                            Personalized Education. Better Learning. Stronger Results.
                        </p>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            Finding the right tutor shouldn&rsquo;t be complicated. <Brand /> brings students,
                            parents, and educators together on one convenient platform, making it easier to
                            find tuition support based on class, subject, location, learning preference, and
                            academic requirements.
                        </p>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            We believe effective education is not just about completing a syllabus &mdash;
                            it&rsquo;s about understanding concepts, building confidence, and creating a strong
                            foundation for the future.
                        </p>

                        <h4 className="mt-8 text-lg font-bold text-foreground">
                            What Makes Us Different?
                        </h4>
                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                            {DIFFERENTIATORS.map((item) => (
                                <div key={item} className="flex items-start gap-2.5">
                                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                        <IconCheck size={12} stroke={3} />
                                    </span>
                                    <span className="text-sm text-foreground/90">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right column */}
                    <div>
                        <h3 className="text-2xl font-extrabold text-foreground">
                            Complete Learning Solutions Under One Platform
                        </h3>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            Whether your child needs help with school academics, exam preparation, concept
                            clarity, homework support, or regular subject-wise tuition, <Brand /> helps you
                            explore suitable learning options.
                        </p>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            Our platform supports personalized learning across different academic levels and
                            subjects, giving students access to the right guidance at the right stage of their
                            education.
                        </p>

                        <div className="mt-8 space-y-4">
                            {/* Subjects */}
                            <div className="rounded-xl border border-border/70 bg-muted/20 p-5">
                                <ModuleHeader
                                    icon={IconBooks}
                                    tone="green"
                                    title="Subjects We Cover"
                                    count={`${SUBJECTS.length}+ subjects`}
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {SUBJECTS.slice(0, SUBJECTS_VISIBLE).map((subject) => (
                                        <Pill key={subject} tone="green">
                                            {subject}
                                        </Pill>
                                    ))}
                                    {hiddenSubjects > 0 && (
                                        <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                                            +{hiddenSubjects} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Classes */}
                            <div className="rounded-xl border border-border/70 bg-muted/20 p-5">
                                <ModuleHeader
                                    icon={IconSchool}
                                    tone="blue"
                                    title="Classes We Cover"
                                    count="Class 1st – 12th"
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {CLASS_STAGES.map((stage) => (
                                        <Pill key={stage} tone="blue">
                                            {stage}
                                        </Pill>
                                    ))}
                                </div>
                            </div>

                            {/* Boards */}
                            <div className="rounded-xl border border-border/70 bg-muted/20 p-5">
                                <ModuleHeader
                                    icon={IconBuildingBank}
                                    tone="purple"
                                    title="Boards We Support"
                                    count={`${BOARDS.length} boards`}
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {BOARDS.map((board) => (
                                        <Pill key={board} tone="purple">
                                            {board}
                                        </Pill>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closing CTA */}
                <div className="mt-20 overflow-hidden rounded-2xl bg-gradient-to-br from-green-800 via-green-800 to-green-900">
                    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-12">
                        <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                            Learn Better. Grow Confidently. Achieve More.
                        </h3>
                        <p className="max-w-2xl leading-relaxed text-green-50/90">
                            At <Brand />, we&rsquo;re building a smarter and more accessible way for students
                            to find the academic support they need. The right guidance can make a difference
                            &mdash; let&rsquo;s find the right learning solution for your child.
                        </p>

                        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="rounded-full bg-amber-400 font-semibold text-green-950 hover:bg-amber-300"
                                >
                                    Find a Tutor
                                    <IconArrowRight size={18} />
                                </Button>
                            </Link>
                            <Link href="https://api.whatsapp.com/send/?phone=918178312085&text&type=phone_number&app_absent=0">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                >
                                    <IconBrandWhatsapp size={18} />
                                    Chat with us on WhatsApp
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}