import { IconBook, IconChevronRight, IconDeviceDesktop, IconSchool, IconTrendingUp } from "@tabler/icons-react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";


const courses = [
    {
        icon: <IconSchool size={36} className="text-primary" />,
        title: "School Courses",
        subtitle: "Class 10th – 12th",
        count: "120+ Courses",
        countColor: "bg-primary",
        bg: "bg-blue-50",
    },
    {
        icon: <IconDeviceDesktop size={36} className="text-blue-600" />,
        title: "IT & Computer Courses",
        subtitle: "Programming, IT, Software & more",
        count: "80+ Courses",
        countColor: "bg-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: <IconTrendingUp size={36} className="text-orange-500" />,
        title: "Competitive Exams",
        subtitle: "JEE, NEET, UPSC, SSC & more",
        count: "150+ Courses",
        countColor: "bg-orange-500",
        bg: "bg-orange-50",
        trending: true,
    },
    {
        icon: <IconBook size={36} className="text-orange-400" />,
        title: "Spoken English & Communication",
        subtitle: "Communication, Grammar, Fluency",
        count: "50+ Courses",
        countColor: "bg-orange-400",
        bg: "bg-orange-50",
    },
];

export default function ExploreTopCourses() {
    return (
        <>
            <section className="py-14 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-foreground">
                            Explore <span className="text-primary">Top Courses</span>
                        </h2>
                        <Link href="/courses" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            View All Courses <IconChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {courses.map((course) => (
                            <Card
                                key={course.title}
                                className={`relative overflow-hidden border-border transition-shadow hover:shadow-lg ${course.bg}`}
                            >
                                {course.trending && (
                                    <Badge className="absolute right-3 top-3 gap-1 bg-orange-500 text-white text-xs rounded-full">
                                        Trending
                                    </Badge>
                                )}
                                <CardContent className="flex flex-col gap-3 p-5">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                        {course.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground leading-snug">{course.title}</h3>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{course.subtitle}</p>

                                    </div>
                                    <Button
                                        size="sm"
                                        className={`mt-auto w-fit rounded-full text-white text-xs ${course.countColor} hover:opacity-90 border-0`}
                                    >
                                        {course.count}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}