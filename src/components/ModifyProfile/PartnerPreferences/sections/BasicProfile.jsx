// src/components/ModifyProfile/PartnerPreferences/sections/BasicProfile.jsx
import React from "react";
import { Input, Select, TextArea } from "../../../common/FormElements";
import CountryStateCitySelector from "../../../common/CountryStateCitySelector";
import EnhancedAutocomplete from "../helpers/EnhancedAutocomplete";
import { Country, State } from "country-state-city";
import FullWidthHobbiesGrid from "../../../common/options/FullWidthHobbiesGrid";

const DataRow = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {value || "-"}
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
  console.log("DEBUG BasicProfile: formData on render:", formData, typeof formData);
  console.log(
    "DEBUG BasicProfile: formData.hobbies on render:",
    formData.hobbies,
    typeof formData.hobbies
  );

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
    console.log("🔍 Mother Tongue selected:", selectedValue);
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
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">
        Profile Information
      </h2>

      {/* Basic Details */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">
          Basic Details
        </h3>
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
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Share Details on Platform
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        name="shareDetailsOnPlatform"
                        value="Yes"
                        checked={formData?.shareDetailsOnPlatform === "Yes"}
                        onChange={handleChange}
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        name="shareDetailsOnPlatform"
                        value="No"
                        checked={formData?.shareDetailsOnPlatform === "No"}
                        onChange={handleChange}
                      />
                      <span className="ml-2 text-gray-700">No</span>
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
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              {/* Mother Tongue */}
              <div>
                <label
                  htmlFor="motherTongue"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                  <option value="Vaidhik">Vaidhik</option>
                  <option value="Anyone">Anyone</option>
                </Select>
              </div>

              {/* Hobbies – now using FullWidthHobbiesGrid */}
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
                  className="block text-sm font-medium text-gray-700 mb-1"
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
    </section>
  );
};

export default BasicProfile;  