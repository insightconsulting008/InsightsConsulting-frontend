import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaClock, FaTag, FaUser, FaImage,
  FaArrowUp, FaArrowDown, FaTimes, FaCheck, FaExclamationTriangle,
  FaEye, FaEdit, FaSave, FaArrowLeft, FaSpinner,
  FaHeading, FaParagraph, FaTrash, FaCrop,
} from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import Cropper from "react-easy-crop";

const BASE_URL = "https://insightsconsult-backend.onrender.com";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/* ── Crop Modal ─────────────────────────────────────────────── */
function CropModal({ isOpen, onClose, imageSrc, onCropComplete, aspect = 12 / 8 }) {
  const [crop, setCrop]                     = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                     = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropLoading, setCropLoading]       = useState(false);
  const IMAGE_SIZE = { width: 1000, height: 600 };

  if (!isOpen) return null;

  const onCropCompleteHandler = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", reject);
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
    });

  const getCroppedImg = async (src, pixelCrop) => {
    const image  = await createImage(src);
    const canvas = document.createElement("canvas");
    const ctx    = canvas.getContext("2d");
    canvas.width  = IMAGE_SIZE.width;
    canvas.height = IMAGE_SIZE.height;
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, IMAGE_SIZE.width, IMAGE_SIZE.height);
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95));
  };

  const applyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setCropLoading(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: "image/jpeg" });
      onCropComplete(file);
      onClose();
    } catch (e) { console.error("Crop error:", e); }
    finally     { setCropLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Crop Blog Image</h2>
            <button onClick={onClose} disabled={cropLoading} className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">Aspect Ratio: 1200×800px</p>
          <div className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden" style={{ height: "300px" }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
              cropShape="rect"
              showGrid
              objectFit="contain"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom: {Math.round(zoom * 100)}%</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              disabled={cropLoading}
              style={{ accentColor: "var(--color-primary)" }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--primary-100)]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={cropLoading}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={applyCrop}
              disabled={cropLoading}
              className="px-5 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-60 flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
            >
              {cropLoading ? <><FaSpinner className="w-4 h-4 animate-spin" /> Cropping…</> : "Crop & Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Upload Box ─────────────────────────────────────────────── */
function UploadBox({ id, preview, onFileChange, showCropButton = false, onCropClick }) {
  return (
    <div className="relative">
      <div
        onClick={() => document.getElementById(id).click()}
        className="relative bg-white border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden group hover:border-[var(--color-primary)] hover:bg-[var(--primary-50)]"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full">Click to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="w-16 h-16 bg-[var(--primary-50)] rounded-full flex items-center justify-center mb-2">
              <BiImageAdd className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="text-[var(--color-primary)] font-semibold hover:underline">Click to upload</span>
            </p>
            <p className="text-xs text-gray-400">1200×800px or 12:8 ratio · JPG, PNG</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => { const f = e.target.files[0]; if (f) onFileChange(f); }}
        />
      </div>
      {showCropButton && preview && (
        <button
          type="button"
          onClick={onCropClick}
          className="mt-2 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors flex items-center gap-1"
        >
          <FaCrop className="w-3 h-3" /> Crop image
        </button>
      )}
    </div>
  );
}

/* ── Success / Error Popups ─────────────────────────────────── */
const SuccessPopup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-[90%] max-w-[360px] md:max-w-[460px] rounded-2xl shadow-2xl relative">
        <div className="px-4 py-3 md:py-4 rounded-t-2xl bg-[var(--color-primary)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
              <FaCheck className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold text-base md:text-lg text-white">Success!</h3>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 md:p-2 shadow-md transition-colors z-10">
          <FaTimes className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div className="px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-[var(--primary-50)] rounded-full flex items-center justify-center">
            <FaCheck className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Blog Updated!</h2>
          <p className="text-sm md:text-base text-gray-600">{message || "Your blog post has been successfully updated."}</p>
        </div>
      </div>
    </div>
  );
};

const ErrorPopup = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-[90%] max-w-[360px] md:max-w-[460px] rounded-2xl shadow-2xl relative">
        <div className="px-4 py-3 md:py-4 rounded-t-2xl bg-[var(--color-primary)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-semibold text-base md:text-lg text-white">Error</h3>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 md:p-2 shadow-md transition-colors z-10">
          <FaTimes className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div className="px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-[var(--primary-50)] rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Update Failed</h2>
          <p className="text-sm md:text-base text-gray-600">{errorMessage || "An unexpected error occurred."}</p>
        </div>
      </div>
    </div>
  );
};

