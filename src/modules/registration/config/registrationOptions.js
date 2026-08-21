export const profileForOptions = [
  { value: "SELF", label: "Self" },
  { value: "SON", label: "Son" },
  { value: "DAUGHTER", label: "Daughter" },
  { value: "BROTHER", label: "Brother" },
  { value: "SISTER", label: "Sister" },
  { value: "RELATIVE", label: "Relative" },
];

export const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export const maritalStatusOptions = [
  "Single (Never Married)",
  "Divorced",
  "Separated",
  "Widowed",
];

export const heightFeetOptions = [4, 5, 6, 7];

export const heightInchOptions = Array.from(
  { length: 12 },
  (_, index) => index
);

export const preferredAgeOptions = Array.from(
  { length: 43 },
  (_, index) => 18 + index
);

export const heightOptions = heightFeetOptions.flatMap((feet) =>
  heightInchOptions.map((inches) => ({
    value: `${feet}-${inches}`,
    label: `${feet} ft ${inches} in`,
    feet,
    inches,
  }))
);

export const preferredAgeRangeConfig = {
  min: 18,
  max: 60,
  defaultValue: [25, 35],
  step: 1,
};

export const preferredHeightRangeConfig = {
  min: 48,
  max: 84,
  defaultValue: [60, 72],
  step: 1,
};

export const preferredIncomeRangeConfig = {
  min: 0,
  max: 100,
  defaultValue: [5, 20],
  step: 1,
};

export const subCasteOptions = [
  "Madhva (ಮಾಧ್ವ)",
  "Smarta (ಸ್ಮಾರ್ತ)",
  "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)",
  "Others (ಇತರರು)",
];

export const brideGroomCategoryOptions = [
  "Domestic-India",
  "International",
  "Vaidik",
  "Anyone",
];

export const formatHeightValue = (totalInches) => {
  const numericValue = Number(totalInches);

  if (!Number.isFinite(numericValue)) {
    return "";
  }

  const feet = Math.floor(numericValue / 12);
  const inches = numericValue % 12;

  return `${feet} ft ${inches} in`;
};