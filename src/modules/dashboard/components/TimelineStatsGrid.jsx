import React, { useEffect, useMemo, useState } from "react";

import invitationService from "../../../services/invitationService";
import { designClasses } from "../../../shared/styles/designTokens";

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const TimelineStatsGrid = () => {
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
        label: "Accepted Connections",
        value: acceptedConnections,
      },
    ];
  }, [receivedInvitations, sentInvitations]);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className={`${designClasses.surface} ${designClasses.border} rounded-xl border p-4 text-center shadow-sm`}
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
        </div>
      ))}
    </div>
  );
};

export default TimelineStatsGrid;