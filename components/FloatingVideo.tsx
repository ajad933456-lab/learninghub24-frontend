"use client";

import { useState } from "react";
import { IconX } from "@tabler/icons-react";

export default function FloatingVideo() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 max-w-40 sm:w-40 rounded-2xl shadow-2xl overflow-hidden bg-black border-2 border-primary/50 group animate-in fade-in slide-in-from-bottom-5 duration-500">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 z-10 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 shadow-sm backdrop-blur-sm"
                aria-label="Close video"
            >
                <IconX size={16} />
            </button>
            <div className="relative w-full aspect-[9/16]">
                <iframe
                    src="https://www.youtube.com/embed/DlBl-SEx5l4?autoplay=1&mute=1&loop=1&playlist=DlBl-SEx5l4&controls=1"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                ></iframe>
            </div>
        </div>
    );
}
