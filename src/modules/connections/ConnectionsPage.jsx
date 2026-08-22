import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import invitationService from "../../services/invitationService";
import registrationService from "../../services/registrationService";

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
    normalizedStatus === "PENDING"
      ? "Pending"
      : normalizedStatus === "ACCEPTED"
        ? "Accepted"
        : normalizedStatus === "REJECTED"
          ? "Not Proceeding"
          : normalizedStatus === "DECLINED"
            ? "Not Proceeding"
            : normalizedStatus
              ? normalizedStatus
                  .toLowerCase()
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

        const {
          received = [],
          sent = [],
        } =
          await invitationService.getAllInvitations();

        if (!active) {
          return;
        }

        setReceivedInvitations(
          Array.isArray(received)
            ? received
            : []
        );

        setSentInvitations(
          Array.isArray(sent)
            ? sent
            : []
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

  const handleViewProfile = (
    memberProfileId
  ) => {
    navigate(
      `/view-profile/${memberProfileId}`
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
                Review interests received
                from members and interests
                you have sent.
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

        {!error && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section
              className={`${designClasses.card} p-5`}
            >
              <div className="mb-4">
                <h2
                  className={`text-lg font-semibold ${designClasses.textDark}`}
                >
                  Received Interests
                </h2>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Interests received from
                  other members.
                </p>
              </div>

              <div className="space-y-3">
                {receivedInvitations.length ===
                0 ? (
                  <EmptyState message="You have no received interests at the moment." />
                ) : (
                  receivedInvitations.map(
                    (invitation) => (
                      <InvitationCard
                        key={
                          invitation.invitation_id
                        }
                        invitation={
                          invitation
                        }
                        direction="received"
                        onViewProfile={
                          handleViewProfile
                        }
                      />
                    )
                  )
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
                  Sent Interests
                </h2>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Interests you have sent
                  to other members.
                </p>
              </div>

              <div className="space-y-3">
                {sentInvitations.length ===
                0 ? (
                  <EmptyState message="You have not sent any interests yet." />
                ) : (
                  sentInvitations.map(
                    (invitation) => (
                      <InvitationCard
                        key={
                          invitation.invitation_id
                        }
                        invitation={
                          invitation
                        }
                        direction="sent"
                        onViewProfile={
                          handleViewProfile
                        }
                      />
                    )
                  )
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