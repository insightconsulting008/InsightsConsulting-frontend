import React, { useEffect, useState } from "react";
import { Star, Building2, Heart, Tag } from "lucide-react";
import { useParams } from "react-router-dom";

import Enquiryform from "./reusable/Enquiryform";
import EnquiryPopup from "./reusable/Popup";
import ServiceContent from "./ServiceContent";
import { findService, findSubcategory, servicesData } from "./data/servicesData";

const stripLeadingEmoji = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/^(?:\p{Extended_Pictographic}[\uFE0F\u20E3]?\u200D?)+\s*/gu, '')
    .replace(/\*/g, '')
    .trim();
};

/* ─────────────────────────────────────────────────────────
   12A / 80G HERO INTRO — inline text (no boxes)
───────────────────────────────────────────────────────── */
const COL_ICONS = {
  'Benefit': <Tag size={13} className="text-gray-400 flex-shrink-0" />,
  '12A':     <Building2 size={13} className="text-red flex-shrink-0" />,
  '80G':     <Heart size={13} className="text-red flex-shrink-0" />,
};

const HeroComparisonTable = ({ table }) => {
  if (!table?.headers || !table?.rows) return null;
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            {table.headers.map((h, i) => (
              <th key={i} className={`pb-2 font-semibold text-gray-700 ${i === 0 ? 'text-left' : 'text-center w-24'}`}>
                <span className={`inline-flex items-center gap-1.5 ${i > 0 ? 'justify-center' : ''}`}>
                  {COL_ICONS[h]}
                  {h}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100">
              {row.map((cell, j) => (
                <td key={j} className={`py-2 text-gray-600 text-[14px] leading-relaxed ${j === 0 ? 'font-medium' : 'text-center text-base'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HeroIntroSection = ({ data }) => (
  <div>
    <h3 className="text-base font-bold text-gray-900 mb-2">
      {stripLeadingEmoji(data.title)}
    </h3>
    {data.description && (
      <p className="text-gray-600 text-[15px] leading-relaxed mb-3">{data.description}</p>
    )}
    {data.listHeading && (
      <p className="text-sm font-semibold text-gray-800 mb-2">{data.listHeading}</p>
    )}
    {data.items?.length > 0 && (
      <ul className="space-y-1.5 mb-2">
        {data.items.map((item, i) => (
          <li key={i} className="text-gray-600 text-[14px] leading-relaxed">{item}</li>
        ))}
      </ul>
    )}
    {data.note && (
      <p className="text-gray-500 text-[13px] leading-relaxed italic">{data.note}</p>
    )}
  </div>
);

const HeroCombinedSection = ({ data }) => {
  const bulletItems = data.listItems.filter(p => !p.startsWith('👉'));
  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5">
        {stripLeadingEmoji(data.title)}
      </h3>
      {data.introText && (
        <p className="text-gray-600 text-[15px] leading-relaxed mb-1">{data.introText}</p>
      )}
      <HeroComparisonTable table={data.table} />
      {bulletItems.length > 0 && (
        <>
          <p className="text-sm font-semibold text-gray-800 mt-3 mb-2">Together they:</p>
          <ul className="space-y-1.5 mb-2">
            {bulletItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600 text-[14px] leading-relaxed">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
      {data.note && (
        <p className="text-gray-500 text-[13px] leading-relaxed italic">{data.note}</p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────── */
const ServiceInfoSection = () => {
  const { categoryId, subCategoryId, serviceId } = useParams();

  const selectedService = serviceId
    ? findService(categoryId, subCategoryId, serviceId)
    : null;

  const subCategory     = findSubcategory(categoryId, subCategoryId);
  const category        = servicesData.find((c) => c.categoryId === categoryId);
  const categoryName    = category?.categoryName;
  const subCategoryName = subCategory?.subCategoryName;

  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  const process = selectedService?.process ?? [];

  return (
    <main className="bg-white">

      {/* ════════════════════════════════════════════════════
          HERO — title · form · process strip
      ════════════════════════════════════════════════════ */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/92" />

        <div className="relative container mx-auto px-4 lg:px-12 pt-8 lg:pt-20 pb-8 lg:pb-10">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-10">
            Home
            {categoryName    && <span> / {categoryName}</span>}
            {/* {subCategoryName && <span> / {subCategoryName}</span>} */}
            {selectedService && (
              <span className="text-gray-700 font-medium"> / {selectedService.name}</span>
            )}
          </nav>

          {/* ── Two-column: content + form ── */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* LEFT */}
            <div>
              <h1 className="text-2xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3 lg:mb-4">
                {selectedService?.name || subCategoryName}
              </h1>

              {selectedService?.tagline && (
                <p className="text-red font-semibold text-base lg:text-lg mb-4 leading-snug">
                  {selectedService.tagline}
                </p>
              )}



              {selectedService?.whyChoose && (
                <div className="mb-5 mt-5 lg:mb-8 lg:mt-8">
                  {stripLeadingEmoji(selectedService.whyChoose.heading) && (
                    <div className="flex items-start gap-3 mb-3 lg:mb-5">
                      <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                      <h2 className="text-[17px] lg:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                        {stripLeadingEmoji(selectedService.whyChoose.heading)}
                      </h2>
                    </div>
                  )}
                  <div className="space-y-2.5 lg:space-y-3">
                    {selectedService.whyChoose.paragraphs?.map((para, i) => (
                      <p key={i} className="text-gray-600 text-[15px] lg:text-base leading-relaxed">
                        {stripLeadingEmoji(para)}
                      </p>
                    ))}
                    {selectedService.whyChoose.items?.length > 0 && (
                      <ul className="space-y-2 pl-1">
                        {selectedService.whyChoose.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600 text-[15px] lg:text-base leading-relaxed">
                            <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedService.whyChoose.note && (
                      <p className="text-gray-500 text-[13px] lg:text-sm leading-relaxed italic">
                        {stripLeadingEmoji(selectedService.whyChoose.note)}
                      </p>
                    )}
                    {selectedService.whyChoose.closingParagraphs?.map((p, i) => (
                      <p key={i} className="text-gray-600 text-[15px] lg:text-base leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {selectedService.whyChoose.extraItems?.length > 0 && (
                      <ul className="space-y-2">
                        {selectedService.whyChoose.extraItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 text-[15px] lg:text-base leading-relaxed">
                            <span className="flex-shrink-0 text-base leading-snug mt-[1px]">❌</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedService.whyChoose.closingText && (
                      <p className="text-gray-600 text-[15px] lg:text-base leading-relaxed">
                        {selectedService.whyChoose.closingText}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CFO hero sections: UNDERSTANDING THE ROLE + VCFO ONBOARDING */}
              {selectedService?.heroSections?.map((sec, i) => {
                /* ── Paired "WHAT IS" cards side by side ── */
                if (sec.paired) {
                  return (
                    <div key={i} className="mb-8 grid sm:grid-cols-2 gap-4">
                      {sec.paired.map((card, j) => (
                        <div key={j} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                          <p className="text-[11px] font-bold tracking-widest uppercase text-red mb-3">
                            {card.heading}
                          </p>
                          <div className="space-y-2">
                            {card.paragraphs?.map((p, k) => (
                              <p key={k} className="text-gray-600 text-sm leading-relaxed">{p}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
                /* ── Normal hero section ── */
                return (
                  <div key={i} className="mb-5 lg:mb-8">
                    <div className="flex items-start gap-3 mb-3 lg:mb-4">
                      <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                      <h2 className="text-[17px] lg:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                        {stripLeadingEmoji(sec.heading)}
                      </h2>
                    </div>
                    {sec.paragraphs?.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {sec.paragraphs.map((p, j) =>
                          p.endsWith('?') ? (
                            <div key={j} className="bg-red/5 border-l-4 border-red/40 rounded-r-xl px-4 py-2.5 my-1">
                              <p className="text-gray-800 text-[15px] lg:text-base font-semibold leading-relaxed">{p}</p>
                            </div>
                          ) : (
                            <p key={j} className="text-gray-600 text-[15px] lg:text-base leading-relaxed">{p}</p>
                          )
                        )}
                      </div>
                    )}
                    {sec.processSteps?.length > 0 && (
                      <ol className="space-y-3">
                        {sec.processSteps.map((step, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                              {String(j + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <p className="text-gray-800 text-base font-semibold leading-snug">{step.name}</p>
                              {step.description && (
                                <p className="text-gray-500 text-sm leading-relaxed mt-0.5">{step.description}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                );
              })}

              {/* Our End-to-End Process */}
              {process.length > 0 && (
                <div className="mb-6 lg:mb-10">
                  <div className="flex items-start gap-3 mb-3 lg:mb-5">
                    <span className="w-[3px] h-6 bg-red rounded-full flex-shrink-0 mt-[3px]" />
                    <h3 className="text-[17px] lg:text-xl font-bold text-gray-900 leading-snug tracking-tight">
                      Our End-to-End Process
                    </h3>
                  </div>
                  <ol className="space-y-3">
                    {process.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 text-[15px] lg:text-base">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {stripLeadingEmoji(step)}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* 12A & 80G inline intro content */}
              {selectedService?.heroIntro && (
                <div className="space-y-7 mb-8 pt-2 border-t border-gray-100">
                  {selectedService.heroIntro.twelveA && (
                    <HeroIntroSection data={selectedService.heroIntro.twelveA} />
                  )}
                  {selectedService.heroIntro.eightyG && (
                    <HeroIntroSection data={selectedService.heroIntro.eightyG} />
                  )}
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white shadow-sm">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">4.8 Rating</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["men/32", "women/44", "men/45"].map((p, i) => (
                      <img
                        key={i}
                        src={`https://randomuser.me/api/portraits/${p}.jpg`}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        alt=""
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                      +
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">1,64,739 Happy Clients</span>
                </div>
              </div>
            </div>

            {/* RIGHT — enquiry form (sticky on desktop) */}
            <div className="w-full lg:sticky lg:top-32">
              <Enquiryform initialService={selectedService?.name || ""} />
            </div>

          </div>

        </div>

        {/* ── Full-width red summary bar — outside container ── */}
        {selectedService?.processSummary && (
          <div className="relative bg-red py-4">
            <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between gap-4">
              <p className="text-white font-semibold text-base lg:text-lg">
                {stripLeadingEmoji(selectedService.processSummary)}
              </p>
              <button
                onClick={() => setPopupOpen(true)}
                className="flex-shrink-0 bg-white text-[#D11C16] text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#e8e8e8] hover:text-[#D11C16] transition-all duration-300 whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

      </section>

      {/* ── Enquiry Popup ── */}
      <EnquiryPopup open={popupOpen} onClose={() => setPopupOpen(false)} initialService={selectedService?.name || ""} />

      {/* ── SERVICE DETAIL CONTENT ── */}
      <ServiceContent />

    </main>
  );
};

export default ServiceInfoSection;
