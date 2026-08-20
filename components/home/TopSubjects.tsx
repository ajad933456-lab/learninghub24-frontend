"use client";

import {
    IconChevronRight,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import SubjectCard, { type Subject } from "@/components/ui/subjectCard";
import { useRouter } from "next/navigation";

// Top subjects offered on the platform
export const subjects: Subject[] = [
    {
        name: "Mathematics",
        slug: "mathematics",
        tone: "blue",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80",
        tutors: "1,200+",
        popular: true,
        description:
            "Build strong problem-solving skills with tutors who make numbers, algebra, and geometry easy to understand.",
    },
    {
        name: "Science",
        slug: "science",
        tone: "purple",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80",
        tutors: "980+",
        popular: true,
        description:
            "Get personalized home and online tutoring for science with tutors who explain concepts through real examples.",
    },
    {
        name: "Chemistry",
        slug: "chemistry",
        tone: "orange",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&q=80",
        tutors: "640+",
        description:
            "Get ready to teach and take online classes for chemistry with our qualified and experienced teachers.",
    },
    {
        name: "Biology",
        slug: "biology",
        tone: "green",
        image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=500&q=80",
        tutors: "560+",
        description:
            "Start a rewarding journey of teaching biology to eager learners on a platform built for both teaching and learning.",
    },
    {
        name: "English",
        slug: "english",
        tone: "rose",
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&q=80",
        tutors: "1,050+",
        popular: true,
        description:
            "We provide home tutoring opportunities for English — register as a tutor and start teaching students nearby.",
    },
    {
        name: "Hindi",
        slug: "hindi",
        tone: "amber",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
        tutors: "710+",
        description:
            "Help students build fluency and confidence in Hindi with focused, one-to-one home and online tuition.",
    },
    {
        name: "Accountancy",
        slug: "accountancy",
        tone: "teal",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80",
        tutors: "410+",
        description:
            "LearningHub24 offers home tutoring opportunities in accountancy — register and start guiding students nearby.",
    },
    {
        name: "Business Studies",
        slug: "business-studies",
        tone: "indigo",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
        tutors: "360+",
        description:
            "Looking for a business studies teacher? We have teaching opportunities available right in your area.",
    },
    {
        name: "Economics",
        slug: "economics",
        tone: "cyan",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&q=80",
        tutors: "390+",
        description:
            "LearningHub24 provides home tutoring jobs for economics. Become a registered tutor and start teaching today.",
    },
    {
        name: "History",
        slug: "history",
        tone: "red",
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80",
        tutors: "300+",
        description:
            "Prepare to teach and conduct online classes for history with our team of qualified instructors.",
    },
    {
        name: "Computer Science",
        slug: "computer-science",
        tone: "slate",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
        tutors: "540+",
        popular: true,
        description:
            "Explore teaching opportunities available for computer science educators, from fundamentals to coding.",
    },
    {
        name: "Geography",
        slug: "geography",
        tone: "emerald",
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&q=80",
        tutors: "270+",
        description:
            "Prepare to teach and conduct online classes for geography with our team of qualified instructors.",
    },
];

export default function TopSubjects() {
    const router = useRouter();

    return (
        <section className="bg-background py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Section Header */}
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <Badge
                            variant="outline"
                            className="mb-2 border-primary/20 bg-primary/10 text-xs font-medium text-primary"
                        >
                            Explore by Subject
                        </Badge>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Top <span className="text-primary">Subjects</span> to Learn
                        </h2>
                    </div>
                    <a
                        href="/subjects"
                        className="group flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                        <span>View All Subjects</span>
                        <IconChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.slug}
                            subject={subject}
                            onSelect={() => router.push(`/login`)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}