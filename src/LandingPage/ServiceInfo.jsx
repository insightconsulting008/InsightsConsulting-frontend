import React, { useState, useEffect } from "react";
import { FaStar, FaGift, FaBoxes, FaArrowUp, FaCheckCircle } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

import Enquiryform from "./reusable/Enquiryform";
import ServiceContent from "./ServiceContent";

/*
─────────────────────────────────
COMMON SERVICE HIGHLIGHTS
─────────────────────────────────
*/

export const commonServiceHighlights = {
  support: {
    icon: <FaStar />,
    title: "Ongoing Support",
    desc: "We assist beyond registration with filings, amendments, and renewals.",
  },
  experience: {
    years: "10+ Years",
    label: "Compliance Experience",
    icon: <FaArrowUp size={14} />,
  },
  whoShouldRegister: {
    icon: <FaBoxes />,
    title: "Who Should Register",
    desc: "For businesses required to comply under applicable statutory regulations.",
  },
  turnaround: {
    icon: <FaGift />,
    title: "Turnaround Time",
    desc: "24–48 hours fast-track processing, subject to document verification.",
  },
  cta: {
    label: "Explore Our Services",
  },
};

const data = commonServiceHighlights;

/*
─────────────────────────────────
POINTS SKELETON
─────────────────────────────────
*/

const PointsSkeleton = () => {
  return (
    <ul className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <li key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </li>
      ))}
    </ul>
  );
};

/*
─────────────────────────────────
MAIN COMPONENT
─────────────────────────────────
*/

const ServiceInfoSection = () => {
  const { categoryId, subCategoryId, serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const categoryName = location.state?.categoryName;
  const subCategoryName = location.state?.subCategoryName;

  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
  ─────────────────────────────────
  FETCH SERVICE
  ─────────────────────────────────
  */

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId || !subCategoryId) return;

      try {
        setLoading(true);

        const res = await fetch(
          `https://insightsconsult-backend.onrender.com/api/subcategories/${subCategoryId}/services`
        );

        const data = await res.json();

        const service = data?.data?.find(
          (s) => s.serviceId === serviceId
        );

        setSelectedService(service);
      } catch (err) {
        console.error("Service fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, subCategoryId]);


  /*
  ─────────────────────────────────
  SCROLL TOP
  ─────────────────────────────────
  */

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  return (
    <section className="bg-white">

      {/* HERO SECTION */}

      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        }}
      >

        <div className="absolute inset-0 bg-white/90"></div>

        <div className="relative container mx-auto px-4  lg:px-12 lg:py-14 py-10  gap-16 ">

          {/* LEFT CONTENT */}

          <div className="w-full">
            <p className=" text-gray-400 mb-10 lg:mb-20">
              Home › {categoryName} › {subCategoryName} › {selectedService?.name}
            </p>
            <div className=" max-w-6xl mx-auto grid lg:grid-cols-2 ">

              {/* BREADCRUMB */}



              {/* SERVICE NAME */}

              <div className="col-span-1">
                <h1 className=" text-2xl lg:text-4xl  font-semibold text-gray-800 mb-4 lg:mb-8">

                  {selectedService?.name || subCategoryName?.toUpperCase()}

                </h1>

                {/* DESCRIPTION */}

                <p className="text-gray-600 max-w-2xl mb-8 lg:mb-16">

                  {selectedService?.description ||
                    `We help businesses register under ${subCategoryName} quickly, accurately, and without unnecessary back-and-forth.`}

                </p>

                {/* SERVICE POINTS */}

                <div className="mb-10">

                  {loading ? (

                    <PointsSkeleton />

                  ) : selectedService?.points?.length ? (

                    <ul className="space-y-3">

                      {selectedService.points.map((point, index) => (

                        <li
                          key={index}
                          className="flex items-start gap-3 text-gray-700"
                        >

                          < GiCheckMark className="text-white w-6 h-6 rounded-full  bg-green-800 p-1 mt-1" />

                          <span className="text-lg">{point}</span>

                        </li>

                      ))}

                    </ul>

                  ) : (

                    <p className="text-gray-400">
                      Service details will be available shortly.
                    </p>

                  )}

                </div>

                <div className="flex items-center gap-8 flex-wrap">

      {/* Rating Badge */}
      <div className="flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm">

        {/* Google Icon */}
        <img
          src="https://www.google.com/favicon.ico"
          alt="google"
          className="w-5 h-5"
        />

        <span className="text-sm font-medium text-gray-700">
          4.8 Google Rating
        </span>

        {/* Stars */}
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-gray-300"></div>

        <span className="text-sm font-semibold text-gray-800">
          Trustpilot
        </span>
      </div>

      {/* Avatars */}
      <div className="flex items-center gap-4">

        <div className="flex -space-x-3">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://randomuser.me/api/portraits/men/45.jpg"
            className="w-9 h-9 rounded-full border-2 border-white"
          />

          {/* Plus circle */}
          <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center text-lg border-2 border-white">
            +
          </div>
        </div>

        {/* Happy Clients */}
        <p className="text-lg font-medium text-gray-800">
          1,64,739 Happy Clients
        </p>
      </div>

    </div>
              </div>
              <div className="relative xl:col-span-1  mt-10 lg:mt-0">

                <Enquiryform />

              </div>



            </div>

            {/* RIGHT FORM */}


          </div>

        </div>

      </section>

      {/* SERVICE CONTENT */}

      <ServiceContent />

    </section>
  );
};

export default ServiceInfoSection;