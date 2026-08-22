"use client"

import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandWhatsapp,
    IconBrandYoutube,
    IconMail,
    IconMapPin,
    IconPhone
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { legalLinks } from "./Footer2";

const footerLinks = {
    "Quick Links": [
        { label: "Home", href: "/" },
        { label: "Courses", href: "/courses" },
        { label: "Find Tutors", href: "/#tutors" },
        { label: "Exams", href: "/courses" },
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/#" },
        { label: "Blog", href: "/#" },
    ],
    "Popular Courses": [
        { label: "School Courses (1–12th)", href: "/courses" },
        { label: "Engineering (JEE, NEET)", href: "/courses" },
        { label: "UPSC & SSC", href: "/courses" },
        { label: "Computer Courses", href: "/courses" },
        { label: "Spoken English", href: "/courses" },
        { label: "Competitive Exams", href: "/courses" },
        { label: "Maths & Science", href: "/courses" },
        { label: "View All Courses →", href: "/courses" },
    ],
    "Our Services": [
        { label: "Live Classes", href: "/courses" },
        { label: "Recorded Courses", href: "/courses" },
        { label: "Mock Tests", href: "/courses" },
        { label: "Study Materials", href: "/courses" },
        { label: "Doubt Support", href: "/courses" },
        { label: "Career Guidance", href: "/courses" },
        { label: "Exam Preparation", href: "/courses" },
        { label: "Personalized Learning", href: "/courses" },
    ],
    "Boards We Cover": [
        { label: "CBSE Board", href: "/courses" },
        { label: "ICSE Board", href: "/courses" },
        { label: "IGCSE Board", href: "/courses" },
        { label: "IB Board", href: "/courses" },
        { label: "STATE Board", href: "/courses" },
    ],
};

const socialLinks = [
    { icon: IconBrandYoutube, href: "https://www.youtube.com/@learninghub24-e1w", color: "hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30" },
    { icon: IconBrandInstagram, href: "#", color: "hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30" },
    { icon: IconBrandFacebook, href: "#", color: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30" },
    { icon: IconBrandLinkedin, href: "https://www.linkedin.com/in/learning-hub-6082543b8", color: "hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30" },
];


export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 text-slate-300 overflow-hidden border-t border-slate-800">
            {/* Main Footer Links Content */}
            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

                    {/* Brand Column */}
                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <div className="flex items-center justify-centershadow-sm">
                                <Image height={100} width={100} src="/logo.jpeg" alt="Logo" className="rounded-2xl" />
                            </div>
                        </Link>

                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                            Empowering students with quality education, interactive live classes, and expert tutor guidance for personalized learning across India.
                        </p>

                        {/* Social Links */}
                        <div className="pt-2">
                            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Connect With Us</p>
                            <div className="flex gap-2.5">
                                {socialLinks.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={i}
                                            href={item.href}
                                            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${item.color}`}
                                        >
                                            <Icon size={18} />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Link Columns */}
                    {Object.entries(footerLinks).map(([heading, links]) => (
                        <div key={heading} className="space-y-3">
                            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">{heading}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center text-sm text-white-400 hover:text-emerald-400 transition-colors"
                                        >
                                            <span className="transition-transform duration-200 group-hover:translate-x-1">
                                                {link.label}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Get In Touch Column */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Get In Touch</h4>
                        <ul className="space-y-3 text-xs text-slate-400">
                            <li className="flex gap-3 items-start">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <IconMail size={14} />
                                </div>
                                <span className="pt-1">support@learninghub24.com</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                    <IconPhone size={14} />
                                </div>
                                <span className="pt-1 leading-relaxed">+91 98765 43210<br />+91 98765 43211</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                                    <IconBrandWhatsapp size={14} />
                                </div>
                                <span className="pt-1">Mon–Sat (9 AM – 7 PM IST)</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                    <IconMapPin size={14} />
                                </div>
                                <span className="pt-1">Gandhi Nagar Delhi 110031</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative border-t border-slate-800/80 bg-slate-950 py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} LearningHub24. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {legalLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
}