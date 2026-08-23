import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import invitationService from "../../services/invitationService";
import advertisementResponseService from "../../services/advertisementResponseService";
import registrationService from "../../services/registrationService";
import profileService from "../../services/profileService";

import MemberLayout from "../../shared/layouts/MemberLayout";
import RestrictedFeatureState from "../../shared/components/RestrictedFeatureState";

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

  const contactRequestStatus =
    normalizeStatus(
      contactRequestStatusByProfile[
        String(
          contactTargetProfileId || ""
        )
      ] || ""
    );

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
                  : "Both members have expressed positive interest. You may request contact details for Moderator review."}
              </p>
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
                  direction
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

  const [error, setError] =
    useState("");

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

        const [
          invitationData,
          advertisementResponseData,
          contactRequestData
        ] =
          await Promise.all([
            invitationService
              .getAllInvitations(),

            advertisementResponseService
              .getAllResponses(),

            profileService
              .getMyContactRequests()
          ]);

        if (!active) {
          return;
        }

        setReceivedInvitations(
          Array.isArray(
            invitationData?.received
          )
            ? invitationData.received
            : []
        );

        setSentInvitations(
          Array.isArray(
            invitationData?.sent
          )
            ? invitationData.sent
            : []
        );

        setReceivedAdvertisementResponses(
          Array.isArray(
            advertisementResponseData?.received
          )
            ? advertisementResponseData.received
            : []
        );

        setSentAdvertisementResponses(
          Array.isArray(
            advertisementResponseData?.sent
          )
            ? advertisementResponseData.sent
            : []
        );

          const contactStatusMap =
          {};

        (
          Array.isArray(
            contactRequestData
          )
            ? contactRequestData
            : []
        ).forEach((request) => {
          const targetProfileId =
            String(
              request?.target_profile_id ||
              ""
            );

          if (!targetProfileId) {
            return;
          }

          contactStatusMap[
            targetProfileId
          ] =
            normalizeStatus(
              request?.status
            );
        });

        setContactRequestStatusByProfile(
          contactStatusMap
        );
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

      const remarks =
        window.prompt(
          "Remarks:",
          defaultRemarks
        );

      if (remarks === null) {
        return;
      }

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
    };

  const handleRequestContact =
    async (
      response,
      direction
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

              requesterMessage:
                "Mutual interest established through a matrimonial advertisement.",

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
              )]:
                "PENDING"
            })
          );

          setContactRequestMessage(
            "Contact request sent to the Moderator for review."
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
            )]:
              "APPROVED"
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
      <MemberLayout>
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
    <MemberLayout>
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
                Review applications and
                interests received from
                members, and responses you
                have sent.
              </p>
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

        {contactRequestMessage && (
          <div
            className={`rounded-xl p-4 text-sm ${designClasses.statusSuccess}`}
            role="status"
          >
            {contactRequestMessage}
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                {receivedInvitations.length ===
                  0 &&
                receivedAdvertisementResponses.length ===
                  0 ? (
                  <EmptyState message="You have no received interests or applications at the moment." />
                ) : (
                  <>
                    {receivedAdvertisementResponses.map(
                      (response) => (
                        <AdvertisementResponseCard
                          key={`advertisement-response-${response.id}`}
                          response={
                            response
                          }
                          direction="received"
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

                    {receivedInvitations.map(
                      (invitation) => (
                        <InvitationCard
                          key={`invitation-${invitation.invitation_id}`}
                          invitation={
                            invitation
                          }
                          direction="received"
                          onViewContactDetails={
                            handleViewContactDetails
                          }
                        />
                      )
                    )}
                  </>
                )}
              </div>
            </section>

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
                {sentInvitations.length ===
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
                          onViewContactDetails={
                            handleViewContactDetails
                          }
                        />
                      )
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default ConnectionsPage;