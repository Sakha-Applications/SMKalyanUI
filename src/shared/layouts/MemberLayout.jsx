import { Link, useNavigate } from "react-router-dom";

import kalyanaLogo from "../../assets/branding/kalyana-sakha-logo.png";
import sarvamoolaLogo from "../../assets/branding/sarvamoola-foundation-logo.png";

import { designClasses } from "../styles/designTokens";

import AdvertisementSpotlight from "../components/AdvertisementSpotlight";

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
}) => {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    sessionStorage.clear();
    navigate("/login");
  };

  const handleNavigation = (event, item) => {
    if (item.requiresApproval && !approved) {
      event.preventDefault();
      window.alert(blockedMessage);
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
                : `${designClasses.textPrimary} hover:bg-[#FFF4D6]`
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
        onClick={handleLogout}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
      >
        Logout
      </button>
    </div>
  </div>
</header>

      <AdvertisementSpotlight />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default MemberLayout;