import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import kalyanaLogo from "../../assets/branding/kalyana-sakha-logo.png";
import sarvamoolaLogo from "../../assets/branding/sarvamoola-foundation-logo.png";

import { designClasses } from "../styles/designTokens";

import AdvertisementSpotlight from "../components/AdvertisementSpotlight";
import ConfirmModal from "../components/ConfirmModal";

import invitationService from "../../services/invitationService";

const memberLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/all-matches", label: "Matches", requiresApproval: true },
  { to: "/basic-search", label: "Search", requiresApproval: true },
  { to: "/inbox", label: "Message Box" },
  { to: "/partner-preferences", label: "Partner Expectations" },
];

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const MemberLayout = ({
  children,
  onMatchesClick,
  loadInvitationNotifications = true,
}) => {
  const navigate = useNavigate();

  const [
    pendingInvitationCount,
    setPendingInvitationCount,
  ] = useState(0);

  const [
    logoutConfirmOpen,
    setLogoutConfirmOpen,
  ] = useState(false);

  const [
    navigationMessage,
    setNavigationMessage,
  ] = useState("");

  const profileStatus = normalizeStatus(
    sessionStorage.getItem("profileStatus")
  );

  const approved = profileStatus === "APPROVED";

  const memberName =
    sessionStorage.getItem("name") ||
    sessionStorage.getItem("userName") ||
    "Member";

  const blockedMessage =
    "Your profile is under review. This feature will be available once your profile is approved.";

  useEffect(() => {
    let active = true;

    if (
      !loadInvitationNotifications
    ) {
      setPendingInvitationCount(0);

      return () => {
        active = false;
      };
    }

    const loadPendingInvitations =
      async () => {
        try {
          const received =
            await invitationService
              .getReceivedInvitations();

          if (!active) {
            return;
          }

          const pendingCount =
            Array.isArray(received)
              ? received.filter(
                  (invitation) =>
                    normalizeStatus(
                      invitation?.status
                    ) === "PENDING"
                ).length
              : 0;

          setPendingInvitationCount(
            pendingCount
          );
        } catch (error) {
          console.error(
            "Unable to load invitation notifications:",
            error
          );

          if (active) {
            setPendingInvitationCount(
              0
            );
          }
        }
      };

    loadPendingInvitations();

    return () => {
      active = false;
    };
  }, [
    loadInvitationNotifications,
  ]);

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);

    sessionStorage.clear();
    navigate("/login");
  };

  const handleNavigation = (event, item) => {
    if (
      item.requiresApproval &&
      !approved
    ) {
      event.preventDefault();

      setNavigationMessage(
        blockedMessage
      );

      return;
    }

    if (
  item.to === "/all-matches" &&
  typeof onMatchesClick === "function"
) {
      event.preventDefault();
      onMatchesClick();
    }
  };

  return (
    <div className={`flex min-h-screen flex-col ${designClasses.page}`}>
      <header
  className={`${designClasses.surface} ${designClasses.border} border-b`}
>
  <div className="mx-auto flex w-full max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
    {/* Brand */}
    <div className="flex shrink-0 items-center gap-4">
      <img
        src={kalyanaLogo}
        alt="Kalyana Sakha"
        className="h-14 w-auto object-contain"
      />

      <div className="hidden items-center gap-3 xl:flex">
        <span
  className={`whitespace-nowrap text-[10px] font-semibold italic uppercase tracking-[0.16em] ${designClasses.textSecondary}`}
>
  An initiative of
</span>

        <img
          src={sarvamoolaLogo}
          alt="Sarvamoola Foundation"
          className="h-14 w-auto object-contain"
        />
      </div>
    </div>

    {/* Member Navigation */}
    <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
      {memberLinks.map((item) => {
        const locked =
          item.requiresApproval && !approved;

        return (
          <Link
            key={item.to}
            to={locked ? "#" : item.to}
            onClick={(event) =>
              handleNavigation(event, item)
            }
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
              locked
                ? "cursor-not-allowed opacity-50"
                : `${designClasses.textPrimary} ${designClasses.bgAccentSoft}`
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>

    {/* User */}
    <div className="ml-auto flex shrink-0 items-center gap-3">
      <span
        className={`hidden text-sm xl:inline ${designClasses.textSecondary}`}
      >
        Welcome, {memberName}
      </span>

      <button
        type="button"
        onClick={() =>
          navigate("/inbox")
        }
        aria-label={
          pendingInvitationCount > 0
            ? `${pendingInvitationCount} new invitation${
                pendingInvitationCount === 1
                  ? ""
                  : "s"
              }`
            : "No new invitations"
        }
        title={
          pendingInvitationCount > 0
            ? `${pendingInvitationCount} new invitation${
                pendingInvitationCount === 1
                  ? ""
                  : "s"
              }`
            : "Message Box"
        }
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${designClasses.border} ${designClasses.surface} ${designClasses.textPrimary} hover:bg-[#FFF4D6]`}
      >
        <span aria-hidden="true">
          🔔
        </span>

        {pendingInvitationCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#B42318] px-1 text-[10px] font-bold leading-none text-white"
          >
            {pendingInvitationCount >
            99
              ? "99+"
              : pendingInvitationCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
      >
        Logout
      </button>
    </div>
  </div>
</header>

      <AdvertisementSpotlight />

      {navigationMessage && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-start justify-between gap-4 rounded-xl p-4 text-sm ${designClasses.statusWarning}`}
            role="alert"
          >
            <span>
              {navigationMessage}
            </span>

            <button
              type="button"
              onClick={() =>
                setNavigationMessage("")
              }
              className="shrink-0 font-semibold"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <ConfirmModal
        open={
          logoutConfirmOpen
        }
        title="Logout"
        description="Are you sure you want to logout from Kalyana Sakha?"
        confirmLabel="Logout"
        cancelLabel="Stay Logged In"
        onCancel={() =>
          setLogoutConfirmOpen(false)
        }
        onConfirm={
          confirmLogout
        }
      />
    </div>
  );
};

export default MemberLayout;