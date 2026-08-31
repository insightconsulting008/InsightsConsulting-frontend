import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@src/providers/api";

/* ── Delete Confirm Popup ───────────────────────────────────── */
const DeleteConfirmPopup = ({ isOpen, onClose, onConfirm, blogTitle }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-[90%] max-w-[400px] rounded-2xl shadow-2xl relative">
        <div className="px-4 py-3 md:py-4 rounded-t-2xl bg-[var(--color-primary)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-base md:text-lg text-white">Delete Blog</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 md:p-2 shadow-md transition-colors z-10"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-[var(--primary-50)] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Delete Blog?</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">"{blogTitle}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Success Popup ──────────────────────────────────────────── */
const SuccessPopup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-[90%] max-w-[360px] md:max-w-[400px] rounded-2xl shadow-2xl relative">
        <div className="px-4 py-3 md:py-4 rounded-t-2xl bg-green-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-base md:text-lg text-white">Success!</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 md:p-2 shadow-md transition-colors z-10"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Blog Deleted!</h2>
          <p className="text-sm md:text-base text-gray-600">{message || "Blog post has been successfully deleted."}</p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN — Admin Blog List
══════════════════════════════════════════════════════════════ */
export default function AdminBlogList() {
  const [allBlogs, setAllBlogs]     = useState([]);
  const [activeTab, setActiveTab]   = useState("public");
  const [loading, setLoading]       = useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete]           = useState(null);
  const [showSuccess, setShowSuccess]             = useState(false);
  const [successMessage, setSuccessMessage]       = useState("");

  const [currentPage, setCurrentPage] = useState({ public: 1, draft: 1 });
  const [totalPages, setTotalPages]   = useState({ public: 1, draft: 1 });
  const [totalCount, setTotalCount]   = useState({ public: 0, draft: 0 });

  const navigate = useNavigate();

  
 const fetchByType = async (type, page) => {
  try {
    const res = await api.get("/blogs", {
      params: {
        type,
        page,
        limit: 8,
      },
    });

    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pub, dft] = await Promise.all([
        fetchByType("public", currentPage.public),
        fetchByType("draft",  currentPage.draft),
      ]);
      if (pub) { setTotalPages((p) => ({ ...p, public: pub.totalPages })); setTotalCount((p) => ({ ...p, public: pub.total })); }
      if (dft) { setTotalPages((p) => ({ ...p, draft:  dft.totalPages })); setTotalCount((p) => ({ ...p, draft:  dft.total  })); }
      setAllBlogs([...(pub?.data || []), ...(dft?.data || [])]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchTabData = async (page) => {
    setLoading(true);
    try {
      const data = await fetchByType(activeTab, page);
      if (data) {
        setTotalPages((p) => ({ ...p, [activeTab]: data.totalPages }));
        setTotalCount((p) => ({ ...p, [activeTab]: data.total }));
        setAllBlogs((prev) => {
          const others = prev.filter((b) => (activeTab === "public" ? !b.published : b.published));
          return [...(data.data || []), ...others];
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Mount-only fetch: fetchAll is redefined each render, so listing it as a
  // dependency would refetch on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, []);

  const filteredBlogs = allBlogs.filter((b) =>
    activeTab === "public" ? b.published === true : b.published === false
  );

  const handleDeleteClick   = (blog) => { setBlogToDelete(blog); setShowDeleteConfirm(true); };
 const handleDeleteConfirm = async () => {
  if (!blogToDelete?.blogId) return;

  try {
    await api.delete(`/blogs/${blogToDelete.blogId}`);

    setAllBlogs((p) => p.filter((b) => b.blogId !== blogToDelete.blogId));

    const bType = blogToDelete.published ? "public" : "draft";

    setTotalCount((p) => ({ ...p, [bType]: p[bType] - 1 }));

    if (filteredBlogs.length === 1 && currentPage[activeTab] > 1) {
      const pg = currentPage[activeTab] - 1;
      setCurrentPage((p) => ({ ...p, [activeTab]: pg }));
      fetchTabData(pg);
    } else if (filteredBlogs.length === 1) {
      fetchTabData(1);
    }

    setShowDeleteConfirm(false);
    setSuccessMessage(`"${blogToDelete.title}" has been deleted successfully`);
    setShowSuccess(true);
    setBlogToDelete(null);
  } catch (e) {
    console.error(e);
    alert("Delete failed");
  }
};

  const handleTabChange  = (tab) => {
    setActiveTab(tab);
    if (currentPage[tab] !== 1) { setCurrentPage((p) => ({ ...p, [tab]: 1 })); fetchTabData(1); }
  };
  const handlePageChange = (pg) => {
    if (pg < 1 || pg > totalPages[activeTab]) return;
    setCurrentPage((p) => ({ ...p, [activeTab]: pg }));
    fetchTabData(pg);
  };

  /* Pagination */
  const PaginationControls = () => {
    const cur   = currentPage[activeTab];
    const total = totalPages[activeTab];
    if (total <= 1) return null;

    const getPages = () => {
      const pages = [];
      if (total <= 5) { for (let i = 1; i <= total; i++) pages.push(i); }
      else if (cur <= 3) { for (let i = 1; i <= 4; i++) pages.push(i); pages.push("…"); pages.push(total); }
      else if (cur >= total - 2) { pages.push(1); pages.push("…"); for (let i = total - 3; i <= total; i++) pages.push(i); }
      else { pages.push(1); pages.push("…"); for (let i = cur - 1; i <= cur + 1; i++) pages.push(i); pages.push("…"); pages.push(total); }
      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8 mb-2">
        <button
          onClick={() => handlePageChange(cur - 1)} disabled={cur === 1}
          className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${cur === 1 ? "bg-[var(--neutral-100)] text-gray-400 cursor-not-allowed" : "bg-white border border-[var(--neutral-200)] text-gray-700 hover:bg-[var(--neutral-50)]"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        {getPages().map((pg, i) => (
          <button
            key={i} onClick={() => typeof pg === "number" && handlePageChange(pg)} disabled={pg === "…"}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              cur === pg
                ? "text-white bg-[var(--color-primary)]"
                : pg === "…" ? "cursor-default text-gray-400"
                : "bg-white border border-[var(--neutral-200)] text-gray-700 hover:bg-[var(--neutral-50)]"
            }`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(cur + 1)} disabled={cur === total}
          className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${cur === total ? "bg-[var(--neutral-100)] text-gray-400 cursor-not-allowed" : "bg-white border border-[var(--neutral-200)] text-gray-700 hover:bg-[var(--neutral-50)]"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    );
  };

  /* Loading — initial */
  if (loading && allBlogs.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[100vh] gap-4 bg-[var(--neutral-50)]">
          <div className="w-12 h-12 border-4 border-[var(--neutral-200)] rounded-full animate-spin" style={{ borderTopColor: "var(--color-primary)" }} />
          <p className="text-gray-500 text-sm">Loading blogs…</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Admin Page Header ── */}
   

      <div className=" min-h-screen px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage your published posts and drafts</p>
            </div>
            <button
              onClick={() => navigate("/blogs/add-blogs")}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </button>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            {[
              {
                label: "Total Posts",
                value: totalCount.public + totalCount.draft,
                valueClass: "text-gray-900",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
                iconBg: "bg-[var(--primary-50)]",
                iconColor: "text-[var(--color-primary)]",
              },
              {
                label: "Published",
                value: totalCount.public,
                valueClass: "text-green-600",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                iconBg: "bg-green-50",
                iconColor: "text-green-600",
              },
              {
                label: "Drafts",
                value: totalCount.draft,
                valueClass: "text-yellow-600",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                iconBg: "bg-yellow-50",
                iconColor: "text-yellow-600",
              },
            ].map(({ label, value, valueClass, valueStyle, icon, iconBg, iconColor }) => (
              <div key={label} className="bg-white rounded-xl border border-[var(--neutral-200)] p-3 md:p-5 shadow-sm flex items-center gap-3 md:gap-4 min-w-0">
                <div className={`flex w-10 h-10 md:w-12 md:h-12 rounded-xl flex-shrink-0 items-center justify-center ${iconBg} ${iconColor}`}>
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className={`text-2xl md:text-3xl font-bold leading-none mb-1 ${valueClass || ""}`} style={valueStyle}>{value}</p>
                  <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="mb-6 border-b border-[var(--neutral-200)]">
            <nav className="flex gap-1">
              {[
                { key: "public", label: "Published", count: totalCount.public },
                { key: "draft",  label: "Drafts",    count: totalCount.draft  },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${
                    activeTab === key
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  {label}
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    activeTab === key
                      ? "bg-[var(--primary-100)] text-[var(--color-primary)]"
                      : "bg-[var(--neutral-100)] text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Loading — page change */}
          {loading && filteredBlogs.length > 0 && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[var(--neutral-200)] rounded-full animate-spin" style={{ borderTopColor: "var(--color-primary)" }} />
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredBlogs.length === 0 && (
            <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--neutral-100)] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {activeTab === "public" ? "Published" : "Draft"} Posts
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                {activeTab === "public"
                  ? "Publish your drafts to make them visible to readers."
                  : "Save a blog as draft to review it before publishing."}
              </p>
              <button
                onClick={() => navigate("/blogs/add-blogs")}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Blog
              </button>
            </div>
          )}

          {/* ── Blog Grid ── */}
          {!loading && filteredBlogs.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.blogId}
                    className="group bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden bg-[var(--neutral-100)]">
                      <img
                        src={blog.thumbnail || "https://placehold.co/400x267/f1f1f5/9ca3af?text=No+Image"}
                        alt={blog.title}
                        className="w-full aspect-[3/2] object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        onError={(e) => { e.target.src = "https://placehold.co/400x267/f1f1f5/9ca3af?text=No+Image"; }}
                      />
                      {/* Status badge */}
                      <span className={`absolute top-2.5 right-2.5 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        blog.published ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {blog.published ? "Live" : "Draft"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <h2 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                        {blog.title}
                      </h2>

                      {blog.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">{blog.description}</p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap mt-auto">
                        {blog.author && (
                          <span className="flex items-center gap-1.5 min-w-0">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="truncate">{blog.author}</span>
                          </span>
                        )}
                        {blog.createdAt && (
                          <span className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--neutral-200)]">
                        <button
                          onClick={() => navigate(`/view-blogs/${blog.slug}`)}
                          className="text-sm font-semibold py-2.5 rounded-lg transition-colors bg-[var(--primary-50)] hover:bg-[var(--primary-100)] text-[var(--color-primary)]"
                        >
                          Edit / View
                        </button>
                        <button
                          onClick={() => handleDeleteClick(blog)}
                          className="text-sm font-semibold py-2.5 rounded-lg transition-colors bg-[var(--neutral-100)] hover:bg-red-50 text-gray-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <PaginationControls />
            </>
          )}

        </div>
      </div>

      {/* Popups */}
      {showDeleteConfirm && blogToDelete && (
        <DeleteConfirmPopup
          isOpen={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setBlogToDelete(null); }}
          onConfirm={handleDeleteConfirm}
          blogTitle={blogToDelete.title}
        />
      )}
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => { setShowSuccess(false); setSuccessMessage(""); }}
        message={successMessage}
      />
    </>
  );
}
