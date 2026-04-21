import React, { useEffect, useState, useRef } from "react";
import { 
  FiGrid, FiSearch, FiChevronDown, FiChevronUp, FiX, 
  FiArrowLeft, FiArrowRight, FiCheck, FiArrowUpRight 
} from "react-icons/fi";
import { IoWarning, IoCheckmark } from "react-icons/io5";
import { AiOutlineSelect } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@src/providers/axiosInstance";

const LIMIT = 6;

// Reusable Loading Skeleton
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-pulse">
    <div className="w-full h-44 bg-gray-200 rounded-t-xl" />
    <div className="p-4 flex flex-col flex-1 gap-3">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 rounded" />
      </div>
      <div className="border-t border-b border-gray-100 py-2.5 flex items-center justify-between">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-3 w-28 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-10 bg-gray-100 rounded-lg" />
      </div>
    </div>
  </div>
);

// No Data Component
const NoData = ({ search }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <IoWarning className="w-20 h-20 text-gray-300" />
    <div className="text-center">
      <p className="text-gray-700 font-semibold text-base">
        {search ? `No results for "${search}"` : "No services available"}
      </p>
      <p className="text-gray-400 text-sm mt-1">
        {search
          ? "Try a different search term or browse another category."
          : "There are no services in this subcategory yet. Please check back later."}
      </p>
    </div>
  </div>
);

// Sort Options
const SORT_OPTIONS = [ "Low to High", "High to Low"];

