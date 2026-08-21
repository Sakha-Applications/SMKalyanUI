export const getAge = (dob) => {
  if (!dob) {
    return null;
  }

  const birthDate = new Date(dob);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  const birthdayNotReached =
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() <
        birthDate.getDate()
    );

  if (birthdayNotReached) {
    age -= 1;
  }

  return age;
};

export const validateRegistration = (
  formData
) => {
  const errors = {};

  const requiredFields = {
    profileCreatedFor:
      "Profile Created For",
    name: "Name",
    gender: "Gender",
    dob: "Date of Birth",
    motherTongue: "Mother Tongue",
    gotra: "Gotra",
    currentLocation: "Residing City",
    phoneNumber: "Mobile Number",
    email: "Email Address",
    password: "Password",
    confirmPassword:
      "Confirm Password",
    marriedStatus:
  "Marital Status",
heightFeet: "Height Feet",
heightInches: "Height Inches",
education: "Education",
profession: "Profession",
    workingStatus:
      "Working Status",
    annualIncome:
      "Annual Income",
    aboutBrideGroom:
      "About Yourself",
  };

  Object.entries(
    requiredFields
  ).forEach(([field, label]) => {
    const value = formData[field];

    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      errors[field] =
        `${label} is required.`;
    }
  });

  if (formData.email) {
    const email =
      formData.email.trim();

    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      errors.email =
        "Valid email is required.";
    }
  }

if (!formData.profileId) {
  errors.profileId =
    "Unable to generate Profile ID. Please verify the name and mobile number.";
}

  if (formData.phoneNumber) {
    const phone =
      String(
        formData.phoneNumber
      ).trim();

    if (!/^\d{10}$/.test(phone)) {
      errors.phoneNumber =
        "Valid 10-digit phone number is required.";
    }
  }

  if (formData.dob) {
    const age = getAge(
      formData.dob
    );

    if (
      age === null ||
      age < 18
    ) {
      errors.dob =
        "Minimum age must be 18 years.";
    }
  }

  if (
    formData.password &&
    formData.confirmPassword &&
    formData.password !==
      formData.confirmPassword
  ) {
    errors.confirmPassword =
      "Password and Confirm Password must match.";
  }

  if (
    !formData.declarationAccepted
  ) {
    errors.declarationAccepted =
      "Please accept the declaration before creating the profile.";
  }

  return errors;
};

export const getFirstValidationMessage = (
  errors
) => {
  const firstKey =
    Object.keys(errors)[0];

  return firstKey
    ? errors[firstKey]
    : "";
};