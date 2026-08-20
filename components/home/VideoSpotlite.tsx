"use client";

import {
    IconChevronRight,
    IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

interface SpotlightVideo {
    title: string;
    tag: string;
    type: "video" | "image";
    /** YouTube video id — required when type is "video" */
    youtubeId?: string;
    /** Still image shown for placeholder "coming soon" cards */
    image?: string;
}

// Replace the two "image" entries with real youtubeId values as those
// recordings become available — the card UI is identical either way.
export const spotlightVideos: SpotlightVideo[] = [
    {
        type: "video",
        youtubeId: "DlBl-SEx5l4",
        title: "Inside a Live Home Tuition Class",
        tag: "Home Tuition",
    },
    {
        type: "video",
        youtubeId: "h96dd-a_J1s",
        title: "Interactive Classroom Learning",
        tag: "Classroom Session",
    },
    {
        type: "video",
        youtubeId: "VOQFz_1E2uc",
        title: "Concepts Explained Simply",
        tag: "Online Class",
    },
];

export default function VideoSpotlight() {
    return (
        <section className="overflow-visible bg-muted/30 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 overflow-visible">
                <Carousel
                    plugins={[Autoplay({ delay: 3500 })]}
                    opts={{ align: "start", loop: true }}
                    className="relative w-full overflow-visible"
                >
                    {/* Section Header with Carousel Controls */}
                    <div className="mb-8 flex flex-col justify-between gap-16 sm:flex-row sm:items-end">
                        <div>
                            <Badge
                                variant="outline"
                                className="mb-2 border-primary/20 bg-primary/10 text-xs font-medium text-primary"
                            >
                                Video Spotlight
                            </Badge>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                See <span className="text-primary">LearningHub24</span> in Action
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="group flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                            >
                                <span>View All</span>
                                <IconChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            {/* Carousel Navigation Buttons */}
                            <div className="flex items-center gap-2">
                                <CarouselPrevious className="static h-9 w-9 translate-y-0 rounded-xl" />
                                <CarouselNext className="static h-9 w-9 translate-y-0 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Carousel Content */}
                    <CarouselContent className="-ml-3 overflow-visible py-2 sm:-ml-6">
                        {spotlightVideos.map((item) => (
                            <CarouselItem
                                key={item.title}
                                className="basis-full overflow-visible pl-3 sm:basis-1/2 sm:pl-6 lg:basis-1/3"
                            >
                                <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-black transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl">
                                    {/* Media */}
                                    <div className="relative aspect-[9/16] w-full">
                                        {item.type === "video" ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${item.youtubeId}&controls=1`}
                                                title={item.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 h-full w-full border-0"
                                            />
                                        ) : (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                                                        <IconPlayerPlayFilled size={22} />
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {/* Top tag */}
                                        <Badge className="absolute left-3 top-3 rounded-full bg-black/60 font-medium text-white backdrop-blur-sm hover:bg-black/60">
                                            {item.tag}
                                        </Badge>

                                        {/* Bottom gradient + title */}
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-16">
                                            <h3 className="line-clamp-2 text-base font-bold text-white">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}