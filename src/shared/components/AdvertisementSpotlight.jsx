import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import advertisementService from "../../services/advertisementService";
import profileService from "../../services/profileService";

import ForwardProfileModal from "./ForwardProfileModal";
import PromptModal from "./PromptModal";

import {
  designClasses,
} from "../styles/designTokens";

const ROTATION_INTERVAL = 10000;

const cleanAdvertisementText = (
  value
) => {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(
      /(\d+)\s+years?\s+and\s+\d+\s+months?(?:-year-old)?/gi,
      "$1 years old"
    )
    .replace(
      /(\d+)\s+years?\s+and\s+\d+\s+month(?:-year-old)?/gi,
      "$1 years old"
    )
    .replace(
      /(\d+)\s+years?-year-old/gi,
      "$1 years old"
    )
    .replace(/\s+/g, " ")
    .trim();
};

const buildFallbackAdvertisementText = (
  advertisement
) => {
  const age =
    String(
      advertisement?.current_age ||
        advertisement?.currentAge ||
        ""
    ).match(/\d+/)?.[0];

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

  const parts = [];

  if (age) {
    parts.push(
      `${age} years old`
    );
  }

  if (
    gotra &&
    gotra !== "Not specified"
  ) {
    parts.push(
      `from ${gotra} Gotra`
    );
  }

  if (
    profession &&
    profession !==
      "Not specified"
  ) {
    parts.push(
      company
        ? `working as ${profession} at ${company}`
        : `working as ${profession}`
    );
  }

  if (
    city &&
    city !== "Not specified"
  ) {
    parts.push(
      `based in ${city}`
    );
  }

  if (parts.length === 0) {
    return "";
  }

  return `Matrimonial profile: ${parts.join(
    ", "
  )}.`;
};

const getAdvertisementText = (
  advertisement
) => {
  const approvedText =
    advertisement?.approved_advertisement_text ||
    advertisement?.approvedAdvertisementText ||
    advertisement?.advertisement_text ||
    advertisement?.advertisementText;

  if (approvedText) {
    return cleanAdvertisementText(
      approvedText
    );
  }

  const transactionText =
    cleanAdvertisementText(
      advertisement?.transaction_details ||
        ""
    );

  if (transactionText) {
    return transactionText;
  }

  const displaySummary =
    cleanAdvertisementText(
      advertisement?.display_summary ||
        ""
    );

  if (displaySummary) {
    return displaySummary;
  }

  return buildFallbackAdvertisementText(
    advertisement
  );
};

const getCompactAge = (
  value
) => {
  const age =
    String(value || "")
      .match(/\d+/)?.[0];

  return age
    ? `${age} yrs`
    : "";
};

const formatIncomeForSpotlight = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    String(value).trim() ===
      "Not specified"
  ) {
    return "";
  }

  const numericIncome =
    Number(
      String(value)
        .replace(/,/g, "")
        .trim()
    );

  if (
    !Number.isFinite(
      numericIncome
    ) ||
    numericIncome <= 0
  ) {
    return String(value);
  }

  if (
    numericIncome >= 10000000
  ) {
    const crores =
      numericIncome /
      10000000;

    return `₹${Number(
      crores.toFixed(1)
    )} Cr`;
  }

  if (
    numericIncome >= 100000
  ) {
    const lakhs =
      numericIncome /
      100000;

    return `₹${Number(
      lakhs.toFixed(1)
    )} Lakh`;
  }

  return `₹${numericIncome.toLocaleString(
    "en-IN"
  )}`;
};

