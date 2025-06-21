import { Country, State } from 'country-state-city';

export const cmToFeetInches = (cm) => {
  const inchesTotal = Math.round(cm / 2.54);
  const feet = Math.floor(inchesTotal / 12);
  const inches = inchesTotal % 12;
  return `${feet}ft ${inches}in`;
};

export const normalizeDisplayArray = (arr, fieldName = "") => {
  try {
    if (!arr) return "-";
    if (typeof arr === "string") return arr;
    if (!Array.isArray(arr)) return "-";

    const isLocationField =
      fieldName === "preferred_native_origins" || fieldName === "preferred_cities";

    const values = arr.map((item) => {
      if (isLocationField && typeof item === "string" && item.includes("/")) {
        const [countryCode, stateCode, city] = item.split("/");
        const country = Country.getCountryByCode(countryCode)?.name || countryCode;
        const state = State.getStateByCodeAndCountry(stateCode, countryCode)?.name || stateCode;
        return `${country} / ${state} / ${city}`;
      }

      if (typeof item === "object" && item !== null) {
        return item.label || item.value || "";
      }

      return item;
    }).filter(Boolean);

    return values.length ? values.join(", ") : "-";
  } catch (err) {
    console.error("🛑 normalizeDisplayArray error:", err);
    return "-";
  }
};

export const formatDisplayValue = (value) => {
  if (!value) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value.split(",").map(s => s.trim()).join(", ");
  return value;
};

// helpers/utils.js - Updated formatSelectedValues function

export const formatSelectedValues = (data, fieldName) => {
  const value = data[fieldName];

  if (!value) return [];

  // If it's a comma-separated string from DB, convert to array
  let processedValue = [];
  if (typeof value === 'string') {
    processedValue = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item);
  } else if (Array.isArray(value)) {
    processedValue = value.filter(item => item);
  } else {
    return [];
  }

  // Normalize to { label, value } format
  return processedValue.map(item => {
    if (typeof item === 'object' && item !== null && 'label' in item && 'value' in item) {
      return item;
    }
    const str = typeof item === 'string' ? item : JSON.stringify(item);
    return { label: str, value: str };
  });
};
