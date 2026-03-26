import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  Layers,
  Tag,
  ShieldCheck,
  Sparkles,
  ImagePlus,
  Upload,
  Receipt,
  Percent,
  Camera,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../page-header/PageHeader";
import Cropper from "react-easy-crop";
import axiosInstance from "@src/providers/axiosInstance";

const TARGET_WIDTH = 1024;
const TARGET_HEIGHT = 512;

async function getCroppedImg(
  imageSrc,
  croppedAreaPixels,
  fileName = "bundle-cover.jpg",
) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        TARGET_WIDTH,
        TARGET_HEIGHT,
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve({ file, previewUrl: URL.createObjectURL(file) });
        },
        "image/jpeg",
        0.92,
      );
    });
    image.addEventListener("error", reject);
    image.src = imageSrc;
  });
}

const inp = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 13,
  border: "1px solid var(--neutral-200)",
  borderRadius: 8,
  outline: "none",
  fontFamily: "var(--font-sans)",
  background: "var(--neutral-0)",
  color: "var(--neutral-900)",
  boxSizing: "border-box",
};

const fmt = (n) => parseInt(n || 0).toLocaleString("en-IN");
const inr = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? "—" : "₹" + n.toLocaleString("en-IN");
};

/* ── Toast ── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  const ok = type === "ok";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 16px",
        borderRadius: 12,
        background: "var(--neutral-0)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        border: `1px solid ${ok ? "var(--success-100)" : "var(--error-100)"}`,
        fontSize: 13,
        fontWeight: 600,
        color: ok ? "var(--success-700)" : "var(--error-700)",
        animation: "bdlFadeUp 0.22s ease both",
      }}
    >
      {ok ? <Check size={15} /> : <AlertCircle size={15} />}
      {msg}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          color: "inherit",
          opacity: 0.5,
          lineHeight: 0,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

/* ── Section card — identical to ServiceDetailView ── */
function Section({ icon: Icon, title, onEdit, editOpen, delay = 0, children }) {
  return (
    <div
      className="bdl-animate"
      style={{
        "--delay": `${delay}ms`,
        background: "var(--neutral-0)",
        borderRadius: 14,
        border: `1px solid ${editOpen ? "var(--color-primary-border)" : "var(--neutral-100)"}`,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 18px",
          background: editOpen ? "var(--primary-50)" : "var(--neutral-50)",
          borderBottom: `1px solid ${editOpen ? "var(--color-primary-border)" : "var(--neutral-100)"}`,
          transition: "background 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          {Icon && (
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: editOpen
                  ? "var(--color-primary)"
                  : "var(--color-primary-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <Icon
                size={13}
                color={editOpen ? "#fff" : "var(--color-primary)"}
                strokeWidth={2.2}
              />
            </div>
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: editOpen ? "var(--color-primary)" : "var(--neutral-500)",
            }}
          >
            {title}
          </span>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 11px",
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: editOpen ? "var(--color-primary)" : "transparent",
              color: editOpen ? "#fff" : "var(--neutral-400)",
              border: editOpen
                ? "1px solid var(--color-primary)"
                : "1px solid var(--neutral-200)",
              transition: "all 0.15s",
              fontFamily: "var(--font-sans)",
            }}
          >
            {editOpen ? (
              <X size={12} strokeWidth={2.5} />
            ) : (
              <Pencil size={12} strokeWidth={2.5} />
            )}
            {editOpen ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

/* ── Save footer ── */
function EditFooter({ onSave, saving }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginTop: 18,
        paddingTop: 16,
        borderTop: "1px solid var(--neutral-100)",
      }}
    >
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 18px",
          borderRadius: 9,
          cursor: saving ? "not-allowed" : "pointer",
          background: "var(--color-primary)",
          color: "#fff",
          border: "none",
          fontSize: 13,
          fontWeight: 700,
          opacity: saving ? 0.65 : 1,
          fontFamily: "var(--font-sans)",
        }}
      >
        {saving ? (
          <RefreshCw
            size={13}
            style={{ animation: "bdlSpin 0.7s linear infinite" }}
          />
        ) : (
          <Check size={13} />
        )}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

function Label({ children, req }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--neutral-600)",
        marginBottom: 5,
      }}
    >
      {children}
      {req && (
        <span style={{ color: "var(--error-500)", marginLeft: 2 }}>*</span>
      )}
    </label>
  );
}

function InfoRow({ label, children, last }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        padding: "9px 0",
        borderBottom: last ? "none" : "1px solid var(--neutral-100)",
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: "var(--neutral-400)",
          flexShrink: 0,
          paddingTop: 1,
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--neutral-800)",
          textAlign: "right",
        }}
      >
        {children ?? "—"}
      </div>
    </div>
  );
}

