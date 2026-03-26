import React, { useEffect, useState, useMemo } from "react";
import { FaClock, FaTag, FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosInstance from "@src/providers/axiosInstance";

export default function Blogdesc() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isClickScrolling = React.useRef(false);

  // 👉 fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(
          `/blogs/${slug}`
        );
        setBlog(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // 👉 convert content array to HTML string and extract headings
  const parsedContent = useMemo(() => {
    if (!blog?.content || !Array.isArray(blog.content)) return "";

    const sorted = [...blog.content].sort((a, b) => a.order - b.order);
    const list = [];
    let headingIndex = 0;

    const html = sorted
      .map((block) => {
        if (block.type === "heading") {
          const id = `section-${headingIndex}`;
          list.push({ id, text: block.value });
          headingIndex++;
          return `<h1 id="${id}">${block.value}</h1>`;
        } else if (block.type === "paragraph") {
          return `<p>${block.value}</p>`;
        } else if (block.type === "image") {
          return `<img src="${block.url}" alt="blog image" />`;
        }
        return "";
      })
      .join("");

    setHeadings(list);
    return html;
  }, [blog]);

  useEffect(() => {
    if (!headings.length) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return; // 🚫 prevent override

      let current = null;

      for (let i = 0; i < headings.length; i++) {
        const el = document.getElementById(headings[i].id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top <= 160 && rect.bottom >= 160) {
          current = headings[i].id;
          break;
        }
      }

      if (current) {
        setActiveId(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const styleBlogContent = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("h1").forEach((el) => {
      el.className =
        "text-2xl md:text-3xl font-semibold text-gray-900 mt-12 mb-4";
    });

    doc.querySelectorAll("p").forEach((el) => {
      el.className = "text-gray-600 leading-relaxed mb-6 text-[15px]";
    });

    doc.querySelectorAll("img").forEach((el) => {
      el.className = "rounded-2xl my-6 shadow-sm w-full";
    });

    doc.querySelectorAll("blockquote").forEach((el) => {
      el.className =
        "border-l-4 border-red-500 pl-4 italic text-gray-700 my-8";
    });

    doc.querySelectorAll("ul").forEach((el) => {
      el.className = "list-disc pl-6 mb-6 text-gray-600";
    });

    doc.querySelectorAll("li").forEach((el) => {
      el.className = "mb-2";
    });

    return doc.body.innerHTML;
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Hero Section Skeleton */}
        <div className="grid md:grid-cols-2 gap-10 items-center relative">
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-2/3"></div>
            </div>
            
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse mt-4 w-full"></div>
            
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[280px] sm:h-[400px] md:h-[520px] bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>

        {/* Content Section Skeleton */}
        <div className="grid md:grid-cols-4 gap-10 mt-14">
          {/* TOC Skeleton */}
          <aside className="md:col-span-1">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            <div className="space-y-3 border-l pl-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
              ))}
            </div>
            
            {/* Tags Skeleton */}
            <div className="mt-8">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse w-16"></div>
                ))}
              </div>
            </div>
          </aside>

          {/* Blog Body Skeleton */}
          <article className="md:col-span-3">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse w-full"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center">
          <div className="mb-6">
            <svg 
              className="mx-auto h-24 w-24 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No Data State (if blog is null but no error)
  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center">
          <div className="mb-6">
            <svg 
              className="mx-auto h-24 w-24 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Blog Post Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/blogs"
            className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Blogs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* HERO */}
      <div className="grid md:grid-cols-2 gap-10 items-center relative">
        <div className="relative">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs">
              {blog.category || ""}
            </span>
            {blog.readTime && (
              <span className="flex items-center gap-1">
                <FaClock /> {blog.readTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
            {blog.title}
          </h1>

          <p className="text-gray-500 mt-4 text-base sm:text-lg">{blog.description || ""}</p>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <FaUser />
            </div>
            <div>
              <p className="font-semibold">{blog.author}</p>
              <p className="text-sm text-gray-500">
                Published {new Date(blog.createdAt).toDateString()}
              </p>
            </div>
          </div>

          {/* Arrow — hidden on mobile, shown on md+ */}
          <img
            src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Hand-drawn%20arrow.png"
            alt="arrow"
            className="hidden lg:block absolute -bottom-30 -right-35 w-60 z-10 pointer-events-none"
          />
        </div>

        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-[280px] sm:h-[400px] md:h-[520px] object-cover rounded-2xl shadow"
        />
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-4 gap-10 mt-14">
        {/* TOC — collapsible on mobile */}
        <aside className="md:col-span-1 md:sticky md:top-35 md:h-fit">
          <h3 className="text-red-500 text-xl font-semibold mb-4">
            Table of contents
          </h3>

          <ul className="space-y-3 border-l pl-4">
            {headings.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();

                    const el = document.getElementById(item.id);
                    if (!el) return;

                    isClickScrolling.current = true; // 🚀 block scroll override

                    const yOffset = -150;
                    const y =
                      el.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;

                    window.scrollTo({
                      top: y,
                      behavior: "smooth",
                    });

                    // ✅ highlight instantly
                    setActiveId(item.id);

                    // ⏳ allow scroll detection again after animation
                    setTimeout(() => {
                      isClickScrolling.current = false;
                    }, 500);
                  }}
                  className={`transition ${activeId === item.id
                      ? "text-red-500 font-semibold border-l-2 border-red-500 pl-2"
                      : "text-gray-600 hover:text-black"
                    }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>

          {/* TAGS */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8">
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <FaTag /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* BLOG BODY */}
        <article className="md:col-span-3 min-w-0">
          <div
            className="prose max-w-none prose-img:rounded-xl prose-h1:text-2xl"
            dangerouslySetInnerHTML={{ __html: styleBlogContent(parsedContent) }}
          />
        </article>
      </div>
    </div>
  );
}