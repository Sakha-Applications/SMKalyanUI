// SMKalyanUI/src/components/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import getBaseUrl from "../../utils/GetUrl";
import PromptModal from "../../shared/components/PromptModal";
import NotificationBanner from "../../shared/components/NotificationBanner";
import BrandHeader from "../../shared/layouts/BrandHeader";
import BrandFooter from "../../shared/layouts/BrandFooter";
import { designClasses } from "../../shared/styles/designTokens";

const normalizeStatus = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");

const SETTINGS_KEYS = {
  REGISTRATION_FEE_AMOUNT: "REGISTRATION_FEE_AMOUNT",
  CONTACT_VIEWS_PER_CYCLE: "CONTACT_VIEWS_PER_CYCLE",
  RECHARGE_FEE_AMOUNT: "RECHARGE_FEE_AMOUNT",
  ADVERTISEMENT_MIN_CONTRIBUTION:
    "ADVERTISEMENT_MIN_CONTRIBUTION"
};

const VIEWS = {
  SETTINGS: "SETTINGS",
  CONTACT_REQUESTS: "CONTACT_REQUESTS",
  MUTUAL_FOLLOWUP: "MUTUAL_FOLLOWUP",
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

// Mutual Pair consultation / follow-up
const [
  consultationFollowups,
  setConsultationFollowups
] = useState([]);

const [
  selectedConsultation,
  setSelectedConsultation
] = useState(null);

const [
  consultationForm,
  setConsultationForm
] = useState({
  consultationStatus: "PENDING",
  convenientTime: "",
  consultationRemarks: "",
  nextFollowUpAt: ""
});

const [
  consultationLoading,
  setConsultationLoading
] = useState(false);

const [
  consultationSaving,
  setConsultationSaving
] = useState(false);

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

  const [regFeeAmount, setRegFeeAmount] =
    useState("");

  const [contactViewsX, setContactViewsX] =
    useState("");

  const [
    rechargeFeeAmount,
    setRechargeFeeAmount
  ] = useState("");

  const [
    advertisementMinContribution,
    setAdvertisementMinContribution
  ] = useState("");

  const [loading, setLoading] = useState(true);

  const [
    notification,
    setNotification,
  ] = useState({
    message: "",
    type: "success"
  });

  const showNotification = (
    message,
    type = "success"
  ) => {
    setNotification({
      message:
        String(message || ""),
      type
    });
  };

  const [
    promptModal,
    setPromptModal,
  ] = useState({
    open: false,
    title: "",
    description: "",
    label: "Remarks",
    initialValue: "",
    placeholder: "",
    required: false,
    confirmLabel: "Submit",
    onConfirm: null
  });

  const closePromptModal = () => {
    setPromptModal(
      (current) => ({
        ...current,
        open: false,
        onConfirm: null
      })
    );
  };

  const openPromptModal = (
    options
  ) => {
    setPromptModal({
      open: true,
      title:
        options?.title || "",
      description:
        options?.description || "",
      label:
        options?.label || "Remarks",
      initialValue:
        options?.initialValue || "",
      placeholder:
        options?.placeholder || "",
      required:
        Boolean(
          options?.required
        ),
      confirmLabel:
        options?.confirmLabel ||
        "Submit",
      onConfirm:
        options?.onConfirm ||
        null
    });
  };

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

      setRegFeeAmount(
        String(
          s[
            SETTINGS_KEYS.REGISTRATION_FEE_AMOUNT
          ] ?? ""
        )
      );

      setContactViewsX(
        String(
          s[
            SETTINGS_KEYS.CONTACT_VIEWS_PER_CYCLE
          ] ?? ""
        )
      );

      setRechargeFeeAmount(
        String(
          s[
            SETTINGS_KEYS.RECHARGE_FEE_AMOUNT
          ] ?? ""
        )
      );

      setAdvertisementMinContribution(
        String(
          s[
            SETTINGS_KEYS
              .ADVERTISEMENT_MIN_CONTRIBUTION
          ] ?? ""
        )
      );
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
    const reg =
      Number(regFeeAmount);

    const rech =
      Number(rechargeFeeAmount);

    const views =
      Number(contactViewsX);

    const advertisementMin =
      Number(
        advertisementMinContribution
      );

    if (String(regFeeAmount).trim() === "") {
      setSettingsError(
        "Registration Fee Amount is required."
      );
      setSettingsSaving(false);
      return;
    }

    if (
      !Number.isFinite(reg) ||
      reg < 0
    ) {
      setSettingsError(
        "Registration Fee Amount must be a number >= 0."
      );
      setSettingsSaving(false);
      return;
    }

    if (String(contactViewsX).trim() === "") {
      setSettingsError(
        "Contact Views per Cycle is required."
      );
      setSettingsSaving(false);
      return;
    }

    if (
      !Number.isFinite(views) ||
      !Number.isInteger(views) ||
      views <= 0
    ) {
      setSettingsError(
        "Contact Views per Cycle must be a positive integer."
      );
      setSettingsSaving(false);
      return;
    }

    if (
      String(rechargeFeeAmount).trim() === ""
    ) {
      setSettingsError(
        "Recharge Fee Amount is required."
      );
      setSettingsSaving(false);
      return;
    }

    if (
      !Number.isFinite(rech) ||
      rech < 0
    ) {
      setSettingsError(
        "Recharge Fee Amount must be a number >= 0."
      );
      setSettingsSaving(false);
      return;
    }

    if (
      String(
        advertisementMinContribution
      ).trim() === ""
    ) {
      setSettingsError(
        "Minimum Advertisement Contribution is required."
      );
      setSettingsSaving(false);
      return;
    }

    if (
      !Number.isFinite(advertisementMin) ||
      advertisementMin < 0
    ) {
      setSettingsError(
        "Minimum Advertisement Contribution must be a number >= 0."
      );
      setSettingsSaving(false);
      return;
    }

    try {
      const payload = {
        [SETTINGS_KEYS.REGISTRATION_FEE_AMOUNT]:
          String(reg),

        [SETTINGS_KEYS.CONTACT_VIEWS_PER_CYCLE]:
          String(views),

        [SETTINGS_KEYS.RECHARGE_FEE_AMOUNT]:
          String(rech),

        [SETTINGS_KEYS.ADVERTISEMENT_MIN_CONTRIBUTION]:
          String(advertisementMin)
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

      showNotification(
        "Settings saved successfully.",
        "success"
      );
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

const fetchConsultationFollowups = async () => {
  try {
    setConsultationLoading(true);

    const res = await fetch(
      `${getBaseUrl()}/api/moderator/consultation-followups`,
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
        "Consultation follow-up fetch failed:",
        data
      );

      showNotification(
        data?.message ||
          "Unable to load Mutual Pair follow-up.",
        "error"
      );

      return;
    }

    setConsultationFollowups(
      Array.isArray(data?.data)
        ? data.data
        : []
    );

  } catch (error) {
    console.error(
      "❌ fetchConsultationFollowups error:",
      error
    );

    showNotification(
      "Unable to load Mutual Pair follow-up.",
      "error"
    );

  } finally {
    setConsultationLoading(false);
  }
};
const openConsultationFollowup = (
  row
) => {
  setSelectedConsultation(row);

  setConsultationForm({
    consultationStatus:
      row?.consultation_status ||
      "PENDING",

    convenientTime:
      row?.convenient_time ||
      "",

    consultationRemarks:
      row?.consultation_remarks ||
      "",

    nextFollowUpAt:
      row?.next_follow_up_at
        ? String(
            row.next_follow_up_at
          )
            .replace("Z", "")
            .slice(0, 16)
        : ""
  });
};


const closeConsultationFollowup = () => {
  setSelectedConsultation(null);

  setConsultationForm({
    consultationStatus:
      "PENDING",
    convenientTime: "",
    consultationRemarks: "",
    nextFollowUpAt: ""
  });
};

const saveConsultationFollowup =
  async () => {
    if (
      !selectedConsultation
        ?.advertisement_response_id
    ) {
      return;
    }

    try {
      setConsultationSaving(true);

      const responseId =
        selectedConsultation
          .advertisement_response_id;

      const res = await fetch(
        `${getBaseUrl()}/api/moderator/consultation-followups/${responseId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            consultationStatus:
              consultationForm
                .consultationStatus,

            convenientTime:
              consultationForm
                .convenientTime
                .trim(),

            consultationRemarks:
              consultationForm
                .consultationRemarks
                .trim(),

            nextFollowUpAt:
              consultationForm
                .nextFollowUpAt ||
              null
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        showNotification(
          data?.message ||
            "Unable to save consultation follow-up.",
          "error"
        );

        return;
      }

      showNotification(
        data?.message ||
          "Consultation follow-up saved successfully.",
        "success"
      );

      closeConsultationFollowup();

      await fetchConsultationFollowups();

    } catch (error) {
      console.error(
        "❌ saveConsultationFollowup error:",
        error
      );

      showNotification(
        "Unable to save consultation follow-up.",
        "error"
      );

    } finally {
      setConsultationSaving(false);
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
        showNotification(
          data?.message ||
            "Approval failed.",
          "error"
        );
        return;
      }

      await fetchData();

      showNotification(
        "Profile approved successfully.",
        "success"
      );
    } catch (e) {
      console.error(
        "❌ approve error:",
        e
      );

      showNotification(
        "Approval failed.",
        "error"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const updateOfflinePaymentStatus = (
    paymentId,
    status
  ) => {
    const normalizedStatus =
      String(status || "")
        .trim()
        .toLowerCase();

    const verifying =
      normalizedStatus ===
      "verified";

    openPromptModal({
      title: verifying
        ? "Verify Offline Payment"
        : "Reject Offline Payment",

      description: verifying
        ? "Add review notes before marking this payment as verified."
        : "Provide the reason for rejecting this payment.",

      label: "Admin Notes",

      initialValue: verifying
        ? "Verified after review"
        : "Rejected after review",

      placeholder:
        "Enter payment review notes...",

      required:
        !verifying,

      confirmLabel: verifying
        ? "Verify Payment"
        : "Reject Payment",

      onConfirm: async (
        adminNotes
      ) => {
        closePromptModal();

        try {
          setPaymentActionLoadingId(
            paymentId
          );

          const res =
            await fetch(
              `${getBaseUrl()}/api/offline-payment/update-status`,
              {
                method: "PUT",
                headers: {
                  "Content-Type":
                    "application/json",
                  Authorization:
                    `Bearer ${token}`
                },
                body:
                  JSON.stringify({
                    paymentId,
                    status:
                      normalizedStatus,
                    adminNotes
                  })
              }
            );

          const data =
            await res.json();

          if (!res.ok) {
            showNotification(
              data?.message ||
                "Payment update failed.",
              "error"
            );
            return;
          }

          await fetchData();

          showNotification(
            verifying
              ? "Payment verified successfully."
              : "Payment rejected successfully.",
            "success"
          );

        } catch (e) {
          console.error(
            "❌ updateOfflinePaymentStatus error:",
            e
          );

          showNotification(
            "Payment status update failed.",
            "error"
          );

        } finally {
          setPaymentActionLoadingId(
            null
          );
        }
      }
    });
  };

  const openAdvertisementReview = (advertisement) => {
    setSelectedAdvertisement(
      advertisement
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
  useEffect(() => {
    if (!selectedAdvertisement) {
      return;
    }

    const submittedNarrative =
      String(
        selectedAdvertisement
          ?.member_narrative ||
          ""
      ).trim();

    const publishedNarrative =
      String(
        selectedAdvertisement
          ?.moderator_narrative ||
          ""
      ).trim();

    /*
     * The Moderator editor must always start
     * from the member's latest submitted text.
     *
     * member_narrative = latest member submission
     * moderator_narrative = currently published text
     */
    setModeratorNarrative(
      submittedNarrative ||
        publishedNarrative ||
        ""
    );
  }, [selectedAdvertisement]);
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
        showNotification(
          "Advertisement narrative is required before publishing.",
          "warning"
        );
        return;
      }

      if (
        normalizedAction === "REJECT" &&
        !moderatorRemarks.trim()
      ) {
        showNotification(
          "Please enter Moderator remarks before rejecting.",
          "warning"
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
        showNotification(
          data?.message ||
            "Advertisement review failed.",
          "error"
        );
        return;
      }

      showNotification(
        data?.message ||
          "Advertisement updated.",
        "success"
      );

      closeAdvertisementReview();

      await fetchAdvertisementReviewQueue();
      await fetchData();
    } catch (error) {
      console.error(
        "❌ reviewAdvertisement error:",
        error
      );

      showNotification(
        "Advertisement review failed.",
        "error"
      );
    } finally {
      setAdvertisementActionLoadingId(
        null
      );
    }
  };

const reviewContactRequest = (
  requestId,
  action
) => {
  const normalizedAction =
    String(action || "")
      .trim()
      .toUpperCase();

  const defaultRemark =
    normalizedAction ===
      "APPROVED"
      ? "Approved after moderator review"
      : normalizedAction ===
        "REJECTED"
      ? "Rejected after moderator review"
      : "Please provide additional clarification";

  openPromptModal({
    title:
      normalizedAction ===
        "APPROVED"
        ? "Approve Contact Request"
        : normalizedAction ===
          "REJECTED"
        ? "Reject Contact Request"
        : "Request Clarification",

    description:
      normalizedAction ===
        "APPROVED"
        ? "Add optional moderator remarks before granting contact access."
        : normalizedAction ===
          "REJECTED"
        ? "Provide the reason for rejecting this contact request."
        : "Specify the additional clarification required from the member.",

    label:
      "Moderator Remarks",

    initialValue:
      defaultRemark,

    placeholder:
      "Enter moderator remarks...",

    required:
      normalizedAction ===
        "REJECTED" ||
      normalizedAction ===
        "CLARIFICATION_REQUIRED",

    confirmLabel:
      normalizedAction ===
        "APPROVED"
        ? "Approve Request"
        : normalizedAction ===
          "REJECTED"
        ? "Reject Request"
        : "Request Clarification",

    onConfirm: async (
      remarks
    ) => {
      closePromptModal();

      try {
        setContactActionLoadingId(
          requestId
        );

        const normalizedRemarks =
          String(
            remarks || ""
          ).trim();

        const res =
          await fetch(
            `${getBaseUrl()}/api/moderator/contact-requests/${requestId}/review`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`
              },
              body:
                JSON.stringify({
                  action:
                    normalizedAction,
                  remarks:
                    normalizedRemarks
                })
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          showNotification(
            data?.message ||
              "Contact request update failed.",
            "error"
          );
          return;
        }

        showNotification(
          data?.message ||
            "Contact request updated.",
          "success"
        );

        await fetchContactRequests();
        await fetchData();

      } catch (error) {
        console.error(
          "❌ reviewContactRequest error:",
          error
        );

        showNotification(
          "Contact request update failed.",
          "error"
        );

      } finally {
        setContactActionLoadingId(
          null
        );
      }
    }
  });
};
  useEffect(() => {
  fetchData();
  fetchContactRequests();
  fetchConsultationFollowups();
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
    <div
      className={`${designClasses.surface} ${designClasses.border} mb-5 flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between`}
    >
      <div>
        <div
          className={`text-xl font-semibold ${designClasses.textPrimary}`}
        >
          Admin Console
        </div>

        <div
          className={`mt-1 text-sm ${designClasses.textSecondary}`}
        >
          Manage application settings, payments, member requests and approvals.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            fetchData();

            if (isAdminRole) {
              fetchSettings();
            }

            fetchContactRequests();
fetchConsultationFollowups();
fetchAdvertisementReviewQueue();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
        >
          Refresh
        </button>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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
      label="Fees & Application Settings"
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

    <SidebarItem
      label="Mutual Pair Follow-up"
      view={VIEWS.MUTUAL_FOLLOWUP}
      badge={consultationFollowups.length}
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
    <div
      className={`${designClasses.surface} ${designClasses.border} rounded-2xl border p-5 shadow-sm`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2
            className={`text-lg font-semibold ${designClasses.textPrimary}`}
          >
            Fees & Application Settings
          </h2>

          <p
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Manage configurable fees, contact-view limits,
            and the minimum advertisement contribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={settingsLoading}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              settingsLoading
                ? "cursor-not-allowed opacity-50"
                : ""
            } ${designClasses.secondaryButton}`}
          >
            {settingsLoading
              ? "Loading..."
              : "Reload Settings"}
          </button>

          <button
            type="button"
            onClick={saveSettings}
            disabled={
              settingsSaving ||
              settingsLoading
            }
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              settingsSaving ||
              settingsLoading
                ? "cursor-not-allowed opacity-50"
                : ""
            } ${designClasses.primaryButton}`}
          >
            {settingsSaving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </div>

      {settingsError ? (
        <div className="mb-4 p-3 rounded-lg border border-red-100 bg-red-50 text-sm text-red-800">
          {settingsError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={`${designClasses.surfaceMuted} ${designClasses.border} rounded-xl border p-4`}>
          <div className={`mb-2 text-sm font-semibold ${designClasses.textDark}`}>Registration Fee Amount</div>
          <input
            type="number"
            min="0"
            value={regFeeAmount}
            onChange={(e) => setRegFeeAmount(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
            placeholder="Enter registration fee"
          />
          <div className={`mt-2 text-xs ${designClasses.textSecondary}`}>Used for mandatory registration payment (offline).</div>
        </div>

        <div className={`${designClasses.surfaceMuted} ${designClasses.border} rounded-xl border p-4`}>
          <div className={`mb-2 text-sm font-semibold ${designClasses.textDark}`}>Contact Views per Cycle (X)</div>
          <input
            type="number"
            min="1"
            step="1"
            value={contactViewsX}
            onChange={(e) => setContactViewsX(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
            placeholder="Enter contact-view limit"
          />
          <div className={`mt-2 text-xs ${designClasses.textSecondary}`}>After X contact views, user must recharge.</div>
        </div>

        <div className={`${designClasses.surfaceMuted} ${designClasses.border} rounded-xl border p-4`}>
          <div className={`mb-2 text-sm font-semibold ${designClasses.textDark}`}>Recharge Fee Amount</div>
          <input
            type="number"
            min="0"
            value={rechargeFeeAmount}
            onChange={(e) => setRechargeFeeAmount(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
            placeholder="Enter recharge fee"
          />
          <div className={`mt-2 text-xs ${designClasses.textSecondary}`}>Used for offline recharge payments (ProfileRenewal).</div>
        </div>
                <div className={`${designClasses.surfaceMuted} ${designClasses.border} rounded-xl border p-4`}>
          <div className={`mb-2 text-sm font-semibold ${designClasses.textDark}`}>
            Minimum Advertisement Contribution
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>

            <input
              type="number"
              min="0"
              step="1"
              value={
                advertisementMinContribution
              }
              onChange={(e) =>
                setAdvertisementMinContribution(
                  e.target.value
                )
              }
              className={`w-full rounded-lg border py-2 pl-8 pr-3 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
              placeholder="Enter minimum contribution"
            />
          </div>

          <div className={`mt-2 text-xs ${designClasses.textSecondary}`}>
            Members may contribute this amount or
            any higher amount when submitting an
            advertisement.
          </div>
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
          {String(
            selectedAdvertisement.status || ""
          ).toLowerCase() === "active" &&
            String(
              selectedAdvertisement.review_status || ""
            ).toLowerCase() === "pending" &&
            selectedAdvertisement.moderator_narrative && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Currently Published Advertisement
                </label>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                  {selectedAdvertisement.moderator_narrative}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  This version remains live until the submitted revision is approved.
                </p>
              </div>
            )}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Submitted Advertisement
            </label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
              {selectedAdvertisement.member_narrative ||
                "No submitted advertisement text."}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Read-only member submission.
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Advertisement to Approve & Publish
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
              This starts with the member's latest submitted advertisement.
              Moderator may improve the wording, but must not change authoritative
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
            Review member contact requests that require
            Moderator or Foundation approval.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchContactRequests}
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
                Request
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Requester
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Requested Profile
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Relationship
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Request Message
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Requested On
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {contactRequests.map(
              (request) => {
                const actionLoading =
                  contactActionLoadingId ===
                  request.id;

                return (
                  <tr
                    key={request.id}
                    className="border-b border-gray-100 align-top"
                  >
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">
                        #{request.id}
                      </div>

                      <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                        {request.status ||
                          "PENDING"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        {request.requester_name ||
                          "-"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {
                          request.requester_profile_id
                        }
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        Profile Status:{" "}
                        {request.requester_profile_status ||
                          "-"}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        {request.target_name ||
                          "-"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {
                          request.target_profile_id
                        }
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        Profile Status:{" "}
                        {request.target_profile_status ||
                          "-"}
                      </div>
                    </td>

                    <td className="p-3">
                      {request.mutual_interest ? (
                        <div>
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            Mutual Interest
                          </span>

                          <div className="mt-2 text-xs text-gray-500">
                            Advertisement relationship verified.
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                            Standard Request
                          </span>

                          <div className="mt-2 text-xs text-gray-500">
                            No mutual advertisement relationship found.
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="max-w-xs whitespace-pre-wrap text-sm text-gray-700">
                        {request.requester_message ||
                          "No message provided."}
                      </div>
                    </td>

                    <td className="p-3 text-gray-700">
                      {request.created_at
                        ? new Date(
                            request.created_at
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() =>
                            reviewContactRequest(
                              request.id,
                              "APPROVED"
                            )
                          }
                          className={`px-3 py-2 rounded-lg text-white text-xs font-semibold ${
                            actionLoading
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() =>
                            reviewContactRequest(
                              request.id,
                              "CLARIFICATION_REQUIRED"
                            )
                          }
                          className={`px-3 py-2 rounded-lg text-white text-xs font-semibold ${
                            actionLoading
                              ? "bg-amber-400 cursor-not-allowed"
                              : "bg-amber-600 hover:bg-amber-700"
                          }`}
                        >
                          Clarification
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() =>
                            reviewContactRequest(
                              request.id,
                              "REJECTED"
                            )
                          }
                          className={`px-3 py-2 rounded-lg text-white text-xs font-semibold ${
                            actionLoading
                              ? "bg-red-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}

            {contactRequests.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
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

  const renderConsultationFollowups =
  () => (
    <div
      className={`${designClasses.surface} ${designClasses.border} rounded-2xl border p-5 shadow-sm`}
    >
      <div
        className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2
            className={`text-lg font-semibold ${designClasses.textPrimary}`}
          >
            Mutual Pair Follow-up

            <span
              className={`ml-2 text-sm font-normal ${designClasses.textSecondary}`}
            >
              ({consultationFollowups.length})
            </span>
          </h2>

          <p
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Follow up with members whose
            advertisement response has reached
            Mutual Interest.
          </p>
        </div>

        <button
          type="button"
          onClick={
            fetchConsultationFollowups
          }
          disabled={
            consultationLoading
          }
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            consultationLoading
              ? "cursor-not-allowed opacity-50"
              : ""
          } ${designClasses.secondaryButton}`}
        >
          {consultationLoading
            ? "Loading..."
            : "Refresh"}
        </button>
      </div>

      <div
        className="overflow-auto rounded-xl border border-gray-100"
      >
        <table
          className="min-w-full text-sm"
        >
          <thead
            className="bg-gray-50"
          >
            <tr
              className="border-b border-gray-100 text-left"
            >
              <th className="p-3 font-semibold text-gray-700">
                Mutual Pair
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Contact Numbers
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Status
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Convenient Time
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Next Follow-up
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Remarks
              </th>

              <th className="p-3 font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {consultationFollowups.map(
              (
                item,
                index
              ) => (
                <tr
                  key={
                    item
                      .advertisement_response_id
                  }
                  className={`border-b border-gray-100 ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 align-top">
                    <div className="font-semibold text-gray-900">
                      {item.owner_name ||
                        item.owner_profile_id}
                    </div>

                    <div className="text-xs text-gray-500">
                      {
                        item.owner_profile_id
                      }
                    </div>

                    <div className="my-1 text-xs font-semibold text-green-700">
                      Mutual Interest
                    </div>

                    <div className="font-semibold text-gray-900">
                      {item.responder_name ||
                        item.responder_profile_id}
                    </div>

                    <div className="text-xs text-gray-500">
                      {
                        item.responder_profile_id
                      }
                    </div>
                  </td>

                  <td className="p-3 align-top text-gray-700">
                    <div>
                      Owner:
                      {" "}
                      {item.owner_phone ||
                        "-"}
                    </div>

                    <div className="mt-1">
                      Responder:
                      {" "}
                      {item.responder_phone ||
                        "-"}
                    </div>
                  </td>

                  <td className="p-3 align-top">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        item
                          .consultation_status ===
                        "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : item
                              .consultation_status ===
                            "DISCUSSION_SCHEDULED"
                          ? "bg-blue-100 text-blue-800"
                          : item
                              .consultation_status ===
                            "NO_RESPONSE"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {
                        item.consultation_status ||
                        "PENDING"
                      }
                    </span>
                  </td>

                  <td className="p-3 align-top text-gray-700">
                    {item.convenient_time ||
                      "-"}
                  </td>

                  <td className="p-3 align-top text-gray-700">
                    {item.next_follow_up_at
                      ? new Date(
                          item.next_follow_up_at
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td
                    className="max-w-xs p-3 align-top text-gray-700"
                  >
                    {item
                      .consultation_remarks ||
                      "-"}
                  </td>

                  <td className="p-3 align-top">
                    <button
                      type="button"
                      onClick={() =>
                        openConsultationFollowup(
                          item
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.primaryButton}`}
                    >
                      {item
                        .consultation_followup_id
                        ? "Update"
                        : "Start Follow-up"}
                    </button>
                  </td>
                </tr>
              )
            )}

            {!consultationLoading &&
              consultationFollowups.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-gray-500"
                  >
                    No Mutual Interest pairs
                    are currently awaiting
                    follow-up.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
const renderConsultationEditor =
  () => {
    if (!selectedConsultation) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <div
          className={`${designClasses.surface} ${designClasses.border} max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6 shadow-xl`}
        >
          <div
            className="mb-5 flex items-start justify-between gap-4"
          >
            <div>
              <h3
                className={`text-lg font-semibold ${designClasses.textPrimary}`}
              >
                Mutual Pair Follow-up
              </h3>

              <p
                className={`mt-1 text-sm ${designClasses.textSecondary}`}
              >
                {
                  selectedConsultation
                    .owner_name
                }
                {" ↔ "}
                {
                  selectedConsultation
                    .responder_name
                }
              </p>
            </div>

            <button
              type="button"
              onClick={
                closeConsultationFollowup
              }
              className="text-xl text-gray-500 hover:text-gray-800"
            >
              ×
            </button>
          </div>

          <div
            className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <div
              className={`${designClasses.surfaceMuted} rounded-xl p-3`}
            >
              <div
                className={`text-xs ${designClasses.textSecondary}`}
              >
                Advertisement Owner
              </div>

              <div
                className={`mt-1 font-semibold ${designClasses.textDark}`}
              >
                {
                  selectedConsultation
                    .owner_name
                }
              </div>

              <div
                className={`text-sm ${designClasses.textSecondary}`}
              >
                {
                  selectedConsultation
                    .owner_profile_id
                }
                {" · "}
                {
                  selectedConsultation
                    .owner_phone ||
                  "No phone"
                }
              </div>
            </div>

            <div
              className={`${designClasses.surfaceMuted} rounded-xl p-3`}
            >
              <div
                className={`text-xs ${designClasses.textSecondary}`}
              >
                Interested Member
              </div>

              <div
                className={`mt-1 font-semibold ${designClasses.textDark}`}
              >
                {
                  selectedConsultation
                    .responder_name
                }
              </div>

              <div
                className={`text-sm ${designClasses.textSecondary}`}
              >
                {
                  selectedConsultation
                    .responder_profile_id
                }
                {" · "}
                {
                  selectedConsultation
                    .responder_phone ||
                  "No phone"
                }
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className={`mb-1 block text-sm font-semibold ${designClasses.textDark}`}
              >
                Consultation Status
              </label>

              <select
                value={
                  consultationForm
                    .consultationStatus
                }
                onChange={(event) =>
                  setConsultationForm(
                    (current) => ({
                      ...current,
                      consultationStatus:
                        event.target.value
                    })
                  )
                }
                className={`w-full rounded-lg border px-3 py-2 ${designClasses.border} ${designClasses.surface}`}
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="CONTACTED">
                  Contacted
                </option>

                <option value="DISCUSSION_SCHEDULED">
                  Discussion Scheduled
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="NO_RESPONSE">
                  No Response
                </option>

                <option value="CLOSED">
                  Closed
                </option>
              </select>
            </div>

            <div>
              <label
                className={`mb-1 block text-sm font-semibold ${designClasses.textDark}`}
              >
                Convenient Time for Discussion
              </label>

              <input
                type="text"
                value={
                  consultationForm
                    .convenientTime
                }
                onChange={(event) =>
                  setConsultationForm(
                    (current) => ({
                      ...current,
                      convenientTime:
                        event.target.value
                    })
                  )
                }
                placeholder="Example: Weekdays after 7 PM"
                className={`w-full rounded-lg border px-3 py-2 ${designClasses.border} ${designClasses.surface}`}
              />
            </div>

            <div>
              <label
                className={`mb-1 block text-sm font-semibold ${designClasses.textDark}`}
              >
                Next Follow-up
              </label>

              <input
                type="datetime-local"
                value={
                  consultationForm
                    .nextFollowUpAt
                }
                onChange={(event) =>
                  setConsultationForm(
                    (current) => ({
                      ...current,
                      nextFollowUpAt:
                        event.target.value
                    })
                  )
                }
                className={`w-full rounded-lg border px-3 py-2 ${designClasses.border} ${designClasses.surface}`}
              />
            </div>

            <div>
              <label
                className={`mb-1 block text-sm font-semibold ${designClasses.textDark}`}
              >
                Consultation Remarks
              </label>

              <textarea
                rows={4}
                value={
                  consultationForm
                    .consultationRemarks
                }
                onChange={(event) =>
                  setConsultationForm(
                    (current) => ({
                      ...current,
                      consultationRemarks:
                        event.target.value
                    })
                  )
                }
                placeholder="Record discussion, member feedback and next actions..."
                className={`w-full rounded-lg border px-3 py-2 ${designClasses.border} ${designClasses.surface}`}
              />
            </div>
          </div>

          <div
            className="mt-6 flex justify-end gap-3"
          >
            <button
              type="button"
              onClick={
                closeConsultationFollowup
              }
              disabled={
                consultationSaving
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                saveConsultationFollowup
              }
              disabled={
                consultationSaving
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                consultationSaving
                  ? "cursor-not-allowed opacity-50"
                  : ""
              } ${designClasses.primaryButton}`}
            >
              {consultationSaving
                ? "Saving..."
                : "Save Follow-up"}
            </button>
          </div>
        </div>
      </div>
    );
  };
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
  activeView === VIEWS.MUTUAL_FOLLOWUP
) {
  return renderConsultationFollowups();
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
    <div
      className={`flex min-h-screen flex-col ${designClasses.page}`}
    >
      <BrandHeader compact />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {renderTopHeader()}

        {notification.message && (
          <div className="mb-4">
            <NotificationBanner
              message={
                notification.message
              }
              type={
                notification.type
              }
              onClose={() =>
                setNotification({
                  message: "",
                  type: "success"
                })
              }
            />
          </div>
        )}

        {/* Layout with Sidebar */}
        <div className="flex flex-col md:flex-row gap-5">
          {renderSidebar()}

          <div className="flex-1">
            {renderMainContent()}
          </div>
        </div>
      </main>

      <BrandFooter />
{renderConsultationEditor()}
      <PromptModal
        open={
          promptModal.open
        }
        title={
          promptModal.title
        }
        description={
          promptModal.description
        }
        label={
          promptModal.label
        }
        initialValue={
          promptModal.initialValue
        }
        placeholder={
          promptModal.placeholder
        }
        required={
          promptModal.required
        }
        confirmLabel={
          promptModal.confirmLabel
        }
        onCancel={
          closePromptModal
        }
        onConfirm={(
          value
        ) => {
          promptModal
            .onConfirm?.(
              value
            );
        }}
      />
    </div>
  );
};

export default AdminDashboard;