function Badge({ children, variant = "neutral" }) {
  const map = {
    neutral: {
      bg: "var(--neutral-100)",
      color: "var(--neutral-600)",
      border: "var(--neutral-200)",
    },
    primary: {
      bg: "var(--primary-100)",
      color: "var(--color-primary-text)",
      border: "var(--color-primary-border)",
    },
    success: {
      bg: "var(--success-50)",
      color: "var(--success-700)",
      border: "var(--success-100)",
    },
    warning: {
      bg: "var(--warning-50)",
      color: "var(--warning-700)",
      border: "var(--warning-100)",
    },
    error: {
      bg: "var(--error-50)",
      color: "var(--error-700)",
      border: "var(--error-100)",
    },
  };
  const s = map[variant] ?? map.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {children}
    </span>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: 36,
          height: 20,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          background: checked ? "var(--color-primary)" : "var(--neutral-200)",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 17 : 3,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      </button>
      <span
        style={{ fontSize: 13, color: "var(--neutral-700)", fontWeight: 500 }}
      >
        {label}
      </span>
    </label>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function EditBundle() {
  const { bundleId } = useParams();
  const navigate = useNavigate();

  const [fetchingBundle, setFetchingBundle] = useState(true);
  const [bundle, setBundle] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const [services, setServices] = useState([]);
  const [loadingSvcs, setLoadingSvcs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalPages: 1,
    totalRecords: 0,
  });
  const [selectedServices, setSelectedServices] = useState([]);

  const [editSection, setEditSection] = useState(null);
  const [infoDraft, setInfoDraft] = useState({});
  const [priceDraft, setPriceDraft] = useState({});

  const [rawImageSrc, setRawImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const rawFileRef = useRef(null);

  const ok$ = (msg) => setToast({ msg, type: "ok" });
  const err$ = (msg) => setToast({ msg, type: "err" });

  /* ─── fetch bundle ─── */
  const fetchBundle = useCallback(async () => {
    setFetchingBundle(true);
    setFetchError(null);
    try {
      const res = await axiosInstance.get(`/bundle/${bundleId}/details`);
      const b = res.data.bundle ?? res.data;
      setBundle({
        ...b,
        bundlePrice: b.bundlePrice?.toString() ?? "",
        bundleOfferPrice: b.bundleOfferPrice?.toString() ?? "",
        finalBundlePrice: b.finalBundlePrice?.toString() ?? "",
        isGstApplicable: b.isGstApplicable ?? true,
        gstPercentage: b.gstPercentage?.toString() ?? "18",
      });
      setPhotoPreview(b.photoUrl ?? "");
      if (Array.isArray(b.services)) setSelectedServices(b.services);
    } catch (e) {
      setFetchError(e.message ?? "Failed to load bundle");
    } finally {
      setFetchingBundle(false);
    }
  }, [bundleId]);

  /* ─── fetch services ─── */
  const fetchServices = useCallback(async (page = 1, search = "") => {
    setLoadingSvcs(true);
    try {
      const res = await axiosInstance.get(
        `/service?limit=9&page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      );
      const list = res.data.services ?? [];
      const pag = res.data.pagination ?? {};
      setServices(list);
      setPagination({
        page: pag.page ?? page,
        limit: pag.limit ?? 9,
        totalPages: pag.totalPages ?? 1,
        totalRecords: pag.totalRecords ?? list.length,
      });
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
    } finally {
      setLoadingSvcs(false);
    }
  }, []);

  useEffect(() => {
    fetchBundle();
    fetchServices();
  }, [fetchBundle, fetchServices]);
  useEffect(() => {
    const fn = () => {
      if (document.activeElement?.type === "number")
        document.activeElement.blur();
    };
    window.addEventListener("wheel", fn);
    return () => window.removeEventListener("wheel", fn);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  /* ─── section open / close ─── */
  const open = (section) => {
    setEditSection(section);
    if (section === "info")
      setInfoDraft({
        name: bundle.name ?? "",
        description: bundle.description ?? "",
      });
    if (section === "photo") {
      setPhotoFile(null);
      setPhotoPreview(bundle.photoUrl ?? "");
    }
    if (section === "pricing")
      setPriceDraft({
        bundlePrice: bundle.bundlePrice ?? "",
        bundleOfferPrice: bundle.bundleOfferPrice ?? "",
        isGstApplicable: bundle.isGstApplicable ?? true,
        gstPercentage: bundle.gstPercentage ?? "18",
      });
    if (section === "services") fetchServices(1, "");
  };
  const close = () => setEditSection(null);
  const isOpen = (s) => editSection === s;

  /* ─── helpers ─── */
  const computeFinal = (offer, isGst, gstPct) => {
    const o = parseFloat(offer) || 0;
    if (!isGst) return Math.round(o);
    return Math.round(o + (o * (parseFloat(gstPct) || 0)) / 100);
  };
  const discPct = (price, offer) => {
    const p = parseFloat(price),
      o = parseFloat(offer);
    if (!p || !o || p <= 0) return 0;
    return Math.max(0, Math.round(((p - o) / p) * 100));
  };

  /* ─── shared PUT helper ─── */
  // Sends ALL fields every time (same as AddBundle). Only overrides change; rest falls back to bundle state.
  const putBundle = async (overrides = {}) => {
    const {
      photoFile: _photoFile,
      services: _services,
      ...fieldOverrides
    } = overrides;

    const name = (fieldOverrides.name ?? bundle.name ?? "").toString().trim();
    const description = (fieldOverrides.description ?? bundle.description ?? "")
      .toString()
      .trim();
    const bundlePrice =
      parseFloat(fieldOverrides.bundlePrice ?? bundle.bundlePrice) || 0;
    const bundleOfferPrice =
      parseFloat(fieldOverrides.bundleOfferPrice ?? bundle.bundleOfferPrice) ||
      0;
    const isGstApplicable =
      fieldOverrides.isGstApplicable ?? bundle.isGstApplicable ?? true;
    const gstPercentage =
      parseFloat(fieldOverrides.gstPercentage ?? bundle.gstPercentage) || 0;
    const finalBundlePrice = computeFinal(
      bundleOfferPrice,
      isGstApplicable,
      gstPercentage,
    );
    const svcs = _services ?? selectedServices;

    // Strip any accidental surrounding quotes from stored URL (backend rule: no extra quotes)
    const existingPhotoUrl = (bundle.photoUrl ?? "").replace(
      /^["']|["']$/g,
      "",
    );

    if (!name) throw new Error("Bundle name is required");
    if (!existingPhotoUrl && !_photoFile)
      throw new Error("Cover image is required");
    if (svcs.length === 0) throw new Error("Select at least one service");

    const formData = new FormData();

    // Plain values only — no JSON.stringify (per backend API rules)
    formData.append("name", name);
    formData.append("description", description);
    formData.append("bundlePrice", bundlePrice);
    formData.append("bundleOfferPrice", bundleOfferPrice);
    formData.append("finalBundlePrice", finalBundlePrice);
    formData.append("isGstApplicable", isGstApplicable);
    formData.append("gstPercentage", gstPercentage);

    // serviceIds as plain array (preferred per backend rules)
    svcs.forEach((service) => formData.append("serviceIds", service.serviceId));

    // Photo: new File if changed, else existing URL as plain string (no quotes)
    if (_photoFile) {
      formData.append("photoUrl", _photoFile);
    } else {
      formData.append("photoUrl", existingPhotoUrl);
    }

    const res = await axiosInstance.put(`/bundle/${bundleId}`, formData);
    if (!res.data.success)
      throw new Error(res.data.error ?? res.data.message ?? "Update failed");
    return res;
  };

  const saveInfo = async () => {
    if (!infoDraft.name.trim()) {
      err$("Bundle name is required");
      return;
    }
    if (!infoDraft.description.trim()) {
      err$("Description is required");
      return;
    }
    setSaving(true);
    try {
      await putBundle({
        name: infoDraft.name.trim(),
        description: infoDraft.description.trim(),
      });
      setBundle((p) => ({
        ...p,
        name: infoDraft.name.trim(),
        description: infoDraft.description.trim(),
      }));
      ok$("Bundle info saved");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  const savePhoto = async () => {
    if (!photoFile) {
      close();
      return;
    }
    setSaving(true);
    try {
      await putBundle({ photoFile: photoFile });
      setBundle((p) => ({ ...p, photoUrl: photoPreview }));
      ok$("Cover photo updated");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  const savePricing = async () => {
    if (
      !priceDraft.bundleOfferPrice ||
      parseFloat(priceDraft.bundleOfferPrice) <= 0
    ) {
      err$("Enter a valid offer price");
      return;
    }
    setSaving(true);
    try {
      const final = computeFinal(
        priceDraft.bundleOfferPrice,
        priceDraft.isGstApplicable,
        priceDraft.gstPercentage,
      );
      await putBundle({ ...priceDraft, finalBundlePrice: String(final) });
      setBundle((p) => ({
        ...p,
        ...priceDraft,
        finalBundlePrice: String(final),
      }));
      ok$("Pricing updated");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      await putBundle({ services: selectedServices });
      setBundle((p) => ({ ...p, services: selectedServices }));
      ok$("Services updated");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (svc) =>
    setSelectedServices((prev) =>
      prev.some((s) => s.serviceId === svc.serviceId)
        ? prev.filter((s) => s.serviceId !== svc.serviceId)
        : [...prev, svc],
    );

  /* ─── crop flow ─── */
  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    rawFileRef.current = file;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.src = url;
    setRawImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setShowCropper(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const onCropComplete = useCallback((_, px) => setCroppedAreaPixels(px), []);
  const handleCropConfirm = async () => {
    try {
      setUploadingImage(true);
      const { file, previewUrl } = await getCroppedImg(
        rawImageSrc,
        croppedAreaPixels,
        rawFileRef.current?.name || "bundle-cover.jpg",
      );
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
      setPhotoFile(file);
      setPhotoPreview(previewUrl);
      setShowCropper(false);
      URL.revokeObjectURL(rawImageSrc);
      setRawImageSrc("");
      setImageDimensions({ width: 0, height: 0 });
    } catch {
      err$("Image crop failed");
    } finally {
      setUploadingImage(false);
    }
  };
  const handleCancelCrop = () => {
    setShowCropper(false);
    URL.revokeObjectURL(rawImageSrc);
    setRawImageSrc("");
    setImageDimensions({ width: 0, height: 0 });
  };

  /* ─── guards ─── */
  if (fetchingBundle)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <RefreshCw
          size={28}
          color="var(--color-primary)"
          style={{ animation: "bdlSpin 0.8s linear infinite" }}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--neutral-400)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Loading bundle…
        </p>
        <style>{`@keyframes bdlSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  if (fetchError || !bundle)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 24,
        }}
      >
        <AlertCircle size={36} color="var(--error-500)" />
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--neutral-800)",
            margin: 0,
          }}
        >
          Couldn't load bundle
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--neutral-400)",
            textAlign: "center",
            maxWidth: 300,
            margin: 0,
          }}
        >
          {fetchError}
        </p>
        <button
          onClick={fetchBundle}
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "var(--color-primary)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    );

  const finalAmt =
    parseFloat(bundle.finalBundlePrice) ||
    computeFinal(
      bundle.bundleOfferPrice,
      bundle.isGstApplicable,
      bundle.gstPercentage,
    );
  const disc = discPct(bundle.bundlePrice, bundle.bundleOfferPrice);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-50)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <style>{`
        @keyframes bdlSpin   { to { transform: rotate(360deg); } }
        @keyframes bdlFadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .bdl-animate { animation: bdlFadeUp 0.3s ease both; animation-delay: var(--delay, 0ms); }
        .edit-inp:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px var(--color-primary-muted); outline: none; }
        .svc-row { transition: background 0.12s, border-color 0.12s; }
        .svc-row:hover { background: var(--neutral-50) !important; border-color: var(--neutral-200) !important; }
        .svc-row-sel { transition: background 0.12s; }
        .svc-row-sel:hover { background: var(--primary-100) !important; }
        @media (max-width: 768px) { .bdl-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Crop Modal ── */}
      {showCropper && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 800,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--neutral-900)",
                }}
              >
                Crop to {TARGET_WIDTH}×{TARGET_HEIGHT}
              </h3>
              <button
                onClick={handleCancelCrop}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  lineHeight: 0,
                }}
              >
                <X size={18} color="var(--neutral-500)" />
              </button>
            </div>
            {imageDimensions.width > 0 && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "9px 14px",
                  borderRadius: 9,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1e40af",
                  }}
                >
                  Original: {imageDimensions.width}×{imageDimensions.height}px ·
                  Target: {TARGET_WIDTH}×{TARGET_HEIGHT}px
                </p>
                <span
                  style={{
                    padding: "2px 9px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    background:
                      imageDimensions.width >= TARGET_WIDTH
                        ? "#dcfce7"
                        : "#fef9c3",
                    color:
                      imageDimensions.width >= TARGET_WIDTH
                        ? "#166534"
                        : "#854d0e",
                  }}
                >
                  {imageDimensions.width >= TARGET_WIDTH
                    ? "Good Size"
                    : "Small Image"}
                </span>
              </div>
            )}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 360,
                marginBottom: 16,
              }}
            >
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={TARGET_WIDTH / TARGET_HEIGHT}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    background: "#f3f4f6",
                  },
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--neutral-600)",
                  marginBottom: 6,
                }}
              >
                Zoom
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--color-primary)" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleCropConfirm}
                disabled={uploadingImage}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 10,
                  border: "none",
                  cursor: uploadingImage ? "not-allowed" : "pointer",
                  background: uploadingImage
                    ? "var(--neutral-400)"
                    : "var(--color-primary)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {uploadingImage ? (
                  <>
                    <RefreshCw
                      size={14}
                      style={{ animation: "bdlSpin 0.7s linear infinite" }}
                    />{" "}
                    Processing…
                  </>
                ) : (
                  "Crop & Use"
                )}
              </button>
              <button
                onClick={handleCancelCrop}
                style={{
                  padding: "11px 22px",
                  borderRadius: 10,
                  border: "1px solid var(--neutral-300)",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="Edit Service Bundle"
        subtitle={bundle.name}
        onBack={() => window.history.back()}
      />

      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "24px 16px 56px",
        }}
      >
        <div
          className="bdl-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 320px",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* ══════ LEFT ══════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ── Hero: Cover Photo + Bundle Info ── */}
            <div
              className="bdl-animate"
              style={{
                "--delay": "0ms",
                background: "var(--neutral-0)",
                borderRadius: 14,
                border: `1px solid ${isOpen("info") || isOpen("photo") ? "var(--color-primary-border)" : "var(--neutral-100)"}`,
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                transition: "border-color 0.2s",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 18px",
                  background:
                    isOpen("info") || isOpen("photo")
                      ? "var(--primary-50)"
                      : "var(--neutral-50)",
                  borderBottom: `1px solid ${isOpen("info") || isOpen("photo") ? "var(--color-primary-border)" : "var(--neutral-100)"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background:
                        isOpen("info") || isOpen("photo")
                          ? "var(--color-primary)"
                          : "var(--color-primary-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles
                      size={13}
                      color={
                        isOpen("info") || isOpen("photo")
                          ? "#fff"
                          : "var(--color-primary)"
                      }
                      strokeWidth={2.2}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color:
                        isOpen("info") || isOpen("photo")
                          ? "var(--color-primary)"
                          : "var(--neutral-500)",
                    }}
                  >
                    Bundle Info
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {/* Edit Photo button */}
                  <button
                    onClick={() => (isOpen("photo") ? close() : open("photo"))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 11px",
                      borderRadius: 7,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      background: isOpen("photo")
                        ? "var(--color-primary)"
                        : "transparent",
                      color: isOpen("photo") ? "#fff" : "var(--neutral-400)",
                      border: isOpen("photo")
                        ? "1px solid var(--color-primary)"
                        : "1px solid var(--neutral-200)",
                      transition: "all 0.15s",
                    }}
                  >
                    {isOpen("photo") ? (
                      <X size={12} strokeWidth={2.5} />
                    ) : (
                      <Camera size={12} strokeWidth={2.5} />
                    )}
                    {isOpen("photo") ? "Cancel" : "Edit Photo"}
                  </button>
                  {/* Edit Info button */}
                  <button
                    onClick={() => (isOpen("info") ? close() : open("info"))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 11px",
                      borderRadius: 7,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      background: isOpen("info")
                        ? "var(--color-primary)"
                        : "transparent",
                      color: isOpen("info") ? "#fff" : "var(--neutral-400)",
                      border: isOpen("info")
                        ? "1px solid var(--color-primary)"
                        : "1px solid var(--neutral-200)",
                      transition: "all 0.15s",
                    }}
                  >
                    {isOpen("info") ? (
                      <X size={12} strokeWidth={2.5} />
                    ) : (
                      <Pencil size={12} strokeWidth={2.5} />
                    )}
                    {isOpen("info") ? "Cancel" : "Edit Info"}
                  </button>
                </div>
              </div>

              {/* Cover image — always visible */}
              <div
                style={{
                  height: 220,
                  background: "var(--primary-50)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {(
                  isOpen("photo") && photoPreview
                    ? photoPreview
                    : bundle.photoUrl
                ) ? (
                  <img
                    src={isOpen("photo") ? photoPreview : bundle.photoUrl}
                    alt={bundle.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Layers
                      size={40}
                      color="var(--color-primary-border)"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
                <div style={{ position: "absolute", top: 10, left: 12 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                    }}
                  >
                    <Package size={11} strokeWidth={2.5} /> Bundle
                  </span>
                </div>
              </div>

              {/* Photo edit panel — shown below cover when active */}
              {isOpen("photo") && (
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--neutral-100)",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoFile}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed var(--neutral-200)",
                      borderRadius: 10,
                      padding: "16px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.borderColor = "var(--neutral-200)")
                    }
                  >
                    <Upload
                      size={18}
                      color="var(--neutral-300)"
                      style={{ marginBottom: 5 }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--neutral-500)",
                      }}
                    >
                      {photoFile
                        ? photoFile.name
                        : "Click to choose a new cover image"}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 11,
                        color: "var(--neutral-400)",
                      }}
                    >
                      PNG · JPG · WebP — cropped to {TARGET_WIDTH}×
                      {TARGET_HEIGHT}px
                    </p>
                  </div>
                  <EditFooter onSave={savePhoto} saving={saving} />
                </div>
              )}

              {/* Info body — VIEW mode */}
              {!isOpen("info") && (
                <div style={{ padding: 20 }}>
                  <h1
                    style={{
                      margin: "0 0 8px",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "var(--neutral-900)",
                      lineHeight: 1.25,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {bundle.name}
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: "var(--neutral-500)",
                      lineHeight: 1.7,
                    }}
                  >
                    {bundle.description}
                  </p>
                </div>
              )}

              {/* Info body — EDIT mode */}
              {isOpen("info") && (
                <div style={{ padding: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <Label req>Bundle Name</Label>
                      <input
                        className="edit-inp"
                        value={infoDraft.name}
                        onChange={(e) =>
                          setInfoDraft((p) => ({ ...p, name: e.target.value }))
                        }
                        style={inp}
                        placeholder="e.g. Startup Compliance Bundle"
                      />
                    </div>
                    <div>
                      <Label req>Description</Label>
                      <textarea
                        className="edit-inp"
                        value={infoDraft.description}
                        onChange={(e) =>
                          setInfoDraft((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        style={{ ...inp, resize: "vertical" }}
                        placeholder="Describe what's included and the value it offers…"
                      />
                    </div>
                    <EditFooter onSave={saveInfo} saving={saving} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Pricing ── */}
            <Section
              icon={Tag}
              title="Pricing"
              delay={60}
              onEdit={() => (isOpen("pricing") ? close() : open("pricing"))}
              editOpen={isOpen("pricing")}
            >
              {/* VIEW */}
              {!isOpen("pricing") && (
                <>
                  <div
                    style={{
                      background: "var(--primary-50)",
                      border: "1px solid var(--color-primary-border)",
                      borderRadius: 12,
                      padding: "18px 16px",
                      textAlign: "center",
                      marginBottom: 16,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--neutral-400)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Customer Pays
                    </p>
                    <p
                      style={{
                        margin: "6px 0 8px",
                        fontSize: 30,
                        fontWeight: 800,
                        color: "var(--neutral-900)",
                        lineHeight: 1,
                      }}
                    >
                      {inr(finalAmt)}
                    </p>
                    {disc > 0 && (
                      <Badge variant="success">
                        <Tag size={11} strokeWidth={2.5} />
                        {disc}% cheaper
                      </Badge>
                    )}
                  </div>
                  <InfoRow label="Original price">
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "var(--neutral-300)",
                        fontWeight: 500,
                      }}
                    >
                      {inr(bundle.bundlePrice)}
                    </span>
                  </InfoRow>
                  <InfoRow label="Offer price">
                    <span
                      style={{ color: "var(--color-primary)", fontWeight: 700 }}
                    >
                      {inr(bundle.bundleOfferPrice)}
                    </span>
                  </InfoRow>
                  <InfoRow label="GST" last={!bundle.isGstApplicable}>
                    {bundle.isGstApplicable ? (
                      <Badge variant="warning">
                        <Percent size={11} strokeWidth={2.5} />
                        {bundle.gstPercentage}% added
                      </Badge>
                    ) : (
                      <Badge variant="neutral">Not applicable</Badge>
                    )}
                  </InfoRow>
                  {bundle.isGstApplicable && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "11px 0 0",
                        marginTop: 4,
                        borderTop: "2px dashed var(--neutral-100)",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--neutral-800)",
                        }}
                      >
                        <Receipt
                          size={14}
                          strokeWidth={2.2}
                          color="var(--neutral-500)"
                        />{" "}
                        Total with GST
                      </span>
                      <span
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: "var(--neutral-900)",
                        }}
                      >
                        {inr(finalAmt)}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* EDIT */}
              {isOpen("pricing") && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <div>
                      <Label>Original Price (₹)</Label>
                      <input
                        className="edit-inp"
                        type="number"
                        min="0"
                        value={priceDraft.bundlePrice}
                        onChange={(e) =>
                          setPriceDraft((p) => ({
                            ...p,
                            bundlePrice: e.target.value,
                          }))
                        }
                        style={inp}
                        placeholder="e.g. 10000"
                      />
                    </div>
                    <div>
                      <Label req>Offer Price (₹)</Label>
                      <input
                        className="edit-inp"
                        type="number"
                        min="0"
                        value={priceDraft.bundleOfferPrice}
                        onChange={(e) =>
                          setPriceDraft((p) => ({
                            ...p,
                            bundleOfferPrice: e.target.value,
                          }))
                        }
                        style={inp}
                        placeholder="e.g. 8000"
                      />
                    </div>
                  </div>
                  {priceDraft.bundlePrice &&
                    priceDraft.bundleOfferPrice &&
                    discPct(
                      priceDraft.bundlePrice,
                      priceDraft.bundleOfferPrice,
                    ) > 0 && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--success-600)",
                        }}
                      >
                        {discPct(
                          priceDraft.bundlePrice,
                          priceDraft.bundleOfferPrice,
                        )}
                        % discount
                      </p>
                    )}
                  <div
                    style={{
                      paddingTop: 10,
                      borderTop: "1px solid var(--neutral-100)",
                    }}
                  >
                    <Toggle
                      checked={priceDraft.isGstApplicable}
                      onChange={(v) =>
                        setPriceDraft((p) => ({ ...p, isGstApplicable: v }))
                      }
                      label="GST Applicable"
                    />
                    {priceDraft.isGstApplicable && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          marginTop: 12,
                        }}
                      >
                        <div>
                          <Label req>GST Rate (%)</Label>
                          <input
                            className="edit-inp"
                            type="number"
                            min="0"
                            max="100"
                            value={priceDraft.gstPercentage}
                            onChange={(e) =>
                              setPriceDraft((p) => ({
                                ...p,
                                gstPercentage: e.target.value,
                              }))
                            }
                            style={inp}
                            placeholder="18"
                          />
                        </div>
                        <div>
                          <Label>Total incl. GST</Label>
                          <div
                            style={{
                              ...inp,
                              background: "var(--neutral-50)",
                              color: "var(--neutral-700)",
                              fontWeight: 700,
                              borderColor: "var(--neutral-100)",
                            }}
                          >
                            {inr(
                              computeFinal(
                                priceDraft.bundleOfferPrice,
                                priceDraft.isGstApplicable,
                                priceDraft.gstPercentage,
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <EditFooter onSave={savePricing} saving={saving} />
                </div>
              )}
            </Section>

            {/* ── Included Services ── */}
            <Section
              icon={Layers}
              title="Included Services"
              delay={120}
              onEdit={() => (isOpen("services") ? close() : open("services"))}
              editOpen={isOpen("services")}
            >
              {/* VIEW — selected chips always visible */}
              {selectedServices.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--neutral-400)",
                    fontStyle: "italic",
                  }}
                >
                  No services selected.
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {selectedServices.map((s) => (
                    <div
                      key={s.serviceId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "var(--primary-50)",
                        border: "1px solid var(--color-primary-border)",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "var(--primary-100)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Package
                          size={14}
                          strokeWidth={2}
                          color="var(--color-primary)"
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--neutral-800)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.name}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 11,
                            color: "var(--color-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {inr(s.offerPrice)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          s.serviceType === "RECURRING" ? "primary" : "neutral"
                        }
                      >
                        {s.serviceType === "RECURRING"
                          ? "Recurring"
                          : "One-time"}
                      </Badge>
                      {/* remove only in edit mode */}
                      {isOpen("services") && (
                        <button
                          onClick={() => toggleService(s)}
                          style={{
                            padding: "5px 7px",
                            border: "1px solid var(--neutral-200)",
                            borderRadius: 7,
                            background: "transparent",
                            cursor: "pointer",
                            color: "var(--neutral-400)",
                            lineHeight: 0,
                            flexShrink: 0,
                            transition: "all 0.12s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background =
                              "var(--error-50)";
                            e.currentTarget.style.borderColor =
                              "var(--error-200)";
                            e.currentTarget.style.color = "var(--error-600)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor =
                              "var(--neutral-200)";
                            e.currentTarget.style.color = "var(--neutral-400)";
                          }}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* EDIT — service picker expands below */}
              {isOpen("services") && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: "1px solid var(--neutral-100)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--neutral-400)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Add more services
                  </p>
                  {/* search */}
                  <div style={{ position: "relative", marginBottom: 10 }}>
                    <Search
                      size={14}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--neutral-400)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      className="edit-inp"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && fetchServices(1, searchQuery)
                      }
                      placeholder="Search services…"
                      style={{ ...inp, paddingLeft: 32, paddingRight: 56 }}
                    />
                    <button
                      onClick={() => fetchServices(1, searchQuery)}
                      style={{
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "none",
                        background: "var(--primary-50)",
                        color: "var(--color-primary)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Go
                    </button>
                  </div>

                  {loadingSvcs ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "20px 0",
                      }}
                    >
                      <RefreshCw
                        size={16}
                        color="var(--color-primary)"
                        style={{ animation: "bdlSpin 0.7s linear infinite" }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--neutral-400)",
                          fontWeight: 500,
                        }}
                      >
                        Loading…
                      </span>
                    </div>
                  ) : services.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <Package
                        size={26}
                        color="var(--neutral-300)"
                        style={{ marginBottom: 5 }}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "var(--neutral-400)",
                          fontWeight: 500,
                        }}
                      >
                        No services found
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          fetchServices();
                        }}
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--color-primary)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {services.map((svc) => {
                        const selected = selectedServices.some(
                          (s) => s.serviceId === svc.serviceId,
                        );
                        return (
                          <div
                            key={svc.serviceId}
                            className={selected ? "svc-row-sel" : "svc-row"}
                            onClick={() => toggleService(svc)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "9px 12px",
                              borderRadius: 9,
                              cursor: "pointer",
                              background: selected
                                ? "var(--primary-50)"
                                : "transparent",
                              border: `1px solid ${selected ? "var(--color-primary-border)" : "var(--neutral-100)"}`,
                            }}
                          >
                            <div
                              style={{
                                width: 17,
                                height: 17,
                                borderRadius: 5,
                                flexShrink: 0,
                                border: `2px solid ${selected ? "var(--color-primary)" : "var(--neutral-300)"}`,
                                background: selected
                                  ? "var(--color-primary)"
                                  : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s",
                              }}
                            >
                              {selected && (
                                <Check size={9} color="#fff" strokeWidth={3} />
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "var(--neutral-800)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {svc.name}
                              </p>
                              <p
                                style={{
                                  margin: "1px 0 0",
                                  fontSize: 11,
                                  color: selected
                                    ? "var(--color-primary)"
                                    : "var(--neutral-400)",
                                  fontWeight: 600,
                                }}
                              >
                                {inr(svc.offerPrice)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* pagination */}
                  {!loadingSvcs && pagination.totalPages > 1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: "1px solid var(--neutral-100)",
                      }}
                    >
                      <button
                        onClick={() =>
                          fetchServices(pagination.page - 1, searchQuery)
                        }
                        disabled={pagination.page === 1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1px solid var(--neutral-200)",
                          background: "transparent",
                          cursor:
                            pagination.page === 1 ? "not-allowed" : "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--neutral-600)",
                          opacity: pagination.page === 1 ? 0.4 : 1,
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        <ChevronLeft size={13} /> Prev
                      </button>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--neutral-400)",
                          fontWeight: 500,
                        }}
                      >
                        {pagination.page} / {pagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          fetchServices(pagination.page + 1, searchQuery)
                        }
                        disabled={pagination.page === pagination.totalPages}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1px solid var(--neutral-200)",
                          background: "transparent",
                          cursor:
                            pagination.page === pagination.totalPages
                              ? "not-allowed"
                              : "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--neutral-600)",
                          opacity:
                            pagination.page === pagination.totalPages ? 0.4 : 1,
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        Next <ChevronRight size={13} />
                      </button>
                    </div>
                  )}

                  <EditFooter onSave={saveServices} saving={saving} />
                </div>
              )}
            </Section>
          </div>

          {/* ══════ RIGHT ══════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Quick Facts */}
            <Section icon={Package} title="Quick Facts" delay={40}>
              <div
                style={{
                  background: "var(--primary-50)",
                  border: "1px solid var(--color-primary-border)",
                  borderRadius: 12,
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--neutral-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Final Price
                </p>
                <p
                  style={{
                    margin: "6px 0 4px",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--neutral-900)",
                    lineHeight: 1,
                  }}
                >
                  {inr(finalAmt)}
                </p>
                {disc > 0 && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--success-600)",
                    }}
                  >
                    {disc}% off original
                  </p>
                )}
              </div>
              <InfoRow label="Services included">
                {selectedServices.length}
              </InfoRow>
              <InfoRow label="Offer price">
                {inr(bundle.bundleOfferPrice)}
              </InfoRow>
              <InfoRow label="Original price">
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "var(--neutral-300)",
                    fontWeight: 500,
                  }}
                >
                  {inr(bundle.bundlePrice)}
                </span>
              </InfoRow>
              <InfoRow label="GST" last>
                {bundle.isGstApplicable ? (
                  <Badge variant="warning">
                    <Percent size={11} strokeWidth={2.5} />
                    {bundle.gstPercentage}%
                  </Badge>
                ) : (
                  <Badge variant="neutral">None</Badge>
                )}
              </InfoRow>
            </Section>

            {/* Tips */}
            <Section icon={ShieldCheck} title="Bundle Tips" delay={80}>
              {[
                {
                  tip: "Combine complementary services for better perceived value",
                  icon: "💡",
                },
                {
                  tip: "Aim for at least 20% discount on the bundle price",
                  icon: "🎯",
                },
                {
                  tip: "Keep the bundle name clear and benefit-focused",
                  icon: "✏️",
                },
                {
                  tip: "Use a high-quality 2:1 aspect ratio cover image",
                  icon: "🖼️",
                },
              ].map(({ tip, icon }, i, arr) => (
                <div
                  key={tip}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "9px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px solid var(--neutral-100)"
                        : "none",
                  }}
                >
                  <span
                    style={{ fontSize: 14, flexShrink: 0, lineHeight: 1.5 }}
                  >
                    {icon}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--neutral-500)",
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
            </Section>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
