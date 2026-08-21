import React from "react";
import { Country, State } from "country-state-city";

import ProfileField from "./ProfileField";
import { designClasses } from "../../../shared/styles/designTokens";

const getCountryName = (isoCode) => {
  if (!isoCode) {
    return "-";
  }

  const country = Country.getAllCountries().find(
    (item) => item.isoCode === isoCode
  );

  return country?.name || isoCode;
};

const getStateName = (stateIsoCode, countryIsoCode) => {
  if (!stateIsoCode) {
    return "-";
  }

  if (!countryIsoCode) {
    return stateIsoCode;
  }

  const state = State.getStatesOfCountry(
    countryIsoCode
  ).find(
    (item) => item.isoCode === stateIsoCode
  );

  return state?.name || stateIsoCode;
};

const formatHeight = (height) => {
  if (!height) {
    return "-";
  }

  if (typeof height !== "string") {
    return height;
  }

  const match = height.match(/(\d+)'(\d+)"/);

  if (!match) {
    return height;
  }

  return `${match[1]} feet ${match[2]} inches`;
};

const formatHobbies = (hobbies) => {
  if (Array.isArray(hobbies)) {
    return hobbies.length > 0
      ? hobbies.join(", ")
      : "-";
  }

  return hobbies || "-";
};

const PersonalDetailsSection = ({ profileData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-base font-semibold ${designClasses.textPrimary}`}
        >
          Profile Information
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProfileField
            label="Profile Status"
            value={profileData?.profile_status}
          />

          <ProfileField
            label="Profile Created For"
            value={profileData?.profile_created_for}
          />

          <ProfileField
            label="Profile For"
            value={profileData?.profile_for}
          />

          <ProfileField
            label="Current Age"
            value={profileData?.current_age}
          />
        </div>
      </div>

      <div>
        <h3
          className={`text-base font-semibold ${designClasses.textPrimary}`}
        >
          Personal Details
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField
            label="Mother Tongue"
            value={
              typeof profileData?.mother_tongue ===
                "object" &&
              profileData?.mother_tongue !== null
                ? profileData.mother_tongue.label
                : profileData?.mother_tongue
            }
          />

          <ProfileField
            label="Marital Status"
            value={
              profileData?.married_status ||
              profileData?.marriedStatus
            }
          />

          <ProfileField
            label="Height"
            value={formatHeight(profileData?.height)}
          />

          <ProfileField
            label="Bride/Groom Category"
            value={
              profileData?.profile_category ||
              profileData?.profileCategory
            }
          />

          <ProfileField
            label="How Did You Know"
            value={
              profileData?.how_did_you_know ||
              profileData?.howDidYouKnow
            }
          />

          <ProfileField
            label="Share Details on Platform"
            value={
              profileData?.share_details_on_platform ||
              profileData?.shareDetailsOnPlatform
            }
          />
        </div>
      </div>

      <div>
        <h3
          className={`text-base font-semibold ${designClasses.textPrimary}`}
        >
          Location
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField
            label="Native Place Country"
            value={getCountryName(
              profileData?.native_place_country
            )}
          />

          <ProfileField
            label="Native Place State"
            value={getStateName(
              profileData?.native_place_state,
              profileData?.native_place_country
            )}
          />

          <ProfileField
            label="Native Place"
            value={profileData?.native_place}
          />

          <ProfileField
            label="Current Location Country"
            value={getCountryName(
              profileData?.current_location_country
            )}
          />

          <ProfileField
            label="Current Location State"
            value={getStateName(
              profileData?.current_location_state,
              profileData?.current_location_country
            )}
          />

          <ProfileField
            label="Current Location"
            value={profileData?.current_location}
          />
        </div>
      </div>

      <div>
        <h3
          className={`text-base font-semibold ${designClasses.textPrimary}`}
        >
          About You
        </h3>

        <div className="mt-4 space-y-4">
          <ProfileField
            label="Hobbies"
            value={formatHobbies(
              profileData?.hobbies
            )}
          />

          <ProfileField
            label="About Bride/Groom"
            value={
              profileData?.about_bride_groom ||
              profileData?.aboutBrideGroom
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
