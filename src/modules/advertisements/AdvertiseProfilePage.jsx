import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MemberLayout from "../../shared/layouts/MemberLayout";
import {
  designClasses,
} from "../../shared/styles/designTokens";

import AdvertisementPreview from "../../shared/components/AdvertisementPreview";

import profileService from "../../services/profileService";

const firstValue = (...values) =>
  values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  ) ?? "";

const asDisplayList = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (
          typeof item === "object" &&
          item !== null
        ) {
          return (
            item.label ||
            item.value ||
            item.name ||
            item.city ||
            ""
          );
        }

        return String(item);
      })
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (
    typeof value === "string"
  ) {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    if (
      trimmed.startsWith("[") &&
      trimmed.endsWith("]")
    ) {
      try {
        return asDisplayList(
          JSON.parse(trimmed)
        );
      } catch {
        // Continue with comma-separated handling.
      }
    }

    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [String(value)];
};

const displayValue = (value) => {
  const values = asDisplayList(value);

  return values.length > 0
    ? values.join(", ")
    : "-";
};

const displayGotra = (value) => {
  if (
    typeof value === "object" &&
    value !== null
  ) {
    return (
      value.label ||
      value.value ||
      "-"
    );
  }

  return value || "-";
};

const cleanExpectationsText = (
  value
) => {
  const rawText = String(
    firstValue(value)
  ).trim();

  if (!rawText) {
    return "";
  }

  let cleaned = rawText;

  /*
   * Older saved profiles may contain
   * UI guidance that was accidentally
   * persisted with Partner Expectations.
   *
   * The guidance must never appear in
   * member advertisements.
   */
  cleaned = cleaned.replace(
    /Tip:\s*You can personalize[\s\S]*?(?=Seeking a life partner\b|Looking for a life partner\b|$)/i,
    ""
  );

  /*
   * buildAdvertisementText adds the
   * "Seeking a life partner" introduction,
   * therefore remove it when it already
   * exists in the saved expectations.
   */
  cleaned = cleaned.replace(
    /^Seeking a life partner\s*/i,
    ""
  );

  cleaned = cleaned.replace(
    /^Looking for a life partner\s*/i,
    ""
  );

  return cleaned
    .replace(/\s+/g, " ")
    .trim();
};

const determineLookingFor = (
  profile
) => {
  const profileFor = String(
    firstValue(
      profile?.profile_for,
      profile?.profileFor,
      profile?.preferredBrideGroomCategory
    )
  ).toLowerCase();

  if (
    profileFor.includes("bride")
  ) {
    return "bride";
  }

  if (
    profileFor.includes("groom")
  ) {
    return "groom";
  }

  const gender = String(
    firstValue(
      profile?.gender,
      profile?.sex
    )
  ).toLowerCase();

  if (
    gender === "male" ||
    gender === "m"
  ) {
    return "bride";
  }

  if (
    gender === "female" ||
    gender === "f"
  ) {
    return "groom";
  }

  return "suitable life partner";
};

