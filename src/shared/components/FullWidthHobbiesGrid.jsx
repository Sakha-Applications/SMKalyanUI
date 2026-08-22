// Shared full-width hobbies grid.

import React from "react";
import {
  generalHobbyOptions,
  spiritualActivityOptions,
} from "../config/hobbyOptions";

import {
  designClasses,
} from "../styles/designTokens";

const FullWidthHobbiesGrid = ({ label = "Hobbies", fieldName, formData, handleChange }) => {
  const normalizeHobbyValue = (value) => {
    if (
      typeof value === "object" &&
      value !== null
    ) {
      return String(
        value.label ??
          value.value ??
          value.name ??
          ""
      ).trim();
    }

    return String(
      value ?? ""
    ).trim();
  };

  // Always work with plain hobby labels.
  const current = Array.isArray(
    formData?.[fieldName]
  )
    ? formData[fieldName]
        .map(normalizeHobbyValue)
        .filter(Boolean)
    : [];

  // Utility to toggle selection
  const toggle = (itemLabel, isChecked) => {
    let next = isChecked
      ? current.filter((h) => String(h).trim().toLowerCase() !== itemLabel.toLowerCase())
      : [...current, itemLabel];

    const norm = (x) =>
      normalizeHobbyValue(x)
        .toLowerCase();

    const pick = (x) =>
      normalizeHobbyValue(x);

    const uniqueValues = [...new Map(next.map((v) => [norm(v), pick(v)])).values()];

    handleChange({
      target: { name: fieldName, value: uniqueValues },
    });
  };

  return (
    <div className="md:col-span-2">
      <label
  className={`mb-2 block font-semibold ${designClasses.textPrimary}`}
>
  {label}
</label>

      <div
  className={`max-h-64 overflow-y-auto rounded-lg border p-3 ${designClasses.border} ${designClasses.surface}`}
>
        <div className="grid grid-cols-2 gap-6">
          
          {/* ---------- COLUMN 1 ---------- */}
          <div>
            <div
  className={`mb-2 font-semibold ${designClasses.textPrimary}`}
>General Hobbies</div>
            <div className="space-y-1">
              {generalHobbyOptions.map((opt, idx) => {
                const itemLabel = String(opt.label ?? opt).trim();
                const isChecked = current
  .map((h) =>
    normalizeHobbyValue(h)
      .toLowerCase()
  )
  .includes(
    itemLabel.toLowerCase()
  );

                return (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-start space-x-2 rounded-md px-2 py-1 text-sm ${designClasses.textPrimary}`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={isChecked}
                      onChange={() => toggle(itemLabel, isChecked)}
                    />
                    <span className="whitespace-normal break-words">{itemLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ---------- COLUMN 2 ---------- */}
          <div>
            <div
  className={`mb-2 font-semibold ${designClasses.textPrimary}`}
>Spiritual & Activities</div>
            <div className="space-y-1">
              {spiritualActivityOptions.map((opt, idx) => {
                const itemLabel = String(opt.label ?? opt).trim();
                const isChecked = current
  .map((h) =>
    normalizeHobbyValue(h)
      .toLowerCase()
  )
  .includes(
    itemLabel.toLowerCase()
  );

                return (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-start space-x-2 rounded-md px-2 py-1 text-sm ${designClasses.textPrimary}`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={isChecked}
                      onChange={() => toggle(itemLabel, isChecked)}
                    />
                    <span className="whitespace-normal break-words">{itemLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FullWidthHobbiesGrid;
