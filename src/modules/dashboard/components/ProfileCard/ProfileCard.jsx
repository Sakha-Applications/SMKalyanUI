import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  designClasses,
} from "../../../../shared/styles/designTokens";

const FALLBACK_DEFAULT_IMAGE =
  "/ProfilePhotos/defaultImage.jpg";

const ProfileCard = ({
  profile,
  imageUrl,
  onCardClick,
}) => {
  const {
    profile_id,
    name,
    current_age,
    height,
    current_location,
    gotra,
    photos,
  } = profile;

  const photoList =
    useMemo(() => {
      const list = [];

      if (
        Array.isArray(photos) &&
        photos.length > 0
      ) {
        photos.forEach((photo) => {
          if (
            photo &&
            typeof photo === "string"
          ) {
            list.push(photo);
          }
        });
      }

      if (
        imageUrl &&
        typeof imageUrl === "string" &&
        !list.includes(imageUrl)
      ) {
        list.push(imageUrl);
      }

      if (list.length === 0) {
        list.push(
          FALLBACK_DEFAULT_IMAGE
        );
      }

      return list;
    }, [photos, imageUrl]);

  const [
    photoIndex,
    setPhotoIndex,
  ] = useState(0);

  useEffect(() => {
    setPhotoIndex(0);
  }, [profile_id]);

  const currentPhotoSrc =
    photoList[photoIndex] ||
    FALLBACK_DEFAULT_IMAGE;

  const hasMultiplePhotos =
    photoList.length > 1;

  const handleNext = (
    event
  ) => {
    event.stopPropagation();

    setPhotoIndex(
      (previous) =>
        (previous + 1) %
        photoList.length
    );
  };

  const handlePrev = (
    event
  ) => {
    event.stopPropagation();

    setPhotoIndex(
      (previous) =>
        previous === 0
          ? photoList.length - 1
          : previous - 1
    );
  };

  const handleCardClick =
    () => {
      onCardClick?.(
        profile_id
      );
    };

  return (
    <article
      onClick={
        handleCardClick
      }
      className={`${designClasses.card} w-[95%] max-w-[300px] shrink-0 cursor-pointer p-4 transition hover:-translate-y-1 hover:shadow-md sm:w-[240px]`}
    >
      <div className="flex flex-col items-center">
        <div
          className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 ${designClasses.border} ${designClasses.surfaceMuted}`}
        >
          <img
            src={currentPhotoSrc}
            alt={
              name ||
              "Member profile"
            }
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.onerror =
                null;

              event.currentTarget.src =
                FALLBACK_DEFAULT_IMAGE;
            }}
          />

          {hasMultiplePhotos && (
            <div
              className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-1.5"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                onClick={
                  handlePrev
                }
                aria-label="Previous photo"
                title="Previous photo"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white">
                {photoIndex + 1}/
                {photoList.length}
              </span>

              <button
                type="button"
                onClick={
                  handleNext
                }
                aria-label="Next photo"
                title="Next photo"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 w-full text-center">
          <h3
            className={`truncate text-base font-semibold ${designClasses.textPrimary}`}
          >
            {name || "Member"}
          </h3>

          <div
            className={`mt-2 space-y-1 text-sm ${designClasses.textSecondary}`}
          >
            <p>
              <span
                className={`font-medium ${designClasses.textDark}`}
              >
                Age:
              </span>{" "}
              {current_age
                ? `${parseInt(
                    current_age,
                    10
                  )} yrs`
                : "N/A"}
            </p>

            <p>
              <span
                className={`font-medium ${designClasses.textDark}`}
              >
                Height:
              </span>{" "}
              {height || "N/A"}
            </p>

            <p>
              <span
                className={`font-medium ${designClasses.textDark}`}
              >
                Location:
              </span>{" "}
              {current_location ||
                "N/A"}
            </p>

            {gotra && (
              <p>
                <span
                  className={`font-medium ${designClasses.textDark}`}
                >
                  Gotra:
                </span>{" "}
                {gotra}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              onCardClick?.(
                profile_id
              );
            }}
            className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold transition ${designClasses.primaryButton}`}
          >
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;