const buildAdvertisementText = (
  profile
) => {
  if (!profile) {
    return "";
  }

  const lookingFor =
    determineLookingFor(profile);

  const normalizedLookingFor =
    String(lookingFor)
      .trim()
      .toLowerCase();

  const candidateLabel =
    normalizedLookingFor === "bride"
      ? "Bridegroom"
      : normalizedLookingFor === "groom" ||
          normalizedLookingFor === "bridegroom"
        ? "Bride"
        : "Member";

  const subjectPronoun =
    candidateLabel === "Bridegroom"
      ? "He"
      : candidateLabel === "Bride"
        ? "She"
        : "They";

  const ageRaw = firstValue(
    profile.current_age,
    profile.currentAge
  );

  const age =
    String(ageRaw)
      .match(/\d+/)?.[0] || "";

  const gotra =
    displayGotra(
      profile.gotra
    );

  const nakshatra =
    displayGotra(
      profile.nakshatra
    );

  const heightRaw =
    firstValue(
      profile.height
    );

  const formatHeight = (value) => {
    if (!value) {
      return "";
    }

    const match = String(
      value
    ).match(
      /(\d+)['′]\s*(\d+)?["″]?/
    );

    if (!match) {
      return String(value);
    }

    const feet = match[1];
    const inches =
      match[2] || "0";

    return `${feet} ft ${inches} in`;
  };

  const height =
    formatHeight(heightRaw);

  const education =
    firstValue(
      typeof profile.education ===
        "object"
        ? profile.education?.label ||
            profile.education?.value
        : profile.education
    );

  const profession =
    firstValue(
      typeof profile.profession ===
        "object"
        ? profile.profession?.label ||
            profile.profession?.value
        : profile.profession
    );

  const designation =
    firstValue(
      typeof profile.designation ===
        "object"
        ? profile.designation?.label ||
            profile.designation?.value
        : profile.designation
    );

  const company =
    firstValue(
      profile.current_company,
      profile.currentCompany
    );

  const workingLocation =
    firstValue(
      profile.current_location,
      profile.currentLocation
    );

  const annualIncome =
    firstValue(
      profile.annual_income,
      profile.annualIncome
    );

  const nativePlace =
    firstValue(
      profile.native_place,
      profile.nativePlace
    );

  const hobbies =
    asDisplayList(
      profile.hobbies
    );

  const mainParts = [];

  if (age) {
    const ageText =
      String(age)
        .toLowerCase()
        .includes("year")
        ? `${age} old`
        : `${age} years old`;

    mainParts.push(
      ageText
    );
  }

  if (
    height &&
    height !== "-"
  ) {
    mainParts.push(
      `${height} tall`
    );
  }

  if (
    gotra &&
    gotra !== "-"
  ) {
    mainParts.push(
      `from ${gotra} Gotra`
    );
  }

  if (
    nakshatra &&
    nakshatra !== "-"
  ) {
    mainParts.push(
      `${nakshatra} Nakshatra`
    );
  }

  if (education) {
    mainParts.push(
      `qualified in ${education}`
    );
  }

  const workTitle =
    designation ||
    profession;

  if (workTitle && company) {
    mainParts.push(
      `working as ${workTitle} at ${company}`
    );
  } else if (workTitle) {
    mainParts.push(
      `working as ${workTitle}`
    );
  } else if (company) {
    mainParts.push(
      `working at ${company}`
    );
  }

  if (workingLocation) {
    mainParts.push(
      `based in ${workingLocation}`
    );
  }

  if (annualIncome) {
    mainParts.push(
      `with annual income in the ${annualIncome} range`
    );
  }

  if (nativePlace) {
    mainParts.push(
      `native of ${nativePlace}`
    );
  }

  let generated =
    `${candidateLabel} is ${mainParts.join(
      ", "
    )}.`;

  if (hobbies.length > 0) {
    const hobbiesText =
      hobbies.length === 1
        ? hobbies[0]
        : hobbies.length === 2
          ? `${hobbies[0]} and ${hobbies[1]}`
          : `${hobbies
              .slice(0, -1)
              .join(", ")}, and ${hobbies.at(-1)}`;

    generated +=
      ` ${subjectPronoun} enjoys ${hobbiesText}.`;
  }

  const preferenceParts = [];

  const preferredAge =
    firstValue(
      profile.age_range,
      profile.ageRange,
      profile.preferred_age_range,
      profile.preferredAgeRange
    );

  const preferredAgeValues =
    asDisplayList(
      preferredAge
    );

  if (
    preferredAgeValues.length >= 2
  ) {
    preferenceParts.push(
      `preferred age between ${preferredAgeValues[0]} and ${preferredAgeValues[1]} years`
    );
  } else if (
    preferredAgeValues.length === 1
  ) {
    preferenceParts.push(
      `preferred age around ${preferredAgeValues[0]} years`
    );
  }

  const preferredEducation =
    firstValue(
      profile.preferred_education,
      profile.preferredEducation
    );

  if (
    displayValue(
      preferredEducation
    ) !== "-"
  ) {
    preferenceParts.push(
      `education ${displayValue(
        preferredEducation
      )}`
    );
  }

  const preferredProfessions =
    firstValue(
      profile.preferred_professions,
      profile.preferredProfessions
    );

  if (
    displayValue(
      preferredProfessions
    ) !== "-"
  ) {
    preferenceParts.push(
      `profession ${displayValue(
        preferredProfessions
      )}`
    );
  }

  const preferredGotras =
    firstValue(
      profile.preferred_gotras,
      profile.preferredGotras
    );

  if (
    displayValue(
      preferredGotras
    ) !== "-"
  ) {
    preferenceParts.push(
      `Gotra ${displayValue(
        preferredGotras
      )}`
    );
  }

  const preferredIncome =
    firstValue(
      profile.preferred_income_range,
      profile.preferredIncomeRange
    );

  const preferredIncomeValues =
    asDisplayList(
      preferredIncome
    );

  if (
    preferredIncomeValues.length >= 2
  ) {
    preferenceParts.push(
      `preferred annual income between ₹${preferredIncomeValues[0]} and ₹${preferredIncomeValues[1]} lakh`
    );
  } else if (
    preferredIncomeValues.length === 1
  ) {
    preferenceParts.push(
      `preferred annual income around ₹${preferredIncomeValues[0]} lakh`
    );
  }

  const preferredCities =
    firstValue(
      profile.preferred_cities,
      profile.preferredCities
    );

  const preferredCountries =
    firstValue(
      profile.preferred_countries,
      profile.preferredCountries
    );

  const preferredLocations = [
    ...asDisplayList(
      preferredCities
    ),
    ...asDisplayList(
      preferredCountries
    ),
  ];

  const preferredLocationText = (() => {
    if (preferredLocations.length === 0) {
      return "";
    }

    const locationText =
      preferredLocations.join(" ");

    const hasNorthKarnataka =
      /north karnataka/i.test(
        locationText
      );

    const hasKalyanaKarnataka =
      /kalyana karnataka|hyderabad-karnataka/i.test(
        locationText
      );

    if (
      hasNorthKarnataka &&
      hasKalyanaKarnataka
    ) {
      return "North Karnataka or Kalyana Karnataka";
    }

    if (hasNorthKarnataka) {
      return "North Karnataka";
    }

    if (hasKalyanaKarnataka) {
      return "Kalyana Karnataka";
    }

    if (
      preferredLocations.length <= 3
    ) {
      return preferredLocations.join(
        ", "
      );
    }

    return preferredLocations
      .slice(0, 3)
      .join(", ");
  })();

  if (preferredLocationText) {
    preferenceParts.push(
      `preferably from ${preferredLocationText}`
    );
  }

  const expectations =
    cleanExpectationsText(
      profile.expectations
    );

  if (expectations) {
    generated +=
      ` Seeking a life partner ${expectations.replace(
        /[.!?]+$/,
        ""
      )}.`;
  } else if (
    preferenceParts.length > 0
  ) {
    generated +=
      ` Seeking a compatible life partner with ${preferenceParts.join(
        ", "
      )}.`;
  }

  if (
    expectations &&
    preferenceParts.length > 0
  ) {
    generated +=
      ` Preferred partner profile: ${preferenceParts.join(
        ", "
      )}.`;
  }

  return generated
    .replace(/\s+/g, " ")
    .trim();
};
const DetailItem = ({
  label,
  value,
}) => (
  <div
    className={`rounded-xl border p-3 ${designClasses.border} ${designClasses.surfaceMuted}`}
  >
    <div
      className={`text-xs font-medium ${designClasses.textSecondary}`}
    >
      {label}
    </div>

    <div
      className={`mt-1 text-sm font-semibold ${designClasses.textDark}`}
    >
      {value || "-"}
    </div>
  </div>
);
const AdvertiseProfilePage = () => {
  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    advertisementText,
    setAdvertisementText,
  ] = useState("");

  const advertisementHeading =
    useMemo(() => {
      const lookingFor =
        determineLookingFor(
          profile
        );

      const normalized =
        String(lookingFor)
          .trim()
          .toLowerCase();

      if (
        normalized === "bride"
      ) {
        return "Looking for a Bride";
      }

      if (
        normalized === "groom" ||
        normalized ===
          "bridegroom"
      ) {
        return "Looking for a Bridegroom";
      }

      return "Looking for a Life Partner";
    }, [profile]);

  const generatedText = useMemo(
    () =>
      buildAdvertisementText(
        profile
      ),
    [profile]
  );

  useEffect(() => {
    let active = true;

    const loadProfile =
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await profileService.getMyProfile();

          if (!active) {
            return;
          }

          const currentProfile =
            response?.profile ||
            response ||
            {};

          setProfile(
            currentProfile
          );

          setAdvertisementText(
            buildAdvertisementText(
              currentProfile
            )
          );
        } catch (err) {
          console.error(
            "Unable to load profile for advertisement:",
            err
          );

          if (!active) {
            return;
          }

          setError(
            err?.response?.data?.message ||
              "Unable to load your profile information."
          );
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const resetAdvertisement =
    () => {
      setAdvertisementText(
        generatedText
      );
    };

  const handleContinue =
    () => {
      /*
       * Payment / submission workflow
       * will be connected in the next
       * implementation step.
       *
       * Keep the completed draft locally
       * for the next screen.
       */
      sessionStorage.setItem(
        "advertisementDraft",
        JSON.stringify({
          profileId:
            firstValue(
              profile?.profile_id,
              profile?.profileId,
              profile?.id
            ),

          advertisementHeading,
          advertisementText,

          source: {
            age: firstValue(
              profile?.current_age,
              profile?.currentAge
            ),

            gotra:
              displayGotra(
                profile?.gotra
              ),

            profession:
              firstValue(
                profile?.profession
              ),

            company:
              firstValue(
                profile?.current_company,
                profile?.currentCompany
              ),

            annualIncome:
              firstValue(
                profile?.annual_income,
                profile?.annualIncome
              ),
          },
        })
      );

      window.location.href =
        "/preferred-payment";
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
            Loading your profile...
          </p>
        </div>
      </MemberLayout>
    );
  }

  if (error) {
    return (
      <MemberLayout>
        <div
          className={`${designClasses.card} p-6`}
        >
          <h1
            className={`text-lg font-semibold ${designClasses.textPrimary}`}
          >
            Advertise Your Profile
          </h1>

          <p className="mt-3 text-sm text-red-700">
            {error}
          </p>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="space-y-4">
        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <h1
            className={`text-xl font-semibold ${designClasses.textPrimary}`}
          >
            Advertise Your Profile
          </h1>

          <p
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Your advertisement is
            prepared automatically from
            your Profile and Partner
            Expectations. Review and edit
            the advertisement text before
            continuing.
          </p>
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="mb-4">
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              Your Profile
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              These details come from
              your profile. Editing the
              advertisement below will
              not modify your profile.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Age"
              value={firstValue(
                profile?.current_age,
                profile?.currentAge
              )}
            />

            <DetailItem
              label="Gotra"
              value={displayGotra(
                profile?.gotra
              )}
            />

            <DetailItem
              label="Profession"
              value={
                profile?.profession
              }
            />

            <DetailItem
              label="Current Company"
              value={firstValue(
                profile?.current_company,
                profile?.currentCompany
              )}
            />

            <DetailItem
              label="Annual Income"
              value={firstValue(
                profile?.annual_income,
                profile?.annualIncome
              )}
            />

            <DetailItem
              label="Profile ID"
              value={firstValue(
                profile?.profile_id,
                profile?.profileId,
                profile?.id
              )}
            />
          </div>
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="mb-4">
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              Partner Expectations
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              These values are taken
              automatically from your
              saved Partner Expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Preferred Age"
              value={displayValue(
                firstValue(
                  profile?.age_range,
                  profile?.ageRange,
                  profile?.preferred_age_range,
                  profile?.preferredAgeRange
                )
              )}
            />

            <DetailItem
              label="Preferred Education"
              value={displayValue(
                firstValue(
                  profile?.preferred_education,
                  profile?.preferredEducation
                )
              )}
            />

            <DetailItem
              label="Preferred Profession"
              value={displayValue(
                firstValue(
                  profile?.preferred_professions,
                  profile?.preferredProfessions
                )
              )}
            />

            <DetailItem
              label="Preferred Gotra"
              value={displayValue(
                firstValue(
                  profile?.preferred_gotras,
                  profile?.preferredGotras
                )
              )}
            />

            <DetailItem
              label="Preferred Income"
              value={displayValue(
                firstValue(
                  profile?.preferred_income_range,
                  profile?.preferredIncomeRange
                )
              )}
            />

            <DetailItem
              label="Preferred Location"
              value={[
                ...asDisplayList(
                  firstValue(
                    profile?.preferred_cities,
                    profile?.preferredCities
                  )
                ),
                ...asDisplayList(
                  firstValue(
                    profile?.preferred_countries,
                    profile?.preferredCountries
                  )
                ),
              ].join(", ") || "-"}
            />
          </div>

          {profile?.expectations && (
            <div
              className={`mt-4 rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
            >
              <div
                className={`text-xs font-medium ${designClasses.textSecondary}`}
              >
                Other Expectations
              </div>

              <p
                className={`mt-1 text-sm ${designClasses.textDark}`}
              >
                {profile.expectations}
              </p>
            </div>
          )}
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="mb-4">
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              Advertisement Text
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Gotra, age, employment,
              income and Partner
              Expectations have been
              included automatically
              where available. You can
              edit this draft before
              submitting it.
            </p>
          </div>

          <AdvertisementPreview
            heading={advertisementHeading}
            text={advertisementText}
            editable
            onChange={setAdvertisementText}
            rows={7}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                resetAdvertisement
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
            >
              Reset from Profile
            </button>

            <button
              type="button"
              onClick={
                handleContinue
              }
              disabled={
                !advertisementText.trim()
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.primaryButton}`}
            >
              Continue to Payment
            </button>
          </div>

          <p
            className={`mt-3 text-xs ${designClasses.textSecondary}`}
          >
            The advertisement text can
            also be reviewed and edited
            by the Moderator before
            approval and publication.
          </p>
        </section>
      </div>
    </MemberLayout>
  );
};

export default AdvertiseProfilePage;