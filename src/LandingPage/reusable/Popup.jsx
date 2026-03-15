import React, { useEffect } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import Enquiryform from "./Enquiryform";

const EnquiryPopup = ({ open, onClose }) => {

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [open]);

  if (!open) return null;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      
      <div className="relative w-full max-w-lg">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 md:right-8 z-60  text-red-700 p-2 "
        >
          <RiCloseLargeFill />
        </button>

        <Enquiryform />

      </div>

    </div>
  );
};

export default EnquiryPopup;