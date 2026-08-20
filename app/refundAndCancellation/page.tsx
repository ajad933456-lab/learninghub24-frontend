import Link from "next/link";

export default function RefundAndCancellationPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">
                REFUND &amp; CANCELLATION POLICY
            </h1>

            <p className="mb-8 leading-8">
                This Refund &amp; Cancellation Policy ("Policy") applies to
                www.learninghub24.com ("Website") and all services provided by
                LearningHub24.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    1. Nature of Services
                </h2>

                <p className="leading-8">
                    LearningHub24 is an online educational marketplace that
                    connects students with independent teachers and tutors.
                    LearningHub24 does not directly provide tuition services
                    unless expressly stated.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    2. Teacher Membership Fees
                </h2>

                <p className="leading-8">
                    LearningHub24 charges membership/subscription fees only from
                    teachers for access to platform services, student enquiries,
                    and other benefits available under the selected membership
                    plan.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    3. Refund Policy
                </h2>

                <p className="leading-8 mb-4">
                    Teacher membership/subscription fees are generally
                    non-refundable once the membership has been activated.
                </p>

                <p className="leading-8 mb-4">
                    However, a refund may be considered only in the following
                    cases:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                    <li>Duplicate payment made by mistake.</li>
                    <li>
                        Payment was successful but the membership could not be
                        activated due to a verified technical issue caused by
                        LearningHub24.
                    </li>
                    <li>
                        Any other case specifically approved by LearningHub24 at
                        its sole discretion.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    4. Replacement Policy
                </h2>

                <p className="leading-8 mb-4">
                    If a membership plan includes a replacement student benefit,
                    LearningHub24 will make reasonable efforts to provide a
                    replacement student in accordance with the terms of that
                    plan.
                </p>

                <p className="leading-8">
                    Providing a replacement, where applicable, shall be
                    considered the resolution of the issue and shall not
                    automatically entitle the teacher to a refund.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    5. No Guarantee
                </h2>

                <p className="leading-8 mb-4">
                    LearningHub24 does not guarantee:
                </p>

                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>A fixed number of student enquiries.</li>
                    <li>Tuition confirmations.</li>
                    <li>Student admissions.</li>
                    <li>Income or earnings.</li>
                    <li>Academic or business success.</li>
                </ul>

                <p className="leading-8">
                    Results may vary depending on the teacher's profile,
                    qualifications, responsiveness, availability, pricing,
                    subject demand, location, and market conditions.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    6. Cancellation
                </h2>

                <p className="leading-8">
                    Teachers may cancel future renewals (if applicable).
                    Cancellation does not entitle the teacher to a refund for
                    any activated membership or services already provided.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    7. Refund Processing
                </h2>

                <p className="leading-8">
                    If a refund is approved, it will be processed to the
                    original payment method within 7–10 business days, subject
                    to the timelines of the respective bank or payment gateway.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    8. Changes to this Policy
                </h2>

                <p className="leading-8">
                    LearningHub24 reserves the right to modify this Policy at
                    any time. Any changes become effective immediately upon
                    publication on the Website.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">
                    <Link href="/contact"> 9. Contact Us </Link>
                </h2>

                <p className="leading-8 mb-6">
                    If you have any questions regarding this Refund &amp;
                    Cancellation Policy, please contact us:
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
                        <strong>Phone:</strong> +91 9310499843
                    </p>
                    <p>
                        <strong>Office Hours:</strong> Monday to Saturday,
                        10:00 AM – 6:00 PM (Except Public Holidays)
                    </p>
                </div>
            </section>
        </div>
    );
}