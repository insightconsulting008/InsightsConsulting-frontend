import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { servicesData } from "../data/servicesData";

/**
 * ServicesMegaMenu
 * Data-driven mega-menu — no API calls.
 * Reads directly from servicesData.
 */
export default function ServicesMegaMenu() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState(
    servicesData[0]?.categoryId || null
  );

  const currentCategory = servicesData.find((c) => c.categoryId === activeCat);

  const handleSubcategoryClick = (catId, sub) => {
    navigate(`/our-services/${catId}/${sub.subCategoryId}`);
  };

  const handleServiceClick = (catId, sub, service) => {
    navigate(
      `/our-services/${catId}/${sub.subCategoryId}/${service.serviceId}`,
      {
        state: {
          // catId always equals activeCat here, so reuse the already-resolved currentCategory
          categoryName: currentCategory?.categoryName,
          subCategoryName: sub.subCategoryName,
        },
      }
    );
  };

  return (
    <div className="absolute -left-56 top-full mt-6 w-[580px] bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden">
      {/* Red accent line */}
      <div className="h-0.5 bg-primary w-full" />

      <div className="grid grid-cols-2 divide-x divide-gray-100">
        {/* Column 1 — Categories */}
        <div className="p-5">
          <p className="text-xs tracking-widest uppercase text-gray-400 font-semibold mb-3">
            Category
          </p>
          <div className="space-y-1">
            {servicesData.map((cat) => (
              <button
                key={cat.categoryId}
                onMouseEnter={() => setActiveCat(cat.categoryId)}
                onClick={() => setActiveCat(cat.categoryId)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCat === cat.categoryId
                    ? "bg-secondary text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat.categoryName}
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Column 2 — Subcategories & Services */}
        <div className="p-5">
          {currentCategory?.subcategories.map((sub) => (
            <div key={sub.subCategoryId} className="mb-4 last:mb-0">
              <button
                onClick={() => handleSubcategoryClick(activeCat, sub)}
                className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-900 hover:text-primary transition-colors"
              >
                <span className="w-1 h-4 bg-primary rounded-full flex-shrink-0" />
                {sub.subCategoryName}
              </button>

              <ul className="pl-3 space-y-0.5">
                {sub.services.map((service) => (
                  <li key={service.serviceId}>
                    <button
                      onClick={() => handleServiceClick(activeCat, sub, service)}
                      className="block w-full text-left text-sm text-gray-500 hover:text-primary hover:bg-secondary px-2 py-1 rounded transition-colors"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
