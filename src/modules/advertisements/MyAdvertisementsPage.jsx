import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MemberLayout from "../../shared/layouts/MemberLayout";
import AdvertisementPreview from "../../shared/components/AdvertisementPreview";
import NotificationBanner from "../../shared/components/NotificationBanner";
import ConfirmModal from "../../shared/components/ConfirmModal";

import {
  designClasses,
} from "../../shared/styles/designTokens";

import advertisementService from "../../services/advertisementService";

const normalizeStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString();
};

const getAdvertisementStatus = (
  advertisement
) => {
  const status =
    normalizeStatus(
      advertisement?.status
    );

  const paymentStatus =
    normalizeStatus(
      advertisement?.payment_status
    );

  const reviewStatus =
    normalizeStatus(
      advertisement?.review_status
    );

  if (
    status ===
    "pending_payment"
  ) {
    return {
      label:
        "Payment Verification Pending",
      className:
        designClasses.statusWarning,
    };
  }

  if (
    status ===
    "pending_review"
  ) {
    return {
      label:
        "Under Advertisement Review",
      className:
        designClasses.statusReview,
    };
  }

  if (
    status === "active" &&
    reviewStatus === "pending"
  ) {
    return {
      label:
        "Published · Revision Under Review",
      className:
        designClasses.statusReview,
    };
  }

  if (
    status === "active"
  ) {
    return {
      label:
        "Published",
      className:
        designClasses.statusSuccess,
    };
  }

  if (
    status ===
      "payment_rejected" ||
    paymentStatus ===
      "rejected"
  ) {
    return {
      label:
        "Payment Rejected",
      className:
        designClasses.statusError,
    };
  }

  if (
    status === "rejected" ||
    reviewStatus ===
      "rejected"
  ) {
    return {
      label:
        "Advertisement Rejected",
      className:
        designClasses.statusError,
    };
  }

  if (
    status === "expired"
  ) {
    return {
      label:
        "Expired",
      className:
        designClasses.surfaceMuted,
    };
  }

  if (
    status === "cancelled"
  ) {
    return {
      label:
        "Cancelled",
      className:
        designClasses.surfaceMuted,
    };
  }

  return {
    label:
      advertisement?.status ||
      "Submitted",

    className:
      designClasses.surfaceMuted,
  };
};

const SummaryCard = ({
  label,
  value,
  helper,
  interactive = false,
}) => (
  <div
    className={`${designClasses.card} p-4 ${
      interactive
        ? "h-full transition hover:-translate-y-0.5 hover:shadow-md"
        : ""
    }`}
  >
    <div
      className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
    >
      {label}
    </div>

    <div
      className={`mt-2 text-2xl font-bold ${designClasses.textPrimary}`}
    >
      {value}
    </div>

    {helper && (
      <div
        className={`mt-1 text-xs ${designClasses.textSecondary}`}
      >
        {helper}
      </div>
    )}
  </div>
);

