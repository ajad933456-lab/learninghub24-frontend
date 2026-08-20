import Link from "next/link";

export default function AboutUsPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8 uppercase">
                about us
            </h1>

            <p className="mb-4 leading-8 font-medium">
                Welcome to Learninghub24
            </p>

            <p className="mb-8 leading-8">
                Learninghub24 is an innovative online platform designed to connect students with qualified tutors across various subjects and classes. Our mission is to make quality education accessible, affordable, and convenient for everyone.
            </p>

            <hr className="my-8 border-border/60" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    🎯 Our Mission
                </h2>

                <p className="leading-8">
                    Our goal is to bridge the gap between students and educators by providing a reliable and easy-to-use platform where learning meets opportunity. We aim to empower both students and tutors through seamless connections and modern technology.
                </p>
            </section>

            <hr className="my-8 border-border/60" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    👩‍🏫 What We Do
                </h2>

                <p className="leading-8 mb-4">
                    Learninghub24 acts as a facilitator platform that helps:
                </p>

                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Students find the right tutors based on their needs</li>
                    <li>Tutors connect with potential students and grow their teaching opportunities</li>
                    <li>Provide a smooth and structured system for educational connections</li>
                </ul>

                <p className="leading-8">
                    We do not provide direct teaching services but enable connections between independent tutors and students.
                </p>
            </section>

            <hr className="my-8 border-border/60" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    ⚙️ How It Works
                </h2>

                <ol className="list-decimal pl-6 space-y-2">
                    <li>Students submit their learning requirements</li>
                    <li>Tutors register on the platform</li>
                    <li>We connect tutors with relevant student leads</li>
                    <li>Both parties communicate and finalize learning arrangements</li>
                </ol>
            </section>

            <hr className="my-8 border-border/60" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    💡 Why Choose Learninghub24
                </h2>

                <ul className="space-y-2">
                    <li>✓ Easy tutor-student matching</li>
                    <li>✓ Affordable and flexible options</li>
                    <li>✓ Wide range of subjects and classes</li>
                    <li>✓ Simple and fast registration process</li>
                    <li>✓ Dedicated support team</li>
                </ul>
            </section>

            <hr className="my-8 border-border/60" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    ⚠️ Important Disclaimer
                </h2>

                <p className="leading-8 mb-4">
                    Learninghub24 is a platform that facilitates connections between tutors and students.
                </p>

                <p className="leading-8 mb-4">
                    We do not guarantee:
                </p>

                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Student confirmations</li>
                    <li>Demo classes</li>
                    <li>Tuition conversions</li>
                    <li>Continuous lead availability</li>
                </ul>

                <p className="leading-8">
                    All final agreements are made directly between tutors and students.
                </p>
            </section>

            <hr className="my-8 border-border/60" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    🤝 Our Commitment
                </h2>

                <p className="leading-8">
                    We are committed to providing a transparent, user-friendly, and reliable platform that helps both students and tutors achieve their educational goals.
                </p>
            </section>

            <hr className="my-8 border-border/60" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Link href="/contact"> 📞 Contact Us </Link>
                </h2>

                <div className="space-y-2 leading-8">
                    <p>
                        <strong>Email:</strong> info@learninghub24.com, support@learninghub24.com
                    </p>
                    <p>
                        <strong>Phone:</strong> (+91 9310499843)
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    ⏰ Support Hours
                </h2>

                <ul className="list-disc pl-6 space-y-2">
                    <li>Monday to Saturday</li>
                    <li>10:00 AM to 6:00 PM (IST)</li>
                </ul>
            </section>

            <hr className="my-8 border-border/60" />
        </div>
    );
}