const getLookingFor = (
  advertisement
) => {
  const lookingFor =
    String(
      advertisement?.looking_for ||
        advertisement?.lookingFor ||
        ""
    )
      .trim()
      .toUpperCase();

  if (lookingFor === "BRIDE") {
    return {
      label: "Looking for Bride",
      type: "BRIDE",
    };
  }

  if (
    lookingFor === "BRIDEGROOM" ||
    lookingFor === "GROOM"
  ) {
    return {
      label: "Looking for Bridegroom",
      type: "GROOM",
    };
  }

  const profileFor =
    String(
      advertisement?.profile_for ||
        advertisement?.profileFor ||
        advertisement?.profile_category_need ||
        advertisement?.profileCategoryNeed ||
        ""
    )
      .trim()
      .toLowerCase();

  if (
    profileFor.includes("bridegroom") ||
    profileFor.includes("groom")
  ) {
    return {
      label: "Looking for Bride",
      type: "BRIDE",
    };
  }

  if (
    profileFor.includes("bride")
  ) {
    return {
      label: "Looking for Bridegroom",
      type: "GROOM",
    };
  }

  const gender =
    String(
      advertisement?.gender ||
        advertisement?.sex ||
        ""
    )
      .trim()
      .toLowerCase();

  /*
   * Legacy advertisements may not yet carry
   * profile_for/gender in the display payload.
   * Use the already-approved advertisement text
   * only as a final compatibility fallback.
   */
  const advertisementText =
    String(
      advertisement?.transaction_details ||
        advertisement?.display_summary ||
        ""
    )
      .trim()
      .toLowerCase();

  if (
    advertisementText.includes(
      "looking for a bridegroom"
    ) ||
    advertisementText.includes(
      "looking for bridegroom"
    ) ||
    advertisementText.includes(
      "looking for a groom"
    ) ||
    advertisementText.includes(
      "looking for groom"
    )
  ) {
    return {
      label: "Looking for Bridegroom",
      type: "GROOM",
    };
  }

  if (
    advertisementText.includes(
      "looking for a bride"
    ) ||
    advertisementText.includes(
      "looking for bride"
    )
  ) {
    return {
      label: "Looking for Bride",
      type: "BRIDE",
    };
  }

  /*
   * Same business rule already used by
   * AdvertiseProfilePage:
   *
   * Male profile -> looking for Bride
   * Female profile -> looking for Bridegroom
   */
  if (
    gender === "male" ||
    gender === "m"
  ) {
    return {
      label: "Looking for Bride",
      type: "BRIDE",
    };
  }

  if (
    gender === "female" ||
    gender === "f"
  ) {
    return {
      label: "Looking for Bridegroom",
      type: "GROOM",
    };
  }

  return {
    label: "Matrimonial Profile",
    type: "NEUTRAL",
  };
};


const getAdvertisementTeaser = (
  advertisement
) => {
  if (!advertisement) {
    return "";
  }

  const lookingFor =
    getLookingFor(advertisement);

  const age =
    getCompactAge(
      advertisement?.current_age ||
        advertisement?.currentAge
    );

  const gotra =
    advertisement?.gotra &&
    advertisement.gotra !==
      "Not specified"
      ? `${advertisement.gotra} Gotra`
      : "";

  const profession =
    advertisement?.profession &&
    advertisement.profession !==
      "Not specified"
      ? advertisement.profession
      : "";

  const city =
    advertisement?.city &&
    advertisement.city !==
      "Not specified"
      ? advertisement.city
      : "";

  const income =
    formatIncomeForSpotlight(
      advertisement?.annual_income ||
        advertisement?.annualIncome
    );

  return [
    lookingFor.label,
    age,
    gotra,
    profession,
    city,
    income,
  ]
    .filter(Boolean)
    .join(" · ");
};

