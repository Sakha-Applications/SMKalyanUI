const isMeaningfulValue = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    const displayValue =
      value.label ??
      value.name ??
      value.value ??
      "";

    return String(displayValue).trim() !== "";
  }

  return String(value).trim() !== "";
};

const getFirstValue = (profile, fieldNames = []) => {
  for (const fieldName of fieldNames) {
    const value = profile?.[fieldName];

    if (isMeaningfulValue(value)) {
      return value;
    }
  }

  return "";
};

const field = (
  key,
  label,
  aliases = []
) => ({
  key,
  label,
  aliases: [key, ...aliases],
});

/*
 * Profile information completeness is intentionally separate
 * from registration submission validation.
 *
 * Do NOT include:
 * - password
 * - confirmPassword
 * - declarationAccepted
 *
 */
export const PROFILE_COMPLETION_SECTIONS = [
  {
    id: "personal",
    title: "Personal Details",
    fields: [
      field(
        "profileCreatedFor",
        "Profile Created For",
        [
          "profile_created_for",
          "profileFor",
          "profile_for",
        ]
      ),
      field(
        "name",
        "Name"
      ),
      field(
        "gender",
        "Gender"
      ),
      field(
        "dob",
        "Date of Birth",
        [
          "dateOfBirth",
          "date_of_birth",
        ]
      ),
      field(
        "motherTongue",
        "Mother Tongue",
        [
          "mother_tongue",
        ]
      ),
      field(
        "currentLocation",
        "Residing City",
        [
          "current_location",
          "residingCity",
        ]
      ),
      field(
        "marriedStatus",
        "Marital Status",
        [
          "married_status",
          "maritalStatus",
        ]
      ),
      field(
        "heightFeet",
        "Height - Feet",
        [
          "height_feet",
        ]
      ),
      field(
        "heightInches",
        "Height - Inches",
        [
          "height_inches",
        ]
      ),
      field(
        "aboutBrideGroom",
        "About Yourself",
        [
          "about_bride_groom",
          "aboutYourself",
        ]
      ),
    ],
  },

  {
    id: "career",
    title: "Education & Career",
    fields: [
      field(
        "education",
        "Education"
      ),
      field(
        "profession",
        "Profession"
      ),
      field(
        "workingStatus",
        "Working Status",
        [
          "working_status",
        ]
      ),
      field(
        "annualIncome",
        "Annual Income",
        [
          "annual_income",
        ]
      ),
    ],
  },

  {
    id: "horoscope",
    title: "Horoscope & Cultural Details",
    fields: [
      field(
        "gotra",
        "Gotra"
      ),
    ],
  },

  {
    id: "contact",
    title: "Contact & Address",
    fields: [
      field(
        "phoneNumber",
        "Mobile Number",
        [
          "phone",
          "phone_number",
        ]
      ),
      field(
        "email",
        "Email Address",
        [
          "email_id",
        ]
      ),
    ],
  },
];

export const calculateProfileCompletion = (
  profile = {}
) => {
  const missingFields = [];
  const pendingSections = [];

  let completedCount = 0;
  let totalRequired = 0;

  const sections = PROFILE_COMPLETION_SECTIONS.map(
    (section) => {
      const sectionMissingFields = [];
      let sectionCompletedCount = 0;

      section.fields.forEach((definition) => {
        totalRequired += 1;

        const value = getFirstValue(
          profile,
          definition.aliases
        );

        if (isMeaningfulValue(value)) {
          completedCount += 1;
          sectionCompletedCount += 1;
        } else {
          const missingField = {
            key: definition.key,
            label: definition.label,
            sectionId: section.id,
            sectionTitle: section.title,
          };

          missingFields.push(missingField);
          sectionMissingFields.push(
            missingField
          );
        }
      });

      const sectionTotal =
        section.fields.length;

      const sectionPercentage =
        sectionTotal === 0
          ? 100
          : Math.round(
              (sectionCompletedCount /
                sectionTotal) *
                100
            );

      const result = {
        id: section.id,
        title: section.title,
        completedCount:
          sectionCompletedCount,
        totalRequired: sectionTotal,
        percentage: sectionPercentage,
        isComplete:
          sectionMissingFields.length === 0,
        missingFields:
          sectionMissingFields,
      };

      if (!result.isComplete) {
        pendingSections.push({
          id: result.id,
          title: result.title,
          completedCount:
            result.completedCount,
          totalRequired:
            result.totalRequired,
          percentage:
            result.percentage,
          missingFields:
            result.missingFields,
        });
      }

      return result;
    }
  );

  const percentage =
    totalRequired === 0
      ? 100
      : Math.round(
          (completedCount /
            totalRequired) *
            100
        );

  return {
    percentage,
    completedCount,
    totalRequired,
    missingFields,
    pendingSections,
    sections,
    isComplete:
      missingFields.length === 0,
  };
};

export default calculateProfileCompletion;
