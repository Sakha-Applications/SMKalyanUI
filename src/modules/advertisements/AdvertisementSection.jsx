import {
  useEffect,
  useState,
} from "react";

import {
  Briefcase,
  Calendar,
  MapPin,
  Share2,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import advertisementService from "../../services/advertisementService";
import {
  designClasses,
} from "../../shared/styles/designTokens";

const AdvertisementSection = ({
  limit = 12,
}) => {
  const navigate = useNavigate();

  const [advertisements, setAdvertisements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    const loadAdvertisements =
      async () => {
        setLoading(true);
        setError("");

        try {
          const data =
            await advertisementService.getAdvertisementsForDisplay(
              {
                limit,
                format: "cards",
              }
            );

          if (!active) {
            return;
          }

          setAdvertisements(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (err) {
          console.error(
            "Unable to load advertisements:",
            err
          );

          if (active) {
            setError(
              "Unable to load matrimonial advertisements."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadAdvertisements();

    return () => {
      active = false;
    };
  }, [limit]);

  const handleViewProfile = (
    advertisement
  ) => {
    const profileId =
      advertisement?.profile_id ||
      advertisement?.profileId;

    if (!profileId) {
      setMessage(
        "Profile information is unavailable."
      );

      return;
    }

    navigate(
      `/view-profile/${profileId}`
    );
  };

  const handleFutureAction = (
    action
  ) => {
    setMessage(
      `${action} will be available when advertisement response tracking is enabled.`
    );
  };

  if (loading) {
    return (
      <section
        className={`${designClasses.card} p-5 sm:p-6`}
      >
        <p
          className={`text-sm ${designClasses.textSecondary}`}
        >
          Loading matrimonial
          advertisements...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`${designClasses.card} p-5 sm:p-6`}
      >
        <p className="text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (
    advertisements.length === 0
  ) {
    return null;
  }

  return (
    <section
      className={`${designClasses.card} p-5 sm:p-6`}
    >
      <div className="mb-5">
        <h2
          className={`text-xl font-semibold ${designClasses.textPrimary}`}
        >
          Featured Matrimonial Advertisements
        </h2>

        <p
          className={`mt-1 text-sm ${designClasses.textSecondary}`}
        >
          Member advertisements reviewed
          for matrimonial visibility.
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-xl border p-3 text-sm ${designClasses.border} ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {advertisements.map(
          (advertisement, index) => {
            const profileId =
              advertisement?.profile_id ||
              advertisement?.profileId;

            const name =
              advertisement?.name ||
              advertisement?.member_name ||
              "Member";

            const age =
              advertisement?.current_age ||
              advertisement?.currentAge;

            const gotra =
              advertisement?.gotra;

            const profession =
              advertisement?.profession;

            const company =
              advertisement?.current_company ||
              advertisement?.currentCompany;

            const city =
              advertisement?.city ||
              advertisement?.residing_city ||
              advertisement?.residingCity;

            const text =
  advertisement?.display_summary ||
  advertisement?.transaction_details ||
  "Matrimonial advertisement.";

const advertisementHeading =
  advertisement?.advertisement_heading ||
  advertisement?.advertisementHeading ||
  advertisement?.heading ||
  "";

            return (
              <article
                key={
                  advertisement?.id ||
                  profileId ||
                  index
                }
                className={`rounded-2xl border p-5 ${designClasses.border} ${designClasses.surface}`}
              >
                <div className="flex items-start gap-3">
  <div
    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${designClasses.surfaceMuted}`}
  >
    <User className="h-5 w-5" />
  </div>

  <div className="min-w-0 flex-1">
    {advertisementHeading && (
      <div
        className={`text-base font-bold ${
          advertisementHeading ===
          "Looking for a Bride"
            ? "text-pink-600"
            : advertisementHeading ===
                "Looking for a Bridegroom"
              ? "text-blue-700"
              : designClasses.textPrimary
        }`}
      >
        {advertisementHeading}
      </div>
    )}

    <h3
      className={`mt-1 text-base font-semibold ${designClasses.textPrimary}`}
    >
      {name}
    </h3>

    <p
      className={`text-xs ${designClasses.textSecondary}`}
    >
      Profile ID:{" "}
      {profileId || "-"}
    </p>
  </div>
</div>

<p
  className={`mt-4 text-sm leading-relaxed ${designClasses.textDark}`}
>
  {text}
</p>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {age && (
                    <div
                      className={`flex items-center gap-2 text-sm ${designClasses.textSecondary}`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>
                        {age} years
                      </span>
                    </div>
                  )}

                  {gotra && (
                    <div
                      className={`text-sm ${designClasses.textSecondary}`}
                    >
                      Gotra:{" "}
                      <span
                        className={designClasses.textDark}
                      >
                        {gotra}
                      </span>
                    </div>
                  )}

                  {profession && (
                    <div
                      className={`flex items-center gap-2 text-sm ${designClasses.textSecondary}`}
                    >
                      <Briefcase className="h-4 w-4" />

                      <span>
                        {profession}
                        {company
                          ? ` at ${company}`
                          : ""}
                      </span>
                    </div>
                  )}

                  {city && (
                    <div
                      className={`flex items-center gap-2 text-sm ${designClasses.textSecondary}`}
                    >
                      <MapPin className="h-4 w-4" />
                      <span>
                        {city}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleViewProfile(
                        advertisement
                      )
                    }
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.primaryButton}`}
                  >
                    View Profile
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFutureAction(
                        "Apply"
                      )
                    }
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
                  >
                    Apply
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFutureAction(
                        "Show Interest"
                      )
                    }
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
                  >
                    Show Interest
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFutureAction(
                        "Forward"
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
                  >
                    <Share2 className="h-4 w-4" />
                    Forward
                  </button>
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
};

export default AdvertisementSection;