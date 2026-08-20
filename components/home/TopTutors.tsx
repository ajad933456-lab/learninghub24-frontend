"use client";
import {
    IconArrowRight,
    IconChevronRight,
    IconStarFilled,
    IconCheck,
    IconUsers,
} from "@tabler/icons-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { tutors } from "@/lib/tutors";

export default function TopTutors() {
    return (
        <section className="py-16 bg-muted/30 overflow-visible">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 overflow-visible">
                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 3000,
                        }),
                    ]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full relative overflow-visible"
                >
                    {/* Section Header with Carousel Controls */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <Badge
                                variant="outline"
                                className="mb-2 bg-primary/10 text-primary border-primary/20 font-medium text-xs"
                            >
                                Expert Educators
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Meet Our <span className="text-primary">Top Tutors</span>
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/register"
                                className="group flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                <span>View All</span>
                                <IconChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            {/* Carousel Navigation Buttons */}
                            <div className="flex items-center gap-2">
                                <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-xl" />
                                <CarouselNext className="static translate-y-0 h-9 w-9 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Carousel Content */}
                    <CarouselContent className="-ml-3 sm:-ml-6 py-2 overflow-visible">
                        {tutors.map((tutor) => (
                            <CarouselItem
                                key={tutor.name}
                                className="pl-3 sm:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 overflow-visible"
                            >
                                <Card className="group relative flex flex-col justify-between w-full h-full overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl">
                                    {/* Ambient background glow */}
                                    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-primary/10 transition-all duration-500 group-hover:scale-125 pointer-events-none" />

                                    <CardContent className="flex flex-col items-center justify-between p-6 sm:p-8 text-center flex-1">
                                        {/* Prominent Avatar Section */}
                                        <div className="relative mt-2">
                                            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-primary/20 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-primary">
                                                <AvatarImage src={tutor.img} alt={tutor.name} className="object-cover" />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl sm:text-4xl">
                                                    {tutor.initials}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Verified Badge */}
                                            <div
                                                className="absolute bottom-1 right-1 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-4 ring-card"
                                                title="Verified Tutor"
                                            >
                                                <IconCheck className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                                            </div>
                                        </div>

                                        {/* Center Text & Stats Grouping */}
                                        <div className="flex flex-col items-center gap-2.5 my-auto w-full">
                                            {/* Rating Pill */}
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                                                <IconStarFilled className="h-4 w-4 text-amber-500" />
                                                <span>{tutor.rating}</span>
                                            </div>

                                            {/* Name & Domain */}
                                            <h3 className="font-bold text-xl sm:text-2xl text-card-foreground transition-colors group-hover:text-primary line-clamp-1 mt-1">
                                                {tutor.name}
                                            </h3>
                                            <p className="text-sm sm:text-base text-card font-medium line-clamp-1">
                                                {tutor.subject}
                                            </p>

                                            {/* Social Proof Stats */}
                                            <div className="mt-1 flex items-center justify-center gap-2 text-sm sm:text-base text-card">
                                                <IconUsers className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                                                <span>{tutor.students} Students</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    {/* Bold Button */}
                                    <CardFooter className="p-6 pt-0">
                                        <Link
                                            href={`/teacher/${tutor.slug}`}
                                            className="inline-flex items-center justify-center w-full h-12 sm:h-13 px-6 rounded-full border border-border bg-background hover:border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold text-sm sm:text-base gap-2 group/btn shadow-sm"
                                        >
                                            <span>View Profile</span>
                                            <IconArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}