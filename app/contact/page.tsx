import { IconBrandWhatsapp, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Link from "next/link";

export default function ContactUs() {
  const whatsappNumber = "918178312085";
  const emailAddress = "Info@Learninghub24.com";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Have a question or need assistance? We're here to help. Reach out to us via WhatsApp or Email, and we'll get back to you as soon as possible.
        </p>
      </div>

      {/* Contact Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
        {/* WhatsApp Card */}
        <Link
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconBrandWhatsapp size={32} stroke={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-500 mb-6">
              Chat with our support team instantly. We're online and ready to help.
            </p>
            <div className="text-green-600 font-semibold text-lg flex items-center gap-2">
              +91 81783 12085
            </div>
          </div>
        </Link>

        {/* Email Card */}
        <Link
          href={`mailto:${emailAddress}`}
          className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconMail size={32} stroke={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-500 mb-6">
              Prefer writing? Drop us an email and we'll reply within 24 hours.
            </p>
            <div className="text-blue-600 font-semibold text-lg flex items-center gap-2">
              {emailAddress}
            </div>
          </div>
        </Link>
      </div>

      {/* Optional Secondary Contact Info */}
      <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center border-t border-gray-200 pt-12 w-full max-w-4xl">
        <div className="flex flex-col items-center">
          <IconPhone className="text-gray-400 mb-3" size={24} />
          <h4 className="font-medium text-gray-900">Phone Support</h4>
          <p className="text-gray-500 mt-1">Available Mon-Fri, 9am - 6pm</p>
        </div>
        <div className="flex flex-col items-center">
          <IconMapPin className="text-gray-400 mb-3" size={24} />
          <h4 className="font-medium text-gray-900">Office</h4>
          <p className="text-gray-500 mt-1">Visit us at our main headquarters</p>
        </div>
      </div>
    </div>
  );
}
