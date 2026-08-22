import {
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import BrandHeader from "../../shared/layouts/BrandHeader";
import BrandFooter from "../../shared/layouts/BrandFooter";
import {
  designTokens,
  designClasses,
} from "../../shared/styles/designTokens";
import CollapsibleSection from "../../shared/components/CollapsibleSection";
import useApiData from "../../hooks/useApiData";
import registrationService from "../../services/registrationService";
import authService from "../../services/authService";
import {
  calculateProfileCompletion,
} from "../../shared/utils/profileCompletion";

import useRegistrationAvailability from "./hooks/useRegistrationAvailability";

import {
  preferredAgeRangeConfig,
  preferredHeightRangeConfig,
  preferredIncomeRangeConfig,
} from "../../shared/config/profileOptions";

import BasicDetailsSection from "./components/BasicDetailsSection";
import ContactAccountSection from "./components/ContactAccountSection";
import AboutYouSection from "./components/AboutYouSection";
import PhotoPreferencesSection from "./components/PhotoPreferencesSection";
import ReviewCompleteSection from "./components/ReviewCompleteSection";
import {
  calculateCurrentAgeText,
  deriveProfileFor,
  generateProfileId,
  getLockedGender,
  heightRangeInchesToCm,
  normalizeSelectedValues,
} from "./utils/registrationBusinessRules";

import {
  getFirstValidationMessage,
  validateRegistration,
} from "./validation/registrationValidation";

const initialFormData = {
  // Section 1
  profileCreatedFor: "",
  profileFor: "",
  profileId: "",
  name: "",
  gender: "",
  dob: "",
  motherTongue: "",
  gotra: "",
  currentLocation: "",

  // Section 2
  phoneCountryCode: "+91",
  phoneNumber: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",

  // Section 3
  marriedStatus: "",
  height: "",
  heightFeet: "",
  heightInches: "",
  nativePlace: "",
  education: "",
  profession: "",
  designation: "",
  currentCompany: "",
  annualIncome: "",
  workingStatus: "",
  aboutBrideGroom: "",

  // Section 4
  photo: null,
  ageRange: preferredAgeRangeConfig.defaultValue,
  heightRange: preferredHeightRangeConfig.defaultValue,
  preferredIncomeRange: preferredIncomeRangeConfig.defaultValue,
  preferredMotherTongues: [],
  preferredGotras: [],
  preferredMaritalStatus: "",
  preferredEducation: [],
  preferredCities: [],

  // Section 5
  declarationAccepted: false,
};

const SinglePageRegistration = () => {
  const navigate = useNavigate();

const [formData, setFormData] =
  useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState("basic");
  const {
  availability,
  checking: availabilityChecking,
  clearEmailAvailability,
  clearPhoneAvailability,
  checkEmailAvailability,
  checkPhoneAvailability,
  checkAccountAvailability,
} = useRegistrationAvailability();
  const toggleSection = (sectionName) => {
    setOpenSection((current) =>
      current === sectionName ? null : sectionName
    );
  };
  const {
    isLoading: lookupLoading,
    gotraOptions,
    searchMotherTongues,
    searchPlaces,
    searchEducation,
    searchProfessions,
    searchDesignations,
  } = useApiData();

  
 
  const {
    percentage: completion,
  } = calculateProfileCompletion(formData);

  const basicComplete = Boolean(
    formData.profileCreatedFor &&
      formData.name &&
      formData.gender &&
      formData.dob &&
      formData.motherTongue &&
      formData.gotra &&
      formData.currentLocation
  );

  const accountComplete = Boolean(
    formData.phone &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
  );

const aboutComplete = Boolean(
  formData.marriedStatus &&
    formData.heightFeet &&
    formData.heightInches !== "" &&
    formData.education &&
    formData.profession &&
    formData.workingStatus &&
    formData.annualIncome &&
    formData.aboutBrideGroom
);

  const preferencesComplete = Boolean(
    formData.photo ||
      formData.preferredMotherTongues?.length > 0 ||
      formData.preferredGotras?.length > 0 ||
      formData.preferredMaritalStatus ||
      formData.preferredEducation?.length > 0 ||
      formData.preferredCities?.length > 0
  );

  const updateField = (event) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = event.target;

    setFormData((current) => {
      const next = {
        ...current,
      };

      const nextValue =
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] || null
          : value;

      next[name] = nextValue;

      if (name === "email") {
  clearEmailAvailability();
}

      if (
        name ===
        "profileCreatedFor"
      ) {
        const lockedGender =
          getLockedGender(
            nextValue
          );

        if (lockedGender) {
          next.gender =
            lockedGender;

          next.profileFor =
            deriveProfileFor(
              lockedGender
            );
        }
      }

      if (name === "gender") {
        next.profileFor =
          deriveProfileFor(
            nextValue
          );
      }
    
      return next;
    });
  };

  const setFieldValue = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePhoneChange = (event) => {
    const { name } = event.target;
    clearPhoneAvailability();

    const value =
      name === "phoneNumber"
        ? event.target.value.replace(/\D/g, "")
        : event.target.value;

    setFormData((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      const countryCode =
        name === "phoneCountryCode"
          ? value
          : next.phoneCountryCode || "+91";

      const phoneNumber =
        name === "phoneNumber"
          ? value
          : next.phoneNumber || "";

      next.phone = phoneNumber
  ? `${countryCode}${phoneNumber}`
  : "";


      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let persistedProfileId = "";

    const profileId =
  formData.profileId ||
  generateProfileId(
    formData.name,
    formData.phone
  );

const submissionData = {
  ...formData,
  profileId,
};

const backendProfileData = {
  profileId:
    submissionData.profileId,

  name:
    submissionData.name,

  profileCreatedFor:
    submissionData.profileCreatedFor,

  profileFor:
    submissionData.profileFor,

  motherTongue:
    submissionData.motherTongue,

  currentLocation:
    submissionData.currentLocation,

  profileStatus: "DRAFT",

  marriedStatus:
    submissionData.marriedStatus,

  gotra:
    submissionData.gotra,

  dob:
    submissionData.dob,

  currentAge:
    calculateCurrentAgeText(
      submissionData.dob
    ),

  height:
    submissionData.height,

  heightFeet:
    submissionData.heightFeet,

  heightInches:
    submissionData.heightInches,

  nativePlace:
    submissionData.nativePlace,

  email:
    submissionData.email,

  phone:
    submissionData.phone,

  aboutBrideGroom:
    submissionData.aboutBrideGroom,

  workingStatus:
    submissionData.workingStatus,

  education:
    submissionData.education,

  profession:
    submissionData.profession,

  designation:
    submissionData.designation,

  currentCompany:
    submissionData.currentCompany,

  annualIncome:
    submissionData.annualIncome,

  ageRange:
    submissionData.ageRange,

  heightRange:
    heightRangeInchesToCm(
      submissionData.heightRange
    ),

  preferredIncomeRange:
    submissionData.preferredIncomeRange,

  preferredEducation:
    normalizeSelectedValues(
      submissionData.preferredEducation
    ),

  preferredMotherTongues:
    normalizeSelectedValues(
      submissionData.preferredMotherTongues
    ),

  preferredMaritalStatus:
    submissionData.preferredMaritalStatus,

  preferredGotras:
    normalizeSelectedValues(
      submissionData.preferredGotras
    ),

  preferredCities:
    normalizeSelectedValues(
      submissionData.preferredCities
    ),
};

const validationErrors =
  validateRegistration(
    submissionData
  );

  if (
    Object.keys(
      validationErrors
    ).length > 0
  ) {
    const message =
      getFirstValidationMessage(
        validationErrors
      );

    window.alert(message);

    const basicFields = [
      "profileCreatedFor",
      "name",
      "gender",
      "dob",
      "motherTongue",
      "gotra",
      "currentLocation",
    ];

    const accountFields = [
  "phoneNumber",
  "profileId",
  "email",
  "password",
  "confirmPassword",
];

    const aboutFields = [
  "marriedStatus",
  "heightFeet",
  "heightInches",
  "education",
  "profession",
  "workingStatus",
  "annualIncome",
  "aboutBrideGroom",
];

    const firstError =
      Object.keys(
        validationErrors
      )[0];

    if (
      basicFields.includes(
        firstError
      )
    ) {
      setOpenSection("basic");
    } else if (
      accountFields.includes(
        firstError
      )
    ) {
      setOpenSection("account");
    } else if (
      aboutFields.includes(
        firstError
      )
    ) {
      setOpenSection("about");
    } else {
      setOpenSection("review");
    }

    return;
  }

    setSubmitting(true);

    try {
      const preflight =
        await checkAccountAvailability({
          email: submissionData.email,
          phoneCountryCode:
            submissionData.phoneCountryCode,
          phoneNumber:
            submissionData.phoneNumber,
        });

      if (preflight?.email?.exists) {
        window.alert(
          'This email is already registered. Please login with this email and use "Forgot Password" if needed.'
        );

        setOpenSection("account");
        return;
      }

      if (preflight?.phone?.exists) {
        window.alert(
          "This phone number is already registered. Please login with this number."
        );

        setOpenSection("account");
        return;
      }

      const profileExists =
        await registrationService.checkProfileExists(
          submissionData.profileId
        );

      if (profileExists) {
        window.alert(
          "The generated Profile ID already exists. Please try again."
        );

        setOpenSection("account");
        return;
      }

const profileResponse =
  await registrationService.createProfile({
    profileData: {
      ...backendProfileData,
      profileStatus: "DRAFT",
    },
  });

const createdProfileId =
  profileResponse?.profileId;

  persistedProfileId =
  createdProfileId;

if (!createdProfileId) {
  throw new Error(
    "Profile creation succeeded without returning a Profile ID."
  );
}

await registrationService.createLogin({
  profileId:
    createdProfileId,

  user_id:
    submissionData.email,

  password:
    submissionData.password,

  role: "USER",

  is_active: "Yes",

  notes: "",
});

let photoUploadFailed = false;

if (submissionData.photo) {
  try {
    await registrationService.uploadProfilePhoto({
      profileId:
        createdProfileId,

      email:
        submissionData.email,

      photo:
        submissionData.photo,

      isDefault: true,
    });
  } catch (photoError) {
    photoUploadFailed = true;

    console.error(
      "Profile photo upload failed:",
      photoError
    );
  }
}

const loginResponse =
  await authService.login({
    userId:
      submissionData.email,

    password:
      submissionData.password,
  });

const token =
  loginResponse?.token;

if (!token) {
  throw new Error(
    "Profile was created, but automatic login could not be completed."
  );
}

sessionStorage.setItem(
  "token",
  token
);

sessionStorage.setItem(
  "isLoggedIn",
  "true"
);

sessionStorage.setItem(
  "profileId",
  createdProfileId
);

sessionStorage.setItem(
  "profileStatus",
  "DRAFT"
);

sessionStorage.setItem(
  "userEmail",
  submissionData.email
);

let role = (
  loginResponse?.user?.role ||
  loginResponse?.role ||
  ""
).toString();

try {
  if (
    !role &&
    token
  ) {
    const payloadBase64 =
      token.split(".")[1];

    const payloadJson =
      JSON.parse(
        atob(
          payloadBase64
        )
      );

    role = (
      payloadJson?.role ||
      ""
    ).toString();
  }
} catch (roleError) {
  console.warn(
    "Unable to resolve user role from login response:",
    roleError
  );
}

if (role) {
  sessionStorage.setItem(
    "userRole",
    role
  );
}


setFormData((current) => ({
  ...current,
  profileId:
    createdProfileId,
}));

const successLines = [
  "Profile created successfully.",
  "",
  `Profile ID: ${createdProfileId}`,
  `Name: ${submissionData.name}`,
  `Login ID: ${submissionData.email}`,
  "Password: Use the password entered during registration.",
];

if (photoUploadFailed) {
  successLines.push(
    "",
    "Your profile was created successfully, but the profile photo could not be uploaded. You can upload it later from My Profile."
  );
}

window.alert(
  successLines.join("\n")
);
navigate(
  "/dashboard",
  {
    replace: true,
  }
);

    } catch (error) {
      console.error(
  "Registration failed:",
  error
);

      const serverMessage =
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.response?.data?.details ||
  error?.message;

if (persistedProfileId) {
  window.alert(
    [
      "Your profile has been created.",
      "",
      `Profile ID: ${persistedProfileId}`,
      `Login ID: ${submissionData.email}`,
      "",
      "Automatic sign-in could not be completed.",
      "Please use the Member Login screen with the password you entered during registration.",
    ].join("\n")
  );
} else {
  window.alert(
    serverMessage
      ? `Registration could not be completed: ${serverMessage}`
      : "Registration could not be completed. Please try again."
  );
}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
  className="flex min-h-screen flex-col"
  style={{ backgroundColor: designTokens.colors.page }}
>
      <BrandHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Kalyana Sakha
            </p>

            <h1
  className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl"
  style={{ color: designTokens.colors.primary }}
>
              Create Your Profile
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Tell us the essential details needed to create your profile and
              help you discover meaningful matches.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-amber-200 bg-white px-5 py-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">
                Registration progress
              </span>

              <span
  className="text-sm font-semibold"
  style={{ color: designTokens.colors.primary }}
>
                {completion}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <CollapsibleSection
              number="1"
              title="Basic Details"
              description="Start with the essential information used to identify and match the profile."
              open={openSection === "basic"}
              completed={basicComplete}
              onToggle={() => toggleSection("basic")}
            >
              <BasicDetailsSection
  formData={formData}
  updateField={updateField}
  setFieldValue={setFieldValue}
  lookupLoading={lookupLoading}
  gotraOptions={gotraOptions}
  searchMotherTongues={searchMotherTongues}
  searchPlaces={searchPlaces}
/>
            </CollapsibleSection>

<CollapsibleSection
  number="2"
  title="Contact & Account"
  description="Your contact information is used for secure account access and communication."
  open={openSection === "account"}
  completed={accountComplete}
  onToggle={() => toggleSection("account")}
>
  <ContactAccountSection
  formData={formData}
  updateField={updateField}
  handlePhoneChange={
    handlePhoneChange
  }
  availability={availability}
  availabilityChecking={
    availabilityChecking
  }
  onEmailBlur={() =>
    checkEmailAvailability(
      formData.email
    )
  }
  onPhoneBlur={() =>
    checkPhoneAvailability(
      formData.phoneCountryCode,
      formData.phoneNumber
    )
  }
/>
</CollapsibleSection>

<CollapsibleSection
  number="3"
  title="About You"
  description="Add a concise professional and personal introduction."
  open={openSection === "about"}
  completed={aboutComplete}
  onToggle={() =>
    toggleSection("about")
  }
>
  <AboutYouSection
    formData={formData}
    updateField={updateField}
    setFieldValue={setFieldValue}
    searchPlaces={searchPlaces}
    searchEducation={searchEducation}
    searchProfessions={
      searchProfessions
    }
    searchDesignations={
      searchDesignations
    }
  />
</CollapsibleSection>

<CollapsibleSection
  number="4"
  title="Photo & Partner Expectations"
  description="Add a profile photo and the most important criteria for your search."
  open={
    openSection === "preferences"
  }
  completed={preferencesComplete}
  onToggle={() =>
    toggleSection("preferences")
  }
>
  <PhotoPreferencesSection
    formData={formData}
    updateField={updateField}
    setFieldValue={setFieldValue}
    lookupLoading={lookupLoading}
    gotraOptions={gotraOptions}
    searchMotherTongues={
      searchMotherTongues
    }
    searchEducation={
      searchEducation
    }
    searchPlaces={searchPlaces}
  />
</CollapsibleSection>

<CollapsibleSection
  number="5"
  title="Review & Complete"
  description="Confirm the key information before creating the profile."
  open={openSection === "review"}
  completed={
    formData.declarationAccepted
  }
  onToggle={() =>
    toggleSection("review")
  }
>
  <ReviewCompleteSection
    formData={formData}
    updateField={updateField}
  />
</CollapsibleSection>

            <div className="flex flex-col-reverse items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
              <p className="text-sm text-slate-500">
                You can complete additional family and horoscope details after
                registration.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full rounded-xl px-7 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${designClasses.primaryButton}`}
              >
                {submitting ? "Creating Profile..." : "Create My Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BrandFooter />
    </div>
  );
};

export default SinglePageRegistration;