const MyAdvertisementsPage = () => {
  const navigate =
    useNavigate();

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    advertisements,
    setAdvertisements
  ] = useState([]);

  const [
    notification,
    setNotification
  ] = useState({
    message: "",
    type: "success"
  });

    const [
    cancellationTarget,
    setCancellationTarget
  ] = useState(null);

  const [
    cancellingId,
    setCancellingId
  ] = useState(null);

  const loadAdvertisements =
    async () => {
      setLoading(true);

      try {
        const result =
          await advertisementService
            .getMyAdvertisements();

        setAdvertisements(
          result
        );
      } catch (error) {
        console.error(
          "Unable to load My Advertisements:",
          error
        );

        setNotification({
          message:
            error?.response?.data
              ?.message ||
            "Unable to load your advertisements.",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };
  const confirmCancellation =
    async () => {
      if (
        !cancellationTarget?.id
      ) {
        return;
      }

      const advertisementId =
        cancellationTarget.id;

      try {
        setCancellingId(
          advertisementId
        );

        const result =
          await advertisementService
            .cancelMyAdvertisement(
              advertisementId
            );

        setCancellationTarget(
          null
        );

        setNotification({
          message:
            result?.message ||
            "Advertisement cancelled successfully.",
          type:
            "success"
        });

        await loadAdvertisements();

      } catch (error) {
        console.error(
          "Unable to cancel advertisement:",
          error
        );

        setNotification({
          message:
            error?.response?.data
              ?.message ||
            "Unable to cancel your advertisement.",
          type:
            "error"
        });

      } finally {
        setCancellingId(
          null
        );
      }
    };
  useEffect(() => {
    loadAdvertisements();
  }, []);

  const summary =
    useMemo(() => {
      const active =
        advertisements.filter(
          (item) =>
            normalizeStatus(
              item.status
            ) === "active"
        ).length;

      const underReview =
        advertisements.filter(
          (item) => {
            const status =
              normalizeStatus(
                item.status
              );

            const reviewStatus =
              normalizeStatus(
                item.review_status
              );

            return (
              status ===
                "pending_review" ||
              (
                status === "active" &&
                reviewStatus ===
                  "pending"
              )
            );
          }
        ).length;

      const responses =
        advertisements.reduce(
          (
            total,
            advertisement
          ) =>
            total +
            Number(
              advertisement
                ?.total_responses ||
                0
            ),
          0
        );

      const mutual =
        advertisements.reduce(
          (
            total,
            advertisement
          ) =>
            total +
            Number(
              advertisement
                ?.mutual_count ||
                0
            ),
          0
        );

      return {
        total:
          advertisements.length,
        active,
        underReview,
        responses,
        mutual
      };
    }, [advertisements]);

  const hasBlockingAdvertisement =
    advertisements.some(
      (advertisement) =>
        [
          "pending_payment",
          "pending_review",
          "active"
        ].includes(
          normalizeStatus(
            advertisement.status
          )
        )
    );

  if (loading) {
    return (
      <MemberLayout>
        <div
          className={`${designClasses.card} p-6`}
        >
          <p
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Loading your advertisements...
          </p>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="space-y-5">
        {notification.message && (
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
        )}

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className={`text-xl font-semibold ${designClasses.textPrimary}`}
              >
                My Advertisements
              </h1>

              <p
                className={`mt-1 text-sm ${designClasses.textSecondary}`}
              >
                Create, track and manage
                advertisements for your
                matrimonial profile.
              </p>
            </div>

            {advertisements.length > 0 &&
              !hasBlockingAdvertisement && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/make-preferred"
                    )
                  }
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${designClasses.primaryButton}`}
                >
                  Create Advertisement
                </button>
              )}
          </div>
        </section>

        {advertisements.length ===
        0 ? (
          <section
            className={`${designClasses.card} overflow-hidden p-0`}
          >
            <div className="p-6 sm:p-8">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${designClasses.accentSoft} ${designClasses.textAccent}`}
              >
                Matrimonial Spotlight
              </div>

              <h2
                className={`mt-4 text-2xl font-semibold ${designClasses.textPrimary}`}
              >
                Help Your Profile Reach
                More Families
              </h2>

              <p
                className={`mt-3 max-w-3xl text-sm leading-6 ${designClasses.textSecondary}`}
              >
                Your profile is already
                available through search
                and matches. Creating an
                advertisement gives it
                additional visibility
                through the Kalyana Sakha
                Matrimonial Spotlight and
                makes it easier for
                interested members and
                families to view, respond
                to and share your profile.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div
                  className={`rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
                >
                  <div
                    className={`font-semibold ${designClasses.textDark}`}
                  >
                    More Visibility
                  </div>

                  <p
                    className={`mt-1 text-sm ${designClasses.textSecondary}`}
                  >
                    Appear in the
                    Matrimonial Spotlight
                    seen by members across
                    the portal.
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
                >
                  <div
                    className={`font-semibold ${designClasses.textDark}`}
                  >
                    Easy Responses
                  </div>

                  <p
                    className={`mt-1 text-sm ${designClasses.textSecondary}`}
                  >
                    Interested members can
                    Show Interest or Apply
                    directly from your
                    advertisement.
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
                >
                  <div
                    className={`font-semibold ${designClasses.textDark}`}
                  >
                    Share with Families
                  </div>

                  <p
                    className={`mt-1 text-sm ${designClasses.textSecondary}`}
                  >
                    Your advertisement and
                    profile can be
                    forwarded to suitable
                    families.
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
                >
                  <div
                    className={`font-semibold ${designClasses.textDark}`}
                  >
                    Manage Responses
                  </div>

                  <p
                    className={`mt-1 text-sm ${designClasses.textSecondary}`}
                  >
                    Track responses and
                    continue conversations
                    through your Message
                    Box.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/make-preferred"
                    )
                  }
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${designClasses.primaryButton}`}
                >
                  Create My Advertisement
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/my-profile"
                    )
                  }
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${designClasses.secondaryButton}`}
                >
                  View My Profile
                </button>
              </div>

              <div
                className={`mt-6 rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
              >
                <p
                  className={`text-xs leading-5 ${designClasses.textSecondary}`}
                >
                  You review the
                  advertisement before
                  submission. Profile facts
                  remain sourced from your
                  approved profile, and the
                  advertisement is
                  published only after
                  payment verification and
                  Moderator review.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section
  className={`flex flex-wrap items-center gap-y-3 rounded-xl border px-4 py-3 ${designClasses.border} ${designClasses.surfaceMuted}`}
>
  <div className="flex min-w-[220px] items-center gap-6 px-5 py-1">
    <span
      className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
    >
      Total Advertisements
    </span>

    <span
      className={`text-xl font-bold ${designClasses.textPrimary}`}
    >
      {summary.total}
    </span>
  </div>

  <div
  className={`mx-3 hidden h-7 border-l sm:block ${designClasses.border}`}
/>

  <div className="flex items-center gap-2 px-3 py-1">
    <span
      className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
    >
      Under Review
    </span>

    <span
      className={`text-xl font-bold ${designClasses.textPrimary}`}
    >
      {summary.underReview}
    </span>
  </div>
</section>

            <section className="space-y-4">
              {advertisements.map(
                (advertisement) => {
                  const statusUi =
                    getAdvertisementStatus(
                      advertisement
                    );
                  const normalizedStatus =
                    normalizeStatus(
                      advertisement.status
                    );

                  const canEdit =
                    [
                      "pending_payment",
                      "pending_review",
                      "active",
                      "rejected"
                    ].includes(
                      normalizedStatus
                    );

                  const canCancel =
                    [
                      "pending_payment",
                      "pending_review",
                      "active"
                    ].includes(
                      normalizedStatus
                    );

                  const cancelLabel =
                    normalizedStatus ===
                      "active"
                      ? "Cancel Advertisement"
                      : "Withdraw Submission";
                  const memberNarrative =
                    String(
                      advertisement
                        .member_narrative ||
                        ""
                    ).trim();

                  const approvedNarrative =
                    String(
                      advertisement
                        .moderator_narrative ||
                        ""
                    ).trim();

                  const narrative =
                    memberNarrative ||
                    approvedNarrative ||
                    "";

                  const lookingFor =
                    String(
                      advertisement
                        .looking_for ||
                        ""
                    ).toLowerCase();

                  const heading =
                    lookingFor === "bride"
                      ? "Looking for a Bride"
                      : lookingFor ===
                          "groom" ||
                        lookingFor ===
                          "bridegroom"
                        ? "Looking for a Bridegroom"
                        : "Matrimonial Advertisement";

                  return (
                    <article
                      key={
                        advertisement.id
                      }
                      className={`${designClasses.card} p-5 sm:p-6`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2
                              className={`text-lg font-semibold ${designClasses.textPrimary}`}
                            >
                              {heading}
                            </h2>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusUi.className}`}
                            >
                              {
                                statusUi.label
                              }
                            </span>
                          </div>

                          <div
                            className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs ${designClasses.textSecondary}`}
                          >
                            <span>
                              Advertisement #
                              {advertisement.id}
                            </span>

                            <span>
                              Submitted{" "}
                              {formatDate(
                                advertisement
                                  .created_at
                              )}
                            </span>

                            {advertisement
                              .published_at && (
                              <span>
                                Published{" "}
                                {formatDate(
                                  advertisement
                                    .published_at
                                )}
                              </span>
                            )}

                            {advertisement
                              .validity_date &&
                              normalizedStatus ===
                                "active" && (
                                <span>
                                  Valid until{" "}
                                  {formatDate(
                                    advertisement
                                      .validity_date
                                  )}
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-sm font-semibold ${designClasses.textPrimary}`}
                          >
                            Contribution: ₹
                            {advertisement
                              .payment_amount ??
                              "-"}
                          </div>

                          {normalizedStatus ===
                            "active" &&
                            advertisement
                              .days_remaining !==
                              null &&
                            advertisement
                              .days_remaining !==
                              undefined && (
                              <div
                                className={`mt-1 text-xs ${
                                  Number(
                                    advertisement
                                      .days_remaining
                                  ) <= 7
                                    ? designClasses.textAccent
                                    : designClasses.textSecondary
                                }`}
                              >
                                {Number(
                                  advertisement
                                    .days_remaining
                                ) > 0
                                  ? `${advertisement.days_remaining} days remaining`
                                  : "Expires today"}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <AdvertisementPreview
                          heading={
                            heading
                          }
                          text={
                            narrative
                          }
                          muted
                        />
                      </div>

                      <div
                        className={`mt-2 text-right text-xs ${designClasses.textSecondary}`}
                      >
                        {
                          narrative.length
                        }{" "}
                        characters
                      </div>

                      <div
                        className={`mt-5 flex flex-wrap items-center gap-y-3 rounded-xl border px-4 py-3 ${designClasses.border} ${designClasses.surfaceMuted}`}
                      >
                        

                        <div
  className={`mx-2 hidden h-7 border-l sm:block ${designClasses.border}`}
/>
<button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/inbox?advertisementId=${advertisement.id}&responseType=APPLY`
                            )
                          }
                          className="group flex min-w-[190px] items-center gap-3 px-5 py-1 text-left"
                        >
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
                          >
                            Applied against Advt.
                          </span>

                          <span
                            className={`text-xl font-bold ${designClasses.textPrimary} group-hover:underline`}
                          >
                            {advertisement
                              .apply_count ||
                              0}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/inbox?advertisementId=${advertisement.id}&responseType=INTEREST`
                            )
                          }
                          className="group flex min-w-[190px] items-center gap-3 px-5 py-1 text-left"
                        >
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
                          >
                            SHOWED INTEREST
                          </span>

                          <span
                            className={`text-xl font-bold ${designClasses.textPrimary} group-hover:underline`}
                          >
                            {advertisement
                              .interest_count ||
                              0}
                          </span>
                        </button>

                        <div
  className={`mx-2 hidden h-7 border-l sm:block ${designClasses.border}`}
/>

                        

                        <div
  className={`mx-2 hidden h-7 border-l sm:block ${designClasses.border}`}
/>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/inbox?advertisementId=${advertisement.id}&responseStatus=MUTUAL`
                            )
                          }
                          className="group flex min-w-[190px] items-center gap-3 px-5 py-1 text-left"
                        >
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
                          >
                            Mutually Agreed to go next step
                          </span>

                          <span
                            className={`text-xl font-bold ${designClasses.textPrimary} group-hover:underline`}
                          >
                            {advertisement
                              .mutual_count ||
                              0}
                          </span>
                        </button>
                      </div>

                      {(advertisement
                        .moderator_remarks ||
                        normalizeStatus(
                          advertisement
                            .status
                        ) ===
                          "rejected") && (
                        <div
                          className={`mt-4 rounded-xl p-4 ${designClasses.statusWarning}`}
                        >
                          <div
                            className={
                              designClasses
                                .statusTitle
                            }
                          >
                            Moderator Remarks
                          </div>

                          <p
                            className={`mt-1 text-sm ${designClasses.statusText}`}
                          >
                            {advertisement
                              .moderator_remarks ||
                              "Please review the advertisement before resubmission."}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        {Number(
                          advertisement
                            .total_responses ||
                            0
                        ) > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/inbox?advertisementId=${advertisement.id}`
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.primaryButton}`}
                          >
                            View Responses (
                            {advertisement
                              .total_responses}
                            )
                          </button>
                        )}
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/make-preferred?advertisementId=${advertisement.id}`
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
                          >
                            {normalizedStatus ===
                            "rejected"
                              ? "Edit & Resubmit"
                              : "Edit Advertisement"}
                          </button>
                        )}
                        
                                                {canCancel && (
                          <button
                            type="button"
                            disabled={
                              cancellingId ===
                              advertisement.id
                            }
                            onClick={() =>
                              setCancellationTarget(
                                advertisement
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.secondaryButton}`}
                          >
                            {cancellingId ===
                            advertisement.id
                              ? "Cancelling..."
                              : cancelLabel}
                          </button>
                        )}
                        
                        

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/view-profile/${advertisement.profile_id}`
                            )
                          }
                          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
                        >
                          {normalizedStatus ===
                          "active"
                            ? "View Published Profile"
                            : "View Profile"}
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </section>
          </>
        )}
      </div>

      <ConfirmModal
        open={
          Boolean(
            cancellationTarget
          )
        }
        title={
          normalizeStatus(
            cancellationTarget?.status
          ) === "active"
            ? "Cancel Advertisement?"
            : "Withdraw Advertisement Submission?"
        }
        description={
          normalizeStatus(
            cancellationTarget?.status
          ) === "active"
            ? "This will immediately remove the advertisement from Matrimonial Spotlight. Your advertisement history and responses will be retained."
            : "This will withdraw the advertisement from further payment or Moderator review. The historical record will be retained."
        }
        confirmLabel={
          normalizeStatus(
            cancellationTarget?.status
          ) === "active"
            ? "Cancel Advertisement"
            : "Withdraw Submission"
        }
        cancelLabel="Keep Advertisement"
        onCancel={() =>
          setCancellationTarget(
            null
          )
        }
        onConfirm={
          confirmCancellation
        }
      />
    </MemberLayout>
  );
};

export default MyAdvertisementsPage;