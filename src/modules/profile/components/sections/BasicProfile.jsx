import React from "react";
import { Select, TextArea } from "../../../../shared/common/FormElements";
import CountryStateCitySelector from "../../../../shared/common/CountryStateCitySelector";
import EnhancedAutocomplete from "../helpers/EnhancedAutocomplete";
import { Country, State } from "country-state-city";
import FullWidthHobbiesGrid from "../../../../shared/components/FullWidthHobbiesGrid";

import {
  designClasses,
} from "../../../../shared/styles/designTokens";

const DataRow = ({ label, value }) => (
  <div
    className={`rounded-lg p-4 ${designClasses.surfaceMuted}`}
  >
    <p
      className={`text-sm ${designClasses.textSecondary}`}
    >
      <span
        className={`font-semibold ${designClasses.textPrimary}`}
      >
        {label}:
      </span>{" "}
      {value || "-"}
    </p>
  </div>
);

const getCountryName = (isoCode) => {
  const countryObj = Country.getAllCountries().find((c) => c.isoCode === isoCode);
  return countryObj ? countryObj.name : isoCode;
};

const getStateName = (stateIsoCode, countryIsoCode) => {
  if (!countryIsoCode || !stateIsoCode) return stateIsoCode;
  const stateObj = State.getStatesOfCountry(countryIsoCode).find(
    (s) => s.isoCode === stateIsoCode
  );
  return stateObj ? stateObj.name : stateIsoCode;
};

const getDisplayGender = (profileData = {}) => {
  if (profileData.gender) {
    return profileData.gender;
  }

  if (profileData.sex) {
    return profileData.sex;
  }

  const profileFor = String(
    profileData.profile_for ||
    profileData.profileFor ||
    ""
  )
    .trim()
    .toLowerCase();

  if (
    profileFor === "bridegroom" ||
    profileFor === "groom"
  ) {
    return "Male";
  }

  if (profileFor === "bride") {
    return "Female";
  }

  return "-";
};

const howDidYouKnowOptions = [
  "Online Advertisement",
  "Friend/Family Referral",
  "Social Media (Facebook, Instagram, etc.)",
  "Newspaper Advertisement",
  "Magazine Advertisement",
  "Event/Exhibition",
  "Walk-in/Office Visit",
  "Other",
];

