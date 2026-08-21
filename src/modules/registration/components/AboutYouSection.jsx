import AutocompleteField from "../../../shared/forms/AutocompleteField";

import {
  annualIncomeOptions,
  heightFeetOptions,
  heightInchOptions,
  maritalStatusOptions,
  workingStatusOptions,
} from "../../../shared/config/profileOptions";

const inputClassName =
  "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

const Field = ({
  label,
  required = false,
  children,
}) => (
  <label className="block text-sm font-medium text-slate-700">
    <span>
      {label}

      {required && (
        <span className="ml-1 text-red-600">
          *
        </span>
      )}
    </span>

    {children}
  </label>
);

const TextInput = ({
  label,
  name,
  formData,
  updateField,
}) => (
  <Field label={label}>
    <input
      name={name}
      value={formData[name] || ""}
      onChange={updateField}
      className={inputClassName}
    />
  </Field>
);

const AboutYouSection = ({
  formData,
  updateField,
  setFieldValue,
  searchPlaces,
  searchEducation,
  searchProfessions,
  searchDesignations,
}) => {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Marital Status"
          required
        >
          <select
            name="marriedStatus"
            value={formData.marriedStatus}
            onChange={updateField}
            className={inputClassName}
          >
            <option value="">
              Select marital status
            </option>

            {maritalStatusOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </Field>

        <Field
  label="Height"
  required
>
          <div className="grid grid-cols-2 gap-2">
            <select
              name="heightFeet"
              value={formData.heightFeet}
              onChange={(event) => {
                updateField(event);

                const feet =
                  event.target.value;

const inches =
  formData.heightInches;

setFieldValue(
  "height",
  feet && inches !== ""
    ? `${feet}'${inches}"`
    : ""
);
              }}
              className={inputClassName}
            >
              <option value="">
                Feet
              </option>

              {heightFeetOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            <select
              name="heightInches"
              value={formData.heightInches}
              onChange={(event) => {
                updateField(event);

                const inches =
                  event.target.value;

setFieldValue(
  "height",
  formData.heightFeet &&
    inches !== ""
    ? `${formData.heightFeet}'${inches}"`
    : ""
);
              }}
              className={inputClassName}
            >
              <option value="">
                Inches
              </option>

              {heightInchOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>
        </Field>

        <AutocompleteField
          label="Native Place"
          value={formData.nativePlace}
          searchFn={searchPlaces}
          placeholder="Start typing native place"
          onChange={(value) =>
            setFieldValue(
              "nativePlace",
              value
            )
          }
        />

        <AutocompleteField
          label="Education"
          required
          value={formData.education}
          searchFn={searchEducation}
          placeholder="Start typing education"
          onChange={(value) =>
            setFieldValue(
              "education",
              value
            )
          }
        />

        <AutocompleteField
          label="Profession"
          required
          value={formData.profession}
          searchFn={searchProfessions}
          placeholder="Start typing profession"
          onChange={(value) =>
            setFieldValue(
              "profession",
              value
            )
          }
        />

        <AutocompleteField
          label="Designation"
          value={formData.designation}
          searchFn={searchDesignations}
          placeholder="Start typing designation"
          onChange={(value) =>
            setFieldValue(
              "designation",
              value
            )
          }
        />

        <TextInput
          label="Current Company"
          name="currentCompany"
          formData={formData}
          updateField={updateField}
        />

<Field
  label="Working Status"
  required
>
  <select
    name="workingStatus"
    value={
      formData.workingStatus ||
      ""
    }
    onChange={updateField}
    className={inputClassName}
  >
    <option value="">
      Select working status
    </option>

    {workingStatusOptions.map(
      (option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      )
    )}
  </select>
</Field>

<Field
  label="Annual Income"
  required
>
  <select
    name="annualIncome"
    value={
      formData.annualIncome ||
      ""
    }
    onChange={updateField}
    className={inputClassName}
  >
    <option value="">
      Select income range
    </option>

    {annualIncomeOptions.map(
      (option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      )
    )}
  </select>
</Field>
      </div>

      <div className="mt-5">
        <Field
  label="About Yourself"
  required
>
 <textarea
  name="aboutBrideGroom"
  required
            value={
              formData.aboutBrideGroom
            }
            onChange={updateField}
            rows={4}
            className={inputClassName}
            placeholder="Share a short introduction about yourself..."
          />
        </Field>
      </div>
    </>
  );
};

export default AboutYouSection;