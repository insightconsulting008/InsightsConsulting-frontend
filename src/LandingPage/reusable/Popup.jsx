import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Enquiryform from "./Enquiryform";

const EnquiryPopup = ({ open, onClose }) => {

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      
      <div className="relative w-full max-w-lg">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 z-60  text-red-700 p-2 "
        >
          <FaTimes />
        </button>

        <Enquiryform />

      </div>

    </div>
  );
};

export default EnquiryPopup;