/* ── Preview Panel ──────────────────────────────────────────── */
function PreviewPanel({ title, author, description, thumbnailPreview, blocks, category, readTime, onBackToEdit }) {
  const [activeId, setActiveId]         = useState(null);
  const isClickScrolling                = useRef(false);

  const headings = useMemo(() => {
    let idx = 0;
    return blocks.filter((b) => b.type === "heading").map((b) => ({ id: `preview-section-${idx++}`, text: b.value }));
  }, [blocks]);

  useEffect(() => {
    if (!headings.length) return;
    const onScroll = () => {
      if (isClickScrolling.current) return;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 160 && r.bottom >= 160) { setActiveId(h.id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  let hIdx = 0;
  const blocksWithIds = blocks.map((b) =>
    b.type === "heading" ? { ...b, _headingId: `preview-section-${hIdx++}` } : b
  );

  return (
    <div className="bg-white">
      {/* Preview bar */}
      <div className="sticky top-[64px] z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <FaEye className="w-3.5 h-3.5" /> Preview Mode
          </span>
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
          >
            <FaEdit className="w-4 h-4" /> Back to Edit
          </button>
        </div>
      </div>

      {/* Blog preview layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Hero ── */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10">
          {/* Left: meta + title + author */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="bg-[var(--primary-100)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-semibold">
                {category || "Preview"}
              </span>
              {readTime && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-[var(--neutral-100)] px-3 py-1 rounded-full">
                  <FaClock className="w-2.5 h-2.5" /> {readTime}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {title || <span className="text-gray-300 italic">No title yet…</span>}
            </h1>
            {description && (
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-6">{description}</p>
            )}
            <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center flex-shrink-0">
                <FaUser className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{author || "—"}</p>
                <p className="text-xs text-gray-400">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>
          </div>

          {/* Right: thumbnail */}
          {thumbnailPreview ? (
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <img src={thumbnailPreview} alt="thumbnail" className="w-full max-h-[380px] object-cover" />
            </div>
          ) : (
            <div className="w-full h-[260px] sm:h-[340px] bg-[var(--neutral-100)] rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 border-2 border-dashed border-[var(--neutral-200)]">
              <FaImage className="w-8 h-8 opacity-40" />
              <p className="text-sm">No thumbnail uploaded</p>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-100 mb-10" />

        {/* ── Content: TOC + Article ── */}
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Table of contents */}
          <aside className="lg:col-span-1 lg:sticky lg:top-[140px] h-fit">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Contents</h3>
            {headings.length > 0 ? (
              <ul className="space-y-2 border-l-2 border-[var(--neutral-200)] pl-4">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(h.id);
                        if (!el) return;
                        isClickScrolling.current = true;
                        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 150, behavior: "smooth" });
                        setActiveId(h.id);
                        setTimeout(() => { isClickScrolling.current = false; }, 500);
                      }}
                      className={`block text-sm py-0.5 transition-all duration-150 ${
                        activeId === h.id
                          ? "text-[var(--color-primary)] font-semibold -ml-[3px] border-l-2 border-[var(--color-primary)] pl-3"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">No headings yet</p>
            )}
          </aside>

          {/* Article body */}
          <article className="lg:col-span-3 min-w-0">
            {blocksWithIds.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm italic">No content blocks yet…</p>
              </div>
            )}
            <div className="space-y-1">
              {blocksWithIds.map((block, i) => {
                if (block.type === "heading")
                  return (
                    <h2 key={i} id={block._headingId} className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-4 leading-tight">
                      {block.value}
                    </h2>
                  );
                if (block.type === "paragraph")
                  return (
                    <p key={i} className="text-gray-600 leading-[1.8] mb-5 text-[15px]">
                      {block.value}
                    </p>
                  );
                if (block.type === "image")
                  return block.preview ? (
                    <div key={i} className="my-8 rounded-xl overflow-hidden shadow-sm border border-[var(--neutral-200)]">
                      <img src={block.preview} alt="" className="w-full object-cover max-h-[500px]" />
                    </div>
                  ) : (
                    <div key={i} className="my-8 rounded-xl bg-[var(--neutral-100)] h-48 flex items-center justify-center text-gray-400 text-sm border border-[var(--neutral-200)]">
                      Image block (no file uploaded)
                    </div>
                  );
                return null;
              })}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN — View / Edit Blog
══════════════════════════════════════════════════════════════ */
export default function ViewEditBlog() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const [mode, setMode]             = useState("view");
  const [blog, setBlog]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup,   setShowErrorPopup]   = useState(false);
  const [errorMessage,     setErrorMessage]     = useState("");

  const [title, setTitle]             = useState("");
  const [author, setAuthor]           = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]       = useState("");
  const [readTime, setReadTime]       = useState("");
  const [published, setPublished]     = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const thumbnailRef  = useRef(null);
  const [blocks, setBlocks]           = useState([]);
  const blockFilesRef = useRef({});
  const blogIdRef     = useRef(null);

  const [showThumbnailCrop, setShowThumbnailCrop] = useState(false);
  const [tempThumbnailFile, setTempThumbnailFile] = useState(null);
  const [showBlockCrop, setShowBlockCrop]         = useState(false);
  const [currentBlockId, setCurrentBlockId]       = useState(null);
  const [tempBlockFile, setTempBlockFile]         = useState(null);

  const populateBlogState = (data) => {
    blogIdRef.current = data._id || data.id || data.blogId || null;
    setBlog(data);
    setTitle(data.title || "");
    setAuthor(data.author || "");
    setDescription(data.description || "");
    setCategory(data.category || "");
    setReadTime(data.readTime || "");
    setPublished(data.published || false);
    setThumbnailPreview(data.thumbnail || null);
    setBlocks(
      (data.content || []).map((item) => ({
        id: generateId(),
        type: item.type === "text" ? "paragraph" : item.type,
        value: item.value || "",
        preview: item.type === "image" ? item.url : null,
      }))
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/blogs/${slug}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        populateBlogState(await res.json());
      } catch (e) { console.error("Fetch error:", e); }
      finally     { setLoading(false); }
    };
    load();
  }, [slug]);

  const handleThumbnail = (file) => { setTempThumbnailFile(file); setShowThumbnailCrop(true); };
  const handleThumbnailCropComplete = (file) => {
    thumbnailRef.current = file;
    if (thumbnailPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(URL.createObjectURL(file));
    setTempThumbnailFile(null);
  };

  const addBlock        = (type) => setBlocks((p) => [...p, { id: generateId(), type, value: "", preview: null }]);
  const updateBlockValue= (id, val) => setBlocks((p) => p.map((b) => (b.id === id ? { ...b, value: val } : b)));
  const updateBlockFile = (id, file) => { setCurrentBlockId(id); setTempBlockFile(file); setShowBlockCrop(true); };
  const handleBlockCropComplete = (file) => {
    blockFilesRef.current[currentBlockId] = file;
    setBlocks((p) => p.map((b) => b.id === currentBlockId ? { ...b, preview: URL.createObjectURL(file) } : b));
    setTempBlockFile(null);
    setCurrentBlockId(null);
  };
  const moveBlock = (idx, dir) => {
    const arr = [...blocks];
    const to  = dir === "up" ? idx - 1 : idx + 1;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    setBlocks(arr);
  };
  const removeBlock = (id) => {
    const b = blocks.find((b) => b.id === id);
    if (b?.preview?.startsWith("blob:")) URL.revokeObjectURL(b.preview);
    delete blockFilesRef.current[id];
    setBlocks((p) => p.filter((b) => b.id !== id));
  };
  const handleCancel = () => { populateBlogState(blog); blockFilesRef.current = {}; thumbnailRef.current = null; setMode("view"); };

  const handleSubmit = async () => {
    if (!blogIdRef.current) { setErrorMessage("Blog ID missing."); setShowErrorPopup(true); return; }
    const form = new FormData();
    form.append("title", title); form.append("author", author);
    form.append("description", description); form.append("category", category);
    form.append("readTime", readTime); form.append("published", String(published));
    if (thumbnailRef.current) form.append("thumbnail", thumbnailRef.current);

    let fileIdx = 0;
    const contentPayload = [];
    blocks.forEach((block, idx) => {
      if (block.type === "image") {
        const file = blockFilesRef.current[block.id];
        if (file instanceof File) { form.append("contentImages", file); contentPayload.push({ type: "image", fileIndex: fileIdx++, order: idx }); }
        else contentPayload.push({ type: "image", url: block.preview, order: idx });
      } else {
        contentPayload.push({ type: block.type === "text" ? "paragraph" : block.type, value: block.value, order: idx });
      }
    });
    form.append("content", JSON.stringify(contentPayload));

    setSaving(true);
    try {
      const putRes = await fetch(`${BASE_URL}/blogs/${blogIdRef.current}`, { method: "PUT", body: form });
      if (!putRes.ok) throw new Error(`PUT failed: HTTP ${putRes.status}`);
      const res = await fetch(`${BASE_URL}/blogs/${slug}`);
      if (!res.ok)    throw new Error(`Re-fetch failed: HTTP ${res.status}`);
      const updated = await res.json();
      blockFilesRef.current = {}; thumbnailRef.current = null;
      populateBlogState(updated);
      setMode("view");
      setShowSuccessPopup(true);
    } catch (e) { setErrorMessage("Update failed: " + e.message); setShowErrorPopup(true); }
    finally      { setSaving(false); }
  };

  const inputClass =
    "w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all text-sm md:text-base";

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[var(--neutral-50)]">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: "var(--color-primary)" }} />
        <p className="text-gray-500 text-sm">Loading blog…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--neutral-50)] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--neutral-200)] p-12 text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Not Found</h3>
          <p className="text-sm text-gray-500 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-colors bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
          >
            <FaArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ── Preview mode ── */
  if (mode === "preview") {
    return (
      <>
        <PreviewPanel
          title={title} author={author} description={description}
          thumbnailPreview={thumbnailPreview} blocks={blocks}
          category={category} readTime={readTime}
          onBackToEdit={() => setMode("edit")}
        />
        {showSuccessPopup && <SuccessPopup isOpen onClose={() => setShowSuccessPopup(false)} message="Blog updated successfully!" />}
        {showErrorPopup   && <ErrorPopup   isOpen onClose={() => { setShowErrorPopup(false); setErrorMessage(""); }} errorMessage={errorMessage} />}
      </>
    );
  }

  /* ── View / Edit mode ── */
  return (
    <>
      <div className="bg-[var(--neutral-50)] min-h-screen">

        {/* ── Sticky top bar ── */}
        <div className="sticky top-0 z-30 bg-white border-b border-[var(--neutral-200)] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => navigate("/manage-blog")}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
            >
              <FaArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Back to Blogs</span>
            </button>

            {/* Mode indicator */}
            <span className={`hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
              mode === "view" ? "bg-[var(--neutral-100)] text-gray-600" : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              {mode === "view" ? "View Mode" : "✏️ Editing"}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              {mode === "view" ? (
                <button
                  onClick={() => setMode("edit")}
                  className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                >
                  <FaEdit className="w-3.5 h-3.5" /> Edit Blog
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setMode("preview")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-[var(--neutral-200)] px-3 py-2 rounded-lg hover:bg-[var(--neutral-50)] transition-colors"
                  >
                    <FaEye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-sm font-medium text-gray-600 border border-[var(--neutral-200)] rounded-lg px-3 py-2 hover:bg-[var(--neutral-50)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all bg-green-500 hover:bg-green-600"
                  >
                    {saving ? (
                      <><FaSpinner className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                    ) : (
                      <><FaSave className="w-3.5 h-3.5" /> <span>Save</span></>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Blog content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

          {/* ════ EDIT MODE — two-column layout ════ */}
          {mode === "edit" && (
            <div className="grid lg:grid-cols-3 gap-5 items-start">

              {/* Left — main content (2/3) */}
              <div className="lg:col-span-2 space-y-5">

                {/* Thumbnail */}
                <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)]">
                    <h3 className="text-sm font-semibold text-gray-800">Thumbnail Image</h3>
                    <p className="text-xs text-gray-500 mt-0.5">1200×800px · JPG or PNG</p>
                  </div>
                  <div className="p-5">
                    <UploadBox
                      id="thumbnailInput" preview={thumbnailPreview}
                      onFileChange={handleThumbnail}
                      showCropButton={!!thumbnailPreview}
                      onCropClick={() => setShowThumbnailCrop(true)}
                    />
                    {thumbnailPreview && (
                      <button
                        type="button"
                        onClick={() => { if (thumbnailPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview); thumbnailRef.current = null; setThumbnailPreview(null); }}
                        className="mt-3 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors flex items-center gap-1"
                      >
                        <FaTimes className="w-3 h-3" /> Remove thumbnail
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)]">
                    <h3 className="text-sm font-semibold text-gray-800">Post Details</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Title <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" rows={3} className={`${inputClass} resize-none`} />
                    </div>
                  </div>
                </div>

                {/* Content Blocks */}
                <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)] flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Content</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{blocks.length} block{blocks.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        { label: "Heading",   type: "heading",   icon: <FaHeading className="w-3 h-3" />   },
                        { label: "Paragraph", type: "paragraph", icon: <FaParagraph className="w-3 h-3" /> },
                        { label: "Image",     type: "image",     icon: <FaImage className="w-3 h-3" />     },
                      ].map(({ label, type, icon }) => (
                        <button
                          key={type} type="button" onClick={() => addBlock(type)}
                          className="inline-flex items-center gap-1.5 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        >
                          {icon} <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    {blocks.length === 0 ? (
                      <div className="text-center py-10 rounded-xl border-2 border-dashed border-[var(--neutral-200)]">
                        <p className="text-sm font-medium text-gray-500">No content blocks yet</p>
                        <p className="text-xs text-gray-400 mt-1">Add headings, paragraphs, or images using the buttons above</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {blocks.map((block, i) => (
                          <div key={block.id} className="flex gap-3 items-start bg-[var(--neutral-50)] rounded-xl p-3.5 border border-[var(--neutral-200)]">
                            {/* Order controls */}
                            <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                              <div className="w-7 h-7 bg-[var(--primary-50)] text-[var(--color-primary)] rounded-lg flex items-center justify-center text-xs font-bold border border-[var(--primary-100)]">
                                {i + 1}
                              </div>
                              {[
                                { fn: () => moveBlock(i, "up"),   Icon: FaArrowUp,   dis: i === 0 },
                                { fn: () => moveBlock(i, "down"), Icon: FaArrowDown, dis: i === blocks.length - 1 },
                              ].map(({ fn, Icon, dis }, j) => (
                                <button
                                  key={j} type="button" onClick={fn} disabled={dis}
                                  className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-[var(--neutral-200)] text-gray-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                  <Icon className="w-2.5 h-2.5" />
                                </button>
                              ))}
                            </div>
                            {/* Block content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-primary)] bg-[var(--primary-50)] border border-[var(--primary-100)] px-2 py-0.5 rounded-md">
                                  {block.type}
                                </span>
                                <button
                                  type="button" onClick={() => removeBlock(block.id)}
                                  className="w-6 h-6 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[var(--neutral-200)] rounded-full flex items-center justify-center transition-colors"
                                >
                                  <FaTimes className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              {block.type === "heading"   && <input value={block.value} onChange={(e) => updateBlockValue(block.id, e.target.value)} placeholder="Enter heading…" className={`${inputClass} font-semibold`} />}
                              {block.type === "paragraph" && <textarea value={block.value} onChange={(e) => updateBlockValue(block.id, e.target.value)} placeholder="Enter paragraph text…" rows={4} className={`${inputClass} resize-none`} />}
                              {block.type === "image"     && (
                                <UploadBox
                                  id={`imgInput-${block.id}`} preview={block.preview}
                                  onFileChange={(f) => updateBlockFile(block.id, f)}
                                  showCropButton={!!block.preview}
                                  onCropClick={() => { setCurrentBlockId(block.id); setShowBlockCrop(true); }}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>{/* /left */}

              {/* Right — sidebar (1/3) */}
              <div className="space-y-5 lg:sticky lg:top-[80px]">

                {/* Author + Status */}
                <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)]">
                    <h3 className="text-sm font-semibold text-gray-800">Post Settings</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Author <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" className={inputClass} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Visibility</p>
                        <p className="text-xs text-gray-500 mt-0.5">{published ? "Visible to all" : "Hidden draft"}</p>
                      </div>
                      <button
                        type="button" onClick={() => setPublished(!published)}
                        className={`relative inline-flex w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${published ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${published ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium ${published ? "bg-green-50 text-green-700 border border-green-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${published ? "bg-green-500" : "bg-yellow-500"}`} />
                      {published ? "Will publish immediately" : "Saved as draft"}
                    </div>
                  </div>
                </div>

                {/* Save actions */}
                <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)]">
                    <h3 className="text-sm font-semibold text-gray-800">Actions</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <button
                      onClick={handleSubmit} disabled={saving}
                      className="w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-all bg-green-500 hover:bg-green-600"
                    >
                      {saving ? <><FaSpinner className="w-4 h-4 animate-spin" /> Saving…</> : <><FaSave className="w-4 h-4" /> Save Changes</>}
                    </button>
                    <button
                      onClick={() => setMode("preview")}
                      className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-600 border border-[var(--neutral-200)] py-2.5 rounded-lg hover:bg-[var(--neutral-50)] transition-colors"
                    >
                      <FaEye className="w-4 h-4" /> Preview
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full text-sm font-medium text-gray-500 py-2 rounded-lg hover:text-gray-700 transition-colors"
                    >
                      Discard changes
                    </button>
                  </div>
                </div>

              </div>{/* /sidebar */}
            </div>
          )}

          {/* ════ VIEW MODE — reading layout ════ */}
          {mode === "view" && (
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main reading column */}
              <div className="lg:col-span-2">
                {/* Thumbnail */}
                {blog.thumbnail && (
                  <div className="relative mb-8 rounded-2xl overflow-hidden shadow-md bg-[var(--neutral-100)]">
                    <img
                      src={blog.thumbnail} alt={blog.title}
                      className="w-full max-h-[420px] object-cover"
                    />
                  </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${blog.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {blog.published ? "Published" : "Draft"}
                  </span>
                  {blog.category && (
                    <span className="text-xs text-gray-500 bg-[var(--neutral-100)] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FaTag className="w-2.5 h-2.5" /> {blog.category}
                    </span>
                  )}
                  {blog.readTime && (
                    <span className="text-xs text-gray-500 bg-[var(--neutral-100)] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FaClock className="w-2.5 h-2.5" /> {blog.readTime}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">{blog.title}</h1>

                {/* Author */}
                {blog.author && (
                  <div className="flex items-center gap-2.5 mb-6 pb-6 border-b border-[var(--neutral-200)]">
                    <div className="w-9 h-9 rounded-full bg-[var(--primary-100)] flex items-center justify-center flex-shrink-0">
                      <FaUser className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{blog.author}</p>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {blog.description && (
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 font-light">{blog.description}</p>
                )}

                {/* Content blocks */}
                <div>
                  {blocks.map((block, i) => (
                    <div key={block.id}>
                      {block.type === "image" && block.preview && (
                        <div className="my-8 rounded-xl overflow-hidden shadow-sm border border-[var(--neutral-200)]">
                          <img src={block.preview} alt="" className="w-full object-cover max-h-[500px]" />
                        </div>
                      )}
                      {block.type === "heading" && (
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-3 leading-tight">{block.value}</h2>
                      )}
                      {block.type === "paragraph" && (
                        <p className="text-gray-600 leading-[1.8] mb-5 text-[15px]">{block.value}</p>
                      )}
                    </div>
                  ))}
                  {blocks.length === 0 && (
                    <div className="text-center py-14 rounded-xl border border-dashed border-[var(--neutral-200)] text-gray-400">
                      <p className="text-sm">No content blocks added yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right info sidebar */}
              <div className="space-y-4 lg:sticky lg:top-[80px] h-fit">
                {/* Quick edit */}
                <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm p-5">
                  <button
                    onClick={() => setMode("edit")}
                    className="w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-lg transition-all bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                  >
                    <FaEdit className="w-4 h-4" /> Edit This Blog
                  </button>
                </div>
                {/* Blog info */}
                <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[var(--neutral-200)] bg-[var(--neutral-50)]">
                    <h3 className="text-sm font-semibold text-gray-800">Blog Info</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {[
                      { label: "Status",  value: blog.published ? "Published" : "Draft" },
                      { label: "Author",  value: blog.author || "—" },
                      { label: "Blocks",  value: `${blocks.length} block${blocks.length !== 1 ? "s" : ""}` },
                      ...(blog.createdAt ? [{ label: "Created", value: new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }] : []),
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-gray-500">{label}</span>
                        <span className="text-xs font-semibold text-gray-800 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Crop Modals */}
      {showThumbnailCrop && tempThumbnailFile && (
        <CropModal
          isOpen onClose={() => { setShowThumbnailCrop(false); setTempThumbnailFile(null); }}
          imageSrc={URL.createObjectURL(tempThumbnailFile)}
          onCropComplete={handleThumbnailCropComplete}
          aspect={12 / 8}
        />
      )}
      {showBlockCrop && tempBlockFile && (
        <CropModal
          isOpen onClose={() => { setShowBlockCrop(false); setTempBlockFile(null); setCurrentBlockId(null); }}
          imageSrc={URL.createObjectURL(tempBlockFile)}
          onCropComplete={handleBlockCropComplete}
          aspect={12 / 8}
        />
      )}

      {showSuccessPopup && <SuccessPopup isOpen onClose={() => setShowSuccessPopup(false)} message="Blog updated successfully!" />}
      {showErrorPopup   && <ErrorPopup   isOpen onClose={() => { setShowErrorPopup(false); setErrorMessage(""); }} errorMessage={errorMessage} />}
    </>
  );
}
