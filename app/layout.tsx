import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import StickyWhatsapp from "@/components/StickyWhatsapp";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer2 from "@/components/Footer2";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearningHub24 – Upgrade Your Skills. Build Your Dream Career.",
  description:
    "Join 50,000+ students learning from top educators across India. Explore courses in School subjects, IT, Competitive Exams, and Spoken English.",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", outfit.variable, "scroll-smooth")}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          {children}
          <StickyWhatsapp />
          <Footer2 />
        </AuthProvider>
      </body>
    </html>
  );
}
