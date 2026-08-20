import React from "react";
import Link from "next/link";
import {
    IconShieldCheck,
    IconDatabase,
    IconCpu,
    IconShare,
    IconCreditCard,
    IconCookie,
    IconLock,
    IconExternalLink,
    IconBabyCarriage,
    IconClock,
    IconUserCheck,
    IconLink,
    IconRefresh,
    IconMail,
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

export default function PrivacyPolicy() {
    const sections = [
        {
            id: "info-collection",
            icon: IconDatabase,
            title: "1. Information We Collect",
            content: (
                <div className="space-y-3">
                    <p>
                        We may collect the following information when you register, submit an enquiry, or use our services:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground list-disc list-inside bg-muted/50 p-4 rounded-lg">
                        <li>Full name</li>
                        <li>Mobile number</li>
                        <li>Email address</li>
                        <li>City and location details</li>
                        <li>Student / tutor information</li>
                        <li>Educational qualifications & experience</li>
                        <li>Subjects, classes, & tuition requirements</li>
                        <li>Registration / enquiry form details</li>
                        <li>Payment and transaction-related data</li>
                        <li>Device, browser, IP address & usage data</li>
                    </ul>
                    <p className="text-xs text-muted-foreground italic">
                        We only collect information that is reasonably necessary to provide and improve our services.
                    </p>
                </div>
            ),
        },
        {
            id: "how-we-use",
            icon: IconCpu,
            title: "2. How We Use Your Information",
            content: (
                <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                    <li>Connect students/parents with suitable tutors</li>
                    <li>Connect tutors with relevant student enquiries</li>
                    <li>Process registrations and payments</li>
                    <li>Verify tutor information where applicable</li>
                    <li>Communicate regarding enquiries, registrations, services, and updates</li>
                    <li>Improve our website, services, and user experience</li>
                    <li>Prevent fraud, misuse, and unauthorized activity</li>
                    <li>Comply with applicable legal and regulatory requirements</li>
                </ul>
            ),
        },
        {
            id: "sharing",
            icon: IconShare,
            title: "3. Sharing of Information",
            content: (
                <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        LEARNINGHUB24 may share relevant information with students, parents, tutors, service providers, payment processors, or other parties where necessary to provide the requested services.
                    </p>
                    <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded text-foreground font-medium">
                        We do not sell or rent users&apos; personal information to third parties for their independent marketing purposes.
                    </div>
                    <p>
                        Information may also be disclosed where required by law, legal proceedings, government authorities, or to protect the rights, safety, and security of LEARNINGHUB24 and its users.
                    </p>
                </div>
            ),
        },
        {
            id: "payment",
            icon: IconCreditCard,
            title: "4. Payment Information",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Payments may be processed through third-party payment gateways. LEARNINGHUB24 does not intend to store complete card, UPI, banking, or other sensitive payment credentials on its own servers. Payment information is handled according to the applicable policies and security practices of the relevant payment service provider.
                </p>
            ),
        },
        {
            id: "cookies",
            icon: IconCookie,
            title: "5. Cookies",
            content: (
                <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Our website may use cookies and similar technologies to:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Maintain website functionality</li>
                        <li>Understand website traffic and usage</li>
                        <li>Improve user experience & analyze performance</li>
                        <li>Support marketing and advertising activities where applicable</li>
                    </ul>
                    <p className="text-xs italic">
                        You may manage or disable cookies through your browser settings. Some website features may not function properly if cookies are disabled.
                    </p>
                </div>
            ),
        },
        {
            id: "security",
            icon: IconLock,
            title: "6. Data Security",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    We take reasonable administrative, technical, and organizational measures to protect personal information against unauthorized access, alteration, disclosure, loss, or misuse. However, no method of transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>
            ),
        },
        {
            id: "third-party",
            icon: IconExternalLink,
            title: "7. Third-Party Services",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Our website may use third-party services such as payment gateways, analytics providers, hosting providers, communication services, or advertising platforms. These third parties may process information according to their own privacy policies and applicable laws.
                </p>
            ),
        },
        {
            id: "childrens-privacy",
            icon: IconBabyCarriage,
            title: "8. Children's Privacy",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Our services may involve students who are minors. Where information relating to a child is provided, it should be submitted by or with the involvement of a parent or legal guardian where required by applicable law. We do not knowingly seek unnecessary personal information from children.
                </p>
            ),
        },
        {
            id: "retention",
            icon: IconClock,
            title: "9. Data Retention",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    We retain personal information only for as long as reasonably necessary for providing our services, maintaining business and transaction records, resolving disputes, preventing fraud, and complying with applicable legal obligations. When information is no longer required, we may delete or anonymize it.
                </p>
            ),
        },
        {
            id: "your-rights",
            icon: IconUserCheck,
            title: "10. Your Rights",
            content: (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Subject to applicable law, you may have the right to:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Request access to your personal information</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Request deletion of information where legally permissible</li>
                        <li>Withdraw consent where processing is based on consent</li>
                        <li>Raise a concern regarding the handling of your personal information</li>
                    </ul>
                </div>
            ),
        },
        {
            id: "external-links",
            icon: IconLink,
            title: "11. External Links",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Our website may contain links to third-party websites or services. LEARNINGHUB24 is not responsible for the privacy practices, content, or security of third-party websites. We recommend reviewing their respective privacy policies before providing personal information.
                </p>
            ),
        },
        {
            id: "policy-changes",
            icon: IconRefresh,
            title: "12. Changes to This Privacy Policy",
            content: (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    LEARNINGHUB24 may update this Privacy Policy from time to time to reflect changes in our services, technology, or applicable legal requirements. Any updated version will be published on this page with the revised &quot;Last Updated&quot; date.
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
                        <IconShieldCheck className="h-8 w-8 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Trust & Transparency
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline">LEARNINGHUB24</Badge>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-xs text-muted-foreground">
                            Last Updated: August 9, 2026
                        </span>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Welcome to LEARNINGHUB24. We respect your privacy and are committed to protecting the personal information you share with us.
                    </p>
                </div>

                <Separator />

                {/* Collapsible Accordion View */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Policy Overview</CardTitle>
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

                {/* Contact Us Card */}
                <Card className="bg-primary/5 border-primary/20 shadow-none">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <IconMail className="h-6 w-6" />
                            </div>
                            <div>
                                <Link href="/contact" className="hover:text-primary">
                                    <h3 className="font-bold text-lg">13. Contact Us</h3>
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                    Questions, concerns, or data privacy requests?
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact LEARNINGHUB24 through the contact details available on our website.
                        </p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}