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
        "nativePlace",
        "Native Place",
        [
          "native_place",
        ]
      ),

      field(
        "currentLocation",
        "Residing City",
        [
          "current_location",
          "residingCity",
          "residing_city",
          "currentCity",
          "current_city",
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
        "height",
        "Height",
        [
          "heightFeet",
          "height_feet",
          "heightInches",
          "height_inches",
        ]
      ),

      field(
        "profileCategory",
        "Bride/Groom Category",
        [
          "profile_category",
        ]
      ),

      field(
        "aboutBrideGroom",
        "About Yourself",
        [
          "about_bride_groom",
          "aboutYourself",
          "about_yourself",
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
    id: "family",
    title: "Family Details",
    fields: [
      field(
        "fatherName",
        "Father's Name",
        [
          "father_name",
        ]
      ),

      field(
        "motherName",
        "Mother's Name",
        [
          "mother_name",
        ]
      ),

      field(
        "noOfBrothers",
        "Number of Brothers",
        [
          "no_of_brothers",
        ]
      ),

      field(
        "noOfSisters",
        "Number of Sisters",
        [
          "no_of_sisters",
        ]
      ),

      field(
        "familyStatus",
        "Family Status",
        [
          "family_status",
        ]
      ),

      field(
        "familyType",
        "Family Type",
        [
          "family_type",
        ]
      ),

      field(
        "familyValues",
        "Family Values",
        [
          "family_values",
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

      field(
        "rashi",
        "Rashi"
      ),

      field(
        "nakshatra",
        "Nakshatra"
      ),

      field(
        "charanaPada",
        "Charana / Pada",
        [
          "charana_pada",
        ]
      ),

      field(
        "subCaste",
        "Sub Caste",
        [
          "sub_caste",
        ]
      ),

      field(
        "guruMatha",
        "Guru Matha",
        [
          "guru_matha",
        ]
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

      field(
        "communicationAddress",
        "Communication Address",
        [
          "communication_address",
        ]
      ),

      field(
        "residenceAddress",
        "Residence Address",
        [
          "residence_address",
        ]
      ),
    ],
  },

  {
    id: "references",
    title: "References",
    fields: [
      field(
        "reference1Name",
        "Reference 1 Name",
        [
          "reference1_name",
        ]
      ),

      field(
        "reference1Phone",
        "Reference 1 Phone",
        [
          "reference1_phone",
          "reference1PhoneNumber",
          "reference1_phone_number",
        ]
      ),

      field(
        "reference2Name",
        "Reference 2 Name",
        [
          "reference2_name",
        ]
      ),

      field(
        "reference2Phone",
        "Reference 2 Phone",
        [
          "reference2_phone",
          "reference2PhoneNumber",
          "reference2_phone_number",
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
