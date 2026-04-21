import React, { useEffect, useState } from "react";
import { useService } from "../ServiceContext";
import {
  Edit2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  FileText,
  Upload,
  Type,
  ChevronRight,
  Loader2,
  Sparkles,
  RotateCcw,
  LayoutList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@src/providers/axiosInstance";

/* ─── helpers ─────────────────────────────────────────────── */
const FREQUENCY_MAP = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};
const DURATION_MAP = { DAY: "Days", MONTH: "Months", YEAR: "Years" };

/* ─── sub-components ──────────────────────────────────────── */
function ReviewCard({ title, stepNumber, onEdit, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-neutral-50/80">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-sm">
            {stepNumber}
          </span>
          <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-primary hover:bg-primary/5 transition-colors px-2 py-1 rounded-lg"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, span }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-neutral-900 break-words">
        {value}
      </p>
    </div>
  );
}

function FieldPill({ label, type, required }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-100">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-neutral-800">{label}</span>
        <span className="text-xs text-neutral-400 capitalize">({type})</span>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          required
            ? "bg-primary/10 text-primary"
            : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {required ? "Required" : "Optional"}
      </span>
    </div>
  );
}

/* ─── Loading overlay ─────────────────────────────────────── */
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-5 w-full max-w-xs">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-neutral-900">
            Publishing Service…
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Please don't close this tab
          </p>
        </div>
        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ─── Success modal ───────────────────────────────────────── */
function SuccessModal({ onCreateAnother, onViewList }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-warning-500 to-primary" />
        <div className="px-8 py-8 text-center">
          <div className="relative mx-auto w-20 h-20 mb-5">
            <div className="w-20 h-20 rounded-full bg-success-50 border-4 border-success-100 flex items-center justify-center">
              <CheckCircle
                className="w-10 h-10 text-success-500"
                strokeWidth={1.5}
              />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-warning-500 flex items-center justify-center shadow">
              <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Service Published! 🎉
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            Your service is now live. Clients can discover and book it right
            away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCreateAnother}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Create Another
            </button>
            <button
              onClick={onViewList}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm shadow-primary/30"
            >
              <LayoutList className="w-4 h-4" />
              View Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Error banner ────────────────────────────────────────── */
