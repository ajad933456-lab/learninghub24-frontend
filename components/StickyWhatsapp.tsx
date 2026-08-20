import { IconBrandWhatsapp } from "@tabler/icons-react";

export default function StickyWhatsapp() {
  return (
    <a
      href="https://api.whatsapp.com/send/?phone=918178312085&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <IconBrandWhatsapp size={32} />
    </a>
  );
}
