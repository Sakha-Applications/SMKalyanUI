import {
  useState,
} from "react";

import MultiSelectField from "../../../shared/forms/MultiSelectField";
import RangeSliderField from "../../../shared/forms/RangeSliderField";

import {
  maritalStatusOptions,
  preferredAgeRangeConfig,
  preferredHeightRangeConfig,
  preferredIncomeRangeConfig,
  formatHeightValue,
} from "../../../shared/config/profileOptions";

const inputClassName =
  "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

const Field = ({
  label,
  children,
}) => (
  <label className="block text-sm font-medium text-slate-700">
    <span>{label}</span>
    {children}
  </label>
);

const extractLookupOptions = (
  result
) => {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.results)) {
    return result.results;
  }

  if (
    Array.isArray(
      result?.data?.results
    )
  ) {
    return result.data.results;
  }

  if (
    Array.isArray(result?.options)
  ) {
    return result.options;
  }

  return [];
};

const PhotoPreferencesSection = ({
  formData,
  updateField,
  setFieldValue,
  lookupLoading,
  gotraOptions,
  searchMotherTongues,
  searchEducation,
  searchPlaces,
}) => {
  const [
    showMorePreferences,
    setShowMorePreferences,
  ] = useState(false);

  const [
    motherTongueInput,
    setMotherTongueInput,
  ] = useState("");

  const [
    motherTongueOptions,
    setMotherTongueOptions,
  ] = useState([]);

  const [
    motherTongueLoading,
    setMotherTongueLoading,
  ] = useState(false);

  const [
    educationInput,
    setEducationInput,
  ] = useState("");

  const [
    educationOptions,
    setEducationOptions,
  ] = useState([]);

  const [
    cityInput,
    setCityInput,
  ] = useState("");

  const [
    cityOptions,
    setCityOptions,
  ] = useState([]);

  const [
    cityLoading,
    setCityLoading,
  ] = useState(false);

  const [
    educationLoading,
    setEducationLoading,
  ] = useState(false);

  const runLookup = async (
    searchFunction,
    searchText,
    setOptions,
    setLoading
  ) => {
    const value = String(
      searchText || ""
    ).trim();

    if (value.length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result =
        await searchFunction(value);

      setOptions(
        extractLookupOptions(result)
      );
    } catch (error) {
      console.error(
        "Partner preference lookup failed:",
        error
      );

      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <Field label="Profile Photo">
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={updateField}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <RangeSliderField
            label="Preferred Age Range"
            value={
              formData.ageRange
            }
            min={
              preferredAgeRangeConfig.min
            }
            max={
              preferredAgeRangeConfig.max
            }
            step={
              preferredAgeRangeConfig.step
            }
            onChange={(value) =>
              setFieldValue(
                "ageRange",
                value
              )
            }
            formatValue={(value) =>
              `${value} yrs`
            }
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <MultiSelectField
            label="Preferred Mother Tongue"
            value={
              formData.preferredMotherTongues
            }
            options={
              motherTongueOptions
            }
            searchValue={
              motherTongueInput
            }
            loading={
              motherTongueLoading
            }
            placeholder="Type at least 2 characters"
            onSearchChange={(value) => {
              setMotherTongueInput(
                value
              );

              runLookup(
                searchMotherTongues,
                value,
                setMotherTongueOptions,
                setMotherTongueLoading
              );
            }}
            onChange={(values) =>
              setFieldValue(
                "preferredMotherTongues",
                values
              )
            }
          />
        </div>

        <MultiSelectField
          label="Preferred Gotra"
          value={formData.preferredGotras}
          options={gotraOptions || []}
          placeholder="Select preferred Gotra"
          loading={lookupLoading}
          onChange={(values) =>
            setFieldValue(
              "preferredGotras",
              values
            )
          }
        />

        <Field label="Preferred Marital Status">
          <select
  name="preferredMaritalStatus"
  value={
    formData.preferredMaritalStatus
  }
  onChange={updateField}
  className={`${inputClassName} min-h-[42px]`}
>
            <option value="">
              Any marital status
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

        <MultiSelectField
          label="Preferred Location"
          value={formData.preferredCities}
          options={cityOptions}
          searchValue={cityInput}
          loading={cityLoading}
          placeholder="Type at least 2 characters"
          onSearchChange={(value) => {
            setCityInput(value);

            runLookup(
              searchPlaces,
              value,
              setCityOptions,
              setCityLoading
            );
          }}
          onChange={(values) =>
            setFieldValue(
              "preferredCities",
              values
            )
          }
        />
      </div>

      <button
        type="button"
        onClick={() =>
          setShowMorePreferences(
            (current) => !current
          )
        }
        className="mt-5 text-sm font-semibold text-amber-700 hover:text-amber-800"
      >
        {showMorePreferences
          ? "Hide additional preferences"
          : "More preferences"}
      </button>

      {showMorePreferences && (
        <div className="mt-5 grid gap-6 border-t border-slate-200 pt-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <RangeSliderField
              label="Preferred Height Range"
              value={
  formData.heightRange
}
              min={
                preferredHeightRangeConfig.min
              }
              max={
                preferredHeightRangeConfig.max
              }
              step={
                preferredHeightRangeConfig.step
              }
              onChange={(value) =>
                setFieldValue(
                  "heightRange",
                  value
                )
              }
              formatValue={
                formatHeightValue
              }
            />
          </div>

          <div className="md:col-span-2">
            <RangeSliderField
              label="Preferred Annual Income Range"
              value={
                formData.preferredIncomeRange
              }
              min={
                preferredIncomeRangeConfig.min
              }
              max={
                preferredIncomeRangeConfig.max
              }
              step={
                preferredIncomeRangeConfig.step
              }
              onChange={(value) =>
                setFieldValue(
                  "preferredIncomeRange",
                  value
                )
              }
              formatValue={(value) =>
                `₹${value}L`
              }
            />
          </div>

          <div className="md:col-span-2">
            <MultiSelectField
              label="Preferred Education"
              value={
                formData.preferredEducation
              }
              options={
                educationOptions
              }
              searchValue={
                educationInput
              }
              loading={
                educationLoading
              }
              placeholder="Type at least 2 characters"
              onSearchChange={(value) => {
                setEducationInput(value);

                runLookup(
                  searchEducation,
                  value,
                  setEducationOptions,
                  setEducationLoading
                );
              }}
              onChange={(values) =>
                setFieldValue(
                  "preferredEducation",
                  values
                )
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoPreferencesSection;