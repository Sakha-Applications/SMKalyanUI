import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import invitationService from "../../services/invitationService";
import advertisementResponseService from "../../services/advertisementResponseService";
import registrationService from "../../services/registrationService";
import profileService from "../../services/profileService";

import MemberLayout from "../../shared/layouts/MemberLayout";
import RestrictedFeatureState from "../../shared/components/RestrictedFeatureState";
import PromptModal from "../../shared/components/PromptModal";

import {
  calculateProfileCompletion,
} from "../../shared/utils/profileCompletion";

import {
  designClasses,
} from "../../shared/styles/designTokens";

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString();
};

const InvitationStatus = ({ status }) => {
  const normalizedStatus =
    normalizeStatus(status);

  const label =
    normalizedStatus === "NEW"
      ? "New"
      : normalizedStatus === "PENDING"
        ? "Pending"
        : normalizedStatus === "ACCEPTED"
          ? "Accepted"
          : normalizedStatus === "SHORTLISTED"
            ? "Shortlisted"
            : normalizedStatus === "HOLD"
              ? "On Hold"
              : normalizedStatus === "MUTUAL"
                ? "Mutual Interest"
                : normalizedStatus === "NOT_INTERESTED"
                  ? "Not Interested"
                  : normalizedStatus === "REJECTED"
                    ? "Not Proceeding"
                    : normalizedStatus === "DECLINED"
                      ? "Not Proceeding"
                      : normalizedStatus
                        ? normalizedStatus
                            .toLowerCase()
                            .replace(
                              /_/g,
                              " "
                            )
                            .replace(
                              /\b\w/g,
                              (character) =>
                                character.toUpperCase()
                            )
                        : "Status unavailable";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
    >
      {label}
    </span>
  );
};

