import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@src/providers/axiosInstance";
import PageHeader from '../page-header/PageHeader';
import {
  X, Phone, Search, Clock, FileText, Shield, CheckCircle,
  ArrowRight, Tag, Calendar, BadgeCheck, Loader2, Package,
  Layers, Star, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";

export default function GetService() {
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // Data states
  const [services, setServices] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredBundles, setFilteredBundles] = useState([]);
  const [serviceStats, setServiceStats] = useState({ total: 0, filtered: 0, bundles: 0 });
  const [viewMode, setViewMode] = useState("services");
  const [bundlesLoading, setBundlesLoading] = useState(false);

  // All-services cache used for cross-page category filtering
  const [allServices, setAllServices] = useState([]);
  const [allServicesLoaded, setAllServicesLoaded] = useState(false);

  // Payment states
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showBundlePaymentPopup, setShowBundlePaymentPopup] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [purchasedItem, setPurchasedItem] = useState(null);

  const debounceTimer = useRef(null);

  const userId = localStorage.getItem("userId");
  if (!userId) console.error("User ID not found");

  /* ── DEBOUNCE SEARCH INPUT ── */
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  /* ── FETCH DATA ON MOUNT ── */
  useEffect(() => {
    axiosInstance.get("/category").then(res => setCategories(res.data.categories)).catch(console.error);
    axiosInstance.get("/subcategory").then(res => setSubCategories(res.data.subcategories)).catch(console.error);
  }, []);

  /* ── RE-FETCH SERVICES WHEN SEARCH / PAGE / LIMIT CHANGES ── */
  useEffect(() => {
    fetchServices(1, itemsPerPage, debouncedSearch);
    setCurrentPage(1);
  }, [debouncedSearch]);

  /* ── RE-FETCH BUNDLES WHEN SEARCH CHANGES ── */
  useEffect(() => {
    fetchBundles(debouncedSearch);
  }, [debouncedSearch]);

  /* ── INITIAL LOAD ── */
  useEffect(() => {
    fetchServices(1, itemsPerPage, "");
    fetchBundles("");
  }, []);

  /* ── FETCH SERVICES (with backend search + pagination) ── */
  const fetchServices = async (page = 1, limit = itemsPerPage, search = "") => {
    setPaginationLoading(true);
    try {
      const params = new URLSearchParams({ limit, page });
      if (search) params.append("search", search);
      const res = await axiosInstance.get(`/service?${params.toString()}`);
      const data = res.data.services ?? [];
      const total = res.data.pagination?.totalRecords ?? data.length;
      setServices(data);
      setTotalServices(total);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setPaginationLoading(false);
    }
  };

  /* ── FETCH BUNDLES (with backend search) ── */
  const fetchBundles = async (search = "") => {
    setBundlesLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await axiosInstance.get(`/bundle${query}`);
      const data = res.data.bundles ?? [];
      setBundles(data);
      setServiceStats(prev => ({ ...prev, bundles: data.length }));
    } catch (error) {
      console.error("Failed to fetch bundles:", error);
    } finally {
      setBundlesLoading(false);
    }
  };

  /* ── FETCH ALL SERVICES (for cross-page category filtering) ── */
  const fetchAllServices = useCallback(async () => {
    if (allServicesLoaded) return;
    try {
      const res = await axiosInstance.get(`/service?limit=999&page=1`);
      setAllServices(res.data.services ?? []);
      setAllServicesLoaded(true);
    } catch (e) {
      console.error("Failed to fetch all services for filter:", e);
    }
  }, [allServicesLoaded]);

  /* ── CLIENT-SIDE CATEGORY FILTER FOR SERVICES ── */
  useEffect(() => {
    // When a category filter is active, filter against the full dataset (allServices)
    // so we don't miss services that live on other pages.
    const isFiltered = selectedCategory !== "all" || selectedSubCategory !== "all";
    const base = isFiltered && allServicesLoaded ? allServices : services;

    let r = base;
    if (selectedCategory !== "all") {
      const ids = subCategories.filter(s => s.categoryId === selectedCategory).map(s => s.subCategoryId);
      r = r.filter(s => ids.includes(s.subCategoryId));
    }
    if (selectedSubCategory !== "all") {
      r = r.filter(s => s.subCategoryId === selectedSubCategory);
    }
    setFilteredServices(r);
  }, [selectedCategory, selectedSubCategory, services, allServices, allServicesLoaded, subCategories]);

  /* ── CLIENT-SIDE CATEGORY FILTER FOR BUNDLES ── */
  useEffect(() => {
    // Bundle services from the API only carry {serviceId, name} — no subCategoryId.
    // Build a serviceId → subCategoryId lookup from allServices to fix this.
    const svcMap = {};
    allServices.forEach(s => { svcMap[s.serviceId] = s.subCategoryId; });

    let r = bundles;
    if (selectedCategory !== "all") {
      const ids = subCategories.filter(s => s.categoryId === selectedCategory).map(s => s.subCategoryId);
      r = r.filter(b => b.services?.some(s => ids.includes(svcMap[s.serviceId])));
    }
    if (selectedSubCategory !== "all") {
      r = r.filter(b => b.services?.some(s => svcMap[s.serviceId] === selectedSubCategory));
    }
    setFilteredBundles(r);
  }, [selectedCategory, selectedSubCategory, bundles, subCategories, allServices]);

  /* ── UPDATE STATS ── */
  useEffect(() => {
    setServiceStats(prev => ({
      ...prev,
      total: totalServices,
      filtered: viewMode === "services" ? filteredServices.length : filteredBundles.length,
    }));
  }, [totalServices, filteredServices.length, filteredBundles.length, viewMode]);

  /* ── HANDLE PAGE CHANGE ── */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchServices(newPage, itemsPerPage, debouncedSearch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── HANDLE ITEMS PER PAGE ── */
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchServices(1, newLimit, debouncedSearch);
  };

  /* ── HANDLE CATEGORY CHANGE (resets page) ── */
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubCategory("all");
    setCurrentPage(1);
    // Ensure full service list is loaded for cross-page filtering
    if (catId !== "all") fetchAllServices();
  };

  const openService = async (serviceId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/service/${serviceId}`);
      setSelectedService(res.data.service);
      setSelectedBundle(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openBundle = async (bundleId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/bundle/${bundleId}/details`);
      setSelectedBundle(res.data.bundle);
      setSelectedService(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedService && !selectedBundle) { setPaymentError("No service or bundle selected"); return; }
    if (!userId) { setPaymentError("User information missing"); return; }

    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      const payload = { userId };
      if (selectedService) payload.serviceId = selectedService.serviceId;
      else if (selectedBundle) payload.bundleId = selectedBundle.bundleId;

      const response = await axiosInstance.post("/buy/service", payload);

      if (!response.data.paymentRequired) {
        setPurchasedItem(selectedService || selectedBundle);
        setSuccessMessage(`${selectedService ? "Service" : "Bundle"} activated successfully!`);
        setShowSuccessPopup(true);
        setShowPaymentPopup(false);
        setShowBundlePaymentPopup(false);
        setTimeout(() => { setShowSuccessPopup(false); navigate("/my-services"); }, 2000);
        return;
      }

      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: "INR",
        order_id: response.data.orderId,
        handler: (res) => {
          if (res.razorpay_payment_id && res.razorpay_order_id && res.razorpay_signature) {
            setPaymentData(response.data);
            setPaymentSuccess(true);
            setPurchasedItem(selectedService || selectedBundle);
            setSuccessMessage(`Payment successful! Your ${selectedService ? "service" : "bundle"} has been purchased.`);
            setShowSuccessPopup(true);
            setTimeout(() => {
              setShowPaymentPopup(false);
              setShowBundlePaymentPopup(false);
              setPaymentSuccess(false);
              setPaymentData(null);
              setSelectedService(null);
              setSelectedBundle(null);
              setShowSuccessPopup(false);
              navigate("/my-services");
            }, 3000);
          }
        },
        prefill: {
          name: selectedService?.name || selectedBundle?.name || "Customer",
          email: "customer@example.com",
          contact: "+919876543210",
        },
        theme: { color: "#6869AC" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setPaymentError(e.response?.data?.message || e.message || "Failed to process payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Helper functions
  const getCategoryName = (id) => categories.find(c => c.categoryId === id)?.categoryName || "Uncategorized";
  const getSubCategoryName = (id) => subCategories.find(s => s.subCategoryId === id)?.subCategoryName || "Uncategorized";
  const formatPrice = (p) => parseInt(p || 0).toLocaleString("en-IN");
  const getCategorySubCategories = (catId) => subCategories.filter(s => s.categoryId === catId);

  const formatImageUrl = (url, name) => {
    if (!url) return `https://via.placeholder.com/1024x512/6869AC/ffffff?text=${encodeURIComponent(name?.substring(0, 20) || "Service")}`;
    if (url.includes("via.placeholder.com")) return url.replace(/\d+x\d+/, "1024x512");
    return url;
  };

  const getBundleImage = (bundle) =>
    bundle.photoUrl
      ? bundle.photoUrl
      : bundle.services?.length > 0
      ? formatImageUrl(bundle.services[0].photoUrl, bundle.name)
      : `https://via.placeholder.com/1024x512/4c4d80/ffffff?text=${encodeURIComponent(bundle.name?.substring(0, 20) || "Bundle")}`;

  const calculateBundleSavings = (bundle) => {
    const total = bundle.services?.reduce((s, sv) => s + parseInt(sv.offerPrice || 0), 0) || 0;
    return total - bundle.bundleOfferPrice;
  };

  /* ── ATOMS ── */
  const ServiceTypeBadge = ({ type }) => {
    const cfg = {
      ONE_TIME: { label: "One Time", cls: "bg-primary-50 text-primary border border-primary-200" },
      RECURRING: { label: "Recurring", cls: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
    };
    const { label, cls } = cfg[type] || { label: type, cls: "bg-gray-100 text-gray-700 border border-gray-200" };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${cls}`}>{label}</span>;
  };

  const BundleBadge = () => (
    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 border border-primary-200">
      <Package size={12} className="inline mr-1" />Bundle
    </span>
  );

  /* ── SEARCH STATUS INDICATOR ── */
  const isSearching = paginationLoading || bundlesLoading;
  const hasActiveSearch = debouncedSearch.length > 0;
  const isFiltered = selectedCategory !== "all" || selectedSubCategory !== "all";

  return (
    <div className="min-h-screen" style={{ background: "var(--neutral-50)" }}>

      {/* ── SUCCESS POPUP ── */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="text-white" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{paymentSuccess ? "Payment Successful!" : "Success!"}</h3>
              <p className="text-gray-500 mb-4">{successMessage}</p>
              {purchasedItem && (
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 text-left">
                  <p className="text-xs text-primary-600 font-semibold mb-1">PURCHASED ITEM</p>
                  <p className="font-bold text-gray-900">{purchasedItem.name}</p>
                  {purchasedItem.serviceId && <p className="text-xs text-gray-400 mt-1">Service ID: {purchasedItem.serviceId.substring(0, 12)}...</p>}
                  {purchasedItem.bundleId && <p className="text-xs text-gray-400 mt-1">Bundle ID: {purchasedItem.bundleId.substring(0, 12)}...</p>}
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-primary-600">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Redirecting to My Services...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT POPUP ── */}
      {(showPaymentPopup || showBundlePaymentPopup) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden" style={{ boxShadow: "var(--shadow-2xl)" }}>
            <div className="border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">{selectedService ? "Confirm Payment" : "Confirm Bundle Payment"}</h3>
              <button
                onClick={() => { setShowPaymentPopup(false); setShowBundlePaymentPopup(false); setPaymentError(null); setPaymentSuccess(false); }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                disabled={isProcessingPayment}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {paymentSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-emerald-600" size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h4>
                  <p className="text-gray-500 text-sm mb-4">Your purchase has been processed successfully.</p>
                  {paymentData?.orderId && (
                    <div className="bg-primary-50 border border-primary-100 p-3 rounded-xl mb-4">
                      <p className="text-xs text-primary-600">Order ID</p>
                      <p className="font-mono text-sm font-bold text-primary-800">{paymentData.orderId}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">Redirecting to My Services in 3 seconds…</p>
                </div>
              ) : (
                <>
                  {selectedService && (
                    <div className="mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary-50 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={formatImageUrl(selectedService.photoUrl, selectedService.name)} alt={selectedService.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{selectedService.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{getSubCategoryName(selectedService.subCategoryId)}</p>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-gray-100 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Service Price</span>
                          <span className="font-medium">₹{formatPrice(selectedService.offerPrice)}</span>
                        </div>
                        {selectedService.isGstApplicable === "true" && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">GST ({selectedService.gstPercentage}%)</span>
                            <span>₹{formatPrice((selectedService.offerPrice * selectedService.gstPercentage) / 100)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                          <span>Total</span>
                          <span className="text-primary">₹{formatPrice(selectedService.finalIndividualPrice)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBundle && (
                    <div className="mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="text-primary" size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{selectedBundle.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{selectedBundle.services?.length || 0} services included</p>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-gray-100 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Bundle Price</span>
                          <span className="font-medium">₹{formatPrice(selectedBundle.bundleOfferPrice)}</span>
                        </div>
                        {selectedBundle.isGstApplicable && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">GST ({selectedBundle.gstPercentage}%)</span>
                            <span>₹{formatPrice((selectedBundle.bundleOfferPrice * selectedBundle.gstPercentage) / 100)}</span>
                          </div>
                        )}
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Individual Total</span>
                            <span className="line-through text-gray-400">₹{formatPrice(selectedBundle.bundlePrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-emerald-700 mt-1">
                            <span>You Save</span>
                            <span>₹{formatPrice(selectedBundle.bundlePrice - selectedBundle.bundleOfferPrice)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                          <span>Total</span>
                          <span className="text-primary">₹{formatPrice(selectedBundle.finalBundlePrice)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-5 p-3 bg-primary-50 border border-primary-100 rounded-xl">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">User ID</span>
                      <span className="font-mono text-primary-700">{userId?.substring(0, 12)}…</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{selectedService ? "Service" : "Bundle"} ID</span>
                      <span className="font-mono text-primary-700">{(selectedService?.serviceId || selectedBundle?.bundleId)?.substring(0, 12)}…</span>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <p className="text-sm text-rose-600">{paymentError}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowPaymentPopup(false); setShowBundlePaymentPopup(false); }}
                      disabled={isProcessingPayment}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <><Loader2 size={16} className="animate-spin" />Processing…</>
                      ) : (
                        `Pay ₹${formatPrice(selectedService?.finalIndividualPrice || selectedBundle?.finalBundlePrice || 0)}`
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                    <Shield size={11} /> Secure payment · 256-bit SSL encryption
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="Our Services"
        subtitle="Browse our curated list of professional services and bundles"
      />

      {/* ── FILTERS ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-end mb-4 gap-3">
            <div className="lg:w-2/3 flex flex-col lg:flex-row lg:items-end gap-3">
              {/* ── SEARCH INPUT with live backend indicator ── */}
              <div className="relative flex-1">
                {isSearching && hasActiveSearch ? (
                  <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary animate-spin" size={18} />
                ) : (
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                )}
                <input
                  type="text"
                  placeholder={`Search ${viewMode === "services" ? "services" : "bundles"} by name or description…`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 border border-gray-200 text-sm rounded-xl outline-none focus:border-primary transition-colors"
                />
                {/* Clear button */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {/* Count badge */}
              <div className="flex-shrink-0 text-sm text-gray-500 bg-primary-50 border border-primary-100 px-4 py-2.5 rounded-xl whitespace-nowrap">
                {hasActiveSearch || isFiltered ? (
                  <>
                    Found <span className="font-bold text-primary">
                      {viewMode === "services"
                        ? (isFiltered ? filteredServices.length : totalServices)
                        : filteredBundles.length}
                    </span> results
                    {hasActiveSearch && <span className="text-primary-400"> for "{debouncedSearch}"</span>}
                  </>
                ) : (
                  <>
                    Showing <span className="font-bold text-primary">
                      {viewMode === "services" ? totalServices : serviceStats.bundles}
                    </span> total
                  </>
                )}
              </div>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex bg-primary-50 border border-primary-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("services")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "services" ? "bg-primary text-white shadow-sm" : "text-primary hover:bg-primary-100"
                }`}
              >
                Services ({totalServices})
              </button>
              <button
                onClick={() => setViewMode("bundles")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "bundles" ? "bg-primary text-white shadow-sm" : "text-primary hover:bg-primary-100"
                }`}
              >
                <Package size={14} /> Bundles ({serviceStats.bundles})
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                selectedCategory === "all"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:text-primary"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.categoryId}
                onClick={() => handleCategoryChange(cat.categoryId)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  selectedCategory === cat.categoryId
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:text-primary"
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* Subcategories */}
          {selectedCategory !== "all" && getCategorySubCategories(selectedCategory).length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subcategories</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubCategory("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    selectedSubCategory === "all"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-500 border-gray-200 hover:border-primary-200 hover:text-primary"
                  }`}
                >
                  All
                </button>
                {getCategorySubCategories(selectedCategory).map(sub => (
                  <button
                    key={sub.subCategoryId}
                    onClick={() => setSelectedSubCategory(sub.subCategoryId)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      selectedSubCategory === sub.subCategoryId
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-500 border-gray-200 hover:border-primary-200 hover:text-primary"
                    }`}
                  >
                    {sub.subCategoryName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {viewMode === "services" ? (
          paginationLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-400">
                  {hasActiveSearch ? `Searching for "${debouncedSearch}"…` : "Loading services..."}
                </p>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary-300" size={26} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No services found</h3>
              <p className="text-sm text-gray-500">
                {hasActiveSearch
                  ? `No results for "${debouncedSearch}". Try different keywords.`
                  : "Try adjusting your filters."}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedSubCategory("all"); }}
                className="mt-5 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover text-sm transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <div
                    key={service.serviceId}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-200 group cursor-pointer flex flex-col h-full"
                    style={{ boxShadow: "var(--shadow-sm)" }}
                    onClick={() => openService(service.serviceId)}
                  >
                    <div className="relative w-full overflow-hidden bg-gray-100">
                      <img
                        src={formatImageUrl(service.photoUrl, service.name)}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="1024"
                        onError={e => { e.target.src = `https://via.placeholder.com/1024x512/6869AC/ffffff?text=${encodeURIComponent(service.name.substring(0, 20))}`; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <ServiceTypeBadge type={service.serviceType} />
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 mb-1">{service.name}</h3>
                        <p className="text-xs text-gray-400 mb-3">
                          {getCategoryName(subCategories.find(s => s.subCategoryId === service.subCategoryId)?.categoryId)} · {getSubCategoryName(service.subCategoryId)}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{service.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                          {service.duration && (
                            <span className="flex items-center gap-1"><Clock size={12} />{service.duration} {service.durationUnit?.toLowerCase()}</span>
                          )}
                          {service.frequency && (
                            <span className="flex items-center gap-1"><Calendar size={12} />{service.frequency}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-gray-900">₹{formatPrice(service.offerPrice)}</span>
                            {service.individualPrice !== service.offerPrice && (
                              <span className="text-sm text-gray-400 line-through">₹{formatPrice(service.individualPrice)}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">+ Taxes applicable</p>
                        </div>
                        <button
                          className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                          onClick={e => { e.stopPropagation(); openService(service.serviceId); }}
                        >
                          View <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls — hidden when category/subcategory filter is active */}
              {!isFiltered && totalPages > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                    >
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                      <option value={24}>24</option>
                    </select>
                    <span>per page</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border ${
                        currentPage === 1
                          ? "border-gray-100 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 text-primary hover:bg-primary-50 hover:border-primary"
                      } transition-colors`}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? "bg-primary text-white"
                                : "text-gray-500 hover:bg-primary-50 hover:text-primary"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border ${
                        currentPage === totalPages
                          ? "border-gray-100 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 text-primary hover:bg-primary-50 hover:border-primary"
                      } transition-colors`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="text-sm text-gray-400">Page {currentPage} of {totalPages}</div>
                </div>
              )}
            </>
          )
        ) : (
          /* ── BUNDLES VIEW ── */
          bundlesLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-400">
                  {hasActiveSearch ? `Searching bundles for "${debouncedSearch}"…` : "Loading bundles..."}
                </p>
              </div>
            </div>
          ) : filteredBundles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="text-primary-300" size={26} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No bundles found</h3>
              <p className="text-sm text-gray-500">
                {hasActiveSearch
                  ? `No bundles match "${debouncedSearch}". Try different keywords.`
                  : `Try adjusting your filters. ${serviceStats.bundles} bundles available.`}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedSubCategory("all"); }}
                className="mt-5 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover text-sm transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBundles.map(bundle => {
                const savings = calculateBundleSavings(bundle);
                return (
                  <div
                    key={bundle.bundleId}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-200 group cursor-pointer flex flex-col h-full"
                    style={{ boxShadow: "var(--shadow-sm)" }}
                    onClick={() => openBundle(bundle.bundleId)}
                  >
                    <div className="relative w-full overflow-hidden bg-primary-50">
                      <img
                        src={getBundleImage(bundle)}
                        alt={bundle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="1024"
                        onError={e => { e.target.src = `https://via.placeholder.com/1024x512/4c4d80/ffffff?text=${encodeURIComponent(bundle.name.substring(0, 20))}`; }}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <BundleBadge />
                        {savings > 0 && (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Save ₹{formatPrice(savings)}
                          </span>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <Layers size={11} /> {bundle.services?.length || 0} services
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 mb-2">{bundle.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{bundle.description}</p>
                        {bundle.services?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Includes</p>
                            <div className="space-y-1">
                              {bundle.services.slice(0, 3).map((s, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                  <span className="line-clamp-1">{s.name}</span>
                                </div>
                              ))}
                              {bundle.services.length > 3 && (
                                <p className="text-[11px] text-primary-500 pl-3">+{bundle.services.length - 3} more</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-gray-900">₹{formatPrice(bundle.bundleOfferPrice)}</span>
                            <span className="text-sm text-gray-400 line-through">₹{formatPrice(bundle.bundlePrice)}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Bundle price · Taxes applicable</p>
                        </div>
                        <button
                          className="flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                          onClick={e => { e.stopPropagation(); openBundle(bundle.bundleId); }}
                        >
                          View <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ── SERVICE DETAIL DRAWER ── */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white z-50 transform transition-transform duration-300 border-l border-gray-100 ${
          selectedService ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "var(--shadow-drawer)" }}
      >
        {selectedService && (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex items-center gap-2 text-primary font-semibold text-sm hover:bg-primary-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <X size={18} /> Close
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors">
                  <Phone size={14} /> Call Expert
                </button>
              </div>
            </div>

            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-3 text-sm text-gray-400">Loading details…</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  <div>
                    <div className="rounded-xl overflow-hidden border border-gray-100 mb-4">
                      <img
                        src={formatImageUrl(selectedService.photoUrl, selectedService.name)}
                        alt={selectedService.name}
                        className="w-full object-cover"
                        loading="lazy"
                        onError={e => { e.target.src = `https://via.placeholder.com/1024x512/6869AC/ffffff?text=${encodeURIComponent(selectedService.name.substring(0, 20))}`; }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <ServiceTypeBadge type={selectedService.serviceType} />
                      {selectedService.frequency && (
                        <span className="px-2.5 py-1 text-xs font-semibold bg-primary-100 text-primary-700 rounded-full border border-primary-200">
                          {selectedService.frequency}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{selectedService.name}</h2>
                    <p className="text-sm text-gray-400">
                      {getCategoryName(subCategories.find(s => s.subCategoryId === selectedService.subCategoryId)?.categoryId)} · {getSubCategoryName(selectedService.subCategoryId)}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-primary-200" style={{ background: "var(--primary-50)" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-gray-900">₹{formatPrice(selectedService.offerPrice)}</span>
                          <span className="text-gray-400 text-sm">+ Tax</span>
                        </div>
                        {selectedService.individualPrice !== selectedService.offerPrice && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 line-through text-sm">₹{formatPrice(selectedService.individualPrice)}</span>
                            <span className="text-xs font-bold text-emerald-600">Save ₹{formatPrice(selectedService.individualPrice - selectedService.offerPrice)}</span>
                          </div>
                        )}
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs text-gray-500">Final Price</p>
                        <p className="text-xl font-extrabold text-primary">₹{formatPrice(selectedService.finalIndividualPrice)}</p>
                        <p className="text-[10px] text-gray-400">incl. GST {selectedService.gstPercentage}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2"><FileText size={16} className="text-primary" /> Overview</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{selectedService.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Service Type", val: selectedService.serviceType.replace("_", " ") },
                      selectedService.duration && { label: "Duration", val: `${selectedService.duration} ${selectedService.durationUnit?.toLowerCase()}` },
                      { label: "GST", val: selectedService.isGstApplicable === "true" ? `Yes (${selectedService.gstPercentage}%)` : "No" },
                      { label: "Documents", val: selectedService.documentsRequired === "true" ? "Required" : "Not Required" },
                    ].filter(Boolean).map(({ label, val }) => (
                      <div key={label} className="p-3 bg-primary-50 border border-primary-100 rounded-xl">
                        <p className="text-[10px] text-primary-500 font-semibold mb-0.5">{label}</p>
                        <p className="text-sm font-bold text-gray-900">{val}</p>
                      </div>
                    ))}
                  </div>

                  {selectedService.inputFields?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><Shield size={16} className="text-primary" /> Required Information</h3>
                      <div className="space-y-2">
                        {selectedService.inputFields.map(field => (
                          <div key={field.fieldId} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-800">
                              {field.label}{field.required && <span className="text-rose-500 ml-1">*</span>}
                            </span>
                            <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{field.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedService.trackSteps?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><CheckCircle size={16} className="text-primary" /> How It Works</h3>
                      <div className="space-y-3">
                        {[...selectedService.trackSteps].sort((a, b) => a.order - b.order).map(step => (
                          <div key={step.stepId} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {step.order}
                            </div>
                            <div className="p-3 bg-primary-50 border border-primary-100 rounded-xl flex-1">
                              <p className="font-semibold text-sm text-gray-900">{step.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="sticky bottom-0 pt-4 bg-white border-t border-gray-100 -mx-6 px-6 pb-6">
                    <button
                      onClick={() => setShowPaymentPopup(true)}
                      className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-base hover:bg-primary-hover transition-colors"
                    >
                      Proceed to Pay ₹{formatPrice(selectedService.finalIndividualPrice)}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-3">
                      <span className="flex items-center gap-1"><BadgeCheck size={11} className="text-emerald-500" /> Secure</span>
                      <span>100% Satisfaction</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── BUNDLE DETAIL DRAWER ── */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white z-50 transform transition-transform duration-300 border-l border-gray-100 ${
          selectedBundle ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "var(--shadow-drawer)" }}
      >
        {selectedBundle && (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSelectedBundle(null)}
                  className="flex items-center gap-2 text-primary font-semibold text-sm hover:bg-primary-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <X size={18} /> Close
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors">
                  <Phone size={14} /> Call Expert
                </button>
              </div>
            </div>

            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  <div>
                    <div className="rounded-xl overflow-hidden border border-primary-100 mb-4">
                      <img
                        src={getBundleImage(selectedBundle)}
                        alt={selectedBundle.name}
                        className="w-full object-cover"
                        loading="lazy"
                        onError={e => { e.target.src = `https://via.placeholder.com/1024x512/4c4d80/ffffff?text=${encodeURIComponent(selectedBundle.name.substring(0, 20))}`; }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <BundleBadge />
                      {calculateBundleSavings(selectedBundle) > 0 && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Save ₹{formatPrice(calculateBundleSavings(selectedBundle))}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{selectedBundle.name}</h2>
                    <p className="text-sm text-gray-400">{selectedBundle.services?.length || 0} services included</p>
                  </div>

                  <div className="p-5 rounded-2xl border border-primary-200" style={{ background: "var(--primary-50)" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bundle Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-gray-900">₹{formatPrice(selectedBundle.bundleOfferPrice)}</span>
                          <span className="text-gray-400 text-sm">+ Tax</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-400 line-through text-sm">₹{formatPrice(selectedBundle.bundlePrice)}</span>
                          <span className="text-xs font-bold text-emerald-600">Save ₹{formatPrice(selectedBundle.bundlePrice - selectedBundle.bundleOfferPrice)}</span>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs text-gray-500">Final Price</p>
                        <p className="text-xl font-extrabold text-primary">₹{formatPrice(selectedBundle.finalBundlePrice)}</p>
                        <p className="text-[10px] text-gray-400">incl. GST {selectedBundle.gstPercentage}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2"><FileText size={16} className="text-primary" /> Overview</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{selectedBundle.description}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <CheckCircle size={16} className="text-emerald-500" /> Included Services ({selectedBundle.services?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {selectedBundle.services?.map((svc, i) => (
                        <div key={i} className="p-3 bg-primary-50 border border-primary-100 rounded-xl flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-primary-200 overflow-hidden flex-shrink-0">
                            <img src={formatImageUrl(svc.photoUrl, svc.name)} alt={svc.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900">{svc.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{svc.description}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <ServiceTypeBadge type={svc.serviceType} />
                              <span className="text-xs font-bold text-primary">₹{formatPrice(svc.offerPrice)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-primary-50 border border-primary-200 rounded-2xl">
                    <h4 className="font-bold text-primary-800 mb-3 flex items-center gap-2"><Star size={15} /> Bundle Benefits</h4>
                    <ul className="space-y-2">
                      {[
                        "Save money with bundled pricing",
                        "Single application for multiple services",
                        "Unified support and tracking",
                        "Streamlined documentation process",
                      ].map(b => (
                        <li key={b} className="flex items-start gap-2 text-sm text-primary-700">
                          <CheckCircle size={13} className="text-primary mt-0.5 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sticky bottom-0 pt-4 bg-white border-t border-gray-100 -mx-6 px-6 pb-6">
                    <button
                      onClick={() => setShowBundlePaymentPopup(true)}
                      className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-base hover:bg-primary-hover transition-colors"
                    >
                      Buy Bundle — ₹{formatPrice(selectedBundle.finalBundlePrice)}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-3">
                      <span className="flex items-center gap-1">
                        <BadgeCheck size={11} className="text-emerald-500" /> Save ₹{formatPrice(calculateBundleSavings(selectedBundle))}
                      </span>
                      <span>Single Payment</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}