import { useState, useEffect, useRef } from "react";
import axiosInstance from "@src/providers/axiosInstance";

/* ─── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
        bg-white border transition-all duration-300
        ${toast.type === "success" ? "border-green-100 text-green-700" : "border-red-100 text-red-600"}`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
      >
        {toast.type === "success" ? "✓" : "✕"}
      </span>
      {toast.message}
    </div>
  );
}

/* ─── Source Badge ───────────────────────────────────────────────────────── */
function SourceBadge({ source }) {
  const s = (source || "").toLowerCase();
  const style =
    s === "google"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : s === "facebook" || s === "instagram"
        ? "bg-orange-50 text-orange-700 border-orange-100"
        : s === "email"
          ? "bg-green-50 text-green-700 border-green-100"
          : "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
    >
      {source}
    </span>
  );
}

/* ─── Medium Badge ───────────────────────────────────────────────────────── */
function MediumBadge({ medium }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
      {medium}
    </span>
  );
}

/* ─── Skeleton Row ───────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[50, 30, 25, 20, 60].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-2.5 rounded-full bg-gray-100 animate-pulse"
            style={{ width: `${w}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

/* ─── Confirm Delete Modal ───────────────────────────────────────────────── */
function ConfirmDeleteModal({ campaign, onClose, onConfirm, loading }) {
  if (!campaign) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-lg">🗑</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Delete Campaign</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">
            "{campaign.campaignName}"
          </span>
          ?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Modal ─────────────────────────────────────────────────────────── */
function EditModal({ campaign, onClose, showToast, onUpdated }) {
  if (!campaign) return null;

  const [form, setForm] = useState({
    baseUrl: campaign.baseUrl || "",
    source: campaign.source || "",
    medium: campaign.medium || "",
    campaignName: campaign.campaignName || "",
    content: campaign.content || "",
    term: campaign.term || "",
    refCode: campaign.refCode || "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.baseUrl || !form.source || !form.medium || !form.campaignName) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.put(`/api/admin/utm/${campaign.utmCampaignId}`, form);
      showToast("Campaign updated successfully!", "success");
      onUpdated();
      onClose();
    } catch (err) {
      showToast(err?.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all";
  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-0.5">
              Edit Campaign
            </p>
            <h2 className="text-base font-bold text-gray-800">
              {campaign.campaignName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>
              Base URL <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls}
              value={form.baseUrl}
              onChange={(e) => set("baseUrl")(e.target.value)}
              placeholder="https://yoursite.com/page"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Source <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                value={form.source}
                onChange={(e) => set("source")(e.target.value)}
                placeholder="google"
              />
            </div>
            <div>
              <label className={labelCls}>
                Medium <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                value={form.medium}
                onChange={(e) => set("medium")(e.target.value)}
                placeholder="cpc"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls}
              value={form.campaignName}
              onChange={(e) => set("campaignName")(e.target.value)}
              placeholder="spring-sale-2025"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Content</label>
              <input
                className={inputCls}
                value={form.content}
                onChange={(e) => set("content")(e.target.value)}
                placeholder="banner-top"
              />
            </div>
            <div>
              <label className={labelCls}>Term</label>
              <input
                className={inputCls}
                value={form.term}
                onChange={(e) => set("term")(e.target.value)}
                placeholder="keyword-target"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Ref Code</label>
            <input
              className={inputCls}
              value={form.refCode}
              onChange={(e) => set("refCode")(e.target.value)}
              placeholder="REF123"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Modal ───────────────────────────────────────────────────────── */
function DetailModal({ campaign, onClose, showToast }) {
  if (!campaign) return null;

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!", "success");
  };

  const fields = [
    { label: "Campaign ID", value: campaign.utmCampaignId, mono: true },
    { label: "Base URL", value: campaign.baseUrl, mono: true },
    { label: "Source", value: campaign.source },
    { label: "Medium", value: campaign.medium },
    { label: "Campaign Name", value: campaign.campaignName },
    {
      label: "Content",
      value: campaign.content || "—",
      muted: !campaign.content,
    },
    { label: "Term", value: campaign.term || "—", muted: !campaign.term },
    {
      label: "Ref Code",
      value: campaign.refCode || "—",
      muted: !campaign.refCode,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-0.5">
              Campaign Detail
            </p>
            <h2 className="text-base font-bold text-gray-800">
              {campaign.campaignName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-3">
          {fields.map((f) => (
            <div
              key={f.label}
              className="flex justify-between items-start gap-4 py-2.5 border-b border-gray-50 last:border-0"
            >
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-32 flex-shrink-0 pt-0.5">
                {f.label}
              </span>
              <span
                className={`text-sm text-right break-all leading-relaxed
                  ${f.mono ? "font-mono text-xs text-gray-400" : "text-gray-700"}
                  ${f.muted ? "text-gray-300" : ""}`}
              >
                {f.value}
              </span>
            </div>
          ))}
        </div>

        {/* URL block */}
        <div className="mx-6 mb-6 rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2">
            Full UTM URL
          </p>
          <p className="font-mono text-xs text-red-700 break-all leading-relaxed bg-white border border-red-100 rounded-lg p-3 mb-3">
            {campaign.fullUrl}
          </p>
          <button
            onClick={() => copy(campaign.fullUrl)}
            className="w-full py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Copy URL
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Create Form ────────────────────────────────────────────────────────── */
function CreateForm({ showToast, onCreated }) {
  const [form, setForm] = useState({
    baseUrl: "",
    source: "",
    medium: "",
    campaignName: "",
    content: "",
    term: "",
    refCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!form.baseUrl || !form.source || !form.medium || !form.campaignName) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/api/admin/utm/create", form);
      setResult(data);
      showToast("Campaign created successfully!", "success");
      onCreated();
      setForm({
        baseUrl: "",
        source: "",
        medium: "",
        campaignName: "",
        content: "",
        term: "",
        refCode: "",
      });
    } catch (err) {
      showToast(err?.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all";
  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="flex gap-8 h-full">
      <div className="flex-1 min-w-0">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              Base URL <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls}
              placeholder="https://yoursite.com/page"
              value={form.baseUrl}
              onChange={(e) => set("baseUrl")(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Source <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="google"
                value={form.source}
                onChange={(e) => set("source")(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>
                Medium <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="cpc"
                value={form.medium}
                onChange={(e) => set("medium")(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls}
              placeholder="spring-sale-2025"
              value={form.campaignName}
              onChange={(e) => set("campaignName")(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-px bg-gray-100 self-stretch" />

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Content</label>
              <input
                className={inputCls}
                placeholder="banner-top"
                value={form.content}
                onChange={(e) => set("content")(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Term</label>
              <input
                className={inputCls}
                placeholder="keyword-target"
                value={form.term}
                onChange={(e) => set("term")(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Ref Code</label>
            <input
              className={inputCls}
              placeholder="REF123"
              value={form.refCode}
              onChange={(e) => set("refCode")(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide transition-colors"
        >
          {loading ? "Generating…" : "Generate UTM Campaign"}
        </button>

        {result && (
          <div className="mt-4 rounded-xl bg-green-50 border border-green-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-gray-700">
                Campaign Generated
              </span>
            </div>
            <p className="font-mono text-xs text-gray-600 break-all leading-relaxed bg-white border border-gray-100 rounded-lg p-3 mb-2">
              {result.fullUrl}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(result.fullUrl)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              Copy URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Campaign Table ─────────────────────────────────────────────────────── */
/* ─── Campaign Table ─────────────────────────────────────────────────────── */
function CampaignTable({ showToast, refreshKey }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Server-side state ──
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null); // { total, page, limit, totalPages }
  const LIMIT = 8;

  // Debounce search input (500ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchAll = async (
    currentPage = page,
    currentSearch = debouncedSearch,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: LIMIT,
        ...(currentSearch ? { search: currentSearch } : {}),
      });
      const { data } = await axiosInstance.get(`/api/admin/utm/all?${params}`);
      setCampaigns(data.data || []);
      setPagination(data.pagination || null);
    } catch {
      showToast("Failed to load campaigns", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page, debounced search, or refreshKey changes
  useEffect(() => {
    fetchAll(page, debouncedSearch);
  }, [page, debouncedSearch, refreshKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(
        `/api/admin/utm/${deleteTarget.utmCampaignId}`,
      );
      showToast("Campaign deleted successfully!", "success");
      setDeleteTarget(null);
      fetchAll();
    } catch (err) {
      showToast(
        err?.response?.data?.error || "Failed to delete campaign",
        "error",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none select-none">
            ⌕
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, source, medium, URL or ref code…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-sm transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => fetchAll(page, debouncedSearch)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "33%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Campaign Name",
                  "Source",
                  "Medium",
                  "Ref Code",
                  "Full URL",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(LIMIT)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-sm font-semibold text-red-400">
                      No campaigns found
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {search
                        ? "Try a different search"
                        : "Create your first UTM campaign"}
                    </p>
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr
                    key={c.utmCampaignId}
                    onClick={() => setSelected(c)}
                    className="border-b border-gray-50 hover:bg-red-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5 overflow-hidden">
                      <span className="font-medium text-sm text-gray-800 truncate block">
                        {c.campaignName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <SourceBadge source={c.source} />
                    </td>
                    <td className="px-4 py-3.5">
                      <MediumBadge medium={c.medium} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`font-mono text-xs ${c.refCode ? "text-gray-500" : "text-gray-200"}`}
                      >
                        {c.refCode || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="font-mono text-xs text-gray-300 truncate min-w-0">
                          {c.fullUrl}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(c.fullUrl);
                            showToast("Copied!", "success");
                          }}
                          className="opacity-0 group-hover:opacity-100 flex-shrink-0 px-2.5 py-1 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTarget(c);
                          }}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all text-xs"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(c);
                          }}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all text-xs"
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer — count + pagination */}
        {!loading && pagination && (
          <div className="px-4 py-3 border-t border-gray-50 bg-gray-50 flex items-center justify-between gap-4">
            {/* Count */}
            <p className="text-xs text-gray-400 whitespace-nowrap">
              {pagination.total === 0 ? (
                "No results"
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-gray-600">
                    {(pagination.page - 1) * pagination.limit + 1}–
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-600">
                    {pagination.total}
                  </span>{" "}
                  campaigns
                </>
              )}
            </p>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ‹
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-8 h-8 flex items-center justify-center text-xs text-gray-300"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors
                          ${
                            page === item
                              ? "bg-red-500 border-red-500 text-white"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selected && (
        <DetailModal
          campaign={selected}
          onClose={() => setSelected(null)}
          showToast={showToast}
        />
      )}
      {editTarget && (
        <EditModal
          campaign={editTarget}
          onClose={() => setEditTarget(null)}
          showToast={showToast}
          onUpdated={() => fetchAll(page, debouncedSearch)}
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          campaign={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function UTM() {
  const [tab, setTab] = useState("all");
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabCls = (t) =>
    `px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${
      tab === t
        ? "bg-white text-gray-800 shadow-sm border border-gray-200"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toast toast={toast} />

      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-none">
                UTM Manager
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              className={tabCls("all")}
              onClick={() => {
                setTab("all");
                setRefreshKey((k) => k + 1);
              }}
            >
              Campaigns
            </button>
            <button
              className={tabCls("create")}
              onClick={() => setTab("create")}
            >
              Create
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === "create" ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-800">
                Create Campaign
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Build and generate a new UTM tracking link.
              </p>
            </div>
            <CreateForm
              showToast={showToast}
              onCreated={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-800">
                All Campaigns
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Browse, search and manage your UTM campaigns.
              </p>
            </div>
            <CampaignTable showToast={showToast} refreshKey={refreshKey} />
          </>
        )}
      </main>
    </div>
  );
}
