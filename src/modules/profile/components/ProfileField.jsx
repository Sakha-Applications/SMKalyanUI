import React from "react";
import { designClasses } from "../../../shared/styles/designTokens";

const ProfileField = ({ label, value }) => {
  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "-"
      : value;

  return (
    <div
      className={`rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
    >
      <div
        className={`text-xs font-medium uppercase tracking-wide ${designClasses.textSecondary}`}
      >
        {label}
      </div>

      <div
        className={`mt-1 text-sm font-semibold ${designClasses.textDark}`}
      >
        {displayValue}
      </div>
    </div>
  );
};

export default ProfileField;
