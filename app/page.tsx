import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import ExploreTopCourses from "@/components/home/ExploreTopCourses";
import TopTutors from "@/components/home/TopTutors";
import StatsBanner from "@/components/home/StatsBanner";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";
import TopLocations from "@/components/home/TopLocations";
import TuitionOverviewSection from "@/components/home/TuitionOverview";
import TopSubjects from "@/components/home/TopSubjects";
import VideoSpotlight from "@/components/home/VideoSpotlite";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* ── HERO ───────────────────────────────-──────────────────────────── */}
      <Hero />

      {/* Spacer to compensate for the overlapping stats card */}
      <div className="h-14 bg-white" />

      {/* ── FEATURES BAR ─────────────────────────-────────────────────────── */}
      <Features />

      {/* ── EXPLORE TOP COURSES ───────────────────────────────────────────── */}
      <div id="courses">
        <ExploreTopCourses />
      </div>

      {/* ── MEET OUR TOP TUTORS ───────────────────────────────────────────── */}
      <div id="tutors" className="overflow-visible">
        <TopTutors />
      </div>

      {/* ── TOP LOCATIONS ────────────────────────────────--───────────────── */}
      <TopLocations />

      {/* ── Tuition Overview Section ──────────────────────────────────────── */}
      <TuitionOverviewSection />

      {/* ── Top Subjects ──────────────────────────────────────────────────── */}
      <TopSubjects />

      {/* ── STATS BANNER ──────────────────────────────────────────────────── */}
      <StatsBanner />

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Video Spotlight ───────────────────────────────────────────────── */}
      <VideoSpotlight />

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <CtaBanner />
    </div>
  );
}
