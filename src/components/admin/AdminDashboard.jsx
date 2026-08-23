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
  CONTACT_REQUESTS: "CONTACT_REQUESTS",
  PENDING_RECHARGE: "PENDING_RECHARGE",
  PENDING_REG_FEE: "PENDING_REG_FEE",
  PENDING_ADVERTISEMENT: "PENDING_ADVERTISEMENT",
  ADVERTISEMENT_REVIEW: "ADVERTISEMENT_REVIEW",
  PAYMENT_SUBMITTED: "PAYMENT_SUBMITTED",
  STATS_PROFILE: "STATS_PROFILE",
  STATS_OFFLINE: "STATS_OFFLINE"
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const currentRole = (
    sessionStorage.getItem("userRole") || ""
  ).toUpperCase();

  const isAdminRole =
    currentRole === "ADMIN";

  const [activeView, setActiveView] =
    useState(
      isAdminRole
        ? VIEWS.SETTINGS
        : VIEWS.CONTACT_REQUESTS
    );
  const [stats, setStats] = useState(null);

  // Existing: profile approval queue (PAYMENT_SUBMITTED)
  const [profiles, setProfiles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);


  // Contact request review queue
const [
  contactRequests,
  setContactRequests
] = useState([]);

const [
  contactActionLoadingId,
  setContactActionLoadingId
] = useState(null);

  // Offline payments queue
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paymentSearchText, setPaymentSearchText] = useState("");
  const [paymentActionLoadingId, setPaymentActionLoadingId] = useState(null);

  // Advertisement moderation queue
  const [advertisementReviewQueue, setAdvertisementReviewQueue] = useState([]);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);
  const [moderatorNarrative, setModeratorNarrative] = useState("");
  const [moderatorRemarks, setModeratorRemarks] = useState("");
  const [advertisementActionLoadingId, setAdvertisementActionLoadingId] = useState(null);

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
const fetchContactRequests = async () => {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/moderator/contact-requests?status=PENDING`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error(
        "Contact request fetch failed:",
        data
      );
      return;
    }

    setContactRequests(
      Array.isArray(data?.requests)
        ? data.requests
        : []
    );
  } catch (error) {
    console.error(
      "❌ fetchContactRequests error:",
      error
    );
  }
};

  const fetchAdvertisementReviewQueue = async () => {
    try {
      const res = await fetch(
        `${getBaseUrl()}/api/preferred-profiles/moderator/review-queue`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Advertisement review queue fetch failed:",
          data
        );
        return;
      }

      setAdvertisementReviewQueue(
        Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (error) {
      console.error(
        "❌ fetchAdvertisementReviewQueue error:",
        error
      );
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

      await fetchData();
      await fetchAdvertisementReviewQueue();
    } catch (e) {
      console.error("❌ updateOfflinePaymentStatus error:", e);
      alert("Payment status update failed");
    } finally {
      setPaymentActionLoadingId(null);
    }
  };

  const openAdvertisementReview = (advertisement) => {
    setSelectedAdvertisement(advertisement);

    setModeratorNarrative(
      advertisement?.moderator_narrative ||
        advertisement?.transaction_details ||
        ""
    );

    setModeratorRemarks(
      advertisement?.moderator_remarks ||
        ""
    );
  };

  const closeAdvertisementReview = () => {
    setSelectedAdvertisement(null);
    setModeratorNarrative("");
    setModeratorRemarks("");
  };

  const reviewAdvertisement = async (
    advertisementId,
    action
  ) => {
    try {
      setAdvertisementActionLoadingId(
        advertisementId
      );

      const normalizedAction =
        String(action || "")
          .trim()
          .toUpperCase();

      if (
        normalizedAction === "APPROVE" &&
        !moderatorNarrative.trim()
      ) {
        alert(
          "Advertisement narrative is required before publishing."
        );
        return;
      }

      if (
        normalizedAction === "REJECT" &&
        !moderatorRemarks.trim()
      ) {
        alert(
          "Please enter Moderator remarks before rejecting."
        );
        return;
      }

      const res = await fetch(
        `${getBaseUrl()}/api/preferred-profiles/moderator/${advertisementId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            action: normalizedAction,
            moderatorNarrative:
              moderatorNarrative.trim(),
            moderatorRemarks:
              moderatorRemarks.trim()
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data?.message ||
            "Advertisement review failed."
        );
        return;
      }

      alert(data?.message || "Advertisement updated.");

      closeAdvertisementReview();

      await fetchAdvertisementReviewQueue();
      await fetchData();
    } catch (error) {
      console.error(
        "❌ reviewAdvertisement error:",
        error
      );

      alert(
        "Advertisement review failed."
      );
    } finally {
      setAdvertisementActionLoadingId(
        null
      );
    }
  };

