import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { servicesData } from "../data/servicesData";

/* How many services each category contributes to the moving strip */
const PER_CATEGORY = {
  registration: 5,
  compliance: 4,
  gst: 5,
  "income-tax": 5,
  mca: 5,
  cfo: 1,
  dpdp: 1,
};

/* Flatten the catalogue into the pills the strip renders */
const buildItems = () => {
  const items = [];
  servicesData.forEach((cat) => {
    const limit = PER_CATEGORY[cat.categoryId] ?? 4;
    cat.subcategories.forEach((sub) => {
      sub.services.slice(0, limit).forEach((service) => {
        items.push({
          key: `${cat.categoryId}-${sub.subCategoryId}-${service.serviceId}`,
          name: service.name,
          to: `/our-services/${cat.categoryId}/${sub.subCategoryId}/${service.serviceId}`,
        });
      });
    });
  });
  return items;
};

/* One infinite strip. The list is rendered twice so the loop is seamless. */
function MarqueeRow({ items, direction, onOpen }) {
  return (
    <div className="ic-marquee-wrap overflow-hidden">
      <div
        className={`ic-marquee gap-4 py-2 ${
          direction === "right" ? "ic-marquee-right" : "ic-marquee-left"
        }`}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1}>
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onOpen(item.to)}
                className="shrink-0 whitespace-nowrap rounded-full border
                           border-gray-200 bg-white px-6 py-3 text-gray-700
                           transition-colors duration-200 hover:border-primary
                           hover:text-primary"
              >
                {item.name}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesShowcase() {
  const navigate = useNavigate();
  const items = useMemo(() => buildItems(), []);

  const rowOne = items.filter((_, i) => i % 2 === 0);
  const rowTwo = items.filter((_, i) => i % 2 === 1);

  const onOpen = (to) => {
    navigate(to);
    window.scrollTo({ top: 0 });
  };

  return (
    <section className="pt-10 lg:pt-20 bg-white overflow-hidden">
      <div className="mx-auto container">
        <div className="lg:px-12 px-4 mx-auto text-center my-10">
          

          <h2 className="text-2xl md:text-5xl font-semibold text-gray-800 mb-3 text-left">
            Every Service Your Business Needs
          </h2>

          <p className="text-gray-600 max-w-2xl text-left">
            Registrations, GST, income tax, MCA filings and CFO support — all
            handled by one team, under one roof.
          </p>
        </div>

        {/* Moving service strips */}
        <div className="relative">
          <MarqueeRow items={rowOne} direction="left" onOpen={onOpen} />
          <MarqueeRow items={rowTwo} direction="right" onOpen={onOpen} />

          {/* soft fade on both edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
