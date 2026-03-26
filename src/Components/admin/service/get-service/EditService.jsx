// ServiceDetailView.jsx
// View + inline edit per section.
// APIs used (exactly as spec):
//   PUT /service/:serviceId                  — info, pricing, photo, docs, points
//   PUT /service/:serviceId/input-fields     — { fields: [...] }
//   PUT /service/:serviceId/track-steps      — { steps: [...] }

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FormInput,
  ListChecks,
  FileText,
  CreditCard,
  LayoutList,
  Repeat2,
  Zap,
  Tag,
  Percent,
  Receipt,
  Clock,
  CalendarDays,
  ShieldCheck,
  ThumbsUp,
  Layers,
  Camera,
  Upload,
  ChevronDown,
} from "lucide-react";
import Cropper from "react-easy-crop";
import axiosInstance from "@src/providers/axiosInstance";
import PageHeader from "../../page-header/PageHeader";

/* ─── constants ──────────────────────────────────────────────────────── */
const FREQ_LABEL = {
  MONTHLY: "Every Month",
  QUARTERLY: "Every 3 Months",
  YEARLY: "Every Year",
};
const DUR_LABEL = { MONTH: "months", YEAR: "years" };
const FREQ_OPTS = [
  { v: "MONTHLY", l: "Monthly" },
  { v: "QUARTERLY", l: "Quarterly" },
  { v: "YEARLY", l: "Yearly" },
];
const DUR_OPTS = [
  { v: "MONTH", l: "Months" },
  { v: "YEAR", l: "Years" },
];
const SVC_TYPES = [
  { v: "ONE_TIME", l: "One-time" },
  { v: "RECURRING", l: "Recurring" },
];
const FIELD_TYPES = [
  "text",
  "email",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
  "file",
  "password",
];
const DOC_TYPES = ["file", "text"];
const STEP_COLORS = [
  "var(--color-primary)",
  "var(--success-500)",
  "var(--warning-500)",
  "var(--info-500)",
];
const BULLET_COLORS = [
  "var(--color-primary)",
  "var(--success-500)",
  "var(--warning-500)",
  "var(--info-500)",
  "var(--error-500)",
];

const TARGET_WIDTH = 1024;
const TARGET_HEIGHT = 512;

/* ─── getCroppedImg helper ───────────────────────────────────────────── */
async function getCroppedImg(
  imageSrc,
  croppedAreaPixels,
  fileName = "service-photo.jpg",
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

/* ─── helpers ────────────────────────────────────────────────────────── */
const normBool = (v) => v === true || v === "true";
const inr = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? "—" : "₹" + n.toLocaleString("en-IN");
};
const discPct = (ip, op) => {
  const i = parseFloat(ip),
    o = parseFloat(op);
  return !isNaN(i) && !isNaN(o) && i > 0
    ? Math.max(0, Math.round(((i - o) / i) * 100))
    : 0;
};
const withGst = (op, gst, on) => {
  const o = parseFloat(op);
  if (isNaN(o) || o <= 0) return 0;
  if (on) {
    const g = parseFloat(gst);
    if (!isNaN(g) && g > 0) return Math.round(o + (o * g) / 100);
  }
  return Math.round(o);
};

/* ─── shared input styles ────────────────────────────────────────────── */
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
const sel = { ...inp, appearance: "none", paddingRight: 28, cursor: "pointer" };

/* ─── Toast ──────────────────────────────────────────────────────────── */
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
        animation: "svcFadeUp 0.22s ease both",
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

/* ─── Section card with optional Edit button ─────────────────────────── */
function Section({ icon: Icon, title, onEdit, editOpen, delay = 0, children }) {
  return (
    <div
      className="svc-animate"
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

/* ─── Save footer ────────────────────────────────────────────────────── */
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
            style={{ animation: "svcSpin 0.7s linear infinite" }}
          />
        ) : (
          <Check size={13} />
        )}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

/* ─── Label ──────────────────────────────────────────────────────────── */
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

