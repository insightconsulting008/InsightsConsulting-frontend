import React from "react";
import { FaWhatsapp } from "react-icons/fa";

/* Floating WhatsApp CTA — sits on the left edge of every landing page screen */
const PHONE = "919500012551"; // +91 95000 12551
const MESSAGE =
  "Hi Insight Consulting, I'd like to know more about your services.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed left-4 bottom-6 z-40 flex h-14 w-14 items-center
                 justify-center rounded-full bg-[#25D366] text-white shadow-lg
                 shadow-black/20 transition-transform duration-300
                 hover:scale-105 hover:bg-[#1FB855] focus:outline-none
                 focus:ring-4 focus:ring-[#25D366]/40"
    >
      {/* calm pulse ring — outline only, so the circle stays crisp */}
      <span className="ic-ping pointer-events-none absolute inset-0 rounded-full border-2 border-[#25D366]" />

      <FaWhatsapp className="relative text-3xl" />

      {/* label appears on hover, outside the circle so the button stays round */}
      <span
        className="pointer-events-none absolute left-full ml-3 hidden md:block
                   whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-sm
                   font-medium text-white opacity-0 transition-opacity
                   duration-300 group-hover:opacity-100"
      >
        95000 12551
      </span>
    </a>
  );
}
