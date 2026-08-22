import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import invitationService from "../../../services/invitationService";
import { designClasses } from "../../../shared/styles/designTokens";

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const TimelineStatsGrid = () => {
  const navigate = useNavigate();
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvitationStats = async () => {
      try {
        setLoading(true);

        const { received, sent } =
          await invitationService.getAllInvitations();

        setReceivedInvitations(received);
        setSentInvitations(sent);
      } catch (error) {
        console.error(
          "[TimelineStatsGrid] Failed to load invitation statistics:",
          error
        );

        setReceivedInvitations([]);
        setSentInvitations([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvitationStats();
  }, []);

  const stats = useMemo(() => {
    const newInvitations = receivedInvitations.filter(
      (invitation) =>
        normalizeStatus(invitation.status) === "PENDING"
    ).length;

    const awaitingResponse = sentInvitations.filter((invitation) => {
      const status = normalizeStatus(invitation.status);

      return status === "PENDING" || status === "VIEWED";
    }).length;

    const acceptedConnections =
      receivedInvitations.filter(
        (invitation) =>
          normalizeStatus(invitation.status) === "ACCEPTED"
      ).length +
      sentInvitations.filter(
        (invitation) =>
          normalizeStatus(invitation.status) === "ACCEPTED"
      ).length;

    return [
      {
        label: "New Invitations",
        value: newInvitations,
      },
      {
        label: "Awaiting Response",
        value: awaitingResponse,
      },
      {
        label: "Accepted Interests",
        value: acceptedConnections,
      },
    ];
  }, [receivedInvitations, sentInvitations]);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value }) => (
        <button
          key={label}
          type="button"
          onClick={() =>
            navigate("/inbox")
          }
          className={`${designClasses.card} w-full p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md`}
        >
          <div
            className={`text-3xl font-semibold ${designClasses.textPrimary}`}
          >
            {loading ? "—" : value}
          </div>

          <div
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            {label}
          </div>
        </button>
      ))}
    </div>
  );
};

export default TimelineStatsGrid;