const AdvertisementSpotlight = ({
  limit = 8,
}) => {
  const navigate =
    useNavigate();

  const [
    advertisements,
    setAdvertisements,
  ] = useState([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    paused,
    setPaused,
  ] = useState(false);

  const [
    manuallyPaused,
    setManuallyPaused,
  ] = useState(false);

  const [
    showFullMessage,
    setShowFullMessage,
  ] = useState(false);

  const [
    showAllAdvertisements,
    setShowAllAdvertisements,
  ] = useState(false);

  const [
    responseSubmitting,
    setResponseSubmitting,
  ] = useState(false);

  const [
    responseMessage,
    setResponseMessage,
  ] = useState("");

  const [
    forwardModalOpen,
    setForwardModalOpen,
  ] = useState(false);

  const [
    forwardTarget,
    setForwardTarget,
  ] = useState(null);

  const [
    isForwardingProfile,
    setIsForwardingProfile,
  ] = useState(false);

  const [
    photoByProfileId,
    setPhotoByProfileId,
  ] = useState({});  
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
    confirmLabel: "Submit",
    onConfirm: null,
  });

  const closePromptModal =
    () => {
      setPromptModal(
        (current) => ({
          ...current,
          open: false,
          onConfirm: null,
        })
      );
    };

  const openPromptModal =
    (options) => {
      setPromptModal({
        open: true,
        title:
          options?.title || "",
        description:
          options?.description || "",
        label:
          options?.label || "Remarks",
        initialValue:
          options?.initialValue || "",
        placeholder:
          options?.placeholder || "",
        required:
          Boolean(
            options?.required
          ),
        confirmLabel:
          options?.confirmLabel ||
          "Submit",
        onConfirm:
          options?.onConfirm ||
          null,
      });
    };

  useEffect(() => {
    let active = true;

    const loadAdvertisements =
      async () => {
        try {
          const data =
            await advertisementService.getAdvertisementsForDisplay(
              {
                limit,
                format: "ticker",
              }
            );

          if (!active) {
            return;
          }

          const available =
            Array.isArray(data)
              ? data.filter(
                  (item) =>
                    getAdvertisementText(
                      item
                    )
                )
              : [];

          setAdvertisements(
            available
          );

          setCurrentIndex(0);
        } catch (error) {
                    console.error(
            "Unable to load advertisement spotlight:",
            error?.response?.data ||
              error
          );

          if (active) {
            setAdvertisements([]);
          }
        }
      };

    loadAdvertisements();

    return () => {
      active = false;
    };
  }, [limit]);

  useEffect(() => {
    if (
      advertisements.length <= 1 ||
      paused ||
      manuallyPaused
    ) {
      return undefined;
    }

    const timer =
      window.setInterval(
        () => {
          setCurrentIndex(
            (current) =>
              (current + 1) %
              advertisements.length
          );
        },
        ROTATION_INTERVAL
      );

    return () => {
      window.clearInterval(timer);
    };
  }, [
    advertisements.length,
    paused,
    manuallyPaused,
  ]);

  const advertisement =
    advertisements[
      currentIndex
    ];

  const advertisementText =
    useMemo(
      () =>
        getAdvertisementText(
          advertisement
        ),
      [advertisement]
    );

  const advertisementTeaser =
    useMemo(
      () =>
        getAdvertisementTeaser(
          advertisement
        ),
      [advertisement]
    );

  const lookingFor =
    useMemo(
      () =>
        getLookingFor(
          advertisement
        ),
      [advertisement]
    );


  const compactDetails =
    useMemo(() => {
      if (!advertisement) {
        return [];
      }

      return [
        getCompactAge(
          advertisement?.current_age ||
            advertisement?.currentAge
        ),

        advertisement?.gotra &&
        advertisement.gotra !==
          "Not specified"
          ? `${advertisement.gotra} Gotra`
          : "",

        advertisement?.profession &&
        advertisement.profession !==
          "Not specified"
          ? advertisement.profession
          : "",

        advertisement?.city &&
        advertisement.city !==
          "Not specified"
          ? advertisement.city
          : "",

        formatIncomeForSpotlight(
          advertisement?.annual_income ||
            advertisement?.annualIncome
        ),
      ].filter(Boolean);
    }, [advertisement]);

  const profileId =
    advertisement?.profile_id ||
    advertisement?.profileId ||
    "";

  useEffect(() => {
    let active = true;

    const loadSpotlightPhoto =
      async () => {
        if (!profileId) {
          return;
        }

        const profileKey =
          String(profileId);

        if (
          Object.prototype.hasOwnProperty.call(
            photoByProfileId,
            profileKey
          )
        ) {
          return;
        }

        try {
          const photo =
            await profileService
              .getDefaultPhoto(
                profileId
              );

          if (!active) {
            return;
          }

          setPhotoByProfileId(
            (current) => ({
              ...current,
              [profileKey]:
                photo?.fullUrl ||
                ""
            })
          );
        } catch (error) {
          console.warn(
            "Unable to load Spotlight photo:",
            profileId,
            error
          );

          if (active) {
            setPhotoByProfileId(
              (current) => ({
                ...current,
                [profileKey]:
                  ""
              })
            );
          }
        }
      };

    loadSpotlightPhoto();

    return () => {
      active = false;
    };
  }, [
    profileId,
    photoByProfileId,
  ]);

  const spotlightPhotoUrl =
    profileId
      ? photoByProfileId[
          String(profileId)
        ] || ""
      : "";

  useEffect(() => {
    if (
      !showAllAdvertisements ||
      advertisements.length === 0
    ) {
      return;
    }

    let active = true;

    const loadMissingPhotos =
      async () => {
        const missingProfileIds =
          advertisements
            .map(
              (item) =>
                item?.profile_id ||
                item?.profileId
            )
            .filter(Boolean)
            .map(String)
            .filter(
              (itemProfileId) =>
                !Object.prototype
                  .hasOwnProperty.call(
                    photoByProfileId,
                    itemProfileId
                  )
            );

        if (
          missingProfileIds.length === 0
        ) {
          return;
        }

        const uniqueProfileIds =
          [
            ...new Set(
              missingProfileIds
            )
          ];

        const results =
          await Promise.allSettled(
            uniqueProfileIds.map(
              async (
                itemProfileId
              ) => {
                const photo =
                  await profileService
                    .getDefaultPhoto(
                      itemProfileId
                    );

                return {
                  profileId:
                    itemProfileId,
                  photoUrl:
                    photo?.fullUrl ||
                    ""
                };
              }
            )
          );

        if (!active) {
          return;
        }

        setPhotoByProfileId(
          (current) => {
            const updated = {
              ...current
            };

            results.forEach(
              (result) => {
                if (
                  result.status !==
                  "fulfilled"
                ) {
                  return;
                }

                updated[
                  result.value
                    .profileId
                ] =
                  result.value
                    .photoUrl;
              }
            );

            return updated;
          }
        );
      };

    loadMissingPhotos();

    return () => {
      active = false;
    };
  }, [
    showAllAdvertisements,
    advertisements,
    photoByProfileId,
  ]);

  if (
    advertisements.length === 0 ||
    !advertisement
  ) {
    return null;
  }

  const loggedInProfileId =
    String(
      sessionStorage.getItem(
        "profileId"
      ) || ""
    ).trim();

  const isOwnAdvertisement =
    Boolean(
      loggedInProfileId &&
      profileId &&
      String(profileId) ===
        loggedInProfileId
    );

  const goPrevious = () => {
    setCurrentIndex(
      (current) =>
        current === 0
          ? advertisements.length - 1
          : current - 1
    );
  };

  const goNext = () => {
    setCurrentIndex(
      (current) =>
        (current + 1) %
        advertisements.length
    );
  };

  const handleViewProfile =
    () => {
      if (!profileId) {
        return;
      }

      navigate(
        `/view-profile/${profileId}`
      );
    };

  const handleViewResponses =
    (item) => {
      const advertisementId =
        item?.id;

      if (!advertisementId) {
        setResponseMessage(
          "Advertisement reference is unavailable."
        );
        return;
      }

      setShowFullMessage(false);
      setShowAllAdvertisements(false);
      setPaused(false);

      navigate(
        `/inbox?advertisementId=${encodeURIComponent(
          advertisementId
        )}`
      );
    };

  const handleOpenForwardModal =
    (item) => {
      const targetProfileId =
        item?.profile_id ||
        item?.profileId;

      if (!targetProfileId) {
        setResponseMessage(
          "Profile reference is unavailable."
        );
        return;
      }

      setForwardTarget(
        item
      );

      setForwardModalOpen(
        true
      );

      setPaused(
        true
      );
    };


  const handleCloseForwardModal =
    () => {
      if (
        isForwardingProfile
      ) {
        return;
      }

      setForwardModalOpen(
        false
      );

      setForwardTarget(
        null
      );

      setPaused(
        false
      );
    };


  const handleForwardProfile =
    async ({
      recipientEmail,
      senderMessage,
    }) => {
      const targetProfileId =
        forwardTarget?.profile_id ||
        forwardTarget?.profileId;

      if (!targetProfileId) {
        setResponseMessage(
          "Profile reference is unavailable."
        );

        return;
      }

      try {
        setIsForwardingProfile(
          true
        );

        const result =
          await profileService
            .forwardProfileByEmail({
              targetProfileId,
              recipientEmail,
              senderMessage,
              advertisementId:
                forwardTarget?.id ||
                null,
              advertisementText:
                getAdvertisementText(
                  forwardTarget
                ),
            });

        setForwardModalOpen(
          false
        );

        setForwardTarget(
          null
        );

        setResponseMessage(
          result?.message ||
            "Advertisement forwarded successfully."
        );

      } catch (error) {
        console.error(
          "Unable to forward advertisement:",
          error
        );

        setResponseMessage(
          error?.response?.data
            ?.message ||
            "Unable to forward advertisement."
        );

      } finally {
        setIsForwardingProfile(
          false
        );

        setPaused(
          false
        );
            }
    };


  const handleAdvertisementResponse =
    (
      item,
      responseType
    ) => {
      const advertisementId =
        item?.id;

      if (!advertisementId) {
        setResponseMessage(
          "Advertisement reference is unavailable."
        );
        return;
      }

      const normalizedResponseType =
        String(
          responseType || ""
        )
          .trim()
          .toUpperCase();

      const defaultRemarks =
        normalizedResponseType ===
        "APPLY"
          ? "I would like to apply for this matrimonial advertisement."
          : "I am interested in this matrimonial profile.";

      openPromptModal({
        title:
          normalizedResponseType ===
          "APPLY"
            ? "Apply for this Profile"
            : "Show Interest",

        description:
          normalizedResponseType ===
          "APPLY"
            ? "Add a short message to accompany your application."
            : "Add a short message to express your interest.",

        label:
          normalizedResponseType ===
          "APPLY"
            ? "Application Remarks"
            : "Interest Remarks",

        initialValue:
          defaultRemarks,

        placeholder:
          normalizedResponseType ===
          "APPLY"
            ? "Enter your application message..."
            : "Enter your interest message...",

        required:
          true,

        confirmLabel:
          normalizedResponseType ===
          "APPLY"
            ? "Submit Application"
            : "Send Interest",

        onConfirm:
          async (
            remarks
          ) => {
            closePromptModal();

            try {
              setResponseSubmitting(
                true
              );

              setResponseMessage(
                ""
              );

              const result =
                await advertisementService
                  .respondToAdvertisement({
                    advertisementId,
                    responseType:
                      normalizedResponseType,
                    remarks,
                  });

              setResponseMessage(
                result?.message ||
                  "Response submitted."
              );

            } catch (error) {
              console.error(
                "Unable to submit advertisement response:",
                error
              );

              setResponseMessage(
                error?.response?.data
                  ?.message ||
                  "Unable to submit response."
              );

            } finally {
              setResponseSubmitting(
                false
              );
            }
          },
      });
    };


  const toggleRotation =
    () => {
      setManuallyPaused(
        (current) => !current
      );
    };

  return (
    <aside
      aria-label="Matrimonial Spotlight"
      aria-live="off"
      className={`${designClasses.surface} border-b border-[#EADFCB]`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div
          className={`flex min-h-[54px] items-center gap-3 rounded-xl border px-3 py-2 shadow-sm sm:px-4 ${designClasses.border} ${designClasses.bgAccentSoft}`}
        >
          <div
            className={`hidden shrink-0 items-center gap-2.5 rounded-lg border px-3 py-1.5 sm:flex ${designClasses.border} ${designClasses.surface}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${designClasses.bgAccentSoft}`}
            >
              <Sparkles
                className={`h-4 w-4 ${designClasses.textAccent}`}
              />
            </div>

            <div className="leading-tight">
              <div
                className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${designClasses.textSecondary}`}
              >
                Matrimonial
              </div>

              <div
                className={`text-sm font-bold ${designClasses.textAccent}`}
              >
                Spotlight
              </div>
            </div>
          </div>

        <div
          className="relative min-w-0 flex-1"
          onMouseEnter={() => {
            setPaused(true);
            setShowFullMessage(true);
          }}
          onMouseLeave={() => {
            setPaused(false);
            setShowFullMessage(false);
          }}
        >
          <div
            tabIndex={0}
            onFocus={() => {
              setPaused(true);
              setShowFullMessage(true);
            }}
            onBlur={() => {
              setPaused(false);
              setShowFullMessage(false);
            }}
            className="relative cursor-pointer rounded-md px-1 py-0.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              {spotlightPhotoUrl && (
                <button
                  type="button"
                  onClick={
                    handleViewProfile
                  }
                  className="shrink-0"
                  aria-label="View matrimonial profile"
                >
                  <img
                    src={
                      spotlightPhotoUrl
                    }
                    alt=""
                    className={`h-10 w-10 rounded-full border object-cover shadow-sm ${designClasses.border}`}
                    onError={(
                      event
                    ) => {
                      event.currentTarget
                        .style.display =
                        "none";
                    }}
                  />
                </button>
              )}

              <span
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${
                  lookingFor.type ===
                  "BRIDE"
                    ? "border-pink-100 bg-pink-50 text-pink-700"
                    : lookingFor.type ===
                      "GROOM"
                    ? "border-blue-100 bg-blue-50 text-blue-700"
                    : `${designClasses.border} ${designClasses.surface} ${designClasses.textAccent}`
                }`}
              >
                {lookingFor.label}
              </span>

              <span
                className={`min-w-0 truncate text-sm font-semibold tracking-[0.01em] ${designClasses.textPrimary}`}
              >
                {advertisementTeaser
                  .replace(
                    `${lookingFor.label} · `,
                    ""
                  )
                  .replace(
                    lookingFor.label,
                    ""
                  )
                  .trim()}
              </span>
            </div>
          </div>

          {showFullMessage &&
            advertisementText && (
              <div
                className={`absolute left-0 top-[calc(100%-2px)] z-50 w-full min-w-[320px] max-w-3xl rounded-xl border p-4 shadow-lg ${designClasses.surface} ${designClasses.border}`}
                role="dialog"
                aria-label="Full matrimonial advertisement"
                onMouseEnter={() => {
                  setPaused(true);
                  setShowFullMessage(true);
                }}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-sm font-semibold ${designClasses.textPrimary}`}
                    >
                      Matrimonial Advertisement
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        lookingFor.type ===
                        "BRIDE"
                          ? "bg-pink-50 text-pink-700"
                          : lookingFor.type ===
                            "GROOM"
                          ? "bg-blue-50 text-blue-700"
                          : `${designClasses.bgAccentSoft} ${designClasses.textAccent}`
                      }`}
                    >
                      {lookingFor.label}
                    </span>
                  </div>

                </div>

                {compactDetails.length >
                  0 && (
                  <div
                    className={`mb-2 text-xs font-semibold ${designClasses.textSecondary}`}
                  >
                    {compactDetails.join(
                      " · "
                    )}
                  </div>
                )}

                <div
                  className={`whitespace-normal text-sm leading-6 ${designClasses.textDark}`}
                >
                  {advertisementText}
                </div>
                                <div
                  className={`mt-4 border-t pt-3 ${designClasses.border}`}
                >
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={
                        handleViewProfile
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.secondaryButton}`}
                    >
                      View Profile
                    </button>

                    {!isOwnAdvertisement && (
                      <>
                        <button
                          type="button"
                          disabled={
                            responseSubmitting
                          }
                          onClick={() =>
                            handleAdvertisementResponse(
                              advertisement,
                              "INTEREST"
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.primaryButton}`}
                        >
                          Show Interest
                        </button>

                        <button
                          type="button"
                          disabled={
                            responseSubmitting
                          }
                          onClick={() =>
                            handleAdvertisementResponse(
                              advertisement,
                              "APPLY"
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.primaryButton}`}
                        >
                          Apply
                        </button>
                      </>
                    )}

                    {isOwnAdvertisement && (
                      <button
                        type="button"
                        onClick={() =>
                          handleViewResponses(
                            advertisement
                          )
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.primaryButton}`}
                      >
                        View Responses
                      </button>
                    )}

                                        <button
                      type="button"
                      disabled={
                        isForwardingProfile
                      }
                      onClick={() =>
                        handleOpenForwardModal(
                          advertisement
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${designClasses.secondaryButton}`}
                    >
                      {isForwardingProfile
                        ? "Forwarding..."
                        : "Forward"}
                    </button>
                  </div>

                  {responseMessage && (
                    <p
                      className={`mt-2 text-xs ${designClasses.textSecondary}`}
                    >
                      {responseMessage}
                    </p>
                  )}
                </div>
              </div>
            )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {profileId && (
            <button
              type="button"
              onClick={
                handleViewProfile
              }
              className={`hidden rounded-lg px-3.5 py-2 text-xs font-semibold sm:inline-flex ${designClasses.primaryButton}`}
            >
              View Profile
            </button>
          )}

          {advertisements.length >
            1 && (
            <>
              <span
                className={`hidden min-w-[42px] text-center text-xs md:inline ${designClasses.textSecondary}`}
              >
                {currentIndex + 1} of{" "}
                {advertisements.length}
              </span>

              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous advertisement"
                className={`rounded-lg border p-1.5 ${designClasses.border} ${designClasses.textPrimary}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={
                  toggleRotation
                }
                aria-label={
                  manuallyPaused
                    ? "Resume advertisements"
                    : "Pause advertisements"
                }
                className={`rounded-lg border p-1.5 ${designClasses.border} ${designClasses.textPrimary}`}
              >
                {manuallyPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next advertisement"
                className={`rounded-lg border p-1.5 ${designClasses.border} ${designClasses.textPrimary}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>

                            <button
                type="button"
                onClick={() => {
                  setPaused(true);
                  setShowAllAdvertisements(true);
                }}
                className={`hidden rounded-lg px-3 py-1.5 text-xs font-semibold lg:inline-flex ${designClasses.secondaryButton}`}
              >
                View All Ads
              </button>
            </>
          )}
        </div>
      </div>
    </div>

      {showAllAdvertisements && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowAllAdvertisements(false);
            setPaused(false);
          }}
        >
          <div
            className={`max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border shadow-xl ${designClasses.surface} ${designClasses.border}`}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className={`flex items-center justify-between border-b p-5 ${designClasses.border}`}
            >
              <div>
                <h2
                  className={`text-xl font-bold ${designClasses.textPrimary}`}
                >
                  Matrimonial Advertisements
                </h2>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Browse all currently published
                  matrimonial advertisements.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAllAdvertisements(
                    false
                  );
                  setPaused(false);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {advertisements.map(
                  (item, index) => {
                    const itemLookingFor =
                      getLookingFor(
                        item
                      );

                    const itemText =
                      getAdvertisementText(
                        item
                      );

                    const itemTeaser =
                      getAdvertisementTeaser(
                        item
                      );

                    const itemProfileId =
                      item?.profile_id ||
                      item?.profileId;

                    const itemPhotoUrl =
                      itemProfileId
                        ? photoByProfileId[
                            String(
                              itemProfileId
                            )
                          ] || ""
                        : "";

                    const itemIsOwnAdvertisement =
                      Boolean(
                        loggedInProfileId &&
                        itemProfileId &&
                        String(
                          itemProfileId
                        ) ===
                          loggedInProfileId
                      );

                    return (
                      <article
                        key={
                          itemProfileId ||
                          index
                        }
                        className={`overflow-hidden rounded-xl border ${designClasses.border} ${designClasses.surface}`}
                      >
                        <div className="flex gap-4 p-4">
                          {itemPhotoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowAllAdvertisements(
                                  false
                                );

                                navigate(
                                  `/view-profile/${itemProfileId}`
                                );
                              }}
                              className="shrink-0 self-start"
                              aria-label="View matrimonial profile"
                            >
                              <img
                                src={
                                  itemPhotoUrl
                                }
                                alt=""
                                className={`h-24 w-20 rounded-xl border object-cover shadow-sm ${designClasses.border}`}
                                onError={(
                                  event
                                ) => {
                                  event
                                    .currentTarget
                                    .style
                                    .display =
                                    "none";
                                }}
                              />
                            </button>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                  itemLookingFor.type ===
                                  "BRIDE"
                                    ? "bg-pink-50 text-pink-700"
                                    : itemLookingFor.type ===
                                      "GROOM"
                                    ? "bg-blue-50 text-blue-700"
                                    : `${designClasses.bgAccentSoft} ${designClasses.textAccent}`
                                }`}
                              >
                                {
                                  itemLookingFor.label
                                }
                              </span>
                            </div>

                            <div
                              className={`mt-2 text-sm font-semibold leading-5 ${designClasses.textPrimary}`}
                            >
                              {itemTeaser
                                .replace(
                                  `${itemLookingFor.label} · `,
                                  ""
                                )
                                .replace(
                                  itemLookingFor.label,
                                  ""
                                )
                                .trim()}
                            </div>

                            <div
                              className={`mt-2 text-sm leading-6 ${designClasses.textSecondary}`}
                            >
                              {itemText}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`flex flex-wrap gap-2 border-t px-4 py-3 ${designClasses.border} ${designClasses.surfaceMuted}`}
                        >
                          {itemProfileId && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowAllAdvertisements(
                                  false
                                );

                                navigate(
                                  `/view-profile/${itemProfileId}`
                                );
                              }}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${designClasses.secondaryButton}`}
                            >
                              View Profile
                            </button>
                          )}

                          {!itemIsOwnAdvertisement && (
                            <>
                              <button
                                type="button"
                                disabled={
                                  responseSubmitting
                                }
                                onClick={() =>
                                  handleAdvertisementResponse(
                                    item,
                                    "INTEREST"
                                  )
                                }
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${designClasses.primaryButton}`}
                              >
                                Show Interest
                              </button>

                              <button
                                type="button"
                                disabled={
                                  responseSubmitting
                                }
                                onClick={() =>
                                  handleAdvertisementResponse(
                                    item,
                                    "APPLY"
                                  )
                                }
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${designClasses.primaryButton}`}
                              >
                                Apply
                              </button>
                            </>
                          )}

                          {itemIsOwnAdvertisement && (
                            <button
                              type="button"
                              onClick={() =>
                                handleViewResponses(
                                  item
                                )
                              }
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${designClasses.primaryButton}`}
                            >
                              View Responses
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={
                              isForwardingProfile
                            }
                            onClick={() => {
                              setForwardTarget(
                                item
                              );

                              setForwardModalOpen(
                                true
                              );

                              setPaused(
                                true
                              );
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${designClasses.secondaryButton}`}
                          >
                            Forward
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}
            <ForwardProfileModal
        open={
          forwardModalOpen
        }
        title="Forward Advertisement"
        description="Share this matrimonial advertisement securely by email."
        submitLabel="Forward Advertisement"
        profileName={
          forwardTarget?.name ||
          forwardTarget?.profile_name ||
          forwardTarget?.profileName ||
          "Matrimonial Profile"
        }
        profileId={
          forwardTarget?.profile_id ||
          forwardTarget?.profileId ||
          ""
        }
        submitting={
          isForwardingProfile
        }
        onClose={
          handleCloseForwardModal
        }
        onSubmit={
          handleForwardProfile
        }
      />

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
    </aside>
  );
};

export default AdvertisementSpotlight;