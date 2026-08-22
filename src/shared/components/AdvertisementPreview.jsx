import React from "react";

import {
  designClasses,
} from "../styles/designTokens";

const getHeadingClass = (
  heading
) => {
  if (
    heading ===
    "Looking for a Bride"
  ) {
    return designClasses.advertisementBrideHeading;
  }

  if (
    heading ===
    "Looking for a Bridegroom"
  ) {
    return designClasses.advertisementBridegroomHeading;
  }

  return designClasses.textPrimary;
};

const AdvertisementPreview = ({
  heading,
  text,
  editable = false,
  onChange,
  rows = 7,
  muted = false,
}) => {
  return (
    <div
      className={
        muted
          ? designClasses.advertisementPreview
          : designClasses.advertisementEditor
      }
    >
      {heading && (
        <div
          className={`${designClasses.advertisementHeading} ${getHeadingClass(
            heading
          )}`}
        >
          {heading}
        </div>
      )}

      {editable ? (
        <textarea
          value={text || ""}
          onChange={(event) =>
            onChange?.(
              event.target.value
            )
          }
          rows={rows}
          aria-label="Advertisement"
          className={
            designClasses.advertisementEditorBody
          }
        />
      ) : (
        <p
          className={
            designClasses.advertisementBody
          }
        >
          {text || ""}
        </p>
      )}
    </div>
  );
};

export default AdvertisementPreview;