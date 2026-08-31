import { useState, useRef, useCallback } from "react";
import {
  FiImage, FiArrowUp, FiArrowDown, FiCheck, FiX,
  FiLoader, FiSend, FiCrop, FiEye, FiType, FiAlignLeft,
} from "react-icons/fi";
import { BiSolidError } from "react-icons/bi";
import { MdErrorOutline } from "react-icons/md";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";

import api from "@src/providers/api";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/* ── Crop Modal ─────────────────────────────────────────────── */
function CropModal({ isOpen, onClose, imageSrc, onCropComplete, aspect = 12 / 8 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropLoading, setCropLoading] = useState(false);
  const IMAGE_SIZE = { width: 1200, height: 800 };

  const onCropCompleteHandler = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  if (!isOpen) return null;

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", reject);
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (src, pixelCrop) => {
    const image = await createImage(src);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = IMAGE_SIZE.width;
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
    } catch (e) {
      console.error("Crop error:", e);
    } finally {
      setCropLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Crop Blog Image</h2>
            <button onClick={onClose} disabled={cropLoading} className="text-gray-400 transition-colors" style={{ color: cropLoading ? undefined : undefined }}
              onMouseEnter={e => e.currentTarget.style.color = '#f13c20'}
              onMouseLeave={e => e.currentTarget.style.color = ''}>
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">Aspect Ratio: 1200×800px</p>
          <div className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden" style={{ height: "300px" }}>
            <Cropper
              image={imageSrc} crop={crop} zoom={zoom} aspect={aspect}
              onCropChange={setCrop} onCropComplete={onCropCompleteHandler} onZoomChange={setZoom}
              cropShape="rect" showGrid objectFit="contain"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom: {Math.round(zoom * 100)}%</label>
            <input
              type="range" value={zoom} min={1} max={3} step={0.1}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              disabled={cropLoading}
              style={{ accentColor: "#f13c20" }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-red-100"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose} disabled={cropLoading}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={applyCrop} disabled={cropLoading}
              className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
              style={{ backgroundColor: '#f13c20' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4331a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f13c20'}
            >
              {cropLoading ? <><FiLoader className="w-4 h-4 animate-spin" /> Cropping…</> : "Crop & Save"}
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
        className="relative bg-white border-2 border-dashed border-gray-200 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden group"
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#f13c20'; e.currentTarget.style.backgroundColor = '#fff5f4'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = ''; }}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full">Click to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: '#fff5f4' }}>
              <FiImage className="w-7 h-7" style={{ color: '#f13c20' }} />
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold hover:underline" style={{ color: '#f13c20' }}>Click to upload</span>
            </p>
            <p className="text-xs text-gray-400">1200×800px · JPG, PNG</p>
          </div>
        )}
        <input
          id={id} type="file" accept=".jpg,.jpeg,.png" className="hidden"
          onChange={(e) => { const f = e.target.files[0]; if (f) onFileChange(f); }}
        />
      </div>
      {showCropButton && preview && (
        <button
          type="button" onClick={onCropClick}
          className="mt-2 text-xs transition-colors flex items-center gap-1"
          style={{ color: '#f13c20' }}
          onMouseEnter={e => e.currentTarget.style.color = '#d4331a'}
          onMouseLeave={e => e.currentTarget.style.color = '#f13c20'}
        >
          <FiCrop className="w-3 h-3" /> Crop image
        </button>
      )}
    </div>
  );
}

/* ── Section Panel ──────────────────────────────────────────── */
function Panel({ title, subtitle, children, headerRight }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {headerRight}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Success Popup ──────────────────────────────────────────── */
const SuccessPopup = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-[90%] max-w-[360px] md:max-w-[460px] rounded-2xl shadow-2xl relative">
        <div className="px-4 py-3 md:py-4 rounded-t-2xl" style={{ backgroundColor: '#f13c20' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
              <FiCheck className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#f13c20' }} />
            </div>
            <h3 className="font-semibold text-base md:text-lg text-white">Success!</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 md:p-2 shadow-md transition-colors z-10"
        >
          <FiX className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div className="px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff5f4' }}>
            <FiCheck className="w-8 h-8 md:w-10 md:h-10" style={{ color: '#f13c20' }} />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Blog Published!</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">{message || "Your blog post has been successfully created."}</p>
          <button
            onClick={() => { navigate("/blogs/list"); onClose(); }}
            className="inline-flex items-center justify-center w-full gap-2 px-6 py-2.5 text-white font-medium rounded-lg transition-all"
            style={{ backgroundColor: '#f13c20' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4331a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f13c20'}
          >
            <FiEye className="w-4 h-4" /> View All Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Error Popup ────────────────────────────────────────────── */
const ErrorPopup = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-[90%] max-w-[360px] md:max-w-[460px] rounded-2xl shadow-2xl relative">
        <div className="px-4 py-3 md:py-4 rounded-t-2xl" style={{ backgroundColor: '#f13c20' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
              <MdErrorOutline className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#f13c20' }} />
            </div>
            <h3 className="font-semibold text-base md:text-lg text-white">Error</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1.5 md:p-2 shadow-md transition-colors z-10"
        >
          <FiX className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div className="px-4 md:px-6 py-6 md:py-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff5f4' }}>
            <BiSolidError className="w-8 h-8 md:w-10 md:h-10" style={{ color: '#f13c20' }} />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Operation Failed</h2>
          <p className="text-sm md:text-base text-gray-600">{errorMessage || "An unexpected error occurred."}</p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN — Create Blog Page
══════════════════════════════════════════════════════════════ */
export default function CreateBlog() {
  const [title, setTitle]             = useState("");
  const [author, setAuthor]           = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished]     = useState(false);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const thumbnailRef = useRef(null);
  const [showThumbnailCrop, setShowThumbnailCrop] = useState(false);
  const [tempThumbnailFile, setTempThumbnailFile] = useState(null);

  const [blocks, setBlocks]   = useState([]);
  const blockFilesRef         = useRef({});
  const [showBlockCrop, setShowBlockCrop]   = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const [tempBlockFile, setTempBlockFile]   = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError]     = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup]     = useState(false);

  const handleThumbnail = (file) => { setTempThumbnailFile(file); setShowThumbnailCrop(true); };
  const handleThumbnailCropComplete = (file) => {
    thumbnailRef.current = file;
    if (thumbnailPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(URL.createObjectURL(file));
    setTempThumbnailFile(null);
  };
  const removeThumbnail = () => {
    if (thumbnailPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
    thumbnailRef.current = null;
    setThumbnailPreview(null);
  };

  const addBlock = (type) => setBlocks((p) => [...p, { id: generateId(), type, value: "", preview: null }]);
  const updateBlockValue = (id, value) => setBlocks((p) => p.map((b) => (b.id === id ? { ...b, value } : b)));
  const updateBlockFile = (id, file) => { setCurrentBlockId(id); setTempBlockFile(file); setShowBlockCrop(true); };
  const handleBlockCropComplete = (file) => {
    blockFilesRef.current[currentBlockId] = file;
    setBlocks((p) => p.map((b) => b.id === currentBlockId ? { ...b, preview: URL.createObjectURL(file) } : b));
    setTempBlockFile(null);
    setCurrentBlockId(null);
  };
  const removeBlock = (id) => {
    const b = blocks.find((b) => b.id === id);
    if (b?.preview?.startsWith("blob:")) URL.revokeObjectURL(b.preview);
    delete blockFilesRef.current[id];
    setBlocks((p) => p.filter((b) => b.id !== id));
  };
  const moveBlock = (idx, dir) => {
    const arr = [...blocks];
    const to = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    setBlocks(arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim())  { setError("Post title is required."); setShowErrorPopup(true); return; }
    if (!author.trim()) { setError("Author is required."); setShowErrorPopup(true); return; }

    setLoading(true); setError(null); setSuccess(null);

    const form = new FormData();
    form.append("title", title);
    form.append("author", author);
    form.append("description", description);
    form.append("order", "0");
    form.append("published", String(published));
    if (thumbnailRef.current) form.append("thumbnail", thumbnailRef.current, "thumbnail.jpg");

    let fileCounter = 0;
    const contentPayload = [];
    blocks.forEach((block, i) => {
      if (block.type === "image") {
        const file = blockFilesRef.current[block.id];
        if (file) { form.append("contentImages", file, `image-${block.id}.jpg`); contentPayload.push({ type: "image", fileIndex: fileCounter++, order: i }); }
        else contentPayload.push({ type: "image", fileIndex: undefined, order: i });
      } else {
        contentPayload.push({ type: block.type, value: block.value, order: i });
      }
    });
    form.append("content", JSON.stringify(contentPayload));

    try {
      await api.post("/blogs", form);
      setSuccess("Blog created successfully!");
      setShowSuccessPopup(true);
      setTitle("");
      setAuthor("");
      setDescription("");
      setPublished(false);
      if (thumbnailPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
      thumbnailRef.current = null;
      blocks.forEach((b) => {
        if (b.preview?.startsWith("blob:")) URL.revokeObjectURL(b.preview);
      });
      blockFilesRef.current = {};
      setBlocks([]);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
      setShowErrorPopup(true);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full px-3 py-2 md:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm bg-white";

  const blockTypes = [
    { label: "Heading",   type: "heading",   icon: <FiType className="w-4 h-4" /> },
    { label: "Paragraph", type: "paragraph", icon: <FiAlignLeft className="w-4 h-4" /> },
    { label: "Image",     type: "image",     icon: <FiImage className="w-4 h-4" /> },
  ];

  return (
    <>
      <div className=" min-h-screen py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Page Header ── */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Add New Blog</h1>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to create and publish a new post</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-5 items-start">

              {/* ── Left: Main form (2/3) ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* Post Details */}
                <Panel title="Post Details" subtitle="Title, author, and summary">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Post Title <span style={{ color: '#f13c20' }}>*</span>
                        </label>
                        <input
                          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter an engaging title…" className={inputClass}
                          onFocus={e => { e.target.style.borderColor = '#f13c20'; e.target.style.boxShadow = '0 0 0 2px rgba(241,60,32,0.2)'; }}
                          onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Author <span style={{ color: '#f13c20' }}>*</span>
                        </label>
                        <input
                          type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                          placeholder="Author name" className={inputClass}
                          onFocus={e => { e.target.style.borderColor = '#f13c20'; e.target.style.boxShadow = '0 0 0 2px rgba(241,60,32,0.2)'; }}
                          onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a brief description of your blog post…"
                        rows={3} className={`${inputClass} resize-none`}
                        onFocus={e => { e.target.style.borderColor = '#f13c20'; e.target.style.boxShadow = '0 0 0 2px rgba(241,60,32,0.2)'; }}
                        onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                      />
                    </div>
                  </div>
                </Panel>

                {/* Thumbnail */}
                <Panel title="Thumbnail Image" subtitle="Recommended: 1200×800px · JPG or PNG">
                  <UploadBox
                    id="thumbnailInput" preview={thumbnailPreview}
                    onFileChange={handleThumbnail}
                    showCropButton={!!thumbnailPreview}
                    onCropClick={() => setShowThumbnailCrop(true)}
                  />
                  {thumbnailPreview && (
                    <button
                      type="button" onClick={removeThumbnail}
                      className="mt-3 text-xs transition-colors flex items-center gap-1"
                      style={{ color: '#f13c20' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#d4331a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#f13c20'}
                    >
                      <FiX className="w-3 h-3" /> Remove thumbnail
                    </button>
                  )}
                </Panel>

                {/* Content Blocks */}
                <Panel
                  title="Content"
                  subtitle={`${blocks.length} block${blocks.length !== 1 ? "s" : ""} added`}
                  headerRight={
                    <div className="flex items-center gap-2 flex-wrap">
                      {blockTypes.map(({ label, type, icon }) => (
                        <button
                          key={type} type="button" onClick={() => addBlock(type)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all border"
                          style={{ borderColor: '#f13c20', color: '#f13c20' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f13c20'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#f13c20'; }}
                        >
                          {icon}
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  }
                >
                  {blocks.length === 0 ? (
                    <div className="text-center py-10 rounded-xl border-2 border-dashed border-gray-200">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <FiAlignLeft className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No content blocks yet</p>
                      <p className="text-sm text-gray-400 mt-1">Use the buttons above to add headings, paragraphs, or images</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blocks.map((block, idx) => (
                        <div
                          key={block.id}
                          className="flex gap-3 items-start bg-gray-50 rounded-xl p-3.5 border border-gray-200"
                        >
                          {/* Order controls */}
                          <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border"
                              style={{ backgroundColor: '#fff5f4', color: '#f13c20', borderColor: '#ffd0c8' }}
                            >
                              {idx + 1}
                            </div>
                            {[
                              { fn: () => moveBlock(idx, -1), Icon: FiArrowUp,   dis: idx === 0 },
                              { fn: () => moveBlock(idx, 1),  Icon: FiArrowDown, dis: idx === blocks.length - 1 },
                            ].map(({ fn, Icon, dis }, i) => (
                              <button
                                key={i} type="button" onClick={fn} disabled={dis}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                onMouseEnter={e => { if (!dis) { e.currentTarget.style.color = '#f13c20'; e.currentTarget.style.borderColor = '#f13c20'; }}}
                                onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
                              >
                                <Icon size={11} />
                              </button>
                            ))}
                          </div>

                          {/* Block content */}
                          <div className="flex-1 relative min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className="text-xs font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-md border"
                                style={{ color: '#f13c20', backgroundColor: '#fff5f4', borderColor: '#ffd0c8' }}
                              >
                                {block.type}
                              </span>
                              <button
                                type="button" onClick={() => removeBlock(block.id)}
                                className="w-7 h-7 bg-white text-gray-400 border border-gray-200 rounded-full flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                <FiX size={13} />
                              </button>
                            </div>

                            {block.type === "heading" && (
                              <input
                                type="text" value={block.value}
                                onChange={(e) => updateBlockValue(block.id, e.target.value)}
                                placeholder="Enter heading…"
                                className={`${inputClass} font-semibold text-base`}
                                onFocus={e => { e.target.style.borderColor = '#f13c20'; e.target.style.boxShadow = '0 0 0 2px rgba(241,60,32,0.2)'; }}
                                onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                              />
                            )}
                            {block.type === "paragraph" && (
                              <textarea
                                value={block.value}
                                onChange={(e) => updateBlockValue(block.id, e.target.value)}
                                placeholder="Write your content here…"
                                rows={4} className={`${inputClass} resize-none`}
                                onFocus={e => { e.target.style.borderColor = '#f13c20'; e.target.style.boxShadow = '0 0 0 2px rgba(241,60,32,0.2)'; }}
                                onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                              />
                            )}
                            {block.type === "image" && (
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
                </Panel>

              </div>

              {/* ── Right: Sidebar (1/3) ── */}
              <div className="space-y-5 lg:sticky lg:top-[80px]">

                {/* Publish panel */}
                <Panel title="Publish Settings">
                  <div className="space-y-4">
                    {/* Status toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Visibility</p>
                        <p className="text-sm text-gray-500 mt-0.5">{published ? "Visible to all readers" : "Hidden draft"}</p>
                      </div>
                      <button
                        type="button" onClick={() => setPublished((p) => !p)}
                        className="relative inline-flex w-11 h-6 rounded-full transition-all duration-300 focus:outline-none"
                        style={{ backgroundColor: published ? '#f13c20' : '#d1d5db' }}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${published ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Status indicator */}
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${published ? "bg-green-50 text-green-700 border border-green-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${published ? "bg-green-500" : "bg-yellow-500"}`} />
                      {published ? "Will publish immediately" : "Saved as draft"}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-sm"
                      style={{ backgroundColor: '#f13c20' }}
                      onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#d4331a'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f13c20'; }}
                    >
                      {loading ? (
                        <><FiLoader className="w-4 h-4 animate-spin" /> Publishing…</>
                      ) : (
                        <><FiSend className="w-4 h-4" /> {published ? "Publish Blog" : "Save Draft"}</>
                      )}
                    </button>
                  </div>
                </Panel>

                {/* Tips */}
                <Panel title="Writing Tips">
                  <ul className="space-y-3">
                    {[
                      "Use a compelling, specific title",
                      "Add a thumbnail for better reach",
                      "Keep paragraphs short and readable",
                      "Use headings to structure content",
                      "Write a clear description for SEO",
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border"
                          style={{ backgroundColor: '#fff5f4', borderColor: '#ffd0c8' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f13c20' }} />
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Panel>

                {/* Checklist */}
                <Panel title="Pre-publish Checklist">
                  <ul className="space-y-2.5">
                    {[
                      { label: "Title added", done: title.trim().length > 0 },
                      { label: "Author set",  done: author.trim().length > 0 },
                      { label: "Thumbnail uploaded", done: !!thumbnailPreview },
                      { label: "Content added", done: blocks.length > 0 },
                      { label: "Description written", done: description.trim().length > 0 },
                    ].map(({ label, done }) => (
                      <li key={label} className="flex items-center gap-2.5 text-sm">
                        <span
                          className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            backgroundColor: done ? '#f13c20' : 'white',
                            borderColor: done ? '#f13c20' : '#d1d5db',
                          }}
                        >
                          {done && <FiCheck size={9} className="text-white" />}
                        </span>
                        <span className={done ? "text-gray-700 font-medium" : "text-gray-400"}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>

              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Crop Modals */}
      {showThumbnailCrop && tempThumbnailFile && (
        <CropModal
          isOpen={showThumbnailCrop}
          onClose={() => { setShowThumbnailCrop(false); setTempThumbnailFile(null); }}
          imageSrc={URL.createObjectURL(tempThumbnailFile)}
          onCropComplete={handleThumbnailCropComplete}
          aspect={12 / 8}
        />
      )}
      {showBlockCrop && tempBlockFile && (
        <CropModal
          isOpen={showBlockCrop}
          onClose={() => { setShowBlockCrop(false); setTempBlockFile(null); setCurrentBlockId(null); }}
          imageSrc={URL.createObjectURL(tempBlockFile)}
          onCropComplete={handleBlockCropComplete}
          aspect={12 / 8}
        />
      )}

      {showSuccessPopup && <SuccessPopup isOpen={showSuccessPopup} onClose={() => { setShowSuccessPopup(false); setSuccess(null); }} message={success} />}
      {showErrorPopup   && <ErrorPopup   isOpen={showErrorPopup}   onClose={() => { setShowErrorPopup(false); setError(null); }}   errorMessage={error} />}
    </>
  );
}