/* ─── Select wrapper (chevron icon) ──────────────────────────────────── */
function SelWrap({ children }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <ChevronDown
        size={13}
        style={{
          position: "absolute",
          right: 9,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--neutral-400)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────────────── */
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

/* ─── InfoRow ────────────────────────────────────────────────────────── */
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

/* ─── Badge ──────────────────────────────────────────────────────────── */
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

/* ─── Loader / Error ─────────────────────────────────────────────────── */
function Loader() {
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
        style={{ animation: "svcSpin 0.8s linear infinite" }}
      />
      <p
        style={{
          fontSize: 13,
          color: "var(--neutral-400)",
          fontWeight: 500,
          margin: 0,
        }}
      >
        Loading service…
      </p>
    </div>
  );
}
function ErrorState({ message, onRetry }) {
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
        Couldn't load this service
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
        {message}
      </p>
      <button
        onClick={onRetry}
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
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════ */
export default function ServiceDetailView() {
  const { serviceId } = useParams();

  /* ── remote data ── */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [svc, setSvc] = useState(null);
  const [fields, setFields] = useState([]);
  const [steps, setSteps] = useState([]);
  const [docs, setDocs] = useState([]);
  const [subName, setSubName] = useState("");
  const [subcategories, setSubs] = useState([]);

  /* ── which section is currently being edited ── */
  const [editSection, setEditSection] = useState(null);

  /* ── draft states (one per section) ── */
  const [infoDraft, setInfoDraft] = useState({});
  const [priceDraft, setPriceDraft] = useState({});
  const [pointsDraft, setPointsDraft] = useState([]);
  const [fieldsDraft, setFieldsDraft] = useState([]);
  const [stepsDraft, setStepsDraft] = useState([]);
  const [docsDraft, setDocsDraft] = useState([]);
  const [photoDraft, setPhotoDraft] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  /* ── crop state ── */
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

  /* ── saving + toast ── */
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const photoRef = useRef(null);
  const rawFileRef = useRef(null);

  const ok$ = (msg) => setToast({ msg, type: "ok" });
  const err$ = (msg) => setToast({ msg, type: "err" });

  /* ─── fetch all data ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [svcRes, subRes] = await Promise.all([
        axiosInstance.get(`/service/${serviceId}`),
        axiosInstance.get("/subcategory"),
      ]);
      if (!svcRes.data.success) throw new Error("Service not found");
      const s = svcRes.data.service;
      const norm = {
        ...s,
        documentsRequired: normBool(s.documentsRequired),
        isGstApplicable: normBool(s.isGstApplicable),
        individualPrice: s.individualPrice?.toString() ?? "",
        offerPrice: s.offerPrice?.toString() ?? "",
        gstPercentage: s.gstPercentage?.toString() ?? "18",
        points: (() => {
          if (Array.isArray(s.points)) return s.points;
          if (typeof s.points === "string") {
            try {
              const p = JSON.parse(s.points);
              return Array.isArray(p) ? p : [];
            } catch {
              return [];
            }
          }
          return [];
        })(),
      };
      setSvc(norm);
      if (Array.isArray(s.inputFields)) setFields(s.inputFields);
      if (Array.isArray(s.trackSteps))
        setSteps([...s.trackSteps].sort((a, b) => a.order - b.order));
      if (s.requiredDocuments) {
        try {
          const parsed =
            typeof s.requiredDocuments === "string"
              ? JSON.parse(s.requiredDocuments)
              : s.requiredDocuments;
          if (Array.isArray(parsed))
            setDocs(
              parsed.map((d, i) => ({
                id: i,
                name: typeof d === "string" ? d : (d.documentName ?? ""),
                inputType: d.inputType ?? "file",
              })),
            );
        } catch {
          /* skip invalid JSON */
        }
      }
      if (subRes.data.success) {
        setSubs(subRes.data.subcategories);
        const sub = subRes.data.subcategories.find(
          (x) => x.subCategoryId === s.subCategoryId,
        );
        if (sub) setSubName(sub.subCategoryName);
      }
    } catch (e) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  /* ─── open section → populate draft ── */
  const open = (section) => {
    setEditSection(section);
    if (section === "info") {
      setInfoDraft({
        name: svc.name ?? "",
        description: svc.description ?? "",
        serviceType: svc.serviceType ?? "ONE_TIME",
        subCategoryId: svc.subCategoryId ?? "",
        frequency: svc.frequency ?? "",
        duration: svc.duration?.toString() ?? "",
        durationUnit: svc.durationUnit ?? "MONTH",
      });
    }
    if (section === "photo") {
      setPhotoDraft(null);
      setPhotoPreview(svc.photoUrl ?? "");
    }
    if (section === "points") setPointsDraft([...(svc.points ?? [])]);
    if (section === "pricing") {
      setPriceDraft({
        individualPrice: svc.individualPrice ?? "",
        offerPrice: svc.offerPrice ?? "",
        isGstApplicable: svc.isGstApplicable ?? false,
        gstPercentage: svc.gstPercentage ?? "18",
      });
    }
    if (section === "fields") setFieldsDraft(fields.map((f) => ({ ...f })));
    if (section === "steps") setStepsDraft(steps.map((s) => ({ ...s })));
    if (section === "docs") setDocsDraft(docs.map((d) => ({ ...d })));
  };
  const close = () => setEditSection(null);
  const isOpen = (s) => editSection === s;

  /* ─── PUT /service/:id ── */
  const putSvc = async (body) => {
    const r = await axiosInstance.put(`/service/${serviceId}`, body);
    if (!r.data.success) throw new Error(r.data.error ?? "Update failed");
  };

  /* ─── SAVE: Info ── */
  const saveInfo = async () => {
    setSaving(true);
    try {
      const body = {
        name: infoDraft.name.trim(),
        description: infoDraft.description.trim(),
        serviceType: infoDraft.serviceType,
        subCategoryId: infoDraft.subCategoryId,
        ...(infoDraft.serviceType === "RECURRING"
          ? {
              frequency: infoDraft.frequency,
              duration: infoDraft.duration?.toString() || "0",
              durationUnit: infoDraft.durationUnit,
            }
          : { frequency: null, duration: null, durationUnit: null }),
      };
      await putSvc(body);
      setSvc((p) => ({ ...p, ...body }));
      const sub = subcategories.find(
        (x) => x.subCategoryId === body.subCategoryId,
      );
      if (sub) setSubName(sub.subCategoryName);
      ok$("Service info saved");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── SAVE: Photo ── */
  const savePhoto = async () => {
    if (!photoDraft) {
      close();
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", svc?.name ?? "service");
      fd.append("photoUrl", photoDraft, photoDraft.name);
      const r = await axiosInstance.put(`/service/${serviceId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!r.data.success) throw new Error("Image upload failed");
      setSvc((p) => ({ ...p, photoUrl: photoPreview }));
      ok$("Photo updated");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── SAVE: Points ── */
  const savePoints = async () => {
    setSaving(true);
    try {
      const pts = pointsDraft.filter((p) => p.trim());
      await putSvc({ points: JSON.stringify(pts) });
      setSvc((p) => ({ ...p, points: pts }));
      ok$("Highlights saved");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── SAVE: Pricing ── */
  const savePricing = async () => {
    setSaving(true);
    try {
      const op = parseFloat(priceDraft.offerPrice);
      const ip = parseFloat(priceDraft.individualPrice);
      const g = priceDraft.isGstApplicable
        ? parseFloat(priceDraft.gstPercentage)
        : 0;
      const fin = withGst(op, g, priceDraft.isGstApplicable);
      await putSvc({
        individualPrice: String(ip),
        offerPrice: String(op),
        isGstApplicable: String(priceDraft.isGstApplicable),
        gstPercentage: String(g),
        finalIndividualPrice: String(fin),
      });
      setSvc((p) => ({ ...p, ...priceDraft, finalIndividualPrice: fin }));
      ok$("Pricing updated");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── SAVE: Input fields → PUT /service/:id/input-fields ── */
  const saveFields = async () => {
    setSaving(true);
    try {
      const payload = {
        fields: fieldsDraft.map((f) => ({
          label: f.label,
          type: f.type,
          placeholder: f.placeholder ?? "",
          required: !!f.required,
          ...(f.masterFieldId ? { masterFieldId: f.masterFieldId } : {}),
          ...(f.options?.length ? { options: f.options } : {}),
        })),
      };
      const r = await axiosInstance.put(
        `/service/${serviceId}/input-fields`,
        payload,
      );
      if (!r.data.success)
        throw new Error(r.data.error ?? "Failed to save fields");
      setFields(fieldsDraft);
      ok$("Input fields saved");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── SAVE: Track steps → PUT /service/:id/track-steps ── */
  const saveSteps = async () => {
    setSaving(true);
    try {
      const payload = {
        steps: stepsDraft.map((s, i) => ({
          title: s.title,
          description: s.description,
          order: i + 1,
        })),
      };
      const r = await axiosInstance.put(
        `/service/${serviceId}/track-steps`,
        payload,
      );
      if (!r.data.success)
        throw new Error(r.data.error ?? "Failed to save steps");
      setSteps(stepsDraft.map((s, i) => ({ ...s, order: i + 1 })));
      ok$("Steps saved");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── SAVE: Required docs → PUT /service/:id ── */
  const saveDocs = async () => {
    setSaving(true);
    try {
      const filtered = docsDraft.filter((d) => d.name?.trim());
      const docsPayload = filtered.map((d) => ({
        documentName: d.name.trim(),
        inputType: d.inputType,
      }));
      await putSvc({
        documentsRequired: String(filtered.length > 0),
        requiredDocuments: JSON.stringify(docsPayload),
      });
      setSvc((p) => ({ ...p, documentsRequired: filtered.length > 0 }));
      setDocs(filtered.map((d, i) => ({ ...d, id: i })));
      ok$("Documents saved");
      close();
    } catch (e) {
      err$(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ─── crop handlers ── */
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
    if (photoRef.current) photoRef.current.value = "";
  };

  const onCropComplete = useCallback((_, px) => setCroppedAreaPixels(px), []);

  const handleCropConfirm = async () => {
    try {
      setUploadingImage(true);
      const { file, previewUrl } = await getCroppedImg(
        rawImageSrc,
        croppedAreaPixels,
        rawFileRef.current?.name || "service-photo.jpg",
      );
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
      setPhotoDraft(file);
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

  /* ─── draft helpers ── */
  const fUpd = (i, k, v) =>
    setFieldsDraft((p) =>
      p.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)),
    );
  const fDel = (i) => setFieldsDraft((p) => p.filter((_, idx) => idx !== i));
  const fAdd = () =>
    setFieldsDraft((p) => [
      ...p,
      { label: "", type: "text", placeholder: "", required: false },
    ]);

  const sUpd = (i, k, v) =>
    setStepsDraft((p) => p.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));
  const sDel = (i) => setStepsDraft((p) => p.filter((_, idx) => idx !== i));
  const sAdd = () =>
    setStepsDraft((p) => [
      ...p,
      { title: "", description: "", order: p.length + 1 },
    ]);

  const dUpd = (i, k, v) =>
    setDocsDraft((p) => p.map((d, idx) => (idx === i ? { ...d, [k]: v } : d)));
  const dDel = (i) => setDocsDraft((p) => p.filter((_, idx) => idx !== i));
  const dAdd = () =>
    setDocsDraft((p) => [
      ...p,
      { id: Date.now(), name: "", inputType: "file" },
    ]);

  const pUpd = (i, v) =>
    setPointsDraft((p) => p.map((x, idx) => (idx === i ? v : x)));
  const pDel = (i) => setPointsDraft((p) => p.filter((_, idx) => idx !== i));
  const pAdd = () => setPointsDraft((p) => [...p, ""]);

  /* ─── render guards ── */
  if (loading) return <Loader />;
  if (error || !svc) return <ErrorState message={error} onRetry={fetchAll} />;

  const isRecurring = svc.serviceType === "RECURRING";
  const disc = discPct(svc.individualPrice, svc.offerPrice);
  const total = withGst(svc.offerPrice, svc.gstPercentage, svc.isGstApplicable);

  /* ─────────────────────────── RENDER ─────────────────────────────── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-50)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <style>{`
        @keyframes svcSpin   { to { transform: rotate(360deg); } }
        @keyframes svcFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .svc-animate  { animation: svcFadeUp 0.3s ease both; animation-delay: var(--delay, 0ms); }
        .edit-inp:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px var(--color-primary-muted); outline: none; }
        .del-btn:hover  { background: var(--error-50) !important; color: var(--error-600) !important; }
        .add-btn:hover  { border-color: var(--color-primary) !important; color: var(--color-primary) !important; }
        @media (max-width: 768px) {
          .svc-grid { grid-template-columns: 1fr !important; }
          .svc-hero { height: 200px !important; }
        }
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
            {/* Modal header */}
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

            {/* Image dimension info */}
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

            {/* Cropper canvas */}
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

            {/* Zoom slider */}
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

            {/* Action buttons */}
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
                      style={{ animation: "svcSpin 0.7s linear infinite" }}
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

      <PageHeader title="Service Details" subtitle={svc.name} />

      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "24px 16px 56px",
        }}
      >
        <div
          className="svc-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 320px",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* ══════════ LEFT ══════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ── Hero / Service Info card ── */}
            <div
              className="svc-animate"
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
                    <Layers
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
                    Service Info
                  </span>
                </div>
                {/* Two buttons: Photo + Edit */}
                <div style={{ display: "flex", gap: 6 }}>
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

              {/* Photo */}
              <div
                className="svc-hero"
                style={{
                  height: 230,
                  background: "var(--primary-50)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {(isOpen("photo") ? photoPreview : svc.photoUrl) ? (
                  <img
                    src={isOpen("photo") ? photoPreview : svc.photoUrl}
                    alt={svc.name}
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
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: "rgba(0,0,0,0.55)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                    }}
                  >
                    {isRecurring ? (
                      <>
                        <Repeat2 size={12} strokeWidth={2.5} /> Recurring
                      </>
                    ) : (
                      <>
                        <Zap size={12} strokeWidth={2.5} /> One-time
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Photo edit panel */}
              {isOpen("photo") && (
                <div
                  style={{
                    padding: 20,
                    borderBottom: "1px solid var(--neutral-100)",
                  }}
                >
                  {/* Hidden file input — now triggers crop flow */}
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoFile}
                  />
                  <div
                    onClick={() => photoRef.current?.click()}
                    style={{
                      border: "2px dashed var(--neutral-200)",
                      borderRadius: 10,
                      padding: "18px 12px",
                      textAlign: "center",
                      cursor: "pointer",
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
                      size={20}
                      color="var(--neutral-300)"
                      style={{ marginBottom: 6 }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--neutral-500)",
                      }}
                    >
                      {photoDraft
                        ? photoDraft.name
                        : "Click to choose a new image"}
                    </p>
                    <p
                      style={{
                        margin: "3px 0 0",
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

              {/* Info body — view or edit */}
              <div style={{ padding: 20 }}>
                {!isOpen("info") ? (
                  /* View */
                  <>
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
                      {svc.name}
                    </h1>
                    <p
                      style={{
                        margin: "0 0 18px",
                        fontSize: 14,
                        color: "var(--neutral-500)",
                        lineHeight: 1.65,
                      }}
                    >
                      {svc.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {subName && (
                        <Badge variant="primary">
                          <Layers size={11} strokeWidth={2.5} />
                          {subName}
                        </Badge>
                      )}
                      {isRecurring && svc.frequency && (
                        <Badge variant="neutral">
                          <CalendarDays size={11} strokeWidth={2.5} />
                          {FREQ_LABEL[svc.frequency] ?? svc.frequency}
                        </Badge>
                      )}
                      {isRecurring && svc.duration && (
                        <Badge variant="neutral">
                          <Clock size={11} strokeWidth={2.5} />
                          {svc.duration}{" "}
                          {DUR_LABEL[svc.durationUnit] ?? svc.durationUnit}
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  /* Edit */
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <Label req>Service Name</Label>
                      <input
                        className="edit-inp"
                        value={infoDraft.name}
                        onChange={(e) =>
                          setInfoDraft((p) => ({ ...p, name: e.target.value }))
                        }
                        style={inp}
                        placeholder="e.g. Website Development"
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
                        rows={3}
                        style={{ ...inp, resize: "vertical" }}
                        placeholder="Describe this service…"
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div>
                        <Label req>Service Type</Label>
                        <SelWrap>
                          <select
                            className="edit-inp"
                            value={infoDraft.serviceType}
                            onChange={(e) =>
                              setInfoDraft((p) => ({
                                ...p,
                                serviceType: e.target.value,
                              }))
                            }
                            style={sel}
                          >
                            {SVC_TYPES.map((o) => (
                              <option key={o.v} value={o.v}>
                                {o.l}
                              </option>
                            ))}
                          </select>
                        </SelWrap>
                      </div>
                      <div>
                        <Label>Subcategory</Label>
                        <SelWrap>
                          <select
                            className="edit-inp"
                            value={infoDraft.subCategoryId}
                            onChange={(e) =>
                              setInfoDraft((p) => ({
                                ...p,
                                subCategoryId: e.target.value,
                              }))
                            }
                            style={sel}
                          >
                            <option value="">Select…</option>
                            {subcategories.map((s) => (
                              <option
                                key={s.subCategoryId}
                                value={s.subCategoryId}
                              >
                                {s.subCategoryName}
                              </option>
                            ))}
                          </select>
                        </SelWrap>
                      </div>
                    </div>
                    {infoDraft.serviceType === "RECURRING" && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 12,
                          paddingTop: 12,
                          borderTop: "1px solid var(--neutral-100)",
                        }}
                      >
                        <div>
                          <Label>Frequency</Label>
                          <SelWrap>
                            <select
                              className="edit-inp"
                              value={infoDraft.frequency}
                              onChange={(e) =>
                                setInfoDraft((p) => ({
                                  ...p,
                                  frequency: e.target.value,
                                }))
                              }
                              style={sel}
                            >
                              <option value="">Select…</option>
                              {FREQ_OPTS.map((o) => (
                                <option key={o.v} value={o.v}>
                                  {o.l}
                                </option>
                              ))}
                            </select>
                          </SelWrap>
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <input
                            className="edit-inp"
                            type="number"
                            min="1"
                            value={infoDraft.duration}
                            onChange={(e) =>
                              setInfoDraft((p) => ({
                                ...p,
                                duration: e.target.value,
                              }))
                            }
                            style={inp}
                            placeholder="e.g. 30"
                          />
                        </div>
                        <div>
                          <Label>Unit</Label>
                          <SelWrap>
                            <select
                              className="edit-inp"
                              value={infoDraft.durationUnit}
                              onChange={(e) =>
                                setInfoDraft((p) => ({
                                  ...p,
                                  durationUnit: e.target.value,
                                }))
                              }
                              style={sel}
                            >
                              {DUR_OPTS.map((o) => (
                                <option key={o.v} value={o.v}>
                                  {o.l}
                                </option>
                              ))}
                            </select>
                          </SelWrap>
                        </div>
                      </div>
                    )}
                    <EditFooter onSave={saveInfo} saving={saving} />
                  </div>
                )}
              </div>
            </div>

            {/* ── What's Included (points) ── */}
            <Section
              icon={CheckCircle2}
              title="What's Included"
              delay={60}
              onEdit={() => (isOpen("points") ? close() : open("points"))}
              editOpen={isOpen("points")}
            >
              {!isOpen("points") ? (
                svc.points.length === 0 ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--neutral-400)",
                      fontStyle: "italic",
                    }}
                  >
                    No highlights added yet.
                  </p>
                ) : (
                  svc.points.map((pt, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "9px 0",
                        borderBottom:
                          i < svc.points.length - 1
                            ? "1px solid var(--neutral-100)"
                            : "none",
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        strokeWidth={2.2}
                        style={{
                          color: BULLET_COLORS[i % BULLET_COLORS.length],
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          color: "var(--neutral-700)",
                          lineHeight: 1.55,
                          fontWeight: 500,
                        }}
                      >
                        {pt}
                      </span>
                    </div>
                  ))
                )
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {pointsDraft.map((pt, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        className="edit-inp"
                        value={pt}
                        onChange={(e) => pUpd(i, e.target.value)}
                        placeholder={`Highlight ${i + 1}`}
                        style={{ ...inp, flex: 1 }}
                      />
                      <button
                        className="del-btn"
                        onClick={() => pDel(i)}
                        style={{
                          padding: "6px 8px",
                          border: "1px solid var(--neutral-200)",
                          borderRadius: 7,
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--neutral-400)",
                          lineHeight: 0,
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-btn"
                    onClick={pAdd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      border: "1.5px dashed var(--neutral-200)",
                      borderRadius: 8,
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--neutral-400)",
                      fontFamily: "var(--font-sans)",
                      marginTop: 2,
                    }}
                  >
                    <Plus size={13} /> Add Highlight
                  </button>
                  <EditFooter onSave={savePoints} saving={saving} />
                </div>
              )}
            </Section>

            {/* ── Input Fields ── */}
            <Section
              icon={FormInput}
              title="What You Need to Fill In"
              delay={120}
              onEdit={() => (isOpen("fields") ? close() : open("fields"))}
              editOpen={isOpen("fields")}
            >
              {!isOpen("fields") ? (
                fields.length === 0 ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--neutral-400)",
                      fontStyle: "italic",
                    }}
                  >
                    No input fields configured.
                  </p>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {fields.map((f, i) => (
                      <div
                        key={f.fieldId ?? i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          padding: "10px 14px",
                          borderRadius: 10,
                          background: f.required
                            ? "var(--primary-50)"
                            : "var(--neutral-50)",
                          border: `1px solid ${f.required ? "var(--color-primary-border)" : "var(--neutral-100)"}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              background: f.required
                                ? "var(--primary-100)"
                                : "var(--neutral-100)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FormInput
                              size={14}
                              strokeWidth={2}
                              color={
                                f.required
                                  ? "var(--color-primary)"
                                  : "var(--neutral-400)"
                              }
                            />
                          </div>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--neutral-800)",
                              }}
                            >
                              {f.label}
                            </p>
                            <p
                              style={{
                                margin: "2px 0 0",
                                fontSize: 11,
                                color: "var(--neutral-400)",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              {f.type}
                            </p>
                          </div>
                        </div>
                        <Badge variant={f.required ? "primary" : "neutral"}>
                          {f.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {fieldsDraft.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        border: "1px solid var(--neutral-200)",
                        borderRadius: 10,
                        padding: 14,
                        background: "var(--neutral-50)",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 120px auto",
                          gap: 8,
                          alignItems: "end",
                        }}
                      >
                        <div>
                          <Label req>Label</Label>
                          <input
                            className="edit-inp"
                            value={f.label}
                            onChange={(e) => fUpd(i, "label", e.target.value)}
                            style={inp}
                            placeholder="e.g. Full Name"
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <SelWrap>
                            <select
                              className="edit-inp"
                              value={f.type}
                              onChange={(e) => fUpd(i, "type", e.target.value)}
                              style={sel}
                            >
                              {FIELD_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </SelWrap>
                        </div>
                        <button
                          className="del-btn"
                          onClick={() => fDel(i)}
                          style={{
                            padding: "8px 10px",
                            border: "1px solid var(--neutral-200)",
                            borderRadius: 8,
                            background: "transparent",
                            cursor: "pointer",
                            color: "var(--neutral-400)",
                            lineHeight: 0,
                            marginBottom: 1,
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: 12,
                          alignItems: "center",
                          marginTop: 8,
                        }}
                      >
                        <div>
                          <Label>Placeholder</Label>
                          <input
                            className="edit-inp"
                            value={f.placeholder ?? ""}
                            onChange={(e) =>
                              fUpd(i, "placeholder", e.target.value)
                            }
                            style={inp}
                            placeholder="e.g. Enter your name"
                          />
                        </div>
                        <div style={{ paddingTop: 18 }}>
                          <Toggle
                            checked={!!f.required}
                            onChange={(v) => fUpd(i, "required", v)}
                            label="Required"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="add-btn"
                    onClick={fAdd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 14px",
                      border: "1.5px dashed var(--neutral-200)",
                      borderRadius: 9,
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--neutral-400)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <Plus size={13} /> Add Field
                  </button>
                  <EditFooter onSave={saveFields} saving={saving} />
                </div>
              )}
            </Section>

            {/* ── Track Steps ── */}
            <Section
              icon={ListChecks}
              title="How It Works — Step by Step"
              delay={180}
              onEdit={() => (isOpen("steps") ? close() : open("steps"))}
              editOpen={isOpen("steps")}
            >
              {!isOpen("steps") ? (
                steps.length === 0 ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--neutral-400)",
                      fontStyle: "italic",
                    }}
                  >
                    No steps defined yet.
                  </p>
                ) : (
                  steps.map((s, i) => {
                    const color = STEP_COLORS[i % STEP_COLORS.length];
                    return (
                      <div
                        key={s.stepId ?? i}
                        style={{ display: "flex", gap: 12 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexShrink: 0,
                            width: 32,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: color,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {s.order}
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              style={{
                                width: 2,
                                flex: 1,
                                background: "var(--neutral-100)",
                                marginTop: 5,
                                borderRadius: 2,
                                minHeight: 16,
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            paddingBottom: i < steps.length - 1 ? 16 : 0,
                            paddingTop: 4,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              fontWeight: 700,
                              color: "var(--neutral-900)",
                              lineHeight: 1.3,
                            }}
                          >
                            {s.title}
                          </p>
                          {s.description && (
                            <p
                              style={{
                                margin: "3px 0 0",
                                fontSize: 12,
                                color: "var(--neutral-400)",
                                lineHeight: 1.55,
                              }}
                            >
                              {s.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {stepsDraft.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        border: "1px solid var(--neutral-200)",
                        borderRadius: 10,
                        padding: 12,
                        background: "var(--neutral-50)",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: STEP_COLORS[i % STEP_COLORS.length],
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <input
                          className="edit-inp"
                          value={s.title}
                          onChange={(e) => sUpd(i, "title", e.target.value)}
                          style={inp}
                          placeholder="Step title"
                        />
                        <textarea
                          className="edit-inp"
                          value={s.description}
                          onChange={(e) =>
                            sUpd(i, "description", e.target.value)
                          }
                          rows={2}
                          style={{ ...inp, resize: "none" }}
                          placeholder="Short description"
                        />
                      </div>
                      <button
                        className="del-btn"
                        onClick={() => sDel(i)}
                        disabled={stepsDraft.length <= 1}
                        style={{
                          padding: "6px 8px",
                          border: "1px solid var(--neutral-200)",
                          borderRadius: 8,
                          background: "transparent",
                          cursor:
                            stepsDraft.length <= 1 ? "not-allowed" : "pointer",
                          color: "var(--neutral-400)",
                          lineHeight: 0,
                          opacity: stepsDraft.length <= 1 ? 0.35 : 1,
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-btn"
                    onClick={sAdd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 14px",
                      border: "1.5px dashed var(--neutral-200)",
                      borderRadius: 9,
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--neutral-400)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <Plus size={13} /> Add Step
                  </button>
                  <EditFooter onSave={saveSteps} saving={saving} />
                </div>
              )}
            </Section>

            {/* ── Required Documents (recurring only) ── */}
            {isRecurring && (
              <Section
                icon={FileText}
                title="Documents You'll Need"
                delay={240}
                onEdit={() => (isOpen("docs") ? close() : open("docs"))}
                editOpen={isOpen("docs")}
              >
                {!isOpen("docs") ? (
                  !svc.documentsRequired || docs.length === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 14px",
                        background: "var(--success-50)",
                        borderRadius: 10,
                        border: "1px solid var(--success-100)",
                      }}
                    >
                      <ThumbsUp
                        size={16}
                        color="var(--success-600)"
                        strokeWidth={2.2}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          color: "var(--success-700)",
                          fontWeight: 500,
                        }}
                      >
                        No documents needed — nice and easy!
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {docs
                        .filter((d) => d.name?.trim())
                        .map((d) => (
                          <div
                            key={d.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 14px",
                              background: "var(--warning-50)",
                              border: "1px solid var(--warning-100)",
                              borderRadius: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: "var(--warning-100)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <FileText
                                size={14}
                                strokeWidth={2.2}
                                color="var(--warning-700)"
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--neutral-800)",
                                flex: 1,
                              }}
                            >
                              {d.name}
                            </span>
                            <Badge variant="warning">{d.inputType}</Badge>
                          </div>
                        ))}
                    </div>
                  )
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {docsDraft.map((d, i) => (
                      <div
                        key={d.id ?? i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <input
                          className="edit-inp"
                          value={d.name}
                          onChange={(e) => dUpd(i, "name", e.target.value)}
                          style={{ ...inp, flex: 1 }}
                          placeholder="e.g. Aadhaar Card"
                        />
                        <SelWrap>
                          <select
                            className="edit-inp"
                            value={d.inputType}
                            onChange={(e) =>
                              dUpd(i, "inputType", e.target.value)
                            }
                            style={{ ...sel, width: 90 }}
                          >
                            {DOC_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </SelWrap>
                        <button
                          className="del-btn"
                          onClick={() => dDel(i)}
                          style={{
                            padding: "7px 9px",
                            border: "1px solid var(--neutral-200)",
                            borderRadius: 7,
                            background: "transparent",
                            cursor: "pointer",
                            color: "var(--neutral-400)",
                            lineHeight: 0,
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="add-btn"
                      onClick={dAdd}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 14px",
                        border: "1.5px dashed var(--neutral-200)",
                        borderRadius: 9,
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--neutral-400)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      <Plus size={13} /> Add Document
                    </button>
                    <EditFooter onSave={saveDocs} saving={saving} />
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* ══════════ RIGHT ══════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ── Pricing ── */}
            <Section
              icon={CreditCard}
              title="Pricing"
              delay={40}
              onEdit={() => (isOpen("pricing") ? close() : open("pricing"))}
              editOpen={isOpen("pricing")}
            >
              {!isOpen("pricing") ? (
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
                      You Pay
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
                      {inr(svc.offerPrice)}
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
                      {inr(svc.individualPrice)}
                    </span>
                  </InfoRow>
                  <InfoRow label="Offer price">
                    <span
                      style={{ color: "var(--color-primary)", fontWeight: 700 }}
                    >
                      {inr(svc.offerPrice)}
                    </span>
                  </InfoRow>
                  <InfoRow
                    label="GST"
                    last={!svc.isGstApplicable || total <= 0}
                  >
                    {svc.isGstApplicable ? (
                      <Badge variant="warning">
                        <Percent size={11} strokeWidth={2.5} />
                        {svc.gstPercentage}% added
                      </Badge>
                    ) : (
                      <Badge variant="neutral">Not applicable</Badge>
                    )}
                  </InfoRow>
                  {svc.isGstApplicable && total > 0 && (
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
                        {inr(total)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
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
                      <Label req>Listed Price (₹)</Label>
                      <input
                        className="edit-inp"
                        type="number"
                        value={priceDraft.individualPrice}
                        onChange={(e) =>
                          setPriceDraft((p) => ({
                            ...p,
                            individualPrice: e.target.value,
                          }))
                        }
                        style={inp}
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <Label req>Offer Price (₹)</Label>
                      <input
                        className="edit-inp"
                        type="number"
                        value={priceDraft.offerPrice}
                        onChange={(e) =>
                          setPriceDraft((p) => ({
                            ...p,
                            offerPrice: e.target.value,
                          }))
                        }
                        style={inp}
                        placeholder="8000"
                      />
                    </div>
                  </div>
                  {priceDraft.individualPrice &&
                    priceDraft.offerPrice &&
                    discPct(priceDraft.individualPrice, priceDraft.offerPrice) >
                      0 && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--success-600)",
                        }}
                      >
                        {discPct(
                          priceDraft.individualPrice,
                          priceDraft.offerPrice,
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
                              withGst(
                                priceDraft.offerPrice,
                                priceDraft.gstPercentage,
                                priceDraft.isGstApplicable,
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

            {/* ── Quick Facts (read-only) ── */}
            <Section icon={LayoutList} title="Quick Facts" delay={100}>
              <InfoRow label="Service type">
                <Badge variant={isRecurring ? "primary" : "neutral"}>
                  {isRecurring ? (
                    <>
                      <Repeat2 size={11} strokeWidth={2.5} /> Recurring
                    </>
                  ) : (
                    <>
                      <Zap size={11} strokeWidth={2.5} /> One-time
                    </>
                  )}
                </Badge>
              </InfoRow>
              <InfoRow label="Steps to complete">{steps.length} steps</InfoRow>
              <InfoRow label="Fields to fill">{fields.length} fields</InfoRow>
              {isRecurring && svc.frequency && (
                <InfoRow label="Billing">
                  {FREQ_LABEL[svc.frequency] ?? svc.frequency}
                </InfoRow>
              )}
              {isRecurring && svc.duration && (
                <InfoRow label="Contract length">
                  {svc.duration} {DUR_LABEL[svc.durationUnit] ?? ""}
                </InfoRow>
              )}
              <InfoRow label="Documents needed" last>
                {svc.documentsRequired ? (
                  <Badge variant="warning">
                    <ShieldCheck size={11} strokeWidth={2.5} />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="success">
                    <ShieldCheck size={11} strokeWidth={2.5} />
                    None
                  </Badge>
                )}
              </InfoRow>
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