const BasicProfile = ({
  profileData,
  formData = {},
  setFormData,
  mode = "view",
  motherTongueOptions = [],
  motherTongueInput = "",
  setMotherTongueInput = () => {},
  motherTongueLoading = false,
  setMotherTongueOptions = () => {},
  searchMotherTongues = () => {},
}) => {
  const handleChange = (e) => {
    if (e.target && e.target.name) {
      const { name, value } = e.target;
      setFormData?.((prev) => ({ ...prev, [name]: value }));
    } else {
      const { name, value } = e; // fallback for non-event callers
      setFormData?.((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMotherTongueChange = (selectedValue) => {
    setFormData((prev) => ({
      ...prev,
      motherTongue: selectedValue,
    }));
    setMotherTongueInput(
      selectedValue.label || selectedValue.value || selectedValue
    );
  };

  // Adapter so FullWidthHobbiesGrid can call handleChange in event-style
  const handleHobbiesChange = (e) => {
    const { name, value } = e.target || e;
    handleChange({ name, value });
  };

  return (
    <div className="space-y-6">

      {/* Basic Details */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <DataRow
                  label="Profile Status"
                  value={profileData.profile_status || "-"}
                />
                <DataRow
                  label="Profile Created For"
                  value={profileData.profile_created_for || "-"}
                />
                <DataRow
                  label="Current Age"
                  value={profileData?.current_age || "-"}
                />
                <DataRow
                  label="Profile For"
                  value={profileData?.profile_for || "-"}
                />
                
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="howDidYouKnow"
                    className={`mb-1 block text-sm font-medium ${designClasses.textPrimary}`}
                  >
                    How Did You Know
                  </label>
                  <Select
                    id="howDidYouKnow"
                    name="howDidYouKnow"
                    value={formData?.howDidYouKnow || ""}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="">Select an option</option>
                    {howDidYouKnowOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className={`mb-1 block text-sm font-medium ${designClasses.textPrimary}`}>
                    Share Details on Platform
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className={`form-radio h-4 w-4 ${designClasses.textAccent}`}
                        name="shareDetailsOnPlatform"
                        value="Yes"
                        checked={formData?.shareDetailsOnPlatform === "Yes"}
                        onChange={handleChange}
                      />
                      <span
  className={`ml-2 ${designClasses.textDark}`}
>
  Yes
</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className={`form-radio h-4 w-4 ${designClasses.textAccent}`}
                        name="shareDetailsOnPlatform"
                        value="No"
                        checked={formData?.shareDetailsOnPlatform === "No"}
                        onChange={handleChange}
                      />
                      <span
  className={`ml-2 ${designClasses.textDark}`}
>
  No
</span>
                    </label>
                  </div>
                </div>
              </div>

              <CountryStateCitySelector
                formData={formData}
                handleChange={handleChange}
                countryField="nativePlaceCountry"
                stateField="nativePlaceState"
                cityField="nativePlace"
                labelPrefix="Native"
              />

              <CountryStateCitySelector
                formData={formData}
                handleChange={handleChange}
                countryField="currentLocationCountry"
                stateField="currentLocationState"
                cityField="currentLocation"
                labelPrefix="Current Location"
              />
            </>
          ) : (
            <>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <DataRow
                  label="Profile Status"
                  value={profileData.profile_status || "-"}
                />
                <DataRow
                  label="Profile Created For"
                  value={profileData.profile_created_for || "-"}
                />
                <DataRow
                  label="Current Age"
                  value={profileData?.current_age || "-"}
                />
                <DataRow
  label="Profile For"
  value={profileData?.profile_for || "-"}
/>

<DataRow
  label="Gender"
  value={getDisplayGender(profileData)}
/>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DataRow
                  label="How Did You Know"
                  value={
                    profileData?.how_did_you_know || profileData?.howDidYouKnow
                  }
                />
                <DataRow
                  label="Share Details on Platform"
                  value={
                    profileData?.share_details_on_platform ||
                    profileData?.shareDetailsOnPlatform
                  }
                />
              </div>

              <div className="md:col-span-1">
                <DataRow
                  label="Native Place Country"
                  value={getCountryName(profileData.native_place_country)}
                />
                <DataRow
                  label="Native Place State"
                  value={getStateName(
                    profileData.native_place_state,
                    profileData.native_place_country
                  )}
                />
                <DataRow
                  label="Native Place"
                  value={profileData.native_place}
                />
              </div>

              <div className="md:col-span-1">
                <DataRow
                  label="Current Location Country"
                  value={getCountryName(profileData.current_location_country)}
                />
                <DataRow
                  label="Current Location State"
                  value={getStateName(
                    profileData.current_location_state,
                    profileData.current_location_country
                  )}
                />
                <DataRow
                  label="Current Location"
                  value={profileData.current_location}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              {/* Mother Tongue */}
              <div>
                <label
                  htmlFor="motherTongue"
                  className={`mb-1 block text-sm font-medium ${designClasses.textPrimary}`}
                >
                  Mother Tongue
                </label>
                <EnhancedAutocomplete
                  id="motherTongue"
                  name="motherTongue"
                  label=""
                  options={motherTongueOptions}
                  inputValue={motherTongueInput}
                  inputSetter={setMotherTongueInput}
                  onChange={handleMotherTongueChange}
                  loading={motherTongueLoading}
                  setOptions={setMotherTongueOptions}
                  searchFn={searchMotherTongues}
                  placeholder="Type to search mother tongue..."
                />
              </div>

              {/* Married Status */}
              <div>
                <label
                  htmlFor="marriedStatus"
                  className={`mb-1 block text-sm font-medium ${designClasses.textPrimary}`}
                >
                  Married Status
                </label>
                <Select
                  name="marriedStatus"
                  value={formData.marriedStatus || ""}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">Select</option>
                  <option value="Single (Never Married)">
                    Single (Never Married)
                  </option>
                  <option value="Divorced">Divorced</option>
                  <option value="Separated">Separated</option>
                  <option value="Widowed">Widowed</option>
                </Select>
              </div>

              {/* Height */}
              <div>
                <label className={`mb-1 block text-sm font-medium ${designClasses.textPrimary}`}>
                  Height
                </label>
                <div className="flex space-x-2">
                  <Select
                    name="heightFeet"
                    value={formData.heightFeet || ""}
                    onChange={handleChange}
                    className="w-1/2"
                  >
                    <option value="">Feet</option>
                    {[4, 5, 6, 7].map((f) => (
                      <option key={f} value={f}>
                        {f} ft
                      </option>
                    ))}
                  </Select>
                  <Select
                    name="heightInches"
                    value={formData.heightInches || ""}
                    onChange={handleChange}
                    className="w-1/2"
                  >
                    <option value="">Inches</option>
                    {[...Array(12).keys()].map((i) => (
                      <option key={i} value={i}>
                        {i} in
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Profile Category */}
              <div>
                <label
                  htmlFor="profileCategory"
                  className={`mb-1 block text-sm font-medium ${designClasses.textPrimary}`}
                >
                  Bride/Groom Category
                </label>
                <Select
                  name="profileCategory"
                  value={formData.profileCategory || ""}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">Select Category</option>
                  <option value="Domestic-India">Domestic-India</option>
                  <option value="International">International</option>
                  <option value="Vaidika">Vaidika</option>
                  <option value="Anyone">Anyone</option>
                </Select>
              </div>

              {/* Hobbies now use the shared FullWidthHobbiesGrid. */}
              <FullWidthHobbiesGrid
                label="Hobbies"
                fieldName="hobbies"
                formData={formData}
                handleChange={handleHobbiesChange}
              />

              {/* About Bride/Groom */}
              <div className="md:col-span-2">
                <label
                  htmlFor="aboutBrideGroom"
                  className={`mb-1 block text-sm font-medium ${designClasses.textPrimary}`}
                >
                  About Bride/Groom
                </label>
                <TextArea
                  id="aboutBrideGroom"
                  name="aboutBrideGroom"
                  value={formData?.aboutBrideGroom || ""}
                  onChange={handleChange}
                  rows={5}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <>
              {/* View Mode - Personal Details */}
              <DataRow
                label="Mother Tongue"
                value={
                  typeof profileData?.mother_tongue === "object" &&
                  profileData?.mother_tongue !== null
                    ? profileData.mother_tongue.label
                    : profileData?.mother_tongue
                }
              />
              <DataRow
                label="Height"
                value={(() => {
                  if (profileData.height && typeof profileData.height === "string") {
                    const match = profileData.height.match(/(\d+)'(\d+)"/);
                    if (match) {
                      const feet = parseInt(match[1], 10);
                      const inches = parseInt(match[2], 10);
                      return `${feet} feet ${inches} inches`;
                    }
                  }
                  return "-";
                })()}
              />
              <DataRow
                label="Married Status"
                value={profileData.married_status || profileData.marriedStatus}
              />
              <DataRow
                label="Bride/Groom Category"
                value={
                  profileData.profile_category || profileData.profileCategory
                }
              />
              <div className="md:col-span-2">
                <DataRow
                  label="Hobbies"
                  value={(() => {
                    if (
                      Array.isArray(profileData.hobbies) &&
                      profileData.hobbies.length > 0
                    ) {
                      return profileData.hobbies.join(", ");
                    }
                    if (
                      typeof profileData.hobbies === "string" &&
                      profileData.hobbies.trim() !== ""
                    ) {
                      return profileData.hobbies;
                    }
                    return "-";
                  })()}
                />
              </div>
              <div className="md:col-span-2">
                <DataRow
                  label="About Bride/Groom"
                  value={
                    profileData?.about_bride_groom ||
                    profileData?.aboutBrideGroom
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicProfile;  
