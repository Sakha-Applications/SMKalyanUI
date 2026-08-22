import {
  useEffect,
  useMemo,
  useRef,
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

import {
  designClasses,
} from "../styles/designTokens";

const ROTATION_INTERVAL = 30000;

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

  const displaySummary =
    cleanAdvertisementText(
      advertisement?.display_summary ||
        ""
    );

  if (
    displaySummary &&
    !displaySummary.endsWith("...")
  ) {
    return displaySummary;
  }

  return (
    buildFallbackAdvertisementText(
      advertisement
    ) ||
    displaySummary
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

const AdvertisementSpotlight = ({
  limit = 8,
}) => {
  const navigate =
    useNavigate();

  const textViewportRef =
    useRef(null);

  const textTrackRef =
    useRef(null);

  const textAnimationRef =
    useRef(null);

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
    reducedMotion,
    setReducedMotion,
  ] = useState(false);

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
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const updatePreference =
      () => {
        setReducedMotion(
          mediaQuery.matches
        );
      };

    updatePreference();

    mediaQuery.addEventListener?.(
      "change",
      updatePreference
    );

    return () => {
      mediaQuery.removeEventListener?.(
        "change",
        updatePreference
      );
    };
  }, []);

  useEffect(() => {
    if (
      advertisements.length <= 1 ||
      paused ||
      manuallyPaused ||
      reducedMotion
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
    reducedMotion,
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
  useEffect(() => {
    const viewport =
      textViewportRef.current;

    const track =
      textTrackRef.current;

    if (
      !viewport ||
      !track
    ) {
      return undefined;
    }

    if (
      textAnimationRef.current
    ) {
      textAnimationRef.current.cancel();
      textAnimationRef.current =
        null;
    }

    track.style.transform =
      "translateX(0px)";

    if (
      reducedMotion ||
      !advertisementText
    ) {
      return undefined;
    }

    const startAnimation =
      () => {
        const viewportWidth =
          viewport.clientWidth;

        const textWidth =
          track.scrollWidth;

        const minimumTrackWidth =
          viewportWidth + 160;

        const effectiveTextWidth =
          Math.max(
            textWidth,
            minimumTrackWidth
          );

        const distance =
          effectiveTextWidth +
          viewportWidth;

        const pixelsPerSecond =
          32;

        const duration =
          Math.max(
            12000,
            (distance /
              pixelsPerSecond) *
              1000
          );

        const animation =
          track.animate(
            [
              {
                transform: `translateX(${viewportWidth}px)`,
              },
              {
                transform: `translateX(-${effectiveTextWidth}px)`,
              },
            ],
            {
              duration,
              iterations: Infinity,
              easing: "linear",
            }
          );

        textAnimationRef.current =
          animation;

        if (
          paused ||
          manuallyPaused
        ) {
          animation.pause();
        }
      };

    const frame =
      window.requestAnimationFrame(
        startAnimation
      );

    return () => {
      window.cancelAnimationFrame(
        frame
      );

      if (
        textAnimationRef.current
      ) {
        textAnimationRef.current.cancel();
        textAnimationRef.current =
          null;
      }
    };
  }, [
    advertisementText,
    currentIndex,
    reducedMotion,
    paused,
    manuallyPaused,
  ]);

  useEffect(() => {
    const animation =
      textAnimationRef.current;

    if (!animation) {
      return;
    }

    if (
      paused ||
      manuallyPaused
    ) {
      animation.pause();
    } else {
      animation.play();
    }
  }, [
    paused,
    manuallyPaused,
  ]);

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
      ].filter(Boolean);
    }, [advertisement]);

  if (
    advertisements.length === 0 ||
    !advertisement
  ) {
    return null;
  }

  const profileId =
    advertisement?.profile_id ||
    advertisement?.profileId;

  const goPrevious = () => {
    setManuallyPaused(true);

    setCurrentIndex(
      (current) =>
        current === 0
          ? advertisements.length -
            1
          : current - 1
    );
  };

  const goNext = () => {
    setManuallyPaused(true);

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
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      onFocus={() =>
        setPaused(true)
      }
      onBlur={() =>
        setPaused(false)
      }
      className={`${designClasses.surface} ${designClasses.border} border-b`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div
          className={`hidden shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${designClasses.bgAccentSoft} ${designClasses.textAccent}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Matrimonial Spotlight
        </div>

        <div className="min-w-0 flex-1">
          {compactDetails.length >
            0 && (
            <div
              className={`mb-0.5 truncate text-xs font-semibold ${designClasses.textPrimary}`}
            >
              {compactDetails.join(
                " · "
              )}
            </div>
          )}

          <div
            ref={textViewportRef}
            className="relative overflow-hidden"
          >
            <div
              ref={textTrackRef}
              className={`w-max whitespace-nowrap text-sm leading-5 ${designClasses.textDark}`}
            >
              {advertisementText}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {profileId && (
            <button
              type="button"
              onClick={
                handleViewProfile
              }
              className={`hidden rounded-lg px-3 py-1.5 text-xs font-semibold sm:inline-flex ${designClasses.secondaryButton}`}
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
                {currentIndex + 1}/
                {
                  advertisements.length
                }
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
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdvertisementSpotlight;