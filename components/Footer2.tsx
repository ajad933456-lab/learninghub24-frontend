"use client"

import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandYoutube,
    IconMail,
    IconMapPin,
    IconPhone,
    IconBrandWhatsapp,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Find Tutors", href: "/#tutors" },
    { label: "Exams", href: "/courses" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/#" },
    { label: "Blog", href: "/#" },
];

const popularCourses = [
    { label: "School Courses (1–12th)", href: "/courses" },
    { label: "Engineering (JEE, NEET)", href: "/courses" },
    { label: "UPSC & SSC", href: "/courses" },
    { label: "Computer Courses", href: "/courses" },
    { label: "Spoken English", href: "/courses" },
    { label: "Competitive Exams", href: "/courses" },
    { label: "Maths & Science", href: "/courses" },
    { label: "View All Courses →", href: "/courses" },
];

const services = [
    { label: "Live Classes", href: "/courses" },
    { label: "Recorded Courses", href: "/courses" },
    { label: "Mock Tests", href: "/courses" }
];

const boards = [
    { label: "CBSE Board", href: "/courses" },
    { label: "ICSE Board", href: "/courses" },
    { label: "IGCSE Board", href: "/courses" },
    { label: "IB Board", href: "/courses" },
    { label: "STATE Board", href: "/courses" },
];

const socialLinks = [
    { icon: IconBrandYoutube, href: "https://www.youtube.com/@learninghub24-e1w", label: "YouTube", color: "text-red-600 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30" },
    { icon: IconBrandLinkedin, href: "https://www.linkedin.com/in/learning-hub-6082543b8", label: "LinkedIn", color: "text-sky-700 hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30" },
    { icon: IconBrandInstagram, href: "#", label: "Instagram", color: "text-pink-600 hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30" },
    { icon: IconBrandFacebook, href: "#", label: "Facebook", color: "text-blue-600 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30" },
];

export const legalLinks = [
    { text: "Cookie Policy", href: "/cookiePolicy" },
    { text: "Copyright Policy", href: "/copyrightPolicy" },
    { text: "Refund and Cancellation", href: "/refundAndCancellation" },
    { text: "Disclaimer", href: "/disclaimer" },
    { text: "privacy Policy", href: "/privacyPolicy" },
    { text: "Terms & Conditions", href: "/termsAndConditions" },
];

export default function Footer2() {
    return (
        <footer className="relative bg-gradient-to-r from-blue-900 via-teal-800 to-emerald-600 text-white overflow-hidden">
            {/* Main Footer Content */}
            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Brand Column */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-5">
                        <Link href="/" className="inline-block rounded-2xl bg-white p-3 shadow-sm">
                            <Image
                                height={90}
                                width={140}
                                src="/logo.jpeg"
                                alt="LearningHub24"
                                className="rounded-xl object-contain"
                            />
                        </Link>

                        <p className="text-sm text-white/90 leading-relaxed max-w-xs">
                            Connecting Students With Qualified Tutors For Personalized Learning Experiences Across India.
                        </p>

                        <div>
                            <p className="text-lg font-bold text-white mb-3">Follow Us</p>
                            <div className="flex gap-3">
                                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-white ${color} transition-transform duration-300 hover:scale-110`}
                                    >
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[15px] text-white/90 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Courses */}
                    <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-white leading-tight">Popular<br />Courses</h4>
                        <ul className="space-y-3">
                            {popularCourses.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[15px] text-white/90 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Services + Boards We Cover */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-2xl font-bold text-white">Our Services</h4>
                            <ul className="space-y-3">
                                {services.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[15px] text-white/90 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-2xl font-bold text-white leading-tight">Boards We<br />Cover</h4>
                            <ul className="space-y-3">
                                {boards.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[15px] text-white/90 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Get In Touch */}
                    <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-white">Get In Touch</h4>
                        <ul className="space-y-4 text-[15px] text-white/90">
                            <li className="flex gap-3 items-start">
                                <IconMail size={18} className="text-orange-400 shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white">Email Us</p>
                                    <p>Info@Learninghub24.Com</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <IconPhone size={18} className="text-orange-400 shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white">Call Us (Support)</p>
                                    <p>(+91) 9310499843</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <IconBrandWhatsapp size={18} className="text-orange-400 shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white">WhatsApp</p>
                                    <p>+91 8178312085</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <IconMapPin size={18} className="text-orange-400 shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white">Address</p>
                                    <p>Gandhi Nagar<br />Delhi 110031</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative border m-4 rounded-2xl bg-card/10 border-white/20">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {legalLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-white/90 hover:text-white border-l pl-4 transition-colors"
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                        <p className="text-sm text-white/90">
                            © {new Date().getFullYear()} LearningHub24. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

        </footer>
    );
}