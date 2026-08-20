

import React from "react";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Updated dataset with reliable Unsplash Stock URLs
export const locations = [
    {
        city: "Delhi",
        state: "Delhi NCR",
        tutors: "1,250+",
        students: "6.8K+",
        subjects: "45",
        popular: true,
        image:
            "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Mumbai",
        state: "Maharashtra",
        tutors: "880+",
        students: "4.2K+",
        subjects: "42",
        popular: true,
        image:
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Bengaluru",
        state: "Karnataka",
        tutors: "850+",
        students: "3.8K+",
        subjects: "38",
        popular: true,
        image:
            "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Hyderabad",
        state: "Telangana",
        tutors: "850+",
        students: "2.8K+",
        subjects: "32",
        popular: true,
        image:
            "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Pune",
        state: "Maharashtra",
        tutors: "650+",
        students: "2.8K+",
        subjects: "32",
        popular: false,
        image:
            "https://images.unsplash.com/photo-1625834801124-b153573e3176?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Kolkata",
        state: "West Bengal",
        tutors: "620+",
        students: "2.3K+",
        subjects: "28",
        popular: true,
        image:
            "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Ahmedabad",
        state: "Gujarat",
        tutors: "430+",
        students: "2.1K+",
        subjects: "28",
        popular: true,
        image:
            "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Jaipur",
        state: "Rajasthan",
        tutors: "450+",
        students: "1.8K+",
        subjects: "24",
        popular: true,
        image:
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Ghaziabad",
        state: "Uttar Pradesh",
        tutors: "420+",
        students: "1.8K+",
        subjects: "22",
        popular: false,
        image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Faridabad",
        state: "Haryana",
        tutors: "380+",
        students: "1.7K+",
        subjects: "21",
        popular: false,
        image: "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Noida",
        state: "Uttar Pradesh",
        tutors: "520+",
        students: "2.4K+",
        subjects: "30",
        popular: false,
        image:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    },
    {
        city: "Gurugram",
        state: "Haryana",
        tutors: "580+",
        students: "2.7K+",
        subjects: "34",
        popular: false,
        image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    },
];

type LocationItem = (typeof locations)[0];

interface LocationCardProps {
    location: LocationItem;
    onSelect?: (city: string) => void;
}

export default function LocationCard({ location, onSelect }: LocationCardProps) {
    const handleClick = () => {
        if (onSelect) {
            onSelect(location.city);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
        >
            {/* Top Banner Image Container */}
            <div className="relative h-40 w-full overflow-hidden bg-muted">
                <img
                    src={location.image}
                    alt={`Tutors in ${location.city}`}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                />

                {/* Subtle Bottom Vignette / Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* State Badge on Image */}
                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white/90 drop-shadow">
                    {location.state}
                </span>

                {/* Popular Tag */}
                {location.popular && (
                    <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-500/90 text-white hover:bg-amber-500 border-0 font-medium text-[10px] h-5 px-2 gap-1 backdrop-blur-sm shadow-sm">
                            <IconSparkles className="h-3 w-3" />
                            Popular
                        </Badge>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <CardContent className="flex flex-col flex-1 p-4 justify-between gap-4">
                <div>
                    {/* City Heading */}
                    <h3 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {location.city}
                    </h3>

                    {/* Clean Inline Stats Row */}
                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-foreground">{location.tutors}</span> Tutors
                        <span className="text-muted-foreground/40">•</span>
                        <span className="font-medium text-foreground">{location.students}</span> Students
                        <span className="text-muted-foreground/40">•</span>
                        <span className="font-medium text-foreground">{location.subjects}</span> Subjects
                    </p>
                </div>

                {/* Footer Action Link */}
                <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
                    <span>Find Tutors</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5">
                        <IconArrowRight className="h-3.5 w-3.5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}