export default function RecommendedServices() {
  const navigate = useNavigate();
  
  // State
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [totalServices, setTotalServices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Select");
  const [search, setSearch] = useState("");
  
  // UI State
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [catSubcategories, setCatSubcategories] = useState({});
  const [loadingSubs, setLoadingSubs] = useState({});
  
  // Refs
  const dropdownRef = useRef(null);
  const sortRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  
  // Navigation handlers
  const navigateTo = (service, action) => {
    navigate('/register', {
      state: {
        serviceId: service.serviceId,
        serviceName: service.name,
        action
      }
    });
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/categories");
        const cats = data?.data || data?.categories || data || [];
        setCategories(Array.isArray(cats) ? cats : []);
        
        // Fetch subcategories for each category
        const subsMap = {};
        await Promise.all(cats.map(async (cat) => {
          try {
            const { data } = await axiosInstance.get(
              `/categories/${cat.categoryId}/subcategories`
            );
            subsMap[cat.categoryId] = Array.isArray(data?.data || data?.subcategories || data) 
              ? (data.data || data.subcategories || data) : [];
          } catch (err) {
            console.error(`Error fetching subcategories for ${cat.categoryId}`);
          }
        }));
        setCatSubcategories(subsMap);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category selected
  useEffect(() => {
    if (!selectedCatId) return;
    const fetchSubcategories = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/categories/${selectedCatId}/subcategories`
        );
        setSubcategories(Array.isArray(data?.data || data?.subcategories || data) 
          ? (data.data || data.subcategories || data) : []);
      } catch (err) {
        console.error("Error fetching subcategories", err);
      }
    };
    fetchSubcategories();
  }, [selectedCatId]);

  // Fetch services
  useEffect(() => {
    let cancelled = false;
    
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        let servicesData = [];
        let pages = 1;
        let total = 0;

        if (selectedSubId) {
          const { data } = await axiosInstance.get(
            `/subcategories/${selectedSubId}/services`,
            { params: { page: currentPage, limit: LIMIT, orderBy: "createdAt", order: "desc" } }
          );
          servicesData = data?.data || [];
          pages = data?.pagination?.totalPages || 1;
          total = data?.pagination?.totalRecords || servicesData.length;
        } else if (selectedCatId) {
          const { data } = await axiosInstance.get("/service", {
            params: { page: currentPage, limit: LIMIT * 3, orderBy: "createdAt", order: "desc" }
          });
          if (data?.success) {
            const categorySubIds = catSubcategories[selectedCatId]?.map(s => s.subCategoryId) || [];
            const allServices = data.services || [];
            servicesData = allServices.filter(s => categorySubIds.includes(s.subCategoryId));
            total = servicesData.length;
            pages = Math.ceil(servicesData.length / LIMIT);
          }
        } else {
          const { data } = await axiosInstance.get("/service", {
            params: { page: currentPage, limit: LIMIT, orderBy: "createdAt", order: "desc" }
          });
          if (data?.success) {
            servicesData = data.services || [];
            pages = data.pagination?.totalPages || 1;
            total = data.pagination?.totalRecords || servicesData.length;
          } else if (Array.isArray(data)) {
            servicesData = data;
            total = data.length;
            pages = Math.ceil(data.length / LIMIT);
          }
        }

        if (!cancelled) {
          setServices(servicesData);
          setTotalPages(pages);
          setTotalServices(total);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching services", err);
          setServices([]);
        }
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    };

    fetchServices();
    return () => { cancelled = true; };
  }, [selectedSubId, selectedCatId, currentPage, catSubcategories]);

  // Dropdown handlers
  const handleCategoryClick = (catId) => {
    setOpenDropdownId(openDropdownId === catId ? null : catId);
    if (!catSubcategories[catId]) {
      setLoadingSubs(prev => ({ ...prev, [catId]: true }));
      axiosInstance.get(`/categories/${catId}/subcategories`)
        .then(({ data }) => {
          const subs = Array.isArray(data?.data || data?.subcategories || data) 
            ? (data.data || data.subcategories || data) : [];
          setCatSubcategories(prev => ({ ...prev, [catId]: subs }));
        })
        .catch(err => console.error("Error fetching subcategories", err))
        .finally(() => setLoadingSubs(prev => ({ ...prev, [catId]: false })));
    }
  };

  const handleMouseEnter = (catId) => {
    clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdownId(catId), 200);
    if (!catSubcategories[catId]) handleCategoryClick(catId);
  };

  const handleMouseLeave = () => {
    clearTimeout(dropdownTimeoutRef.current);
  };

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Selection handlers
  const handleSelectAllCategory = (catId) => {
    setSelectedCatId(catId);
    setSelectedSubId(null);
    setCurrentPage(1);
    setOpenDropdownId(null);
  };

  const handleSelectSubcategory = (catId, subId) => {
    setSelectedCatId(catId);
    setSelectedSubId(subId);
    setCurrentPage(1);
    setOpenDropdownId(null);
  };

  const handleAllServicesSelect = () => {
    setSelectedCatId(null);
    setSelectedSubId(null);
    setCurrentPage(1);
    setOpenDropdownId(null);
    setShowAllCategories(false);
  };

  // Filter and sort services
  const displayedServices = (services || [])
    .filter(s => s.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch(sortBy) {
        case "Low to High": 
          return (Number(a.finalIndividualPrice) || 0) - (Number(b.finalIndividualPrice) || 0);
        case "High to Low": 
          return (Number(b.finalIndividualPrice) || 0) - (Number(a.finalIndividualPrice) || 0);
        default: return 0;
      }
    });

  // Get category name
  const getCategoryName = (subId) => {
    if (!subId) return "SERVICE";
    for (const cat of categories) {
      if (catSubcategories[cat.categoryId]?.some(s => s.subCategoryId === subId)) {
        return cat.categoryName;
      }
    }
    return "SERVICE";
  };

  const selectedCat = categories.find(c => c.categoryId === selectedCatId);
  const selectedSub = subcategories.find(s => s.subCategoryId === selectedSubId);

  // Pagination
  const renderPageNumbers = () => {
    const pages = [];
    const addPage = (n) => pages.push(
      <button
        key={n}
        onClick={() => setCurrentPage(n)}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
          currentPage === n
            ? "bg-secondary text-primary font-semibold"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        {n}
      </button>
    );

    const addDots = (key) => pages.push(
      <span key={key} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400">...</span>
    );

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 3) addDots("dots1");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) if (i > 1 && i < totalPages) addPage(i);
      
      if (currentPage < totalPages - 2) addDots("dots2");
      if (totalPages > 1) addPage(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <div className="container mx-auto">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 px-4 lg:px-12 py-3">
          <nav className="flex items-center gap-1 text-gray-400 text-sm flex-wrap">
            <span className="text-primary cursor-pointer hover:underline" onClick={handleAllServicesSelect}>
              All Services
            </span>
            {selectedCat && (
              <>
                <span className="mx-1">›</span>
                <span className="text-primary">{selectedCat.categoryName}</span>
              </>
            )}
            {selectedSub && (
              <>
                <span className="mx-1">›</span>
                <span className="text-primary font-semibold">{selectedSub.subCategoryName}</span>
              </>
            )}
          </nav>
        </div>

        {/* Header */}
        <div className="bg-white px-4 lg:px-12 pt-5 pb-0 border-b border-gray-100">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {selectedSub ? selectedSub.subCategoryName : selectedCat ? selectedCat.categoryName : "All Services"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loadingServices ? (
                <span className="inline-block w-24 h-3 bg-gray-200 rounded animate-pulse" />
              ) : `Showing ${totalServices} services`}
            </p>
          </div>

          {/* Category Bar + Search + Sort */}
          <div className="flex items-start  gap-2 mb-4 flex-col space-y-6 lg:space-y-0 lg:flex-row">
            
            {/* Categories */}
            <div className="flex-1 min-w-0" ref={dropdownRef}>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleAllServicesSelect}
                  className={`px-3 py-1.5 rounded-lg md:text-base text-xs font-medium transition-all duration-200 flex-shrink-0 ${
                    !selectedCatId && !selectedSubId
                      ? 'bg-primary text-white  shadow-sm shadow-primary/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>

                {(showAllCategories ? categories : categories.slice(0, 4)).map(cat => (
                  <div
                    key={cat.categoryId}
                    className="relative flex-shrink-0"
                    onMouseEnter={() => handleMouseEnter(cat.categoryId)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleCategoryClick(cat.categoryId)}
                      className={`px-3 py-1.5 rounded-lg md:text-base text-xs font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                        selectedCatId === cat.categoryId && !selectedSubId
                          ? 'bg-primary text-white shadow-sm shadow-primary/20'
                          : selectedCatId === cat.categoryId && selectedSubId
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${openDropdownId === cat.categoryId ? 'ring-2 ring-primary/20' : ''}`}
                    >
                      {cat.categoryName}
                      {openDropdownId === cat.categoryId ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Subcategory Dropdown */}
                    {openDropdownId === cat.categoryId && (
                      <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-30">
                        {loadingSubs[cat.categoryId] ? (
                          <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
                        ) : catSubcategories[cat.categoryId]?.length > 0 ? (
                          <>
                            <button
                              onClick={() => handleSelectAllCategory(cat.categoryId)}
                              className={`w-full text-left px-4 py-1 text-sm transition-colors font-medium ${
                                selectedCatId === cat.categoryId && !selectedSubId
                                  ? 'bg-secondary text-primary'
                                  : 'hover:bg-secondary hover:text-primary'
                              }`}
                            >
                              All 
                              {selectedCatId === cat.categoryId && !selectedSubId}
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            {catSubcategories[cat.categoryId].map(sub => (
                              <button
                                key={sub.subCategoryId}
                                onClick={() => handleSelectSubcategory(cat.categoryId, sub.subCategoryId)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                  selectedSubId === sub.subCategoryId
                                    ? 'bg-secondary text-primary font-medium'
                                    : 'hover:bg-secondary hover:text-primary'
                                }`}
                              >
                                {sub.subCategoryName}
                                {selectedSubId === sub.subCategoryId }
                              </button>
                            ))}
                          </>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No subcategories</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {categories.length > 4 && (
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex-shrink-0 flex items-center gap-1"
                  >
                    {showAllCategories ? (
                      <>
                        <FiX className="w-3 h-3" />
                        Show less
                      </>
                    ) : (
                      <>+{categories.length - 4} more</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-shrink-0">
              
              {/* Search */}
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 gap-2 flex-1 lg:w-52">
                <FiSearch className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services..."
                  className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setShowSortDropdown(prev => !prev)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-primary/30 hover:text-primary hover:bg-secondary transition-all duration-150 flex-shrink-0"
                >
                  <span className="hidden sm:inline">Sort: </span>
                  <span className="text-gray-900 font-semibold">{sortBy.split(' ')[0]}</span>
                  <FiChevronDown className="w-3 h-3" />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-30">
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option}
                        onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option
                            ? 'bg-secondary text-primary font-medium'
                            : 'hover:bg-secondary hover:text-primary'
                        }`}
                      >
                        {option}
                        {sortBy === option && <FiCheck className="ml-2 inline text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="px-4 lg:px-12 py-6">
          {loadingServices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(LIMIT).fill().map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : displayedServices.length === 0 ? (
            <NoData search={search} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedServices.map(service => {
                  const categoryName = getCategoryName(service.subCategoryId);
                  const offerPrice = Number(service.offerPrice);
                  const finalPrice = Number(service.finalIndividualPrice);
                  const discount = offerPrice && finalPrice ? Math.round((1 - offerPrice / finalPrice) * 100) : 0;

                  return (
                    <div key={service.serviceId} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={service.photoUrl}
                          alt={service.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                            {categoryName}
                          </span>
                          <span className="text-[9px] lg:text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                            {service.serviceType === "RECURRING" ? "RECURRING" : "STANDARD"}
                          </span>
                        </div>
                        
                        <h3 className="font-bold lg:text-xl text-gray-900 text-base mb-1 leading-snug">{service.name}</h3>
                        <p className="text-gray-400 lg:text-base text-sm mb-3 line-clamp-2 leading-relaxed flex-1">{service.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {offerPrice && (
                            <span className="text-lg font-bold text-gray-900">
                              ₹{offerPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          {finalPrice && (
                            <span className={`lg:text-lg text-sm ${offerPrice ? "line-through text-gray-400" : "font-bold text-gray-900"}`}>
                              ₹{finalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="text-[10px] bg-green-50 text-green-600 font-semibold px-1.5 py-0.5 rounded">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-b border-gray-100 py-2.5 mb-3">
                          <span className="text-gray-400 lg:text-base text-sm">Need More Info?</span>
                          <button
                            onClick={() => navigateTo(service, 'buy')}
                            className="font-semibold lg:text-base text-sm text-gray-800 flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            Explore service
                            <FiArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateTo(service, 'buy')}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white lg:text-base text-sm font-semibold py-2.5 rounded-lg transition-colors"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() => navigateTo(service, 'details')}
                            className="flex-1 bg-white border border-gray-200 hover:bg-secondary hover:border-primary/20 lg:text-base text-sm text-primary font-semibold py-2.5 rounded-lg transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 px-2 gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white min-w-[60px] sm:min-w-[100px] justify-center"
                  >
                    <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="flex bg-secondary items-center gap-0.5 sm:gap-1 rounded-lg px-1 sm:px-2 overflow-x-auto max-w-[calc(100vw-160px)] sm:max-w-none scrollbar-hide py-1">
                    {renderPageNumbers()}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white min-w-[60px] sm:min-w-[100px] justify-center"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}