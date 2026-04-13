import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown, ChevronRight } from "lucide-react";
import { servicesData } from "./data/servicesData";

/* ─── strip leading emoji ───────────────────────────────── */
const strip = (text) => {
  if (!text || typeof text !== "string") return text;
  return text.replace(/^(?:\p{Extended_Pictographic}[\uFE0F\u20E3]?\u200D?)+\s*/gu, "").trim();
};

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Blogs", to: "/resource" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

/* ─────────────────────────────────────────────────────────
   Build nav categories:
   - Merge "registration" + "compliance" → single "Registration" item
   - Each subcategory carries _catId so routing still uses the right categoryId
───────────────────────────────────────────────────────── */
const buildNavCategories = (data) => {
  const MERGE_IDS = ["registration", "compliance"];
  const merged = {
    categoryId: "__reg_merged__",
    categoryName: "Registration",
    _matchIds: MERGE_IDS,
    subcategories: data
      .filter((c) => MERGE_IDS.includes(c.categoryId))
      .flatMap((c) => c.subcategories.map((s) => ({ ...s, _catId: c.categoryId }))),
  };
  const rest = data
    .filter((c) => !MERGE_IDS.includes(c.categoryId))
    .map((c) => ({
      ...c,
      _matchIds: [c.categoryId],
      subcategories: c.subcategories.map((s) => ({ ...s, _catId: c.categoryId })),
    }));
  return [merged, ...rest];
};

