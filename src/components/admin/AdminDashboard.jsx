// SMKalyanUI/src/components/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import getBaseUrl from "../../utils/GetUrl";

const normalizeStatus = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");

const SETTINGS_KEYS = {
  REGISTRATION_FEE_AMOUNT: "REGISTRATION_FEE_AMOUNT",
  CONTACT_VIEWS_PER_CYCLE: "CONTACT_VIEWS_PER_CYCLE",
  RECHARGE_FEE_AMOUNT: "RECHARGE_FEE_AMOUNT"
};

const VIEWS = {
  SETTINGS: "SETTINGS",
  PENDING_RECHARGE: "PENDING_RECHARGE",
  PENDING_REG_FEE: "PENDING_REG_FEE",
  PAYMENT_SUBMITTED: "PAYMENT_SUBMITTED",
  STATS_PROFILE: "STATS_PROFILE",
  STATS_OFFLINE: "STATS_OFFLINE"
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState(VIEWS.SETTINGS);
  const [stats, setStats] = useState(null);

  // Existing: profile approval queue (PAYMENT_SUBMITTED)
  const [profiles, setProfiles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Offline payments queue
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paymentSearchText, setPaymentSearchText] = useState("");
  const [paymentActionLoadingId, setPaymentActionLoadingId] = useState(null);

  // Admin settings (Registration & Limits)
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const [regFeeAmount, setRegFeeAmount] = useState("0");
  const [contactViewsX, setContactViewsX] = useState("10");
  const [rechargeFeeAmount, setRechargeFeeAmount] = useState("0");

  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const res = await fetch(`${getBaseUrl()}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        setSettingsError(data?.message || "Failed to load admin settings");
        return;
      }

      const s = data?.settings || {};
      setRegFeeAmount(String(s[SETTINGS_KEYS.REGISTRATION_FEE_AMOUNT] ?? "0"));
      setContactViewsX(String(s[SETTINGS_KEYS.CONTACT_VIEWS_PER_CYCLE] ?? "10"));
      setRechargeFeeAmount(String(s[SETTINGS_KEYS.RECHARGE_FEE_AMOUNT] ?? "0"));
    } catch (e) {
      console.error("❌ fetchSettings error:", e);
      setSettingsError("Failed to load admin settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    setSettingsError("");

    // Minimal client-side validation (server will validate too)
    const reg = Number(regFeeAmount);
    const rech = Number(rechargeFeeAmount);
    const views = Number(contactViewsX);

    if (!Number.isFinite(reg) || reg < 0) {
      setSettingsError("Registration Fee Amount must be a number >= 0");
      setSettingsSaving(false);
      return;
    }
    if (!Number.isFinite(rech) || rech < 0) {
      setSettingsError("Recharge Fee Amount must be a number >= 0");
      setSettingsSaving(false);
      return;
    }
    if (!Number.isFinite(views) || !Number.isInteger(views) || views <= 0) {
      setSettingsError("Contact Views per Cycle (X) must be a positive integer");
      setSettingsSaving(false);
      return;
    }

    try {
      const payload = {
        [SETTINGS_KEYS.REGISTRATION_FEE_AMOUNT]: String(reg),
        [SETTINGS_KEYS.CONTACT_VIEWS_PER_CYCLE]: String(views),
        [SETTINGS_KEYS.RECHARGE_FEE_AMOUNT]: String(rech)
      };

      const res = await fetch(`${getBaseUrl()}/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setSettingsError(data?.message || "Failed to save admin settings");
        return;
      }

      await fetchSettings();
      await fetchData();
      alert("Settings saved successfully.");
    } catch (e) {
      console.error("❌ saveSettings error:", e);
      setSettingsError("Failed to save admin settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes, pendingPayRes] = await Promise.all([
        fetch(`${getBaseUrl()}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${getBaseUrl()}/api/admin/profiles/payment-submitted`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${getBaseUrl()}/api/admin/offline-payments/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const listData = await listRes.json();
      const pendingPayData = await pendingPayRes.json();

      if (statsRes.ok) setStats(statsData);
      if (listRes.ok) setProfiles(listData.profiles || []);
      if (pendingPayRes.ok) setPendingPayments(pendingPayData.payments || []);
    } catch (e) {
      console.error("❌ AdminDashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (profileId) => {
    try {
      setActionLoadingId(profileId);

      const res = await fetch(`${getBaseUrl()}/api/admin/profile/${profileId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Approval failed");
        return;
      }

      fetchData();
    } catch (e) {
      console.error("❌ approve error:", e);
      alert("Approval failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const updateOfflinePaymentStatus = async (paymentId, status) => {
    try {
      setPaymentActionLoadingId(paymentId);

      const adminNotes =
        window.prompt(
          `Enter admin notes for marking payment as "${status.toUpperCase()}":`,
          status === "verified" ? "Verified after review" : "Rejected after review"
        ) || "";

      const res = await fetch(`${getBaseUrl()}/api/offline-payment/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId, status, adminNotes })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Update failed");
        return;
      }

      fetchData();
    } catch (e) {
      console.error("❌ updateOfflinePaymentStatus error:", e);
      alert("Payment status update failed");
    } finally {
      setPaymentActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Derived data ---
  const profileCountsMap = useMemo(() => {
    const map = {};
    const arr = Array.isArray(stats?.profileCounts) ? stats.profileCounts : [];
    arr.forEach((x) => {
      map[normalizeStatus(x.status)] = Number(x.cnt || 0);
    });
    return map;
  }, [stats]);

  const paymentCountsMap = useMemo(() => {
    const map = {};
    const arr = Array.isArray(stats?.offlinePaymentCounts) ? stats.offlinePaymentCounts : [];
    arr.forEach((x) => {
      map[normalizeStatus(x.status)] = Number(x.cnt || 0);
    });
    return map;
  }, [stats]);

  const filteredProfiles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return profiles;

    return profiles.filter((p) => {
      const id = (p.profile_id || "").toString().toLowerCase();
      const name = (p.name || "").toString().toLowerCase();
      const email = (p.email || "").toString().toLowerCase();
      const phone = (p.phone || "").toString().toLowerCase();
      return id.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [profiles, searchText]);

  const filteredPendingPayments = useMemo(() => {
    const q = paymentSearchText.trim().toLowerCase();
    if (!q) return pendingPayments;

    return pendingPayments.filter((p) => {
      const pid = (p.payment_id || "").toString().toLowerCase();
      const profileId = (p.profile_id || "").toString().toLowerCase();
      const type = (p.payment_type || "").toString().toLowerCase();
      const ref = (p.payment_reference || "").toString().toLowerCase();
      const email = (p.email || "").toString().toLowerCase();
      const phone = (p.phone_number || "").toString().toLowerCase();
      const name = (p.profile_name || "").toString().toLowerCase();
      return (
        pid.includes(q) ||
        profileId.includes(q) ||
        type.includes(q) ||
        ref.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        name.includes(q)
      );
    });
  }, [pendingPayments, paymentSearchText]);

  // Split offline payments into two categories for better UX
  const pendingRechargePayments = useMemo(() => {
    return filteredPendingPayments.filter((p) => (p.payment_type || "") === "ProfileRenewal");
  }, [filteredPendingPayments]);

  const pendingRegistrationFeePayments = useMemo(() => {
    return filteredPendingPayments.filter((p) => (p.payment_type || "") === "Donation");
  }, [filteredPendingPayments]);

  const paymentTypeLabel = (paymentType) => {
    const pt = (paymentType || "").toString().trim();
    if (!pt) return "-";
    if (pt === "ProfileRenewal") return "Recharge (Profile Renewal)";
    if (pt === "Donation") return "Registration Fee (Donation)";
    return pt;
  };

  const renderCountCards = (title, counts) => {
    const arr = Array.isArray(counts) ? counts : [];
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-xs text-gray-500">Live</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {arr.map((x) => (
            <div key={x.status} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-[11px] text-gray-500 uppercase tracking-wide">{x.status}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{x.cnt}</div>
            </div>
          ))}

          {arr.length === 0 && <div className="text-sm text-gray-500">No data.</div>}
        </div>
      </div>
    );
  };

  const renderTopHeader = () => (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="text-2xl font-bold text-indigo-900">Kalyana Sakha</div>
        <div className="text-sm text-gray-600">Admin Console</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            fetchData();
            fetchSettings();
          }}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 shadow-sm"
        >
          Refresh
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );

  const SidebarItem = ({ label, view, badge }) => {
    const active = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition ${
          active ? "bg-indigo-600 text-white shadow-sm" : "text-gray-800 hover:bg-indigo-50"
        }`}
      >
        <span className="font-medium">{label}</span>
        {typeof badge === "number" ? (
          <span
            className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
              active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </button>
    );
  };

  const renderSidebar = () => (
    <div className="w-full md:w-72">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sticky top-6">
        <div className="text-xs uppercase tracking-wide text-gray-500 px-2 py-2">Menu</div>

        <div className="space-y-1">
          <SidebarItem label="Registration & Limits" view={VIEWS.SETTINGS} />
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-gray-500 px-2 py-2">
            Pending Offline Payments
          </div>
          <div className="space-y-1">
            <SidebarItem
              label="Recharge Payments"
              view={VIEWS.PENDING_RECHARGE}
              badge={pendingRechargePayments.length}
            />
            <SidebarItem
              label="Registration Fee Payments"
              view={VIEWS.PENDING_REG_FEE}
              badge={pendingRegistrationFeePayments.length}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-gray-500 px-2 py-2">Approvals</div>
          <div className="space-y-1">
            <SidebarItem
              label="Payment Submitted Queue"
              view={VIEWS.PAYMENT_SUBMITTED}
              badge={profiles.length}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-gray-500 px-2 py-2">Statistics</div>
          <div className="space-y-1">
            <SidebarItem label="Profile Status Statistics" view={VIEWS.STATS_PROFILE} />
            <SidebarItem label="Offline Payment Status Statistics" view={VIEWS.STATS_OFFLINE} />
          </div>
        </div>

        <div className="mt-4 text-[11px] text-gray-500 px-2">
          Admin actions are audited via backend logs. Approve only after verification.
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Registration & Limits</h2>
          <p className="text-sm text-gray-600">
            Configure Registration Fee, Contact Views per Cycle (X), and Recharge Fee.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            disabled={settingsLoading}
            className={`px-4 py-2 rounded-lg text-white text-sm shadow-sm ${
              settingsLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"
            }`}
          >
            {settingsLoading ? "Loading..." : "Reload Settings"}
          </button>

          <button
            onClick={saveSettings}
            disabled={settingsSaving || settingsLoading}
            className={`px-4 py-2 rounded-lg text-white text-sm shadow-sm ${
              settingsSaving || settingsLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {settingsSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {settingsError ? (
        <div className="mb-4 p-3 rounded-lg border border-red-100 bg-red-50 text-sm text-red-800">
          {settingsError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-800 mb-2">Registration Fee Amount</div>
          <input
            type="number"
            min="0"
            value={regFeeAmount}
            onChange={(e) => setRegFeeAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g., 500"
          />
          <div className="text-xs text-gray-500 mt-2">Used for mandatory registration payment (offline).</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-800 mb-2">Contact Views per Cycle (X)</div>
          <input
            type="number"
            min="1"
            step="1"
            value={contactViewsX}
            onChange={(e) => setContactViewsX(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g., 10"
          />
          <div className="text-xs text-gray-500 mt-2">After X contact views, user must recharge.</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-800 mb-2">Recharge Fee Amount</div>
          <input
            type="number"
            min="0"
            value={rechargeFeeAmount}
            onChange={(e) => setRechargeFeeAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g., 300"
          />
          <div className="text-xs text-gray-500 mt-2">Used for offline recharge payments (ProfileRenewal).</div>
        </div>
      </div>
    </div>
  );

  const renderPendingPaymentsTable = (rows, title) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
            <span className="ml-2 text-sm text-gray-500">({rows.length})</span>
          </h2>
          <p className="text-sm text-gray-600">
            Verify/reject offline payments. Recharge resets contact views only after VERIFIED.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={paymentSearchText}
            onChange={(e) => setPaymentSearchText(e.target.value)}
            placeholder="Search by Payment ID / Profile ID / Type / Ref / Name / Phone / Email..."
            className="w-full md:w-[520px] px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="rounded-lg border border-gray-100 bg-blue-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Pending Payments</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {paymentCountsMap["PENDING"] || pendingPayments.length || 0}
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-green-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Verified Payments</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{paymentCountsMap["VERIFIED"] || 0}</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-red-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Rejected Payments</div>
          <div className="text-2xl font-bold text-red-900 mt-1">{paymentCountsMap["REJECTED"] || 0}</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-purple-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Approved Profiles</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{profileCountsMap["APPROVED"] || 0}</div>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left border-b border-gray-100">
              <th className="p-3 font-semibold text-gray-700">Payment ID</th>
              <th className="p-3 font-semibold text-gray-700">Profile</th>
              <th className="p-3 font-semibold text-gray-700">Type</th>
              <th className="p-3 font-semibold text-gray-700">Amount</th>
              <th className="p-3 font-semibold text-gray-700">Ref</th>
              <th className="p-3 font-semibold text-gray-700">Date/Time</th>
              <th className="p-3 font-semibold text-gray-700">Contact</th>
              <th className="p-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, idx) => (
              <tr
                key={p.payment_id}
                className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition`}
              >
                <td className="p-3 font-medium text-gray-900">{p.payment_id}</td>
                <td className="p-3 text-gray-800">
                  <div className="font-medium">{p.profile_id}</div>
                  <div className="text-xs text-gray-500">
                    {p.profile_name || "-"} • {p.profile_status || "-"}
                  </div>
                </td>
                <td className="p-3 text-gray-800">{paymentTypeLabel(p.payment_type)}</td>
                <td className="p-3 text-gray-800">{p.amount}</td>
                <td className="p-3 text-gray-800">{p.payment_reference || "-"}</td>
                <td className="p-3 text-gray-800">
                  <div>{p.payment_date || "-"}</div>
                  <div className="text-xs text-gray-500">{p.payment_time || "-"}</div>
                </td>
                <td className="p-3 text-gray-800">
                  <div className="text-xs">{p.phone_number || "-"}</div>
                  <div className="text-xs text-gray-500">{p.email || "-"}</div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateOfflinePaymentStatus(p.payment_id, "verified")}
                      disabled={paymentActionLoadingId === p.payment_id}
                      className={`px-3 py-2 rounded-lg text-white text-sm shadow-sm ${
                        paymentActionLoadingId === p.payment_id ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {paymentActionLoadingId === p.payment_id ? "Updating..." : "Verify"}
                    </button>

                    <button
                      onClick={() => updateOfflinePaymentStatus(p.payment_id, "rejected")}
                      disabled={paymentActionLoadingId === p.payment_id}
                      className={`px-3 py-2 rounded-lg text-white text-sm shadow-sm ${
                        paymentActionLoadingId === p.payment_id ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {paymentActionLoadingId === p.payment_id ? "Updating..." : "Reject"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={8}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentSubmittedQueue = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            PAYMENT_SUBMITTED Queue
            <span className="ml-2 text-sm text-gray-500">({profiles.length})</span>
          </h2>
          <p className="text-sm text-gray-600">Review profiles with offline payment submitted and approve.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Profile ID / name / email / phone..."
            className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="rounded-lg border border-gray-100 bg-blue-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Queue Count</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{profiles.length}</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-green-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Approved</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{profileCountsMap["APPROVED"] || 0}</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-yellow-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Submitted</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">{profileCountsMap["SUBMITTED"] || 0}</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-purple-50 p-3">
          <div className="text-[11px] text-gray-600 uppercase tracking-wide">Payment Submitted</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{profileCountsMap["PAYMENT_SUBMITTED"] || 0}</div>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left border-b border-gray-100">
              <th className="p-3 font-semibold text-gray-700">Profile ID</th>
              <th className="p-3 font-semibold text-gray-700">Name</th>
              <th className="p-3 font-semibold text-gray-700">Email</th>
              <th className="p-3 font-semibold text-gray-700">Phone</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((p, idx) => (
              <tr
                key={p.profile_id}
                className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition`}
              >
                <td className="p-3 font-medium text-gray-900">{p.profile_id}</td>
                <td className="p-3 text-gray-800">{p.name}</td>
                <td className="p-3 text-gray-800">{p.email}</td>
                <td className="p-3 text-gray-800">{p.phone}</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                    {p.profile_status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => approve(p.profile_id)}
                    disabled={actionLoadingId === p.profile_id}
                    className={`px-3 py-2 rounded-lg text-white text-sm shadow-sm ${
                      actionLoadingId === p.profile_id ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {actionLoadingId === p.profile_id ? "Approving..." : "Approve"}
                  </button>
                </td>
              </tr>
            ))}

            {filteredProfiles.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No PAYMENT_SUBMITTED profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-600">
          Loading admin dashboard...
        </div>
      );
    }

    if (activeView === VIEWS.SETTINGS) return renderSettingsView();
    if (activeView === VIEWS.PENDING_RECHARGE)
      return renderPendingPaymentsTable(pendingRechargePayments, "Pending Offline Payments – Recharge");
    if (activeView === VIEWS.PENDING_REG_FEE)
      return renderPendingPaymentsTable(pendingRegistrationFeePayments, "Pending Offline Payments – Registration Fee");
    if (activeView === VIEWS.PAYMENT_SUBMITTED) return renderPaymentSubmittedQueue();
    if (activeView === VIEWS.STATS_PROFILE) return renderCountCards("Profile Status Statistics", stats?.profileCounts);
    if (activeView === VIEWS.STATS_OFFLINE) return renderCountCards("Offline Payment Status Statistics", stats?.offlinePaymentCounts);

    return renderSettingsView();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-6">
        {renderTopHeader()}

        {/* Layout with Sidebar */}
        <div className="flex flex-col md:flex-row gap-5">
          {renderSidebar()}

          <div className="flex-1">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