const reviewContactRequest = async (
  requestId,
  action
) => {
  try {
    setContactActionLoadingId(
      requestId
    );

    const defaultRemark =
      action === "APPROVED"
        ? "Approved after moderator review"
        : action === "REJECTED"
        ? "Rejected after moderator review"
        : "Please provide additional clarification";

    const remarks =
      window.prompt(
        "Moderator remarks:",
        defaultRemark
      );

    if (remarks === null) {
      return;
    }

    const res = await fetch(
      `${getBaseUrl()}/api/moderator/contact-requests/${requestId}/review`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          remarks
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(
        data?.message ||
          "Contact request update failed."
      );
      return;
    }

    alert(data.message);

    await fetchContactRequests();

  } catch (error) {
    console.error(
      "❌ reviewContactRequest error:",
      error
    );

    alert(
      "Contact request update failed."
    );
  } finally {
    setContactActionLoadingId(null);
  }
};
  useEffect(() => {
    fetchData();
    fetchContactRequests();
    fetchAdvertisementReviewQueue();

    if (isAdminRole) {
      fetchSettings();
    }

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
    return filteredPendingPayments.filter(
      (p) => (p.payment_type || "") === "Donation"
    );
  }, [filteredPendingPayments]);

  const pendingAdvertisementPayments = useMemo(() => {
    return filteredPendingPayments.filter(
      (p) => (p.payment_type || "") === "PreferredProfile"
    );
  }, [filteredPendingPayments]);

  const paymentTypeLabel = (paymentType) => {
    const pt = (paymentType || "").toString().trim();
    if (!pt) return "-";
    if (pt === "ProfileRenewal") return "Recharge (Profile Renewal)";
    if (pt === "Donation") return "Registration Fee (Donation)";
    if (pt === "PreferredProfile") return "Advertisement Payment";
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

        {isAdminRole && (
  <div className="space-y-1">
    <SidebarItem
      label="Registration & Limits"
      view={VIEWS.SETTINGS}
    />
  </div>
)}

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

            <SidebarItem
              label="Advertisement Payments"
              view={VIEWS.PENDING_ADVERTISEMENT}
              badge={pendingAdvertisementPayments.length}
            />
          </div>
        </div>

        <div className="mt-4">
  <div className="text-xs uppercase tracking-wide text-gray-500 px-2 py-2">
    Member Requests
  </div>

  <div className="space-y-1">
    <SidebarItem
      label="Contact Requests"
      view={VIEWS.CONTACT_REQUESTS}
      badge={contactRequests.length}
    />
  </div>
</div>

<div className="mt-4">
  <div className="text-xs uppercase tracking-wide text-gray-500 px-2 py-2">
    Approvals
  </div>
          <div className="space-y-1">
            <SidebarItem
              label="Payment Submitted Queue"
              view={VIEWS.PAYMENT_SUBMITTED}
              badge={profiles.length}
            />

            <SidebarItem
              label="Advertisement Review"
              view={VIEWS.ADVERTISEMENT_REVIEW}
              badge={advertisementReviewQueue.length}
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

  const renderAdvertisementReview = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Advertisement Review
              <span className="ml-2 text-sm text-gray-500">
                ({advertisementReviewQueue.length})
              </span>
            </h2>

            <p className="text-sm text-gray-600">
              Review payment-approved advertisements before publication.
              Profile facts are read-only. Moderator may edit only the
              published advertisement narrative.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdvertisementReviewQueue}
            className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-auto rounded-lg border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left border-b border-gray-100">
                <th className="p-3 font-semibold text-gray-700">
                  Advertisement
                </th>

                <th className="p-3 font-semibold text-gray-700">
                  Profile
                </th>

                <th className="p-3 font-semibold text-gray-700">
                  Profile Facts
                </th>

                <th className="p-3 font-semibold text-gray-700">
                  Payment
                </th>

                <th className="p-3 font-semibold text-gray-700">
                  Status
                </th>

                <th className="p-3 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {advertisementReviewQueue.map(
                (advertisement, index) => (
                  <tr
                    key={advertisement.id}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">
                        #{advertisement.id}
                      </div>

                      <div className="text-xs text-gray-500">
                        {advertisement.created_at
                          ? new Date(
                              advertisement.created_at
                            ).toLocaleString()
                          : "-"}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        {advertisement.profile_id}
                      </div>

                      <div className="text-xs text-gray-500">
                        {advertisement.name ||
                          advertisement.member_name ||
                          "-"}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-xs text-gray-800">
                        {advertisement.current_age || "-"} yrs
                        {" · "}
                        {advertisement.gotra || "-"} Gotra
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {advertisement.profession ||
                          advertisement.designation ||
                          "-"}
                        {" · "}
                        {advertisement.current_location || "-"}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        Education: {advertisement.education || "-"}
                        {" · "}
                        Income: {advertisement.annual_income || "-"}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        ₹{advertisement.payment_amount || "0"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {advertisement.payment_method || "-"}
                        {" · "}
                        {advertisement.payment_reference || "-"}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                        {advertisement.review_status ||
                          advertisement.status ||
                          "PENDING"}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() =>
                          openAdvertisementReview(
                            advertisement
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                      >
                        Review Advertisement
                      </button>
                    </td>
                  </tr>
                )
              )}

              {advertisementReviewQueue.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-5 text-gray-500"
                  >
                    No advertisements are waiting for review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAdvertisement && (
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-5">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Review Advertisement #{selectedAdvertisement.id}
              </h3>

              <p className="text-sm text-gray-600">
                {selectedAdvertisement.profile_id}
                {" · "}
                {selectedAdvertisement.name ||
                  selectedAdvertisement.member_name ||
                  "-"}
              </p>
            </div>

            <button
              type="button"
              onClick={closeAdvertisementReview}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-xs text-gray-500">
                Age / Gotra
              </div>

              <div className="mt-1 text-sm font-semibold text-gray-900">
                {selectedAdvertisement.current_age || "-"} yrs
                {" · "}
                {selectedAdvertisement.gotra || "-"}
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-xs text-gray-500">
                Education / Profession
              </div>

              <div className="mt-1 text-sm font-semibold text-gray-900">
                {selectedAdvertisement.education || "-"}
                {" · "}
                {selectedAdvertisement.profession ||
                  selectedAdvertisement.designation ||
                  "-"}
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-xs text-gray-500">
                Location / Income
              </div>

              <div className="mt-1 text-sm font-semibold text-gray-900">
                {selectedAdvertisement.current_location || "-"}
                {" · "}
                {selectedAdvertisement.annual_income || "-"}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Submitted Advertisement
            </label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
              {selectedAdvertisement.transaction_details ||
                "No submitted advertisement text."}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Read-only member submission.
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Published Advertisement
            </label>

            <textarea
              rows={7}
              value={moderatorNarrative}
              onChange={(event) =>
                setModeratorNarrative(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Edit the final advertisement text that members will see..."
            />

            <p className="mt-1 text-xs text-gray-500">
              Moderator may improve wording here. Do not change authoritative
              profile facts such as age, Gotra, education, profession or income.
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Moderator Remarks
            </label>

            <textarea
              rows={3}
              value={moderatorRemarks}
              onChange={(event) =>
                setModeratorRemarks(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Review notes / rejection reason / internal remarks..."
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              disabled={
                advertisementActionLoadingId ===
                selectedAdvertisement.id
              }
              onClick={() =>
                reviewAdvertisement(
                  selectedAdvertisement.id,
                  "REJECT"
                )
              }
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              Reject Advertisement
            </button>

            <button
              type="button"
              disabled={
                advertisementActionLoadingId ===
                  selectedAdvertisement.id ||
                !moderatorNarrative.trim()
              }
              onClick={() =>
                reviewAdvertisement(
                  selectedAdvertisement.id,
                  "APPROVE"
                )
              }
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {advertisementActionLoadingId ===
              selectedAdvertisement.id
                ? "Processing..."
                : "Approve & Publish"}
            </button>
          </div>
        </div>
      )}
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

  const renderContactRequests = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Contact Requests
          <span className="ml-2 text-sm text-gray-500">
            ({contactRequests.length})
          </span>
        </h2>

        <p className="text-sm text-gray-600">
          Review requests before sensitive
          contact information is released.
        </p>
      </div>

      <button
        onClick={fetchContactRequests}
        className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm"
      >
        Refresh
      </button>
    </div>

    <div className="overflow-auto rounded-lg border border-gray-100">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left border-b">
            <th className="p-3">
              Request
            </th>

            <th className="p-3">
              Requester
            </th>

            <th className="p-3">
              Requested Profile
            </th>

            <th className="p-3">
              Requested On
            </th>

            <th className="p-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {contactRequests.map(
            (request) => (
              <tr
                key={request.id}
                className="border-b"
              >
                <td className="p-3">
                  #{request.id}
                </td>

                <td className="p-3">
                  <div className="font-medium">
                    {request.requester_name ||
                      "-"}
                  </div>

                  <div className="text-xs text-gray-500">
                    {
                      request.requester_profile_id
                    }
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-medium">
                    {request.target_name ||
                      "-"}
                  </div>

                  <div className="text-xs text-gray-500">
                    {
                      request.target_profile_id
                    }
                  </div>
                </td>

                <td className="p-3">
                  {request.created_at
                    ? new Date(
                        request.created_at
                      ).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={
                        contactActionLoadingId ===
                        request.id
                      }
                      onClick={() =>
                        reviewContactRequest(
                          request.id,
                          "APPROVED"
                        )
                      }
                      className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs"
                    >
                      Approve
                    </button>

                    <button
                      disabled={
                        contactActionLoadingId ===
                        request.id
                      }
                      onClick={() =>
                        reviewContactRequest(
                          request.id,
                          "CLARIFICATION_REQUIRED"
                        )
                      }
                      className="px-3 py-2 rounded-lg bg-amber-600 text-white text-xs"
                    >
                      Clarification
                    </button>

                    <button
                      disabled={
                        contactActionLoadingId ===
                        request.id
                      }
                      onClick={() =>
                        reviewContactRequest(
                          request.id,
                          "REJECTED"
                        )
                      }
                      className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}

          {contactRequests.length ===
            0 && (
            <tr>
              <td
                colSpan={5}
                className="p-5 text-gray-500"
              >
                No pending contact requests.
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
          Loading admin dashboard....
        </div>
      );
    }

    if (
  activeView === VIEWS.CONTACT_REQUESTS
) {
  return renderContactRequests();
}

if (
  activeView === VIEWS.SETTINGS &&
  isAdminRole
) {
  return renderSettingsView();
}
    if (activeView === VIEWS.PENDING_RECHARGE)
      return renderPendingPaymentsTable(
        pendingRechargePayments,
        "Pending Offline Payments – Recharge"
      );

    if (activeView === VIEWS.PENDING_REG_FEE)
      return renderPendingPaymentsTable(
        pendingRegistrationFeePayments,
        "Pending Offline Payments – Registration Fee"
      );

    if (activeView === VIEWS.PENDING_ADVERTISEMENT)
      return renderPendingPaymentsTable(
        pendingAdvertisementPayments,
        "Pending Offline Payments – Advertisement"
      );

    if (activeView === VIEWS.ADVERTISEMENT_REVIEW)
      return renderAdvertisementReview();

    if (activeView === VIEWS.PAYMENT_SUBMITTED)
      return renderPaymentSubmittedQueue();
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
