import React, { useEffect } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import Enquiryform from "./Enquiryform";

const EnquiryPopup = ({ open, onClose, initialService = "" }) => {

  useEffect(() => {
    if (open) {
      /* measure the actual scrollbar width before hiding it */
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    /* overlay — fade in, click-outside closes */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-[fadeIn_.15s_ease]"
      onClick={onClose}
    >
      {/* card — same max-w as the inner form so the X lines up exactly */}
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X — absolute inside the card, aligned with the blue header */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-red transition-all shadow"
        >
          <RiCloseLargeFill size={13} />
        </button>

        <Enquiryform initialService={initialService} />
      </div>
    </div>
  );
};

export default EnquiryPopup;