export default function Nav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const closeTimer = useRef(null);

  const navCategories = useMemo(() => buildNavCategories(servicesData), []);

  /* desktop dropdown state */
  const [openCatId,      setOpenCatId]      = useState(null);
  const [activeSubId,    setActiveSubId]     = useState(null); // left-panel hover

  /* mobile state */
  const [mobileOpen,     setMobileOpen]      = useState(false);
  const [mobileOpenCat,  setMobileOpenCat]   = useState(null);
  const [mobileOpenSub,  setMobileOpenSub]   = useState(null);

  /* active route tracking */
  const [selectedSubId,  setSelectedSubId]   = useState(null);
  const [selectedSvcId,  setSelectedSvcId]   = useState(null);

  useEffect(() => {
    const parts = location.pathname.split("/");
    if (parts[1] === "our-services") {
      setSelectedSubId(parts[3] || null);
      setSelectedSvcId(parts[4] || null);
    }
  }, [location]);

  /* hover helpers */
  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenCatId(null), 150);
  }, []);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openMenu = useCallback((cat) => {
    cancelClose();
    setOpenCatId(cat.categoryId);
    // default left-panel to first subcategory
    if (cat.subcategories.length > 0) {
      setActiveSubId(cat.subcategories[0].subCategoryId);
    }
  }, [cancelClose]);

  /* navigation helpers */
  const goToService = (sub, service) => {
    setSelectedSvcId(service.serviceId);
    setSelectedSubId(sub.subCategoryId);
    setOpenCatId(null);
    setMobileOpen(false);
    navigate(`/our-services/${sub._catId}/${sub.subCategoryId}/${service.serviceId}`, {
      state: { subCategoryName: sub.subCategoryName },
    });
  };

  const goToSub = (sub) => {
    setSelectedSubId(sub.subCategoryId);
    setSelectedSvcId(null);
    setOpenCatId(null);
    navigate(`/our-services/${sub._catId}/${sub.subCategoryId}`);
  };

  /* active category check */
  const isCatActive = (cat) =>
    cat._matchIds.some((id) => location.pathname.startsWith(`/our-services/${id}`)) ||
    openCatId === cat.categoryId;

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-5px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes mIn {
          from { opacity:0; transform:translateY(5px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <header className="w-full sticky top-0 bg-white shadow-sm z-40">

        {/* ── Top bar ── */}
        <div className="bg-neutral-900 text-white text-sm py-2 px-4 flex items-center justify-center lg:justify-between flex-wrap">
          <span className="hidden lg:block">
            Reliable solutions for{" "}
            <span className="text-yellow-400 font-semibold">
              compliance, filings, and regulatory requirements
            </span>{" "}
            supporting businesses at every stage.
          </span>
          <span className="lg:hidden">
            Get the right <span className="text-yellow-400 font-semibold">compliance guidance</span>
          </span>
          <button
            onClick={() => navigate("/contact")}
            className="ml-2 block bg-primary lg:hidden hover:bg-primary/90 px-4 py-1 rounded font-semibold"
          >
            Enquire Now
          </button>
          <div className="hidden lg:flex items-center gap-2">
            {NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1 text-sm transition-colors ${
                    isActive ? "text-yellow-400" : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ── Main nav ── */}
        <div className="lg:px-12 px-4 py-3 flex justify-between items-center">
          <Link to="/">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png"
              className="h-10"
              alt="logo"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-5">
            {navCategories.map((cat) => {
              const isRegMerged = cat.categoryId === '__reg_merged__';

              /* For merged Registration: flatten all services with their sub reference */
              const flatServicesWithSub = isRegMerged
                ? cat.subcategories.flatMap((sub) =>
                    sub.services.map((svc) => ({ svc, sub }))
                  )
                : [];

              /* For normal cats: resolve active subcategory */
              const activeSub = !isRegMerged
                ? (cat.subcategories.find((s) => s.subCategoryId === activeSubId) || cat.subcategories[0])
                : null;
              const regularServices = activeSub?.services || [];

              const displayCount = isRegMerged ? flatServicesWithSub.length : regularServices.length;
              const multiCol     = displayCount > 7;
              const showLeftPanel = !isRegMerged && cat.subcategories.length > 1;
              const dropdownW    = multiCol ? "520px" : showLeftPanel ? "400px" : "240px";

              return (
                <div
                  key={cat.categoryId}
                  className="relative"
                  onMouseEnter={() => openMenu(cat)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      isCatActive(cat) ? "text-primary" : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    {cat.categoryName}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        openCatId === cat.categoryId ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* ── hover bridge ── */}
                  {openCatId === cat.categoryId && (
                    <div
                      className="absolute top-full w-full h-2.5"
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    />
                  )}

                  {/* ── Mega dropdown ── */}
                  {openCatId === cat.categoryId && (
                    <div
                      className="absolute top-full mt-2.5 bg-white rounded-xl border border-gray-100 overflow-hidden flex"
                      style={{
                        width: dropdownW,
                        right: 0,
                        animation: "fadeDown .15s ease both",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
                        maxHeight: "620px",
                      }}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      {/* top red accent */}
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-primary z-10" />

                      {/* ── LEFT: subcategory list (only for non-merged multi-sub cats) ── */}
                      {showLeftPanel && (
                        <div className="w-44 flex-shrink-0 bg-gray-50 border-r border-gray-100 pt-5 pb-4 overflow-y-auto">
                          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Category
                          </p>
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub.subCategoryId}
                              onMouseEnter={() => setActiveSubId(sub.subCategoryId)}
                              onClick={() => goToSub(sub)}
                              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center justify-between gap-1 ${
                                activeSubId === sub.subCategoryId
                                  ? "bg-secondary text-primary"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <span className="leading-snug">{strip(sub.subCategoryName)}</span>
                              <ChevronRight size={12} className="flex-shrink-0 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* ── RIGHT: services ── */}
                      <div className="flex-1 pt-5 pb-4 px-5 overflow-y-auto">
                        {/* Single-sub label for normal cats */}
                        {!isRegMerged && cat.subcategories.length === 1 && activeSub && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                            {strip(activeSub.subCategoryName)}
                          </p>
                        )}

                        {/* Merged Registration: flat list, all services combined */}
                        {isRegMerged && (
                          flatServicesWithSub.length === 0 ? (
                            <p className="text-xs text-gray-400">No services</p>
                          ) : (
                            <ul className={`${multiCol ? "columns-2 gap-x-6" : ""} space-y-0.5`}>
                              {flatServicesWithSub.map(({ svc, sub }) => {
                                const isActive = selectedSvcId === svc.serviceId;
                                return (
                                  <li key={svc.serviceId} className="break-inside-avoid">
                                    <button
                                      onClick={() => goToService(sub, svc)}
                                      className={`block w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                                        isActive
                                          ? "text-primary bg-secondary font-medium"
                                          : "text-gray-600 hover:text-primary hover:bg-secondary"
                                      }`}
                                    >
                                      {strip(svc.name)}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )
                        )}

                        {/* Normal categories: services from active subcategory */}
                        {!isRegMerged && (
                          regularServices.length === 0 ? (
                            <p className="text-xs text-gray-400">No services</p>
                          ) : (
                            <ul className={`${multiCol ? "columns-2 gap-x-6" : ""} space-y-0.5`}>
                              {regularServices.map((service) => {
                                const isActive = selectedSvcId === service.serviceId;
                                return (
                                  <li key={service.serviceId} className="break-inside-avoid">
                                    <button
                                      onClick={() => goToService(activeSub, service)}
                                      className={`block w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                                        isActive
                                          ? "text-primary bg-secondary font-medium"
                                          : "text-gray-600 hover:text-primary hover:bg-secondary"
                                      }`}
                                    >
                                      {strip(service.name)}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => navigate("/login")}
              className="ml-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Login
            </button>
          </nav>

          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex justify-between items-center px-5 py-4">
            <span className="font-semibold text-sm">Menu</span>
            <button onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-2" style={{ animation: "mIn .18s ease both" }}>
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium ${isActive ? "text-primary" : "text-gray-700"}`
              }
            >
              Home
            </NavLink>

            {navCategories.map((cat) => {
              const isCatOpen = mobileOpenCat === cat.categoryId;
              const catActive = cat._matchIds.some((id) =>
                location.pathname.startsWith(`/our-services/${id}`)
              );

              return (
                <div key={cat.categoryId}>
                  <button
                    className={`w-full flex justify-between py-3 text-sm font-semibold ${
                      catActive ? "text-primary" : "text-gray-800"
                    }`}
                    onClick={() =>
                      setMobileOpenCat(isCatOpen ? null : cat.categoryId)
                    }
                  >
                    {cat.categoryName}
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform ${isCatOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isCatOpen && (
                    <div className="pb-3">
                      {cat.subcategories.length === 1 ? (
                        /* ── Single subcategory: skip the sub level, list services directly ── */
                        <ul className="pl-3 pr-2 space-y-0.5 pt-1 pb-2">
                          {cat.subcategories[0].services.map((service) => {
                            const sub = cat.subcategories[0];
                            const isActive = selectedSvcId === service.serviceId;
                            return (
                              <li key={service.serviceId}>
                                <button
                                  onClick={() => goToService(sub, service)}
                                  className={`text-sm py-2 px-3 rounded-lg w-full text-left transition-colors ${
                                    isActive
                                      ? "text-primary bg-secondary font-medium"
                                      : "text-gray-600 hover:text-primary hover:bg-secondary"
                                  }`}
                                >
                                  {strip(service.name)}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        /* ── Multiple subcategories: show grouped accordion ── */
                        cat.subcategories.map((sub) => {
                          const isSubOpen   = mobileOpenSub === sub.subCategoryId;
                          const isSubActive = selectedSubId === sub.subCategoryId && !selectedSvcId;

                          return (
                            <div key={sub.subCategoryId}>
                              <button
                                onClick={() => setMobileOpenSub(isSubOpen ? null : sub.subCategoryId)}
                                className={`w-full flex justify-between items-center py-2 pl-3 pr-2 text-sm font-medium transition-colors ${
                                  isSubActive ? "text-primary" : "text-gray-700"
                                }`}
                              >
                                <span className="text-left">{strip(sub.subCategoryName)}</span>
                                <ChevronRight
                                  size={14}
                                  className={`text-gray-400 flex-shrink-0 transition-transform ${
                                    isSubOpen ? "rotate-90" : ""
                                  }`}
                                />
                              </button>

                              {isSubOpen && (
                                <ul className="pl-6 pr-2 space-y-0.5 pb-2">
                                  {sub.services.map((service) => {
                                    const isActive = selectedSvcId === service.serviceId;
                                    return (
                                      <li key={service.serviceId}>
                                        <button
                                          onClick={() => goToService(sub, service)}
                                          className={`text-sm py-2 px-3 rounded-lg w-full text-left transition-colors ${
                                            isActive
                                              ? "text-primary bg-secondary font-medium"
                                              : "text-gray-500 hover:text-primary hover:bg-secondary"
                                          }`}
                                        >
                                          {strip(service.name)}
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {NAV_ITEMS.slice(1).map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-sm font-medium ${isActive ? "text-primary" : "text-gray-700"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="px-5 py-4 border-t bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Phone size={14} />
              <span>+91 98578474975</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setMobileOpen(false); navigate("/login"); }}
                className="flex-1 border border-primary text-primary text-sm font-semibold py-2.5 rounded-lg hover:bg-secondary transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate("/contact"); }}
                className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
