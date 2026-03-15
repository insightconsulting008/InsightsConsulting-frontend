import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Phone, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { GrSelect } from "react-icons/gr";

const API_BASE_URL = "https://insightsconsult-backend.onrender.com/api";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Blogs", to: "/resource" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const closeTimer = useRef(null);

  const [categories, setCategories] = useState([]);
  const [subcatWithServices, setSubcatWithServices] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCat, setLoadingCat] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCatIndex, setActiveCatIndex] = useState(null);

  const [mobileData, setMobileData] = useState({});
  const [mobileOpenCat, setMobileOpenCat] = useState(null);
  const [mobileOpenSub, setMobileOpenSub] = useState(null);

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);

  useEffect(() => {
    const parts = location.pathname.split("/");
    if (parts[1] === "our-services") {
      setSelectedSubId(parts[3] || null);
      setSelectedServiceId(parts[4] || null);
    }
  }, [location]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenDropdown(false), 150);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCat(false);
    }
  };

  const fetchDropdownData = async (catId) => {
    if (activeCat === catId && subcatWithServices.length > 0) return;

    setActiveCat(catId);
    setSubcatWithServices([]);
    setLoading(true);

    try {
      const subRes = await axios.get(`${API_BASE_URL}/categories/${catId}/subcategories`);
      const subs = subRes.data?.data || [];

      const withServices = await Promise.all(
        subs.map(async (sub) => {
          try {
            const svcRes = await axios.get(`${API_BASE_URL}/subcategories/${sub.subCategoryId}/services`);
            return { ...sub, services: svcRes.data?.data || [] };
          } catch {
            return { ...sub, services: [] };
          }
        })
      );

      setSubcatWithServices(withServices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMobileData = async (catId) => {
    if (mobileData[catId]?.subcatWithServices?.length > 0) return;

    setMobileData((prev) => ({
      ...prev,
      [catId]: { loading: true, subcatWithServices: [] },
    }));

    try {
      const subRes = await axios.get(`${API_BASE_URL}/categories/${catId}/subcategories`);
      const subs = subRes.data?.data || [];

      const withServices = await Promise.all(
        subs.map(async (sub) => {
          try {
            const svcRes = await axios.get(`${API_BASE_URL}/subcategories/${sub.subCategoryId}/services`);
            return { ...sub, services: svcRes.data?.data || [] };
          } catch {
            return { ...sub, services: [] };
          }
        })
      );

      setMobileData((prev) => ({
        ...prev,
        [catId]: { loading: false, subcatWithServices: withServices },
      }));
    } catch {
      setMobileData((prev) => ({
        ...prev,
        [catId]: { loading: false, subcatWithServices: [] },
      }));
    }
  };

  const navigateToService = (catId, sub, service) => {
    setSelectedServiceId(service.serviceId);
    setSelectedSubId(sub.subCategoryId);
    setOpenDropdown(false);
    setMobileMenuOpen(false);

    const category = categories.find((c) => c.categoryId === catId);

    navigate(
      `/our-services/${catId}/${sub.subCategoryId}/${service.serviceId}`,
      {
        state: {
          categoryName: category?.categoryName,
          subCategoryName: sub.subCategoryName,
        },
      }
    );
  };

  const navigateToSubcategory = (catId, sub) => {
    setSelectedSubId(sub.subCategoryId);
    setSelectedServiceId(null);
    setOpenDropdown(false);

    navigate(`/our-services/${catId}/${sub.subCategoryId}`);
  };

  const handleMobileCatToggle = (catId) => {
    if (mobileOpenCat === catId) {
      setMobileOpenCat(null);
      setMobileOpenSub(null);
    } else {
      setMobileOpenCat(catId);
      setMobileOpenSub(null);
      fetchMobileData(catId);
    }
  };

  const handleMobileSubToggle = (subId) => {
    setMobileOpenSub(mobileOpenSub === subId ? null : subId);
  };

  // Check if a route is active
  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const ErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from {opacity:0; transform:translateY(-5px);}
          to {opacity:1; transform:translateY(0);}
        }

        @keyframes mIn {
          from {opacity:0; transform:translateY(5px);}
          to {opacity:1; transform:translateY(0);}
        }
      `}</style>

      <header className="w-full sticky top-0  bg-white shadow-sm z-40">
        {/* Top Bar */}
        <div className="bg-neutral-900  text-white text-sm py-2 px-4 flex items-center justify-center lg:justify-between flex-wrap">
          <span className="hidden lg:block">
            Reliable solutions for{" "}
            <span className="text-yellow-400 font-semibold">
              compliance, filings, and regulatory requirements
            </span>{" "}
            supporting businesses at every stage.
          </span>


          <span className="lg:hidden">
            Get the right  <span className="text-yellow-400 font-semibold"> compliance guidance</span>
          </span>
          <button
            onClick={() => navigate("/contact")}
            className="ml-2 block bg-red-600  lg:hidden  hover:bg-red-700 px-4 py-1 rounded t font-semibold"
          >
            Enquire Now
          </button>

          <div className="hidden lg:flex items-center cursor-pointer gap-2">
            {NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1 text-sm transition-colors ${isActive || isActiveRoute(to)
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}


          </div>

        </div>

        {/* Main Nav */}
        <div className="lg:px-12 px-4 py-3 flex justify-between items-center">
          <Link to="/">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png"
              className="h-10"
              alt="logo"
            />
          </Link>

          {/* Desktop */}
          <nav className="hidden lg:flex items-center  gap-5">
            {loadingCat
              ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-20 bg-gray-200 rounded animate-pulse"
                />
              ))
              : categories.map((cat, index) => {
                const isCategoryActive =
                  location.pathname.startsWith(`/our-services/${cat.categoryId}`) ||
                  (openDropdown && activeCat === cat.categoryId);

                return (
                  <div
                    key={cat.categoryId}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenDropdown(true);
                      setActiveCatIndex(index);
                      fetchDropdownData(cat.categoryId);
                    }}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      className={`flex items-center gap-1  cursor-pointer font-medium transition-colors ${isCategoryActive
                        ? "text-red-600"
                        : "text-gray-700 hover:text-red-500"
                        }`}
                    >
                      {cat.categoryName}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${openDropdown && activeCat === cat.categoryId ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openDropdown && activeCat === cat.categoryId && (
                      <>
                        {/* Hover bridge */}
                        <div
                          className="absolute top-full w-full h-2.5"
                          style={{ right: 0 }}
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                        />

                        {/* Dropdown - Always positioned to the right */}
                        <div
                          className="absolute  top-full mt-2.5 bg-white rounded-xl border border-gray-100 overflow-hidden"
                          style={{
                            width: "520px",
                            maxHeight: "420px",
                            animation: "fadeDown .15s ease both",
                            right: 0,
                            boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
                          }}
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                        >
                          {/* Red accent line */}
                          <div className="h-0.5 bg-red-600 w-full" />

                          {loading ? (
                            <div className="p-8 text-center text-gray-400">
                              Loading...
                            </div>
                          ) : subcatWithServices.length === 0 ? (
                            <ErrorState message="No services available" />
                          ) : (
                            <div className={`grid  ${subcatWithServices.length === 1
                              ? "grid-cols-1"
                              : "grid-cols-2"
                              } gap-0 divide-x divide-gray-100`}>
                              {subcatWithServices.map((sub, index) => {
                                const isSubActive = selectedSubId === sub.subCategoryId;

                                return (
                                  <div
                                    key={sub.subCategoryId}
                                    className={`p-5 ${index < subcatWithServices.length - (subcatWithServices.length === 1 ? 0 : 2)
                                      ? " border-gray-100"
                                      : ""
                                      }`}
                                  >
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="w-1 h-4 bg-red-500 rounded-full flex-shrink-0" />
                                      <button
                                        className={` font-bold transition-colors ${isSubActive
                                          ? "text-red-600"
                                          : "text-gray-900 hover:text-red-600"
                                          }`}
                                        onClick={() => navigateToSubcategory(cat.categoryId, sub)}
                                      >
                                        {sub.subCategoryName}
                                      </button>
                                    </div>

                                    {sub.services.length === 0 ? (
                                      <p className="text-xs text-gray-400 pl-3">No services</p>
                                    ) : (
                                      <ul className="space-y-0.5 pl-3">
                                        {sub.services.map((service) => {
                                          const isServiceActive = selectedServiceId === service.serviceId;

                                          return (
                                            <li key={service.serviceId}>
                                              <button
                                                onClick={() =>
                                                  navigateToService(cat.categoryId, sub, service)
                                                }
                                                className={`block w-full text-left  px-2 py-1 rounded transition-colors ${isServiceActive
                                                  ? "text-red-600 bg-red-50 font-medium"
                                                  : "text-gray-600 cursor-pointer hover:text-red-600 hover:bg-red-50"
                                                  }`}
                                              >
                                                {service.name}
                                              </button>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

            <button
              onClick={() => navigate("/login")}
              className="ml-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Login
            </button>
          </nav>

          <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex justify-between items-center px-5 py-4 ">
            <span className="font-semibold text-sm">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto px-5 py-2"
            style={{ animation: "mIn .18s ease both" }}
          >
            {/* Home Link */}
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium  ${isActive || isActiveRoute("/")
                  ? "text-red-600"
                  : "text-gray-700"
                }`
              }
            >
              Home
            </NavLink>

            {loadingCat
              ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-200 rounded animate-pulse my-3"
                />
              ))
              : categories.map((cat) => {
                const isCatOpen = mobileOpenCat === cat.categoryId;
                const catData = mobileData[cat.categoryId];
                const isCategoryActive = location.pathname.startsWith(`/our-services/${cat.categoryId}`);

                return (
                  <div key={cat.categoryId} className="">
                    <button
                      className={`w-full flex justify-between py-3 text-sm font-semibold ${isCategoryActive ? "text-red-600" : "text-gray-800"
                        }`}
                      onClick={() => handleMobileCatToggle(cat.categoryId)}
                    >
                      {cat.categoryName}
                      <ChevronDown
                        size={15}
                        className={`text-gray-400 transition-transform ${isCatOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isCatOpen && (
                      <div className="pb-3">
                        {catData?.loading ? (
                          <p className="text-sm text-gray-400 py-2 pl-3">Loading...</p>
                        ) : (
                          catData?.subcatWithServices?.map((sub) => {
                            const isSubOpen = mobileOpenSub === sub.subCategoryId;
                            const isSubActive = selectedSubId === sub.subCategoryId && !selectedServiceId;

                            return (
                              <div key={sub.subCategoryId}>
                                <div className="flex justify-between items-center py-2 pl-3 pr-1">
                                  <button
                                    onClick={() => handleMobileSubToggle(sub.subCategoryId)}
                                    className={`text-sm font-medium text-left flex-1 ${isSubActive ? "text-red-600" : "text-gray-700"
                                      }`}
                                  >
                                    {sub.subCategoryName}
                                  </button>
                                  {sub.services.length > 0 && (
                                    <button
                                      onClick={() => handleMobileSubToggle(sub.subCategoryId)}
                                      className="p-1"
                                    >
                                      <ChevronRight
                                        size={14}
                                        className={`text-gray-400 transition-transform ${isSubOpen ? "rotate-90" : ""
                                          }`}
                                      />
                                    </button>
                                  )}
                                </div>

                                {isSubOpen && (
                                  <ul className="pl-6 pr-2 space-y-1 pb-2">
                                    {sub.services.map((service) => {
                                      const isServiceActive = selectedServiceId === service.serviceId;

                                      return (
                                        <li key={service.serviceId}>
                                          <button
                                            onClick={() =>
                                              navigateToService(
                                                cat.categoryId,
                                                sub,
                                                service
                                              )
                                            }
                                            className={`text-sm py-1.5 px-2 rounded w-full text-left transition-colors ${isServiceActive
                                              ? "text-red-600 bg-red-50 font-medium"
                                              : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                                              }`}
                                          >
                                            {service.name}
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

            {/* Other Navigation Items */}
            {NAV_ITEMS.slice(1).map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-sm font-medium  ${isActive || isActiveRoute(to)
                    ? "text-red-600"
                    : "text-gray-700"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Footer */}
          <div className="px-5 py-4 border-t bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Phone size={14} />
              <span>+91 98578474975</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}
                className="flex-1 border border-red-600 text-red-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/contact"); }}
                className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-colors"
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