import React, { useEffect, useState, useCallback } from "react";
import { FiSearch, FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Footerctn from "./reusable/Footerctn";

// Skeleton Card Component
const BlogCardSkeleton = () => (
  <div className="bg-white shadow-md p-4 overflow-hidden">
    <div className="h-56 w-full bg-gray-200 animate-pulse rounded" />
    <div className="p-5">
      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2" />
      <div className="flex items-start justify-between gap-2 mt-2">
        <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full flex-shrink-0" />
      </div>
      <div className="space-y-2 mt-2">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="flex items-center gap-3 mt-5">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  </div>
);

const BASE_URL = "https://insightsconsult-backend.onrender.com/blogs";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = useCallback((query = "") => {
    setLoading(true);
    setError(null);

    const url = query
      ? `${BASE_URL}?page=1&limit=10&search=${encodeURIComponent(query)}`
      : `${BASE_URL}?page=1&limit=10`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        setBlogs(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  }, []);

  // Initial load
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Debounced search — fires 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchBlogs]);

  return (
    <section className="relative overflow-hidden">
      {/* Heading */}
      <div className="bg-[#FFFBEC] px-4 relative">
        <div className="text-center py-16 space-y-6 mb-12 relative z-10">
          <span className="text-xs bg-[#FFFBEC] text-red px-3 py-1 rounded-full">
            Our blog
          </span>

          <h2 className="text-3xl lg:text-4xl font-bold text-[#42307D] mt-4">
            Resources and insights
          </h2>

          <p className="text-red mt-2">
            The latest industry news, interviews, technologies, and resources.
          </p>

          <div className="flex justify-center mt-6">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg w-72">
              <FiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none ml-2 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 ml-1 text-lg leading-none"
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid Section with Background */}
      <div className="relative mt-10 pb-20">
        <img
          src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Background%20pattern.png"
          alt=""
          className="absolute inset-0 -top-14 w-full h-130 object-cover opacity-100 pointer-events-none"
        />

        <div className="container mx-auto lg:px-12 px-4 relative z-10">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
                <div className="mb-6">
                  <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Failed to Load Blogs</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => fetchBlogs(searchQuery)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
                <div className="mb-6">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchQuery ? "No Results Found" : "No Blogs Found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? `No blog posts matched "${searchQuery}". Try a different search term.`
                    : "There are no blog posts available at the moment. Please check back later."}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={() => fetchBlogs()}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Refresh Page
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog.blogId}
                  className="bg-white shadow-md p-4 overflow-hidden hover:shadow-lg transition cursor-pointer group"
                  onClick={() => navigate(`/resource/${blog.slug}`)}
                >
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-5">
                    <span className="text-xs text-red-500 font-medium">
                      {blog.category || ""}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 mt-2 flex items-start justify-between gap-2">
                      {blog.title}
                      <FiArrowUpRight
                        className="text-gray-500 mt-1 cursor-pointer flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/resource/${blog.slug}`);
                        }}
                      />
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {blog.description || ""}
                    </p>
                    <div className="flex items-center gap-3 mt-5">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {blog.author?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{blog.author}</p>
                        <p className="text-xs text-gray-400">{new Date(blog.createdAt).toDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footerctn/>
    </section>
  );
}