import React from "react";
import Link from "next/link";
import {
    IconFileCheck,
    IconInfoCircle,
    IconSchool,
    IconUserCheck,
    IconUserPlus,
    IconCreditCard,
    IconAlertTriangle,
    IconShieldHeart,
    IconCopyright,
    IconScale,
    IconUserX,
    IconReceiptRefund,
    IconLock,
    IconRefresh,
    IconGavel,
    IconMail,
    IconPhone,
    IconClock,
    IconExternalLink,
} from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function TermsAndConditions() {
    const sections = [
        {
            id: "introduction",
            icon: IconInfoCircle,
            title: "1. Introduction",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Welcome to Learninghub24. By accessing or using our website and services, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our platform.
                </p>
            ),
        },
        {
            id: "nature-of-service",
            icon: IconSchool,
            title: "2. Nature of Service",
            content: (
                <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        Learninghub24 is an online platform that connects students with tutors. We provide a marketplace for educational services including tutor registration and student lead generation.
                    </p>
                    <div className="bg-muted/60 p-4 rounded-lg space-y-2 border border-border/50">
                        <p className="font-semibold text-foreground text-xs uppercase tracking-wide">
                            We do not guarantee:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Student confirmations</li>
                            <li>Demo classes</li>
                            <li>Tuition conversions</li>
                            <li>Job placements</li>
                        </ul>
                    </div>
                </div>
            ),
        },
        {
            id: "user-eligibility",
            icon: IconUserCheck,
            title: "3. User Eligibility",
            content: (
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Users must be at least 18 years old.</li>
                    <li>Users must provide accurate and complete information.</li>
                    <li>Learninghub24 reserves the right to suspend accounts with false or misleading details.</li>
                </ul>
            ),
        },
        {
            id: "registration-account",
            icon: IconUserPlus,
            title: "4. Registration & Account",
            content: (
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Tutors must register and may be required to pay a one-time registration fee.</li>
                    <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
                    <li>Any misuse of an account may result in suspension or termination.</li>
                </ul>
            ),
        },
        {
            id: "payments-fees",
            icon: IconCreditCard,
            title: "5. Payments & Fees",
            content: (
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded text-foreground font-medium">
                        All payments made on Learninghub24 are final and non-refundable, except as stated in our Refund Policy.
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Fees may vary depending on services (registration, premium listing, etc.).</li>
                        <li>Payments are processed through secure third-party gateways.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: "service-disclaimer",
            icon: IconAlertTriangle,
            title: "6. Service Disclaimer",
            content: (
                <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        Learninghub24 acts only as a facilitator between students and tutors.
                    </p>
                    <div className="bg-muted/60 p-4 rounded-lg space-y-2 border border-border/50">
                        <p className="font-semibold text-foreground text-xs uppercase tracking-wide">
                            We are not responsible for:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Quality of teaching</li>
                            <li>Student behavior</li>
                            <li>Payment disputes between tutor and student</li>
                            <li>Any offline agreements</li>
                        </ul>
                    </div>
                </div>
            ),
        },
        {
            id: "user-conduct",
            icon: IconShieldHeart,
            title: "7. User Conduct",
            content: (
                <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Users agree not to:</p>
                    <ul className="list-disc list-inside space-y-1 bg-destructive/5 p-4 rounded-lg border border-destructive/20 text-destructive-foreground">
                        <li>Post false, misleading, or inappropriate information</li>
                        <li>Engage in fraud or illegal activities</li>
                        <li>Harass or abuse other users</li>
                    </ul>
                    <p className="text-xs italic text-muted-foreground">
                        Violation may lead to account termination without notice.
                    </p>
                </div>
            ),
        },
        {
            id: "intellectual-property",
            icon: IconCopyright,
            title: "8. Intellectual Property",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    All content on Learninghub24 (logo, design, text, graphics) is the property of Learninghub24 and may not be copied or reused without permission.
                </p>
            ),
        },
        {
            id: "limitation-liability",
            icon: IconScale,
            title: "9. Limitation of Liability",
            content: (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Learninghub24 shall not be held liable for:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Loss of income or opportunity</li>
                        <li>Indirect or consequential damages</li>
                        <li>Service interruptions or technical issues</li>
                    </ul>
                </div>
            ),
        },
        {
            id: "termination",
            icon: IconUserX,
            title: "10. Termination of Services",
            content: (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>We reserve the right to:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Suspend or terminate any account</li>
                        <li>Modify or discontinue services</li>
                        <li>Restrict access without prior notice</li>
                    </ul>
                </div>
            ),
        },
        {
            id: "refund-policy",
            icon: IconReceiptRefund,
            title: "11. Refund Policy",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Refunds are governed by our Refund &amp; Cancellation Policy, available on the website. Users are advised to read it carefully before making any payment.
                </p>
            ),
        },
        {
            id: "privacy",
            icon: IconLock,
            title: "12. Privacy",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Use of our platform is also governed by our Privacy Policy, which explains how we collect and use your data.
                </p>
            ),
        },
        {
            id: "changes-to-terms",
            icon: IconRefresh,
            title: "13. Changes to Terms",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Learninghub24 may update these Terms at any time. Continued use of the platform means you accept the updated Terms.
                </p>
            ),
        },
        {
            id: "governing-law",
            icon: IconGavel,
            title: "14. Governing Law",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.
                </p>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Banner */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2">
                        <IconFileCheck className="h-8 w-8 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Legal Agreement
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        Terms &amp; Conditions
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline">Learninghub24</Badge>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-xs text-muted-foreground">
                            Last Updated: August 2026
                        </span>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Please read these terms and conditions carefully before using the Learninghub24 website and services.
                    </p>
                </div>

                <Separator />

                {/* Collapsible Accordion View */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Terms Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion className="w-full space-y-2">
                            {sections.map((section) => {
                                const IconComponent = section.icon;
                                return (
                                    <AccordionItem
                                        key={section.id}
                                        value={section.id}
                                        className="border border-border/60 rounded-lg px-4 py-1"
                                    >
                                        <AccordionTrigger className="hover:no-underline font-semibold text-left py-3">
                                            <div className="flex items-center gap-3">
                                                <IconComponent className="h-5 w-5 text-primary shrink-0" />
                                                <span>{section.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 pb-4">
                                            {section.content}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Contact Information Card */}
                <Card className="bg-primary/5 border-primary/20 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <IconMail className="h-6 w-6 text-primary" />
                            15. Contact Information
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            For any queries regarding these Terms, please reach out to us.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Emails */}
                            <div className="p-4 bg-background border border-border rounded-lg space-y-2">
                                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                    <IconMail className="h-4 w-4" />
                                    Email Us
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p>
                                        <a href="mailto:info@learninghub24.com" className="hover:underline text-foreground">
                                            info@learninghub24.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="p-4 bg-background border border-border rounded-lg space-y-2">
                                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                    <IconPhone className="h-4 w-4" />
                                    Call Us
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    <a href="tel:9310499843" className="hover:underline text-foreground font-medium">
                                        +91 9310499843
                                    </a>
                                </div>
                            </div>

                            {/* Support Hours */}
                            <div className="p-4 bg-background border border-border rounded-lg space-y-2">
                                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                    <IconClock className="h-4 w-4" />
                                    Support Hours
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    <p>Monday to Saturday</p>
                                    <p className="font-medium text-foreground">10:00 AM to 6:00 PM (IST)</p>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}