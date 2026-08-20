"use client"

import { IconChevronRight } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import LocationCard from "../ui/LocationCard";
import { useRouter } from "next/navigation";

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
            "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
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
        image:
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
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


export default function TopLocations() {

    const router = useRouter()

    return (
        <section className="py-16 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Section Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <Badge
                            variant="outline"
                            className="mb-2 bg-primary/10 text-primary border-primary/20 font-medium text-xs"
                        >
                            Find Near You
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Top <span className="text-primary">Locations</span> in India
                        </h2>
                    </div>
                    <a
                        href="/register"
                        className="group flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        <span>View All Cities</span>
                        <IconChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Locations Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {locations.map((loc, index) => (
                        <LocationCard key={index} location={loc} onSelect={() => { router.push('/register') }} />
                    ))}
                </div>
            </div>
        </section>
    );
}

