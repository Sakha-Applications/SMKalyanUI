import AutocompleteField from "../../../shared/forms/AutocompleteField";
import { getOptionLabel } from "../../../shared/forms/optionUtils";

import {
  profileForOptions,
  genderOptions,
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

const BasicDetailsSection = ({
  formData,
  updateField,
  setFieldValue,
  lookupLoading,
  gotraOptions,
  searchMotherTongues,
  searchPlaces,
}) => {
    const genderLocked =
    formData.profileCreatedFor ===
      "Son" ||
    formData.profileCreatedFor ===
      "Daughter";
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <Field
        label="Profile Created For"
        required
      >
        <select
          name="profileCreatedFor"
          value={formData.profileCreatedFor}
          onChange={updateField}
          className={inputClassName}
        >
          <option value="">
            Select
          </option>

          {profileForOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Full Name" required>
        <input
          name="name"
          value={formData.name}
          onChange={updateField}
          className={inputClassName}
          placeholder="Enter full name"
        />
      </Field>

      <Field label="Gender" required>
<select
  name="gender"
  value={formData.gender}
  onChange={updateField}
  className={inputClassName}
  disabled={genderLocked}
>
          <option value="">
            Select
          </option>

          {genderOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Date of Birth"
        required
      >
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={updateField}
          className={inputClassName}
        />
      </Field>

      <AutocompleteField
        label="Mother Tongue"
        required
        value={formData.motherTongue}
        searchFn={searchMotherTongues}
        placeholder="Start typing mother tongue"
        onChange={(value) =>
          setFieldValue(
            "motherTongue",
            value
          )
        }
      />

      <Field label="Gotra" required>
        <select
          name="gotra"
          value={formData.gotra}
          onChange={updateField}
          className={inputClassName}
          disabled={lookupLoading}
        >
          <option value="">
            {lookupLoading
              ? "Loading Gotras..."
              : "Select Gotra"}
          </option>

          {(gotraOptions || []).map(
            (option, index) => {
              const optionValue =
                getOptionLabel(option);

              return (
                <option
                  key={`${optionValue}-${index}`}
                  value={optionValue}
                >
                  {optionValue}
                </option>
              );
            }
          )}
        </select>
      </Field>

      <AutocompleteField
        label="Residing City"
        required
        value={formData.currentLocation}
        searchFn={searchPlaces}
        placeholder="Start typing residing city"
        onChange={(value) =>
          setFieldValue(
            "currentLocation",
            value
          )
        }
      />
    </div>
  );
};

export default BasicDetailsSection;