const InvitationCard = ({
  invitation,
  direction,
  onViewProfile,
}) => {
  const received =
    direction === "received";

  const profileId = received
    ? invitation.inviter_profile_id
    : invitation.invitee_profile_id;

  const profileName = received
    ? invitation.inviter_name
    : invitation.invitee_name;

  const directionLabel = received
    ? "Interest from"
    : "Interest sent to";

  const message =
    invitation.inviter_message ||
    invitation.message ||
    "";

  const date =
    formatDate(invitation.sent_at) ||
    formatDate(invitation.created_at);

  return (
    <article
      className={`${designClasses.card} p-4`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              {directionLabel}{" "}
              {profileName ||
                profileId ||
                "Member"}
            </h3>

            <InvitationStatus
              status={invitation.status}
            />
          </div>

          {profileId && (
            <p
              className={`mt-1 text-xs ${designClasses.textSecondary}`}
            >
              Profile ID: {profileId}
            </p>
          )}

          {message && (
            <p
              className={`mt-3 text-sm italic ${designClasses.textSecondary}`}
            >
              “{message}”
            </p>
          )}

          {date && (
            <p
              className={`mt-3 text-xs ${designClasses.textSecondary}`}
            >
              {received
                ? "Received"
                : "Sent"}
              : {date}
            </p>
          )}
        </div>

        {profileId && (
          <button
            type="button"
            onClick={() =>
              onViewProfile(profileId)
            }
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
          >
            View Profile
          </button>
        )}
      </div>
    </article>
  );
};

const AdvertisementResponseCard = ({
  response,
  direction,
  onViewProfile,
  onViewContactDetails,
  onUpdateStatus,
  onRequestContact,
  actionLoading,
  contactActionLoading,
  contactRequestStatusByProfile
}) => {
  const received =
    direction === "received";

  const profileId =
    received
      ? response.responder_profile_id
      : response.owner_profile_id;

  const profileName =
    received
      ? response.responder_name
      : response.owner_name;

  const responseType =
    String(
      response.response_type || ""
    ).toUpperCase();

  const typeLabel =
    responseType === "APPLY"
      ? "Application"
      : "Interest";

  const remarks =
    response.responder_remarks ||
    "";

  const status =
    response.response_status ||
    "NEW";
  const normalizedResponseStatus =
    normalizeStatus(status);

  const contactTargetProfileId =
    received
      ? response.responder_profile_id
      : response.owner_profile_id;

  const contactRequestInfo =
    contactRequestStatusByProfile[
      String(
        contactTargetProfileId || ""
      )
    ] || {};

  const contactRequestStatus =
    normalizeStatus(
      typeof contactRequestInfo ===
        "string"
        ? contactRequestInfo
        : contactRequestInfo?.status
    );

  const contactModeratorRemarks =
    typeof contactRequestInfo ===
      "object"
      ? String(
          contactRequestInfo
            ?.moderatorRemarks ||
          ""
        ).trim()
      : "";

  const contactRequestPending =
    contactRequestStatus ===
      "PENDING";

  const contactAccessApproved =
    contactRequestStatus ===
      "APPROVED";

  const clarificationRequired =
    contactRequestStatus ===
      "CLARIFICATION_REQUIRED";

  return (
    <article
      className={`${designClasses.card} p-4`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-base font-semibold ${designClasses.textDark}`}
              >
                {received
                  ? `${typeLabel} from`
                  : `${typeLabel} sent to`}{" "}
                {profileName ||
                  profileId ||
                  "Member"}
              </h3>

              <InvitationStatus
                status={status}
              />
            </div>

            {profileId && (
              <p
                className={`mt-1 text-xs ${designClasses.textSecondary}`}
              >
                Profile ID: {profileId}
              </p>
            )}

            {received && (
              <p
                className={`mt-2 text-xs ${designClasses.textSecondary}`}
              >
                {response.current_age
                  ? `${response.current_age} yrs · `
                  : ""}
                {response.education || ""}
                {response.profession
                  ? ` · ${response.profession}`
                  : ""}
                {response.current_location
                  ? ` · ${response.current_location}`
                  : ""}
              </p>
            )}

            {!received && (
              <p
                className={`mt-2 text-xs ${designClasses.textSecondary}`}
              >
                {response.owner_current_age
                  ? `${response.owner_current_age} yrs · `
                  : ""}
                {response.owner_education || ""}
                {response.owner_profession
                  ? ` · ${response.owner_profession}`
                  : ""}
                {response.owner_current_location
                  ? ` · ${response.owner_current_location}`
                  : ""}
              </p>
            )}

            {remarks && (
              <p
                className={`mt-3 text-sm italic ${designClasses.textSecondary}`}
              >
                “{remarks}”
              </p>
            )}

            {response.owner_remarks && (
              <p
                className={`mt-2 text-xs ${designClasses.textSecondary}`}
              >
                Owner remarks:{" "}
                {response.owner_remarks}
              </p>
            )}

            {response.created_at && (
              <p
                className={`mt-3 text-xs ${designClasses.textSecondary}`}
              >
                {received
                  ? "Received"
                  : "Sent"}
                :{" "}
                {formatDate(
                  response.created_at
                )}
              </p>
            )}
          </div>

          {profileId && (
            <button
              type="button"
              onClick={() =>
                onViewProfile(
                  profileId
                )
              }
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
            >
              View Profile
            </button>
          )}
        </div>

        {received &&
          normalizedResponseStatus !==
            "MUTUAL" && (
          <div
            className={`flex flex-wrap gap-2 border-t pt-3 ${designClasses.border}`}
          >
            <button
              type="button"
              disabled={
                actionLoading ===
                  response.id ||
                normalizedResponseStatus ===
                  "SHORTLISTED"
              }
              onClick={() =>
                onUpdateStatus(
                  response,
                  "SHORTLISTED"
                )
              }
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {normalizedResponseStatus ===
              "SHORTLISTED"
                ? "Shortlisted"
                : "Shortlist"}
            </button>

            <button
              type="button"
              disabled={
                actionLoading ===
                  response.id ||
                normalizedResponseStatus ===
                  "HOLD"
              }
              onClick={() =>
                onUpdateStatus(
                  response,
                  "HOLD"
                )
              }
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {normalizedResponseStatus ===
              "HOLD"
                ? "On Hold"
                : "Hold"}
            </button>

            <button
              type="button"
              disabled={
                actionLoading ===
                  response.id ||
                normalizedResponseStatus ===
                  "NOT_INTERESTED"
              }
              onClick={() =>
                onUpdateStatus(
                  response,
                  "NOT_INTERESTED"
                )
              }
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {normalizedResponseStatus ===
              "NOT_INTERESTED"
                ? "Not Interested"
                : "Mark Not Interested"}
            </button>
          </div>
        )}

        {normalizedResponseStatus ===
          "MUTUAL" && (
          <div
            className={`flex flex-wrap items-center justify-between gap-3 border-t pt-3 ${designClasses.border}`}
          >
            <div>
              <p
                className={`text-sm font-semibold ${designClasses.textPrimary}`}
              >
                Mutual Interest
              </p>

              <p
                className={`mt-1 text-xs ${designClasses.textSecondary}`}
              >
                {contactAccessApproved
                  ? "Contact access has been approved. Open the profile to view the contact details."
                  : contactRequestPending
                  ? "Your contact request is awaiting Moderator review."
                  : clarificationRequired
                  ? "The Moderator has requested additional clarification before reviewing your contact request."
                  : "Both members have expressed positive interest. You may request contact details for Moderator review."}
              </p>

              {clarificationRequired &&
                contactModeratorRemarks && (
                  <div
                    className={`mt-2 rounded-lg p-3 text-xs ${designClasses.statusWarning}`}
                  >
                    <span className="font-semibold">
                      Moderator clarification:
                    </span>{" "}
                    {contactModeratorRemarks}
                  </div>
                )}
            </div>

            <button
              type="button"
              disabled={
                contactActionLoading ===
                  response.id ||
                contactRequestPending
              }
              onClick={() => {
                if (
                  contactAccessApproved
                ) {
                  onViewContactDetails(
                    contactTargetProfileId
                  );
                  return;
                }

                onRequestContact(
                  response,
                  direction,
                  {
                    clarificationRequired,
                    moderatorRemarks:
                      contactModeratorRemarks
                  }
                );
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {contactActionLoading ===
              response.id
                ? "Submitting..."
                : contactAccessApproved
                ? "View Contact Details"
                : contactRequestPending
                ? "Contact Request Pending"
                : clarificationRequired
                ? "Resubmit Contact Request"
                : "Request Contact Details"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

const EmptyState = ({ message }) => (
  <div
    className={`rounded-xl px-4 py-8 text-center text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
  >
    {message}
  </div>
);

const ConnectionsPage = () => {
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const selectedAdvertisementId =
    String(
      searchParams.get(
        "advertisementId"
      ) || ""
    ).trim();

  const profileId =
    sessionStorage.getItem("profileId");

  const [profileStatus, setProfileStatus] =
    useState(
      sessionStorage.getItem(
        "profileStatus"
      ) || ""
    );

  const [profileData, setProfileData] =
    useState(null);

  const [
    receivedInvitations,
    setReceivedInvitations,
  ] = useState([]);

  const [
    sentInvitations,
    setSentInvitations,
  ] = useState([]);

  const [
    receivedAdvertisementResponses,
    setReceivedAdvertisementResponses,
  ] = useState([]);

  const [
    sentAdvertisementResponses,
    setSentAdvertisementResponses,
  ] = useState([]);

    const visibleReceivedAdvertisementResponses =
    selectedAdvertisementId
      ? receivedAdvertisementResponses.filter(
          (response) =>
            String(
              response?.advertisement_id ||
              response?.advertisementId ||
              ""
            ) ===
            selectedAdvertisementId
        )
      : receivedAdvertisementResponses;

  const [
    responseActionLoadingId,
    setResponseActionLoadingId,
  ] = useState(null);

  const [
    contactActionLoadingId,
    setContactActionLoadingId,
  ] = useState(null);

  const [
    contactRequestMessage,
    setContactRequestMessage,
  ] = useState("");

  const [
    contactRequestStatusByProfile,
    setContactRequestStatusByProfile,
  ] = useState({});

  const [loading, setLoading] =
    useState(true);

  const [
    messagesLoading,
    setMessagesLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

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
    confirmLabel:
      "Submit",
    onConfirm: null,
  });

  const closePromptModal =
    () => {
      setPromptModal(
        (current) => ({
          ...current,
          open: false,
          onConfirm:
            null,
        })
      );
    };

  const openPromptModal =
    (options) => {
      setPromptModal({
        open: true,
        title:
          options.title ||
          "",
        description:
          options.description ||
          "",
        label:
          options.label ||
          "Remarks",
        initialValue:
          options.initialValue ||
          "",
        placeholder:
          options.placeholder ||
          "",
        required:
          Boolean(
            options.required
          ),
        confirmLabel:
          options.confirmLabel ||
          "Submit",
        onConfirm:
          options.onConfirm,
      });
    };

  useEffect(() => {
    let active = true;

    const loadMessageBox = async () => {
      setLoading(true);
      setError("");

      try {
        if (!profileId) {
          if (active) {
            setError(
              "Your member profile could not be identified."
            );
          }

          return;
        }

        const profileResponse =
          await registrationService.getProfile(
            profileId
          );

        if (!active) {
          return;
        }

        const currentProfile =
          profileResponse?.profile ||
          profileResponse ||
          {};

        const currentStatus =
          profileResponse?.profile_status ||
          profileResponse?.profileStatus ||
          currentProfile?.profile_status ||
          currentProfile?.profileStatus ||
          sessionStorage.getItem(
            "profileStatus"
          ) ||
          "";

        setProfileData(currentProfile);

        if (currentStatus) {
          setProfileStatus(
            currentStatus
          );

          sessionStorage.setItem(
            "profileStatus",
            currentStatus
          );
        }

        /*
         * Do not call the approval-protected
         * invitation APIs for an unapproved
         * profile.
         *
         * Backend approval rules remain
         * authoritative. This simply avoids
         * exposing the expected HTTP 403 as
         * a technical error to the member.
         */
        if (
          normalizeStatus(
            currentStatus
          ) !== "APPROVED"
        ) {
          return;
        }

        /*
         * Profile validation is complete.
         * Render Message Box now instead of
         * blocking the whole page while all
         * message APIs finish.
         */
        if (active) {
          setLoading(false);
          setMessagesLoading(true);
        }

        const invitationPromise =
          invitationService
            .getAllInvitations()
            .then(
              (invitationData) => {
                if (!active) {
                  return;
                }

                setReceivedInvitations(
                  Array.isArray(
                    invitationData
                      ?.received
                  )
                    ? invitationData.received
                    : []
                );

                setSentInvitations(
                  Array.isArray(
                    invitationData
                      ?.sent
                  )
                    ? invitationData.sent
                    : []
                );
              }
            );

        const advertisementPromise =
          advertisementResponseService
            .getAllResponses()
            .then(
              (
                advertisementResponseData
              ) => {
                if (!active) {
                  return;
                }

                setReceivedAdvertisementResponses(
                  Array.isArray(
                    advertisementResponseData
                      ?.received
                  )
                    ? advertisementResponseData
                        .received
                    : []
                );

                setSentAdvertisementResponses(
                  Array.isArray(
                    advertisementResponseData
                      ?.sent
                  )
                    ? advertisementResponseData
                        .sent
                    : []
                );
              }
            );

        const contactRequestPromise =
          profileService
            .getMyContactRequests()
            .then(
              (
                contactRequestData
              ) => {
                if (!active) {
                  return;
                }

                const contactStatusMap =
                  {};

                (
                  Array.isArray(
                    contactRequestData
                  )
                    ? contactRequestData
                    : []
                ).forEach(
                  (request) => {
                    const requesterProfileId =
                      String(
                        request
                          ?.requester_profile_id ||
                          ""
                      );

                    const targetProfileId =
                      String(
                        request
                          ?.target_profile_id ||
                          ""
                      );

                    const otherProfileId =
                      String(
                        request
                          ?.other_profile_id ||
                          (
                            requesterProfileId ===
                              String(
                                profileId
                              )
                              ? targetProfileId
                              : requesterProfileId
                          ) ||
                          ""
                      );

                    if (
                      !otherProfileId
                    ) {
                      return;
                    }

                    if (
                      contactStatusMap[
                        otherProfileId
                      ]
                    ) {
                      return;
                    }

                    contactStatusMap[
                      otherProfileId
                    ] = {
                      status:
                        normalizeStatus(
                          request
                            ?.status
                        ),

                      moderatorRemarks:
                        String(
                          request
                            ?.moderator_remarks ||
                            ""
                        ).trim(),

                      requestId:
                        request?.id ||
                        null
                    };
                  }
                );

                setContactRequestStatusByProfile(
                  contactStatusMap
                );
              }
            );

        const results =
          await Promise.allSettled([
            invitationPromise,
            advertisementPromise,
            contactRequestPromise
          ]);

        if (!active) {
          return;
        }

        const failedCount =
          results.filter(
            (result) =>
              result.status ===
              "rejected"
          ).length;

        if (
          failedCount ===
          results.length
        ) {
          setError(
            "We could not load your messages right now. Please try again."
          );
        } else if (
          failedCount > 0
        ) {
          console.warn(
            "Some Message Box data could not be loaded:",
            results
          );
        }

        setMessagesLoading(false);
      } catch (requestError) {
        console.error(
          "Unable to load Message Box:",
          requestError
        );

        if (!active) {
          return;
        }

        /*
         * A backend 403 means the profile is
         * still restricted. Do not expose the
         * raw API error.
         */
        if (
          requestError?.response
            ?.status === 403
        ) {
          return;
        }

        if (
          requestError?.response
            ?.status === 401
        ) {
          navigate("/login");
          return;
        }

        setError(
          "We could not load your messages right now. Please try again."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMessageBox();

    return () => {
      active = false;
    };
  }, [
    profileId,
    navigate,
  ]);

  const normalizedProfileStatus =
    normalizeStatus(profileStatus);

  const profileCompletion =
    calculateProfileCompletion(
      profileData || {}
    );

  const approved =
    normalizedProfileStatus ===
    "APPROVED";

  const handleAdvertisementResponseStatus =
    async (
      response,
      responseStatus
    ) => {
      const defaultRemarks =
        responseStatus ===
          "NOT_INTERESTED"
          ? "Not interested"
          : responseStatus ===
            "HOLD"
          ? "Kept on hold for further review"
          : "Profile shortlisted";

      openPromptModal({
        title:
          responseStatus ===
          "NOT_INTERESTED"
            ? "Mark Not Interested"
            : responseStatus ===
              "HOLD"
            ? "Place Profile On Hold"
            : "Shortlist Profile",

        description:
          "Add remarks for this response.",

        label:
          "Remarks",

        initialValue:
          defaultRemarks,

        required:
          true,

        confirmLabel:
          "Save",

        onConfirm:
          async (
            remarks
          ) => {
            closePromptModal();

            try {
        setResponseActionLoadingId(
          response.id
        );

        setError("");

        const result =
          await advertisementResponseService
            .updateResponseStatus({
              responseId:
                response.id,
              responseStatus,
              remarks
            });

        const storedStatus =
          result?.data
            ?.response_status ||
          responseStatus;

        setReceivedAdvertisementResponses(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                response.id
                  ? {
                      ...item,
                      response_status:
                        storedStatus,
                      owner_remarks:
                        remarks
                    }
                  : item
            )
        );

        /*
         * SHORTLIST may be converted by the
         * backend to MUTUAL. In that case
         * refresh both sides because all
         * INTEREST/APPLY rows for the same
         * relationship are updated together.
         */
        if (
          storedStatus === "MUTUAL"
        ) {
          const refreshed =
            await advertisementResponseService
              .getAllResponses();

          setReceivedAdvertisementResponses(
            refreshed.received || []
          );

          setSentAdvertisementResponses(
            refreshed.sent || []
          );
        }

      } catch (requestError) {
        console.error(
          "Unable to update advertisement response:",
          requestError
        );

        setError(
          requestError?.response
            ?.data?.message ||
            "Unable to update the response."
        );
            } finally {
              setResponseActionLoadingId(
                null
              );
            }
          }
      });
    };

  const handleRequestContact =
    async (
      response,
      direction,
      contactRequestInfo = {}
    ) => {
      const received =
        direction === "received";

      const targetProfileId =
        received
          ? response.responder_profile_id
          : response.owner_profile_id;

      const targetProfileName =
        received
          ? response.responder_name
          : response.owner_name;

      if (!targetProfileId) {
        setError(
          "Member profile could not be identified."
        );
        return;
      }

      const clarificationRequired =
        Boolean(
          contactRequestInfo
            ?.clarificationRequired
        );

      const isClarificationResubmission =
        Boolean(
          contactRequestInfo
            ?.submittedClarification
        );

      let requesterMessage =
        "Mutual interest established through a matrimonial advertisement.";

      if (
        clarificationRequired
      ) {
        openPromptModal({
          title:
            "Respond to Moderator",

          description:
            contactRequestInfo
              ?.moderatorRemarks
              ? `Moderator clarification: ${contactRequestInfo.moderatorRemarks}`
              : "Please provide the additional clarification requested by the Moderator.",

          label:
            "Your Clarification",

          placeholder:
            "Enter your response to the Moderator...",

          required:
            true,

          confirmLabel:
            "Resubmit Request",

          onConfirm:
            async (
              clarification
            ) => {
              closePromptModal();

              await handleRequestContact(
                response,
                direction,
                {
                  ...contactRequestInfo,
                  clarificationRequired:
                    false,
                  submittedClarification:
                    clarification
                }
              );
            }
        });

        return;
      }

      if (
        contactRequestInfo
          ?.submittedClarification
      ) {
        requesterMessage =
          contactRequestInfo
            .submittedClarification;
      }

      try {
        setContactActionLoadingId(
          response.id
        );

        setContactRequestMessage("");
        setError("");

        const result =
          await profileService
            .shareContactDetails({
              sharedProfileId:
                targetProfileId,

              sharedProfileName:
                targetProfileName ||
                targetProfileId,

              requesterMessage,

              requestSource:
                "ADVERTISEMENT_MUTUAL"
            });

        const status =
          String(
            result?.status || ""
          ).toUpperCase();

        if (status === "PENDING") {
          setContactRequestStatusByProfile(
            (current) => ({
              ...current,

              [String(
                targetProfileId
              )]: {
                status:
                  "PENDING",

                moderatorRemarks:
                  "",

                requestId:
                  result?.requestId ||
                  null
              }
            })
          );

          setContactRequestMessage(
            isClarificationResubmission
              ? "Your clarification has been submitted to the Moderator for review."
              : "Contact request sent to the Moderator for review."
          );

          return;
        }

        /*
         * Existing approved access may return
         * the contact object immediately.
         */
        setContactRequestStatusByProfile(
          (current) => ({
            ...current,

            [String(
              targetProfileId
            )]: {
              status:
                "APPROVED",

              moderatorRemarks:
                "",

              requestId:
                result?.requestId ||
                null
            }
          })
        );

        setContactRequestMessage(
          "Contact access is already approved. Open the profile to view the contact details."
        );

      } catch (requestError) {
        console.error(
          "Unable to request contact details:",
          requestError
        );

        const code =
          requestError?.response
            ?.data?.code;

        if (
          code ===
          "CONTACT_VIEW_LIMIT_REACHED"
        ) {
          setError(
            requestError.response.data
              .message ||
              "Contact-view limit reached. Please recharge."
          );
          return;
        }

        if (
          code ===
          "MUTUAL_INTEREST_REQUIRED"
        ) {
          setError(
            "Contact details can be requested only after mutual interest."
          );
          return;
        }

        setError(
          requestError?.response
            ?.data?.message ||
            "Unable to submit the contact request."
        );
      } finally {
        setContactActionLoadingId(
          null
        );
      }
    };



  const handleViewProfile = (
    memberProfileId
  ) => {
    navigate(
      `/view-profile/${memberProfileId}`
    );
  };

  const handleViewContactDetails = (
    memberProfileId
  ) => {
    navigate(
      `/view-profile/${memberProfileId}?section=contact&returnTo=/inbox`
    );
  };

  if (loading) {
    return (
      <MemberLayout
        loadInvitationNotifications={
          false
        }
      >
        <div
          className={`${designClasses.card} p-6`}
        >
          <p
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Loading Message Box…
          </p>
        </div>
      </MemberLayout>
    );
  }

  if (!approved) {
    return (
      <MemberLayout>
        <RestrictedFeatureState
          featureName="Message Box"
          profileStatus={
            profileStatus
          }
          completion={
            profileCompletion
          }
          message="Message Box will be available after your profile is approved."
        />
      </MemberLayout>
    );
  }

  return (
    <MemberLayout
      loadInvitationNotifications={
        false
      }
    >
      <div className="space-y-4">
        <div
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1
                className={`text-xl font-semibold ${designClasses.textPrimary}`}
              >
                Message Box
              </h1>

              <p
                className={`mt-1 text-sm ${designClasses.textSecondary}`}
              >
                {selectedAdvertisementId
                  ? `Showing responses received for Advertisement #${selectedAdvertisementId}.`
                  : "Review applications and interests received from members, and responses you have sent."}
              </p>

              {selectedAdvertisementId && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchParams({})
                  }
                  className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${designClasses.secondaryButton}`}
                >
                  Show All Messages
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div
            className={`rounded-xl p-4 text-sm ${designClasses.statusError}`}
            role="alert"
          >
            {error}
          </div>
        )}
        {messagesLoading && (
          <div
            className={`rounded-xl p-3 text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
            role="status"
          >
            Loading latest messages…
          </div>
        )}
        {contactRequestMessage && (
          <div
            className={`rounded-xl p-4 text-sm ${designClasses.statusSuccess}`}
            role="status"
          >
            {contactRequestMessage}
          </div>
        )}

        {!error && (
          <div
            className={`grid grid-cols-1 gap-4 ${
              selectedAdvertisementId
                ? ""
                : "lg:grid-cols-2"
            }`}
          >
            <section
              className={`${designClasses.card} p-5`}
            >
              <div className="mb-4">
                <h2
                  className={`text-lg font-semibold ${designClasses.textDark}`}
                >
                  Received Responses
                </h2>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Applications and interests
                  received from other members.
                </p>
              </div>

              <div className="space-y-3">
                {messagesLoading &&
                visibleReceivedAdvertisementResponses.length ===
                  0 &&
                receivedInvitations.length ===
                  0 ? (
                  <div
                    className={`rounded-xl px-4 py-6 text-center text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
                  >
                    Loading received responses…
                  </div>
                ) : (
                (
                  selectedAdvertisementId
                    ? true
                    : receivedInvitations.length ===
                      0
                ) &&
                visibleReceivedAdvertisementResponses.length ===
                  0 ? (
                  <EmptyState message="You have no received interests or applications at the moment." />
                ) : (
                  <>
                    {visibleReceivedAdvertisementResponses.map(
                      (response) => (
                        <AdvertisementResponseCard
                          key={`advertisement-response-${response.id}`}
                          response={
                            response
                          }
                          direction="received"
                          onViewProfile={
                            handleViewProfile
                          }
                          onViewContactDetails={
                            handleViewContactDetails
                          }
                          onUpdateStatus={
                            handleAdvertisementResponseStatus
                          }
                          onRequestContact={
                            handleRequestContact
                          }
                          actionLoading={
                            responseActionLoadingId
                          }
                          contactActionLoading={
                            contactActionLoadingId
                          }
                          contactRequestStatusByProfile={
                            contactRequestStatusByProfile
                          }
                        />
                      )
                    )}

                    {!selectedAdvertisementId &&
                      receivedInvitations.map(
                      (invitation) => (
                        <InvitationCard
                          key={`invitation-${invitation.invitation_id}`}
                          invitation={
                            invitation
                          }
                          direction="received"
                          onViewProfile={
                            handleViewProfile
                          }
                        />
                      )
                    )}
                  </>
                )
                )}
              
              </div>
            </section>
            {!selectedAdvertisementId && (
            <section
              className={`${designClasses.card} p-5`}
            >
              <div className="mb-4">
                <h2
                  className={`text-lg font-semibold ${designClasses.textDark}`}
                >
                  Sent Responses
                </h2>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Applications and interests
                  you have sent to other
                  members.
                </p>
              </div>

              <div className="space-y-3">
                {messagesLoading &&
                sentAdvertisementResponses.length ===
                  0 &&
                sentInvitations.length ===
                  0 ? (
                  <div
                    className={`rounded-xl px-4 py-6 text-center text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
                  >
                    Loading sent responses…
                  </div>
                ) : sentInvitations.length ===
                  0 &&
                sentAdvertisementResponses.length ===
                  0 ? (
                  <EmptyState message="You have not sent any interests or applications yet." />
                ) : (
                  <>
                    {sentAdvertisementResponses.map(
                      (response) => (
                        <AdvertisementResponseCard
                          key={`advertisement-sent-${response.id}`}
                          response={
                            response
                          }
                          direction="sent"
                          onViewProfile={
                            handleViewProfile
                          }
                          onViewContactDetails={
                            handleViewContactDetails
                          }
                          onUpdateStatus={() => {}}
                          onRequestContact={
                            handleRequestContact
                          }
                          actionLoading={
                            null
                          }
                          contactActionLoading={
                            contactActionLoadingId
                          }
                          contactRequestStatusByProfile={
                            contactRequestStatusByProfile
                          }
                        />
                      )
                    )}

                    {sentInvitations.map(
                      (invitation) => (
                        <InvitationCard
                          key={`invitation-sent-${invitation.invitation_id}`}
                          invitation={
                            invitation
                          }
                          direction="sent"
                          onViewProfile={
                            handleViewProfile
                          }
                        />
                      )
                    )}
                  </>
                )}
              </div>
              
                        </section>
            )}
          </div>
        )}
      </div>

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

    </MemberLayout>
  );
};

export default ConnectionsPage;