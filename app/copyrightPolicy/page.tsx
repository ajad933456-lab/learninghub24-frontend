import Link from "next/link";

export default function CopyrightPolicy() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-4">
                COPYRIGHT POLICY
            </h1>

            <p className="text-gray-600 mb-8">
                Last Updated: July 28, 2026
            </p>

            <p className="mb-8 leading-8">
                This Copyright Policy ("Policy") applies to the
                www.learninghub24.com website ("Website" or "Service") and any
                of its related products and services (collectively, the
                "Services") and outlines how LearningHub24 ("Operator", "we",
                "us" or "our") addresses copyright infringement notifications
                and how you ("you" or "your") may submit a copyright
                infringement complaint.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Protection of Intellectual Property
                </h2>

                <p className="leading-8 mb-4">
                    At LearningHub24, we respect intellectual property rights
                    and are committed to protecting original content. We expect
                    all users, teachers, students, and visitors to respect the
                    intellectual property rights of others.
                </p>

                <p className="leading-8 mb-4">
                    Unless otherwise stated, all content available on this
                    Website—including text, graphics, logos, icons, images,
                    website design, course information, and other materials—is
                    the property of LearningHub24 or its respective content
                    owners and is protected by applicable copyright and
                    intellectual property laws.
                </p>

                <p className="leading-8 mb-4">
                    © 2026 LearningHub24. All Rights Reserved.
                </p>

                <p className="leading-8">
                    No content from this Website may be copied, reproduced,
                    distributed, modified, published, transmitted, or otherwise
                    used without prior written permission from the rightful
                    owner, except where permitted by applicable law.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    User-Submitted Content
                </h2>

                <p className="leading-8 mb-4">
                    Teachers, students, and other users who upload or submit
                    content to the Website are solely responsible for ensuring
                    that they own the necessary rights or have obtained the
                    required permissions to use such content.
                </p>

                <p className="leading-8">
                    LearningHub24 does not claim ownership of user-submitted
                    content but reserves the right to remove or restrict access
                    to any content that is alleged or found to infringe the
                    intellectual property rights of others.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    What to Consider Before Submitting a Copyright Complaint
                </h2>

                <p className="leading-8 mb-4">
                    If you are unsure whether the material you are reporting is
                    actually infringing, you may wish to consult a legal
                    professional before submitting a notification.
                </p>

                <p className="leading-8">
                    When submitting a copyright infringement notification, you
                    may be required to provide personal information necessary to
                    process and investigate your claim. If you are concerned
                    about your privacy, you may appoint an authorized
                    representative to act on your behalf.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Notifications of Infringement
                </h2>

                <p className="leading-8 mb-4">
                    If you are a copyright owner or an authorized representative
                    and believe that any material available through our Services
                    infringes your copyright, you may submit a written copyright
                    infringement notification.
                </p>

                <p className="leading-8 mb-4">
                    Your notification should include:
                </p>

                <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>
                        Identification of the copyrighted work claimed to have
                        been infringed.
                    </li>
                    <li>
                        Identification and location of the allegedly infringing
                        material on the Website.
                    </li>
                    <li>Your full name, email address, and phone number.</li>
                    <li>
                        A statement that you have a good-faith belief that the
                        disputed use is not authorized by the copyright owner,
                        its agent, or the law.
                    </li>
                    <li>
                        A statement that the information provided is accurate
                        and that you are authorized to act on behalf of the
                        copyright owner.
                    </li>
                    <li>Your physical or electronic signature.</li>
                </ul>

                <p className="leading-8 mb-4">
                    Upon receiving a valid complaint, LearningHub24 will review
                    the notification and may remove or restrict access to the
                    allegedly infringing material where appropriate. We may also
                    notify the affected user regarding the action taken.
                </p>

                <p className="leading-8">
                    LearningHub24 reserves the right to reject or take no action
                    on notifications that are incomplete, inaccurate, or
                    otherwise fail to comply with applicable laws.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Changes to This Policy
                </h2>

                <p className="leading-8">
                    We reserve the right to modify this Policy at any time. Any
                    changes will become effective immediately upon posting the
                    updated version on the Website. Continued use of the Website
                    after such changes constitutes your acceptance of the
                    revised Policy.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">
                    <Link href="/contact"> Contact Us </Link>
                </h2>

                <p className="leading-8 mb-6">
                    If you wish to report copyright infringement or have any
                    questions regarding this Policy, please contact us:
                </p>

                <div className="space-y-2 leading-8">
                    <p>
                        <strong>LearningHub24</strong>
                    </p>
                    <p>
                        <strong>Website:</strong> www.learninghub24.com
                    </p>
                    <p>
                        <strong>Email:</strong> info@learninghub24.com
                    </p>
                    <p>
                        <strong>Office Hours:</strong>
                        <br />
                        Monday to Saturday
                        <br />
                        10:00 AM to 6:00 PM (Except Public Holidays)
                    </p>
                </div>
            </section>
        </div>
    );
}