"use client";

import React, { useEffect, useState } from "react";
import { courseApi, subjectApi } from "@/lib/api";
import { CourseCard } from "@/components/ui/CourseCard";
import { CatalogCard } from "@/components/ui/CatalogCard";
import type { Course, SubjectCatalogItem } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconLoader2 } from "@tabler/icons-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [catalogItems, setCatalogItems] = useState<SubjectCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, catalogRes] = await Promise.all([
          courseApi.list(),
          subjectApi.catalog(),
        ]);

        if (coursesRes.data && (coursesRes.data as any).courses) {
          setCourses((coursesRes.data as any).courses);
        } else if (coursesRes.data && (coursesRes.data as any).items) {
          setCourses((coursesRes.data as any).items);
        } else if (Array.isArray(coursesRes.data)) {
          setCourses(coursesRes.data as Course[]);
        }

        if (catalogRes.data && (catalogRes.data as any).classes) {
          setCatalogItems((catalogRes.data as any).classes);
        }
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  console.log("course", courses)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">
              Explore <span className="text-primary">All Courses</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Browse through our extensive collection of courses tailored for all
              your learning needs. Find the right tutor and start learning today.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <IconLoader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="space-y-16">
              {courses.length > 0 && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-[#0A2540]">
                      Published <span className="text-primary">Courses</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {courses.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                </section>
              )}

              {catalogItems.length > 0 && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-[#0A2540]">
                      Subject <span className="text-primary">Catalog</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {catalogItems.map((catalog) => (
                      <CatalogCard key={catalog._id} catalog={catalog} />
                    ))}
                  </div>
                </section>
              )}

              {!courses.length && !catalogItems.length && (
                <div className="text-center py-10 text-muted-foreground">
                  No courses found at the moment. Please check back later.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
