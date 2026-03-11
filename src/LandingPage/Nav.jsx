import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Phone, FileText, ChevronRight, Menu, X, ChevronUp, AlertCircle } from "lucide-react";
import { GrSelect } from "react-icons/gr";

export default function Nav() {
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [openServices, setOpenServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);

  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeService, setActiveService] = useState(null);

  // Error states
  const [categoryError, setCategoryError] = useState(null);
  const [subcategoryError, setSubcategoryError] = useState(null);
  const [serviceError, setServiceError] = useState(null);

  // Loading states
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [mobileActiveSub, setMobileActiveSub] = useState(null);

  const isServicesActive = location.pathname.startsWith("/our-services");

  // Clear ALL active highlights on route change
  useEffect(() => {
    if (!isServicesActive) {
      // Desktop
      setActiveCat(null);
      setActiveSub(null);
      setActiveService(null);
      setSubcategories([]);
      setServices([]);
      setExpandedCategory(null);
      // Mobile
      setMobileActiveCategory(null);
      setMobileActiveSub(null);
      setMobileServicesOpen(false);
      
      // Clear errors
      setSubcategoryError(null);
      setServiceError(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryError(null);
        const res = await axios.get("https://insightsconsult-backend.onrender.com/api/categories");
        setCategories(res.data?.data || []);
        if (!res.data?.data || res.data.data.length === 0) {
          setCategoryError("No categories found");
        }
      } catch (err) {
        console.log(err);
        setCategoryError(err.response?.data?.message || "Failed to load categories");
        setCategories([]);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchSubcategories = async (catId) => {
    if (activeCat === catId) {
      setExpandedCategory(expandedCategory === catId ? null : catId);
      return;
    }
    setActiveCat(catId);
    setActiveSub(null);
    setServices([]);
    setLoadingSub(true);
    setSubcategoryError(null);
    setExpandedCategory(catId);
    try {
      const res = await axios.get(`https://insightsconsult-backend.onrender.com/api/categories/${catId}/subcategories`);
      const data = res.data?.data || [];
      setSubcategories(data);
      if (data.length === 0) {
        setSubcategoryError("No subcategories available");
      }
    } catch (err) {
      console.log(err);
      setSubcategoryError(err.response?.data?.message || "Failed to load subcategories");
      setSubcategories([]);
    } finally {
      setLoadingSub(false);
    }
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setOpenServices(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      hoverTimeout.current = setTimeout(() => { setOpenServices(false); }, 180);
    }
  };

  const fetchServices = async (subId) => {
    if (activeSub === subId) return;
    setActiveSub(subId);
    setLoadingServices(true);
    setServiceError(null);
    try {
      const res = await axios.get(`https://insightsconsult-backend.onrender.com/api/subcategories/${subId}/services`);
      const data = res.data?.data || [];
      setServices(data);
      if (data.length === 0) {
        setServiceError("No services available");
      }
    } catch (err) {
      console.log(err);
      setServiceError(err.response?.data?.message || "Failed to load services");
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSelectSub = (sub) => {
    navigate(`/our-services/${activeCat}/${sub.subCategoryId}`, {
      state: {
        categoryName: categories.find((c) => c.categoryId === activeCat)?.categoryName,
        subCategoryName: sub.subCategoryName,
      },
    });
    setOpenServices(false);
    setMobileMenuOpen(false);
    setExpandedCategory(null);
  };

  const handleSelectService = (service) => {
    setActiveService(service.serviceId);
    navigate(`/our-services/${activeCat}/${activeSub}/${service.serviceId}`, {
      state: {
        categoryName: categories.find((c) => c.categoryId === activeCat)?.categoryName,
        subCategoryName: subcategories.find((s) => s.subCategoryId === activeSub)?.subCategoryName,
        serviceName: service.name,
      },
    });
    setOpenServices(false);
    setMobileMenuOpen(false);
    setExpandedCategory(null);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target) && !isPinned) {
        setOpenServices(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || openServices) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [mobileMenuOpen, openServices]);

  const fetchMobileSubcategories = async (catId) => {
    try {
      setLoadingSub(true);
      setSubcategoryError(null);
      const res = await axios.get(`https://insightsconsult-backend.onrender.com/api/categories/${catId}/subcategories`);
      const data = res.data?.data || [];
      setSubcategories(data);
      if (data.length === 0) {
        setSubcategoryError("No subcategories available");
      }
    } catch (err) {
      console.log(err);
      setSubcategoryError(err.response?.data?.message || "Failed to load subcategories");
      setSubcategories([]);
    } finally {
      setLoadingSub(false);
    }
  };

  // Error/Empty State Component
 const ErrorState = ({ message, type = "error" }) => (
  <div className="flex flex-col items-center justify-center p-4 text-center">

    {type === "error" ? (
      <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
    ) : (
      <GrSelect className="w-8 h-8 mb-2 text-gray-400" />
    )}

    <p
      className={`text-sm ${
        type === "error" ? "text-red-600" : "text-gray-500"
      }`}
    >
      {message}
    </p>

  </div>
);

  return (
    <header className="w-full shadow-sm sticky top-0 bg-white z-40">

      {/* TOP BAR */}
      <div className="bg-neutral-900 text-white text-sm py-2 px-4 flex items-center justify-center gap-3 text-center flex-wrap">
        <span className="hidden md:block tracking-wide">
          Looking For The Right{" "}
          <span className="text-yellow-400 font-semibold">Compliance & Registration Services</span>
          {" "}| Get A Quick Guidance From Our Team
        </span>
        <span className="md:hidden block">
          Get expert <span className="text-yellow-400 font-semibold">guidance</span> today
        </span>
        <button
          onClick={() => navigate("/contact")}
          className="ml-2 bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide"
        >
          Enquire Now
        </button>
      </div>

      {/* MAIN NAV */}
      <div className="bg-white border-b border-gray-100 px-4 lg:px-12 container mx-auto py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/home" className="flex items-center gap-2">
          <img
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png"
            className="h-10 md:h-14"
            alt="Insights Consultancy"
          />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1 text-gray-700 font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150
              ${isActive
                ? "text-red-600 bg-red-50 border-red-500 font-semibold"
                : "border-transparent hover:text-red-500 "
              }`
            }
          >
            Home
          </NavLink>

          {/* SERVICES */}
          <div
            className="relative"
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => {
                setIsPinned((prev) => !prev);
                setOpenServices((prev) => !prev);
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150
                ${isServicesActive
                  ? "text-red-600 bg-red-50 border-red-500 font-semibold"
                  : "border-transparent hover:text-red-500 "
                }`}
            >
              Services <ChevronDown size={15} />
            </button>

            {openServices && (
              <div
                className="absolute -left-70 top-full mt-3 w-[880px] bg-white shadow-2xl border border-gray-100 rounded-2xl grid grid-cols-3 overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* CATEGORIES */}
                <div className="p-5 border-r h-96 overflow-y-scroll border-gray-100">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                    Categories
                  </h4>
                  {loadingCat ? (
                    <p className="text-gray-400 text-sm text-center py-4">Loading...</p>
                  ) : categoryError ? (
                    <ErrorState message={categoryError} type="error" />
                  ) : categories.length === 0 ? (
                    <ErrorState message="No categories found" type="empty" />
                  ) : (
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <div
                          key={cat.categoryId}
                          onMouseEnter={() => fetchSubcategories(cat.categoryId)}
                          className={`flex justify-between items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border transition-all duration-150
                            ${activeCat === cat.categoryId
                              ? "bg-red-50 border-red-500 text-red-600"
                              : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                            }`}
                        >
                          <div className="flex gap-2.5 items-center">
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0
                              ${activeCat === cat.categoryId ? "bg-red-100" : "bg-gray-100"}`}>
                              <FileText size={14} className={activeCat === cat.categoryId ? "text-red-500" : "text-gray-500"} />
                            </div>
                            <p className={`text-sm line-clamp-1 font-medium ${activeCat === cat.categoryId ? "text-red-600" : "text-gray-800"}`}>
                              {cat.categoryName}
                            </p>
                          </div>
                          <ChevronRight size={14} className={activeCat === cat.categoryId ? "text-red-400" : "text-gray-300"} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SUBCATEGORIES */}
                <div className="p-5 border-r h-96 overflow-y-scroll border-gray-100">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                    Subcategories
                  </h4>
                  {loadingSub ? (
                    <p className="text-gray-400 text-sm text-center py-4">Loading...</p>
                  ) : subcategoryError ? (
                    <ErrorState message={subcategoryError} type="error" />
                  ) : !activeCat ? (
                    <ErrorState message="Select a category" type="empty" />
                  ) : subcategories.length === 0 ? (
                    <ErrorState message="No subcategories available" type="empty" />
                  ) : (
                    <div className="space-y-1 ">
                      {subcategories.map((sub) => (
                        <div
                          key={sub.subCategoryId}
                          onMouseEnter={() => fetchServices(sub.subCategoryId)}
                          onClick={() => handleSelectSub(sub)}
                          className={`flex justify-between items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border transition-all duration-150
                            ${activeSub === sub.subCategoryId
                              ? "bg-red-50 border-red-500 text-red-600"
                              : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                            }`}
                        >
                          <div className="flex gap-2.5 items-center">
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0
                              ${activeSub === sub.subCategoryId ? "bg-red-100" : "bg-gray-100"}`}>
                              <FileText size={14} className={activeSub === sub.subCategoryId ? "text-red-500" : "text-gray-500"} />
                            </div>
                            <p className={`text-sm line-clamp-1 font-medium ${activeSub === sub.subCategoryId ? "text-red-600" : "text-gray-700"}`}>
                              {sub.subCategoryName}
                            </p>
                          </div>
                          <ChevronRight size={14} className={activeSub === sub.subCategoryId ? "text-red-400" : "text-gray-300"} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SERVICES */}
                <div className="p-5 h-96 overflow-y-scroll">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                    Services
                  </h4>
                  {loadingServices ? (
                    <p className="text-gray-400 text-sm text-center py-4">Loading...</p>
                  ) : serviceError ? (
                    <ErrorState message={serviceError} type="error" />
                  ) : !activeSub ? (
                    <ErrorState message="Select a subcategory" type="empty" />
                  ) : services.length === 0 ? (
                    <ErrorState message="No services available" type="empty" />
                  ) : (
                    <div className="space-y-1">
                      {services.map((service) => (
                        <div
                          key={service.serviceId}
                          onClick={() => handleSelectService(service)}
                          className={`flex gap-3 px-2 py-2.5 rounded-lg border cursor-pointer transition-all duration-150
                            ${activeService === service.serviceId
                              ? "bg-red-50 border-red-500"
                              : "border-transparent hover:bg-red-50 hover:border-red-200"
                            }`}
                        >
                          <img
                            src={service.photoUrl}
                            alt={service.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                          />
                          <div>
                            <p className={`text-sm font-semibold line-clamp-1 ${activeService === service.serviceId ? "text-red-600" : "text-gray-800"}`}>
                              {service.name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{service.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/servicehub"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150
              ${isActive
                ? "text-red-600 bg-red-50 border-red-500 font-semibold"
                : "border-transparent hover:text-red-500 "
              }`
            }
          >
            Service Hub
          </NavLink>

          <NavLink
            to="/resource"
            className={({ isActive }) =>
              `flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150
              ${isActive
                ? "text-red-600 bg-red-50 border-red-500 font-semibold"
                : "border-transparent hover:text-red-500 "
              }`
            }
          >
            Blog 
          </NavLink>

          <NavLink
            to="/company"
            className={({ isActive }) =>
              `flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150
              ${isActive
                ? "text-red-600 bg-red-50 border-red-500 font-semibold"
                : "border-transparent hover:text-red-500 "
              }`
            }
          >
            Company 
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150
              ${isActive
                ? "text-red-600 bg-red-50 border-red-500 font-semibold"
                : "border-transparent hover:text-red-500 "
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <button className="hidden lg:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide">
              Login &rarr;
            </button>
          </Link>
          <button
            className="lg:hidden p-2 border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* MOBILE SIDE NAV */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-50 lg:hidden flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png"
                className="h-9"
                alt="Insights Consultancy"
              />
              <button
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">

              {/* Home */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium border transition-all
                  ${isActive
                    ? "bg-red-50 text-red-600 border-red-400 font-semibold"
                    : "border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-700"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>

              {/* Services Accordion */}
              <div className="rounded-xl overflow-hidden">
                <button
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  className={`flex items-center justify-between w-full px-3 py-3 text-sm font-semibold transition-colors
                    ${mobileServicesOpen ? "bg-red-50 text-red-600" : "text-gray-800 hover:bg-gray-100"}`}
                >
                  <span>Services We Provide</span>
                  {mobileServicesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {mobileServicesOpen && (
                  <div className="divide-y divide-gray-100">
                    {categoryError ? (
                      <ErrorState message={categoryError} type="error" />
                    ) : categories.length === 0 ? (
                      <ErrorState message="No categories found" type="empty" />
                    ) : (
                      <div className="h-40 overflow-y-scroll">
                        {categories.map((cat) => (
                          <div key={cat.categoryId}>

                            {/* Category Button */}
                            <button
                              onClick={async () => {
                                if (mobileActiveCategory === cat.categoryId) {
                                  setMobileActiveCategory(null);
                                  setMobileActiveSub(null);
                                  setSubcategoryError(null);
                                } else {
                                  setMobileActiveCategory(cat.categoryId);
                                  setMobileActiveSub(null);
                                  await fetchMobileSubcategories(cat.categoryId);
                                }
                              }}
                              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all
                                ${mobileActiveCategory === cat.categoryId
                                  ? "bg-red-50 text-red-600 font-semibold border-l-2 border-red-500"
                                  : "hover:bg-gray-50 text-gray-700"
                                }`}
                            >
                              <span>{cat.categoryName}</span>
                              {mobileActiveCategory === cat.categoryId
                                ? <ChevronUp size={15} />
                                : <ChevronDown size={15} />
                              }
                            </button>

                            {/* Subcategories */}
                            {mobileActiveCategory === cat.categoryId && (
                              <div className="bg-gray-50 pl-6 pr-3 py-2 space-y-1">
                                {loadingSub ? (
                                  <p className="text-xs text-gray-400 py-1 px-2">Loading...</p>
                                ) : subcategoryError ? (
                                  <ErrorState message={subcategoryError} type="error" />
                                ) : subcategories.length === 0 ? (
                                  <ErrorState message="No subcategories available" type="empty" />
                                ) : (
                                  subcategories.map((sub) => (
                                    <button
                                      key={sub.subCategoryId}
                                      onClick={() => {
                                        setMobileActiveSub(sub.subCategoryId);
                                        navigate(`/our-services/${mobileActiveCategory}/${sub.subCategoryId}`, {
                                          state: {
                                            categoryName: cat.categoryName,
                                            subCategoryName: sub.subCategoryName,
                                          },
                                        });
                                        setMobileMenuOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all
                                        ${mobileActiveSub === sub.subCategoryId
                                          ? "bg-red-50 text-red-600 font-semibold border-red-400"
                                          : "border-transparent hover:bg-white hover:border-gray-200 text-gray-600"
                                        }`}
                                    >
                                      {sub.subCategoryName}
                                    </button>
                                  ))
                                )}
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {[
                { to: "/servicehub", label: "Service Hub" },
                { to: "/resource",   label: "Resources"    },
                { to: "/company",    label: "Company"      },
                { to: "/contact",    label: "Contact"      },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium border transition-all
                    ${isActive
                      ? "bg-red-50 text-red-600 border-red-400 font-semibold"
                      : "border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-700"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}

              {/* Phone */}
              <div className="flex items-center gap-2 px-3 py-3 mt-1 border-t border-gray-100 text-gray-500">
                <Phone size={15} className="text-red-500" />
                <span className="text-sm font-medium">+91 98578474975</span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-4 py-4 border-t border-gray-100 bg-white">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white py-3 rounded-xl text-sm font-bold tracking-wide">
                  Login &rarr;
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}