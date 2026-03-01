import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Save, Pencil, X } from "lucide-react";
 
const API_URL = "https://insightsconsult-backend.onrender.com/settings/payment";
 
const PaymentSettings = () => {
  const [isRazorpayEnabled, setIsRazorpayEnabled] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [editingId, setEditingId] = useState(null);
 
  /* ---- GET ---- */
  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data?.success) setPaymentMethods(res.data.data);
    } catch (err) {
      console.error("Failed to fetch payment methods", err);
    }
  };
 
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
 
  /* ---- RESET ---- */
  const resetForm = () => {
    setEditingId(null);
    setIsRazorpayEnabled(false);
    setRazorpayKeyId("");
    setRazorpaySecret("");
    setShowRazorpaySecret(false);
    setError("");
  };
 
  /* ---- POPULATE EDIT ---- */
  const handleEdit = (item) => {
    setEditingId(item.paymentSettingId);
    setIsRazorpayEnabled(item.isRazorpayEnabled);
    setRazorpayKeyId(item.razorpayKeyId || "");
    setRazorpaySecret(""); // user must re-enter for security
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  /* ---- SAVE / UPDATE ---- */
  const handleSubmit = async () => {
    setError("");
    setSuccess("");
 
    if (!razorpayKeyId.trim()) {
      setError("Razorpay Key ID is required");
      return;
    }
 
    if (!editingId && !razorpaySecret.trim()) {
      setError("Razorpay Secret Key is required");
      return;
    }
 
    setLoading(true);
    try {
      const payload = {
        isRazorpayEnabled,
        razorpayKeyId,
        ...(razorpaySecret.trim() && { razorpaySecret }),
      };
 
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setSuccess("Payment settings updated successfully");
      } else {
        await axios.post(API_URL, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setSuccess("Payment settings saved successfully");
      }
 
      resetForm();
      fetchPaymentMethods();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        editingId
          ? "Failed to update payment settings"
          : "Failed to save payment settings"
      );
    } finally {
      setLoading(false);
    }
  };
 
  return (
<div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* HEADER */}
<div>
<h1 className="text-2xl font-bold text-gray-800">Payment Settings</h1>
<p className="text-gray-500 text-sm mt-1">
          Configure your Razorpay payment gateway
</p>
</div>
 
      {/* ERROR */}
      {error && (
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ❌ {error}
</div>
      )}
 
      {/* SUCCESS */}
      {success && (
<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✅ {success}
</div>
      )}
 
      {/* FORM */}
<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
        {/* Edit mode banner */}
        {editingId && (
<div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm text-indigo-700">
<span>✏️ Editing existing payment setting</span>
<button
              onClick={resetForm}
              className="text-indigo-500 hover:text-indigo-700 font-medium"
>
              Cancel
</button>
</div>
        )}
 
        {/* TOGGLE */}
<div className="flex items-center justify-between">
<div>
<p className="font-medium text-gray-700">Enable Razorpay</p>
<p className="text-xs text-gray-400">
              Activate Razorpay payment processing
</p>
</div>
<button
            onClick={() => setIsRazorpayEnabled(!isRazorpayEnabled)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
              isRazorpayEnabled ? "bg-[#6869AC]" : "bg-gray-300"
            }`}
>
<span
              className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                isRazorpayEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
</button>
</div>
 
        {/* RAZORPAY KEY ID */}
<div className="space-y-1">
<label className="text-sm font-medium text-gray-600">
            Razorpay Key ID
</label>
<input
            type="text"
            placeholder="rzp_live_xxxxxxxxxxxx"
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6869AC]"
          />
</div>
 
        {/* RAZORPAY SECRET KEY */}
<div className="space-y-1">
<label className="text-sm font-medium text-gray-600">
            Razorpay Secret Key{" "}
            {editingId && (
<span className="text-gray-400 font-normal">
                (leave blank to keep existing)
</span>
            )}
</label>
<div className="relative">
<input
              type={showRazorpaySecret ? "text" : "password"}
              placeholder={editingId ? "Enter new secret to update" : "Enter secret key"}
              value={razorpaySecret}
              onChange={(e) => setRazorpaySecret(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#6869AC]"
            />
<button
              onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
>
              {showRazorpaySecret ? <EyeOff size={16} /> : <Eye size={16} />}
</button>
</div>
</div>
 
        {/* ACTIONS */}
<div className="flex items-center gap-3 pt-2">
          {editingId && (
<button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition"
>
<X size={14} /> Cancel
</button>
          )}
<button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-[#6869AC] hover:bg-[#5758a0] text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
>
<Save size={14} />
            {loading
              ? editingId
                ? "Updating..."
                : "Saving..."
              : editingId
              ? "Update Settings"
              : "Save Settings"}
</button>
</div>
</div>
 
      {/* LIST */}
<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
<h2 className="text-base font-semibold text-gray-700 mb-4">
          Added Payment Methods
</h2>
 
        {paymentMethods.length === 0 ? (
<p className="text-sm text-gray-400 text-center py-6">
            No payment methods added yet.
</p>
        ) : (
<div className="overflow-x-auto">
<table className="w-full text-sm text-left">
<thead>
<tr className="text-gray-400 border-b text-xs uppercase tracking-wide">
<th className="pb-3 pr-4">Gateway</th>
<th className="pb-3 pr-4">Status</th>
<th className="pb-3 pr-4">Key ID</th>
<th className="pb-3 pr-4">Last Updated</th>
<th className="pb-3">Actions</th>
</tr>
</thead>
<tbody>
                {paymentMethods.map((item) => (
<tr
                    key={item.paymentSettingId}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
>
<td className="py-3 pr-4 font-medium text-gray-700">
                      Razorpay
</td>
<td className="py-3 pr-4">
                      {item.isRazorpayEnabled ? (
<span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          Enabled
</span>
                      ) : (
<span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
                          Disabled
</span>
                      )}
</td>
<td className="py-3 pr-4 font-mono text-gray-600 text-xs">
                      {item.razorpayKeyId.slice(0, 6)}••••
</td>
<td className="py-3 pr-4 text-gray-400 text-xs">
                      {new Date(item.updatedAt).toLocaleString()}
</td>
<td className="py-3">
<button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1 text-[#6869AC] hover:underline text-xs font-medium"
>
<Pencil size={12} /> Edit
</button>
</td>
</tr>
                ))}
</tbody>
</table>
</div>
        )}
</div>
</div>
  );
};
 
export default PaymentSettings;