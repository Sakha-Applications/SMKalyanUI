export const profileForOptions = [
  { value: "Self", label: "Myself" },
  { value: "Son", label: "My Son" },
  { value: "Daughter", label: "My Daughter" },
  {
    value: "Sibling",
    label: "My Sibling (Brother/Sister)",
  },
  { value: "Relatives", label: "My Relative" },
  { value: "Friends", label: "My Friend" },
];

export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const maritalStatusOptions = [
  {
    value: "Single (Never Married)",
    label: "Single (Never Married)",
  },
  {
    value: "Divorced",
    label: "Divorced",
  },
  {
    value: "Separated",
    label: "Separated",
  },
  {
    value: "Widowed",
    label: "Widowed",
  },
];

export const preferredMaritalStatusOptions = [
  ...maritalStatusOptions,
  {
    value: "Anyone",
    label: "Anyone",
  },
];

export const brideGroomCategoryOptions = [
  {
    value: "Domestic-India",
    label: "Domestic-India",
  },
  {
    value: "International",
    label: "International",
  },
  {
    value: "Vaidika",
    label: "Vaidika",
  },
  {
    value: "Anyone",
    label: "Anyone",
  },
];

export const charanaPadaOptions = [
  {
    value: "1st Pada",
    label: "1st Pada",
  },
  {
    value: "2nd Pada",
    label: "2nd Pada",
  },
  {
    value: "3rd Pada",
    label: "3rd Pada",
  },
  {
    value: "4th Pada",
    label: "4th Pada",
  },
];

export const subCasteOptions = [
  {
    value: "Madhva (ಮಾಧ್ವ)",
    label: "Madhva (ಮಾಧ್ವ)",
  },
  {
    value: "Smarta (ಸ್ಮಾರ್ತ)",
    label: "Smarta (ಸ್ಮಾರ್ತ)",
  },
  {
    value: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)",
    label: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)",
  },
  {
    value: "Others (ಇತರರು)",
    label: "Others (ಇತರರು)",
  },
];
export const heightFeetOptions = [4, 5, 6, 7].map((feet) => ({
  value: String(feet),
  label: `${feet} ft`,
}));

export const heightInchOptions = Array.from(
  { length: 12 },
  (_, inches) => ({
    value: String(inches),
    label: `${inches} in`,
  })
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

export const workingStatusOptions = [
  {
    value: "Working in Private Company",
    label: "Working in Private Company",
  },
  {
    value: "Working in Government / Public Sector",
    label: "Working in Government / Public Sector",
  },
  {
    value: "Business / Self Employed",
    label: "Business / Self Employed",
  },
  {
    value: "Defense / Civil Services",
    label: "Defense / Civil Services",
  },
  {
    value: "Not working",
    label: "Not working",
  },
  {
    value: "Others",
    label: "Others",
  },
];

export const annualIncomeOptions = [
  {
    value: "Below ₹2 Lakh",
    label: "Below ₹2 Lakh",
  },
  {
    value: "₹2 to ₹4 Lakh",
    label: "₹2 to ₹4 Lakh",
  },
  {
    value: "₹4 to ₹6 Lakh",
    label: "₹4 to ₹6 Lakh",
  },
  {
    value: "₹6 to ₹10 Lakh",
    label: "₹6 to ₹10 Lakh",
  },
  {
    value: "₹10 to ₹15 Lakh",
    label: "₹10 to ₹15 Lakh",
  },
  {
    value: "₹15 to ₹25 Lakh",
    label: "₹15 to ₹25 Lakh",
  },
  {
    value: "₹25 to ₹50 Lakh",
    label: "₹25 to ₹50 Lakh",
  },
  {
    value: "₹50 Lakh to ₹1 Crore",
    label: "₹50 Lakh to ₹1 Crore",
  },
  {
    value: "Above ₹1 Crore",
    label: "Above ₹1 Crore",
  },
];
export const formatHeightValue = (totalInches) => {
  const value = Number(totalInches);

  if (!Number.isFinite(value)) {
    return "";
  }

  const feet = Math.floor(value / 12);
  const inches = value % 12;

  return `${feet} ft ${inches} in`;
};

export const formatHeightForApi = (totalInches) => {
  const value = Number(totalInches);

  if (!Number.isFinite(value)) {
    return "";
  }

  const feet = Math.floor(value / 12);
  const inches = value % 12;

  return `${feet}'${inches}"`;
};
export const hobbyOptions = [
  { label: "Reading", value: "Reading" },
  { label: "Traveling", value: "Traveling" },
  { label: "Music", value: "Music" },
  { label: "Sports", value: "Sports" },
  { label: "Art & Craft", value: "Art & Craft" },
  { label: "Cooking", value: "Cooking" },
  { label: "Meditation", value: "Meditation" },
  { label: "Gardening", value: "Gardening" },
  { label: "Photography", value: "Photography" },
];

export const dietOptions = [
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Eggetarian", value: "Eggetarian" },
  { label: "Non-Vegetarian", value: "Non-Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "Doesn't Matter", value: "Doesn't Matter" },
];

export const lookingForOptions = [
  { value: "Bride", label: "Bride" },
  { value: "Bridegroom", label: "Bridegroom" },
];