function ErrorBanner({ message, onDismiss, onRetry }) {
  return (
    <div className="flex items-start gap-3 bg-error/5 border border-error/25 rounded-xl px-4 py-4">
      <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900">
          Submission Failed
        </p>
        <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-error hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Try again
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-error/10 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4 text-neutral-400" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function ReviewPublish() {
  const {
    basicInfo,
    categories,
    filteredSubcategories,
    selectedMasterFields,
    customFields,
    trackSteps,
    priceMode,
    discountPercentage,
    masterFields,
    newCustomField,
    loading,
    setLoading,
    error,
    setError,
    resetForm,
    goToPreviousStep,
    goToStep,
    submissionStatus,
    setSubmissionStatus,
    showSuccessPopup,
    setShowSuccessPopup,
    requiredDocuments,
    points,
  } = useService();

  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");

  /* ─── helpers ─────────────────────────────────────────────── */
  const getCategoryName = () =>
    categories.find((c) => c.categoryId === basicInfo.categoryId)
      ?.categoryName || "—";
  const getSubcategoryName = () =>
    filteredSubcategories.find(
      (s) => s.subCategoryId === basicInfo.subCategoryId,
    )?.subCategoryName || "—";
  const getMasterFieldName = (id) =>
    masterFields.find((f) => f.masterFieldId === id)?.label || id;
  const getFrequencyLabel = () => FREQUENCY_MAP[basicInfo.frequency] || "—";
  const getDurationUnit = () => DURATION_MAP[basicInfo.durationUnit] || "—";

  const validDocs = requiredDocuments.filter((d) => d.documentName?.trim());
  const isSubmitting = submissionStatus === "loading" || loading;
  const hasUnsavedField = newCustomField?.label?.trim();

  /* ─── Compute final price: offerPrice + GST (if applicable) ── */
  const computeFinalPrice = () => {
    // Resolve the effective offer price
    let offerPrice = parseFloat(basicInfo.offerPrice);

    // If percentage mode, derive offerPrice from individualPrice & discount
    if (priceMode === "percentage") {
      const individualPrice = parseFloat(basicInfo.individualPrice);
      const discount = parseFloat(discountPercentage);
      if (
        !isNaN(individualPrice) &&
        !isNaN(discount) &&
        discount >= 0 &&
        discount <= 100
      ) {
        offerPrice = individualPrice - (individualPrice * discount) / 100;
      }
    }

    if (isNaN(offerPrice) || offerPrice <= 0) return 0;

    if (basicInfo.isGstApplicable) {
      const gst = parseFloat(basicInfo.gstPercentage);
      if (!isNaN(gst) && gst > 0) {
        return Math.round(offerPrice + (offerPrice * gst) / 100);
      }
    }

    return Math.round(offerPrice);
  };

  const finalPrice = computeFinalPrice();

  /* ── submit ── */
  const doSubmit = async () => {
    setLocalError("");
    setError("");
    setSubmissionStatus("loading");
    setLoading(true);

    try {
      /* auto-include unsaved custom field */
      let finalCustomFields = [...customFields];
      if (newCustomField?.label?.trim()) {
        const f = {
          label: newCustomField.label.trim(),
          type: newCustomField.type,
          placeholder:
            newCustomField.placeholder ||
            `Enter ${newCustomField.label.toLowerCase()}`,
          required: newCustomField.required,
        };
        if (["select", "radio", "checkbox"].includes(newCustomField.type)) {
          const opts = newCustomField.options.filter((o) => o?.trim());
          if (opts.length) f.options = opts;
        }
        finalCustomFields.push(f);
      }

      /* client-side required-field check */
      const missing = [];
      if (!basicInfo.categoryId) missing.push("Category");
      if (!basicInfo.subCategoryId) missing.push("Subcategory");
      if (!basicInfo.name) missing.push("Service name");
      if (!basicInfo.description) missing.push("Description");
      if (!basicInfo.individualPrice) missing.push("Individual price");
      if (!basicInfo.offerPrice) missing.push("Offer price");
      if (!basicInfo.serviceType) missing.push("Service type");
      if (!basicInfo.photoFile) missing.push("Service image");
      if (basicInfo.serviceType === "RECURRING") {
        if (!basicInfo.frequency) missing.push("Frequency");
        if (!basicInfo.duration) missing.push("Duration");
        if (!basicInfo.durationUnit) missing.push("Duration unit");
        if (basicInfo.documentsRequired && validDocs.length === 0)
          missing.push("At least one required document name");
      }
      if (missing.length)
        throw new Error(`Please complete: ${missing.join(", ")}`);

      /* ── BUILD FormData ── */
      const fd = new FormData();
      fd.append("name", basicInfo.name.trim());
      fd.append("description", basicInfo.description.trim());
      fd.append("serviceType", basicInfo.serviceType);
      fd.append(
        "documentsRequired",
        String(
          basicInfo.serviceType === "RECURRING"
            ? (basicInfo.documentsRequired ?? false)
            : false,
        ),
      );
      fd.append(
        "individualPrice",
        String(parseFloat(basicInfo.individualPrice)),
      );
      fd.append("offerPrice", String(parseFloat(basicInfo.offerPrice)));
      fd.append("isGstApplicable", String(basicInfo.isGstApplicable));
      fd.append(
        "gstPercentage",
        basicInfo.isGstApplicable
          ? String(parseFloat(basicInfo.gstPercentage))
          : "0",
      );

      /* ── FIXED: send computed offerPrice + GST as finalIndividualPrice ── */
      fd.append("finalIndividualPrice", String(finalPrice));

      fd.append("employeeId", basicInfo.employeeId);
      fd.append("subCategoryId", basicInfo.subCategoryId);

      if (basicInfo.serviceType === "RECURRING") {
        fd.append("frequency", basicInfo.frequency);
        fd.append("duration", String(parseInt(basicInfo.duration, 10)));
        fd.append("durationUnit", basicInfo.durationUnit);

        const docsPayload =
          basicInfo.documentsRequired && validDocs.length > 0
            ? validDocs.map(({ documentName, inputType }) => ({
                documentName: documentName.trim(),
                inputType,
              }))
            : [];
        fd.append("requiredDocuments", JSON.stringify(docsPayload));
      }

      /* image — required */
      if (!basicInfo.photoFile) throw new Error("Service image is required");
      fd.append("photoUrl", basicInfo.photoFile, basicInfo.photoFile.name);

      /* points — JSON array of highlight strings */
      fd.append("points", JSON.stringify(points && points.length > 0 ? points : []));

      /* ── LOG final payload ── */
      const payloadPreview = {
        name: basicInfo.name.trim(),
        description: basicInfo.description.trim(),
        serviceType: basicInfo.serviceType,
        documentsRequired: basicInfo.serviceType === "RECURRING" ? (basicInfo.documentsRequired ?? false) : false,
        individualPrice: parseFloat(basicInfo.individualPrice),
        offerPrice: parseFloat(basicInfo.offerPrice),
        isGstApplicable: basicInfo.isGstApplicable,
        gstPercentage: basicInfo.isGstApplicable ? parseFloat(basicInfo.gstPercentage) : 0,
        finalIndividualPrice: finalPrice,
        employeeId: basicInfo.employeeId,
        subCategoryId: basicInfo.subCategoryId,
        ...(basicInfo.serviceType === "RECURRING" && {
          frequency: basicInfo.frequency,
          duration: parseInt(basicInfo.duration, 10),
          durationUnit: basicInfo.durationUnit,
          requiredDocuments: basicInfo.documentsRequired && validDocs.length > 0
            ? validDocs.map(({ documentName, inputType }) => ({ documentName: documentName.trim(), inputType }))
            : [],
        }),
        photoUrl: basicInfo.photoFile?.name,
        points: points && points.length > 0 ? points : [],
      };
      console.log("📦 POST /admin/service — Final Payload:", payloadPreview);

      /* ── POST /service ── */
      const res = await axiosInstance.post(`/admin/service`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const json = res.data;

      if (!json.success) {
        throw new Error(
          json.error || json.message || "Service creation failed",
        );
      }

      const serviceId = json.service?.serviceId || json.data?.serviceId;
      if (!serviceId)
        throw new Error(
          "Service created but no ID was returned. Contact support.",
        );

      /* ── POST /input-fields (optional) ── */
      if (finalCustomFields.length > 0 || selectedMasterFields.length > 0) {
        const fields = [];

        finalCustomFields.forEach((f) => {
          const obj = {
            label: f.label,
            type: f.type,
            placeholder: f.placeholder || "",
            required: f.required || false,
          };
          if (
            ["select", "radio", "checkbox"].includes(f.type) &&
            f.options?.length
          )
            obj.options = f.options;
          fields.push(obj);
        });

        selectedMasterFields.forEach((f) => {
          const master = masterFields.find(
            (m) => m.masterFieldId === f.masterFieldId,
          );
          const obj = {
            masterFieldId: f.masterFieldId,
            required: f.required || false,
          };
          if (master?.options?.length) obj.options = master.options;
          fields.push(obj);
        });

        try {
          const r = await axiosInstance.post(
            `/admin/service/${serviceId}/input-fields`,
            { fields },
          );
          const d = r.data;
          if (!d.success) console.warn("[input-fields]", d.error || d.message);
        } catch (e) {
          console.warn("[input-fields] non-critical error:", e.message);
        }
      }

      /* ── POST /track-steps (optional) ── */
      if (trackSteps.length > 0) {
        try {
          const r = await axiosInstance.post(
            `/admin/service/${serviceId}/track-steps`,
            {
              steps: trackSteps.map((s) => ({
                title: s.title,
                description: s.description,
                order: s.order,
              })),
            },
          );
          const d = r.data;
          if (!d.success) console.warn("[track-steps]", d.error || d.message);
        } catch (e) {
          console.warn("[track-steps] non-critical error:", e.message);
        }
      }

      setSubmissionStatus("success");
      setShowSuccessPopup(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      setLocalError(errorMessage);
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLocalError("");
    setError("");
    setSubmissionStatus("idle");
    doSubmit();
  };

  useEffect(() => {
  const handleWheel = (e) => {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  };

  window.addEventListener("wheel", handleWheel);
  return () => window.removeEventListener("wheel", handleWheel);
}, []);

  /* ═══════════════════════════ RENDER ═══════════════════════ */
  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      {showSuccessPopup && (
        <SuccessModal
          onCreateAnother={() => {
            resetForm();
            setShowSuccessPopup(false);
          }}
          onViewList={() => {
            resetForm();
            setShowSuccessPopup(false);
            navigate("/services-hub");
          }}
        />
      )}

      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Review & Publish
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Double-check everything before going live.
          </p>
        </div>

        {/* Error banner */}
        {(localError || error) && (
          <ErrorBanner
            message={localError || error}
            onDismiss={() => {
              setLocalError("");
              setError("");
              setSubmissionStatus("idle");
            }}
            onRetry={handleRetry}
          />
        )}

        {/* ── Card 1: Service Info ── */}
        <ReviewCard
          title="Service Information"
          stepNumber={1}
          onEdit={() => goToStep(1)}
        >
          {basicInfo.photoUrl && (
            <div className="mb-4">
              <img
                src={basicInfo.photoUrl}
                alt="Service"
                className="w-full h-36 object-cover rounded-xl border border-neutral-200"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <InfoRow
              label="Service Type"
              value={
                basicInfo.serviceType === "ONE_TIME" ? "One Time" : "Recurring"
              }
            />
            <InfoRow label="Category" value={getCategoryName()} />
            <InfoRow label="Subcategory" value={getSubcategoryName()} span />
            <InfoRow label="Service Name" value={basicInfo.name} span />
            <InfoRow label="Description" value={basicInfo.description} span />
            {basicInfo.serviceType === "RECURRING" && (
              <>
                <InfoRow label="Frequency" value={getFrequencyLabel()} />
                <InfoRow
                  label="Duration"
                  value={`${basicInfo.duration} ${getDurationUnit()}`}
                />
              </>
            )}
          </div>

          {/* Service Highlight Points */}
          {points && points.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-xs font-semibold text-neutral-600 mb-2 flex items-center gap-1.5">
                Service Highlights
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {points.length}
                </span>
              </p>
              <ul className="space-y-1.5">
                {points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs text-neutral-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required documents (RECURRING only) */}
          {basicInfo.serviceType === "RECURRING" &&
            basicInfo.documentsRequired && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-600 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Required Documents
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {validDocs.length}
                  </span>
                </p>

                {validDocs.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-warning-600 bg-warning/10 border border-warning/30 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    No document names filled in — an empty array will be sent
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {validDocs.map((doc) => (
                      <span
                        key={doc.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700"
                      >
                        {doc.inputType === "file" ? (
                          <Upload className="w-3 h-3 text-primary" />
                        ) : (
                          <Type className="w-3 h-3 text-warning-500" />
                        )}
                        {doc.documentName}
                        <span className="text-neutral-300">·</span>
                        <span className="text-neutral-400 capitalize">
                          {doc.inputType}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
        </ReviewCard>

        {/* ── Card 2: Pricing ── */}
        <ReviewCard title="Pricing" stepNumber={2} onEdit={() => goToStep(2)}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <InfoRow
              label="Actual Price"
              value={`₹${basicInfo.individualPrice || "0"}`}
            />
            <InfoRow
              label="Offer Price"
              value={`₹${basicInfo.offerPrice || "0"}`}
            />
            <InfoRow
              label="Pricing Mode"
              value={priceMode === "fixed" ? "Fixed Price" : "Discount %"}
            />
            {priceMode === "percentage" && discountPercentage && (
              <InfoRow label="Discount" value={`${discountPercentage}%`} />
            )}
            <InfoRow
              label="GST Applicable"
              value={basicInfo.isGstApplicable ? "Yes" : "No"}
            />
            {basicInfo.isGstApplicable && (
              <>
                <InfoRow
                  label="GST Rate"
                  value={`${basicInfo.gstPercentage}%`}
                />
                {/* ── FIXED: show computed offerPrice + GST ── */}
                <InfoRow
                  label="Final (Incl. GST)"
                  value={`₹${finalPrice}`}
                  span
                />
              </>
            )}
          </div>
        </ReviewCard>

        {/* ── Card 3: Dataset ── */}
        <ReviewCard
          title="Dataset / Input Fields"
          stepNumber={3}
          onEdit={() => goToStep(3)}
        >
          {!selectedMasterFields.length &&
          !customFields.length &&
          !hasUnsavedField ? (
            <p className="text-sm text-neutral-400 italic">
              No input fields configured
            </p>
          ) : (
            <div className="space-y-2">
              {hasUnsavedField && (
                <div className="flex items-center justify-between px-3 py-2 bg-warning/10 border border-warning/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning-500" />
                    <span className="text-xs font-medium text-neutral-700">
                      Unsaved:{" "}
                      <span className="text-warning-600">
                        {newCustomField.label}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    Will be auto-included
                  </span>
                </div>
              )}
              {selectedMasterFields.map((f, i) => (
                <FieldPill
                  key={`m-${i}`}
                  label={getMasterFieldName(f.masterFieldId)}
                  type="pre-defined"
                  required={f.required}
                />
              ))}
              {customFields.map((f, i) => (
                <FieldPill
                  key={`c-${i}`}
                  label={f.label}
                  type={f.type}
                  required={f.required}
                />
              ))}
            </div>
          )}
        </ReviewCard>

        {/* ── Card 4: Checklist ── */}
        <ReviewCard
          title={`Checklist Steps (${trackSteps.length})`}
          stepNumber={4}
          onEdit={() => goToStep(4)}
        >
          {trackSteps.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">
              No checklist steps configured
            </p>
          ) : (
            <ol className="space-y-2">
              {trackSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm">
                    {step.order}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {step.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </ReviewCard>

        {/* ── Action buttons ── */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={goToPreviousStep}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-neutral-700 border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={doSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                Publish Service
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}