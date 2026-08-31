import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchResults from "./components/SearchResults";
import useApiData from "../../hooks/useApiData";
import searchService from "../../services/searchService";
import { useNavigate } from "react-router-dom";
import StyledFormField from "../../components/common/StyledFormField";
import AutocompleteInput from "../../components/common/renderAutocomplete";
import CountryStateCitySelector from "../../shared/common/CountryStateCitySelector";
import MemberLayout from "../../shared/layouts/MemberLayout";
import CollapsibleSection from "../../shared/components/CollapsibleSection";
import RangeSliderField from "../../shared/forms/RangeSliderField";

import {
  designClasses,
} from "../../shared/styles/designTokens";

import {
  maritalStatusOptions,
  subCasteOptions,
  lookingForOptions,
  annualIncomeOptions,
  preferredAgeRangeConfig,
  preferredHeightRangeConfig,
  formatHeightValue,
  formatHeightForApi,
} from "../../shared/config/profileOptions";
//import dayjs from "dayjs";

const SearchPage = () => {
  const navigate = useNavigate();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // --- Opposite mapping (UI-side only for debug; server enforces it) ---
  const getOppositeProfileFor = (myProfileFor) => {
    if (!myProfileFor) return "";
    const val = String(myProfileFor).trim().toLowerCase();
    if (val === "bride") return "Bridegroom";
    if (val === "bridegroom") return "Bride";
    return "";
  };

  // Existing sessionStorage-based attempt (kept as-is), but we now rely on myProfileId from sessionStorage
  const getLoggedInUserProfileFor = () => {
    try {
      const raw =
        sessionStorage.getItem("userProfile") ||
        sessionStorage.getItem("profile") ||
        sessionStorage.getItem("user") ||
        sessionStorage.getItem("currentUser") ||
        sessionStorage.getItem("profileFor") ||
        sessionStorage.getItem("myProfileFor");

      if (!raw) return "";
      if (raw === "Bride" || raw === "Bridegroom") return raw;

      const obj = JSON.parse(raw);
      return (
        obj?.profileFor ||
        obj?.profile_for ||
        obj?.genderCategory ||
        obj?.gender ||
        ""
      );
    } catch (e) {
      return "";
    }
  };

  // Default "Looking For" from the logged-in member's profile type.
 const getMyProfileForFromStorage = () => {
    try {
      // try sessionStorage first (more reliable in your app)
      const ss =
        sessionStorage.getItem("profileFor") ||
        sessionStorage.getItem("myProfileFor") ||
        sessionStorage.getItem("profile_for");
      if (ss === "Bride" || ss === "Bridegroom") return ss;

      // fallback to your existing sessionStorage-based attempt
      const ls = getLoggedInUserProfileFor();
      if (ls === "Bride" || ls === "Bridegroom") return ls;

      return "";
    } catch {
      return "";
    }
  };

  

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState({
  profileId: "",
  profileFor: "",
  ageRange: preferredAgeRangeConfig.defaultValue,
  maritalStatus: "",
  motherTongue: "",
  gotra: "",
  rashi: "",
  nakshatra: "",
  subCaste: "",
  guruMatha: "",

  currentCityOfResidence: "",
  currentLocationCountry: "",
  currentLocationState: "",

  heightRange: preferredHeightRangeConfig.defaultValue,

  income: "",
  education: "",
  profession: "",
  traditionalValues: "",
});

  const {
  isLoading: apiDataLoading,
  error: apiDataError,
  gotraOptions,
  rashiOptions,
  nakshatraOptions,
  searchMotherTongues,
  searchGuruMatha,
  searchEducation,
  searchProfessions,
  searchPlaces,
  getPlaceById,
} = useApiData();

  const [motherTongueInput, setMotherTongueInput] = useState(
    searchQuery.motherTongue || ""
  );
  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
const [showMotherTongueOptions, setShowMotherTongueOptions] = useState(false);

const [guruMathaInput, setGuruMathaInput] = useState(
  searchQuery.guruMatha || ""
);
const [
  educationInput,
  setEducationInput,
] = useState("");

const [
  educationOptions,
  setEducationOptions,
] = useState([]);

const [
  showEducationOptions,
  setShowEducationOptions,
] = useState(false);

const [
  professionInput,
  setProfessionInput,
] = useState("");

const [
  professionOptions,
  setProfessionOptions,
] = useState([]);

const [
  showProfessionOptions,
  setShowProfessionOptions,
] = useState(false);
const [guruMathaOptions, setGuruMathaOptions] = useState([]);
const [showGuruMathaOptions, setShowGuruMathaOptions] = useState(false);

 
  const traditionalValuesOptions = [
    { label: "Traditional", value: "Traditional" },
    { label: "Moderate", value: "Moderate" },
    { label: "Liberal", value: "Liberal" },
  ];

  useEffect(() => {
  if (searchQuery.motherTongue && motherTongueInput === "") {
    setMotherTongueInput(searchQuery.motherTongue);
  }

  if (searchQuery.guruMatha && guruMathaInput === "") {
    setGuruMathaInput(searchQuery.guruMatha);
  }
}, [
  searchQuery.motherTongue,
  motherTongueInput,
  searchQuery.guruMatha,
  guruMathaInput,
]);

  useEffect(() => {
  let cancelled = false;

  const applyDefaultLookingFor = (myProfileForResolved) => {
  const opposite = getOppositeProfileFor(myProfileForResolved);

  if (opposite) {
    setSearchQuery((prev) => ({
      ...prev,
      profileFor: prev.profileFor || opposite,
    }));
  }
};

  const init = async () => {
    // 1) Try storage first
    let myProfileForResolved = getMyProfileForFromStorage();

    // 2) If not found, fetch from backend using sessionStorage.profileId
    if (!myProfileForResolved) {
      const myProfileId = sessionStorage.getItem("profileId") || "";
      if (myProfileId) {
        try {
          const data = await searchService.getProfile(myProfileId);

myProfileForResolved =
  data?.profile_for ||
  data?.profileFor ||
  data?.profileForValue ||
  "";

if (myProfileForResolved) {
  sessionStorage.setItem(
    "profileFor",
    myProfileForResolved
  );
}
        } catch (error) {
          console.error(
            "Unable to resolve profile type for search:",
            error
          );
        }
      }
    }

    if (!cancelled) {
  applyDefaultLookingFor(myProfileForResolved);
}
  };

  init();

  return () => {
    cancelled = true;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



  const handleChange = (e) => {
    const { name, value } = e.target;

    
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
    
  };

  const handleAutocompleteSelect = (name, value, id = null) => {
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
    if (id) {
      setSearchQuery((prev) => ({ ...prev, [`${name}Id`]: id }));
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const myProfileId = sessionStorage.getItem("profileId") || "";
      

      const myProfileFor = getLoggedInUserProfileFor(); // may be empty; server will derive from myProfileId
      

      const payload = {
  ...searchQuery,

  minAge: searchQuery.ageRange?.[0] ?? "",
  maxAge: searchQuery.ageRange?.[1] ?? "",
};

delete payload.ageRange;
delete payload.heightRange;
const defaultHeightRange = preferredHeightRangeConfig.defaultValue;

const heightRangeChanged =
  Array.isArray(searchQuery.heightRange) &&
  Array.isArray(defaultHeightRange) &&
  (
    searchQuery.heightRange[0] !== defaultHeightRange[0] ||
    searchQuery.heightRange[1] !== defaultHeightRange[1]
  );

if (heightRangeChanged) {
  payload.heightMin = formatHeightForApi(searchQuery.heightRange[0]);
  payload.heightMax = formatHeightForApi(searchQuery.heightRange[1]);
}

      // Send the logged-in profile ID so the backend can resolve the member profile type.
      payload.myProfileId = myProfileId;

      // Keep this for backward compatibility/debug; backend will not rely on it
      payload.myProfileFor = myProfileFor;

      // Prefer sessionStorage token (your login stores token there)
      const data = heightRangeChanged
  ? await searchService.advancedSearchProfiles(payload)
  : await searchService.searchProfiles(payload);

setSearchResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
  navigate("/dashboard");
};

  if (apiDataLoading) {
    return (
      <MemberLayout>
        <div
          className={`${designClasses.card} p-6`}
        >
          <p
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Loading search options...
          </p>
        </div>
      </MemberLayout>
    );
  }

  if (apiDataError) {
    return (
      <MemberLayout>
        <div
          className={`rounded-xl p-4 text-sm ${designClasses.statusError}`}
          role="alert"
        >
          Error loading search options:{" "}
          {apiDataError.message}
        </div>
      </MemberLayout>
    );
  }

  return (
  <MemberLayout>
    <div className="w-full space-y-6">
      
      <section className="py-8">
        <div
          className={`mx-auto max-w-5xl overflow-hidden ${designClasses.card}`}
        >
          <div
            className={`border-b p-5 sm:p-6 ${designClasses.border}`}
          >
            <h1
              className={`text-2xl font-bold ${designClasses.textPrimary}`}
            >
              Search Profiles
            </h1>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Find suitable profiles using
              your preferred search criteria.
            </p>
          </div>

          <div className="p-6">
  <div className="mb-4">
    <h2
      className={`text-lg font-semibold ${designClasses.textPrimary}`}
    >
      Basic Search
    </h2>

    <p
      className={`mt-1 text-sm ${designClasses.textSecondary}`}
    >
      Start with the most important
      criteria. Use Advanced Filters only
      when needed.
    </p>
  </div>

  <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(2, 1fr)" },
                gap: 3,
                p: 2,
                maxWidth: "100%",
                margin: "auto",
              }}
            >
              <StyledFormField
                label="Profile ID"
                name="profileId"
                value={searchQuery.profileId}
                onChange={handleChange}
              />

              <StyledFormField
  label="Looking For"
  name="profileFor"
  value={searchQuery.profileFor}
  onChange={handleChange}
  selectOptions={lookingForOptions}
/>


<Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
  <RangeSliderField
    label="Age Range"
    value={searchQuery.ageRange}
    min={preferredAgeRangeConfig.min}
    max={preferredAgeRangeConfig.max}
    step={preferredAgeRangeConfig.step}
    formatValue={(value) => `${value} yrs`}
    onChange={(value) =>
      setSearchQuery((prev) => ({
        ...prev,
        ageRange: value,
      }))
    }
  />
</Box>

              <StyledFormField
                label="Marital Status"
                name="maritalStatus"
                value={searchQuery.maritalStatus}
                onChange={handleChange}
                selectOptions={maritalStatusOptions}
              />

              <AutocompleteInput
                label="Mother Tongue"
                name="motherTongue"
                inputValue={motherTongueInput}
                inputSetter={setMotherTongueInput}
                options={motherTongueOptions}
                setOptions={setMotherTongueOptions}
                show={showMotherTongueOptions}
                setShow={setShowMotherTongueOptions}
                loading={false}
                searchFn={searchMotherTongues}
                onSelect={handleAutocompleteSelect}
              />

              <StyledFormField
                label="Exclude Gotra"
                name="gotra"
                value={searchQuery.gotra}
                onChange={handleChange}
                selectOptions={gotraOptions.map((g) => ({ label: g.label, value: g.label }))}
              />

              

              
<Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
  <CountryStateCitySelector
    formData={searchQuery}
    handleChange={handleChange}
    countryField="currentLocationCountry"
    stateField="currentLocationState"
    cityField="currentCityOfResidence"
    labelPrefix="Residing"
    searchFn={searchPlaces}
    getByIdFn={getPlaceById}
  />
</Box>

</Box>

<div className="mt-6">
  <CollapsibleSection
    number={2}
    title="Advanced Filters"
    description="Refine your search using cultural, financial and lifestyle preferences."
    open={advancedOpen}
    onToggle={() => setAdvancedOpen((current) => !current)}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 3,
      }}
    >
      <StyledFormField
        label="Sub-caste"
        name="subCaste"
        value={searchQuery.subCaste}
        onChange={handleChange}
        selectOptions={subCasteOptions}
      />

      <StyledFormField
        label="Rashi"
        name="rashi"
        value={searchQuery.rashi}
        onChange={handleChange}
        selectOptions={rashiOptions.map(
          (item) => ({
            label: item.label,
            value: item.label,
          })
        )}
      />

      <StyledFormField
        label="Nakshatra"
        name="nakshatra"
        value={searchQuery.nakshatra}
        onChange={handleChange}
        selectOptions={nakshatraOptions.map(
          (item) => ({
            label: item.label,
            value: item.label,
          })
        )}
      />

      <AutocompleteInput
        label="Guru Matha"
        name="guruMatha"
        inputValue={guruMathaInput}
        inputSetter={setGuruMathaInput}
        options={guruMathaOptions}
        setOptions={setGuruMathaOptions}
        show={showGuruMathaOptions}
        setShow={setShowGuruMathaOptions}
        loading={false}
        searchFn={searchGuruMatha}
        onSelect={handleAutocompleteSelect}
      />


<Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
  <RangeSliderField
    label="Height Range"
    value={searchQuery.heightRange}
    min={preferredHeightRangeConfig.min}
    max={preferredHeightRangeConfig.max}
    step={preferredHeightRangeConfig.step}
    formatValue={formatHeightValue}
    onChange={(value) =>
      setSearchQuery((prev) => ({
        ...prev,
        heightRange: value,
      }))
    }
  />
</Box>

      <AutocompleteInput
        label="Education"
        name="education"
        inputValue={educationInput}
        inputSetter={setEducationInput}
        options={educationOptions}
        setOptions={setEducationOptions}
        show={showEducationOptions}
        setShow={setShowEducationOptions}
        loading={false}
        searchFn={searchEducation}
        onSelect={handleAutocompleteSelect}
      />

      <AutocompleteInput
        label="Profession"
        name="profession"
        inputValue={professionInput}
        inputSetter={setProfessionInput}
        options={professionOptions}
        setOptions={setProfessionOptions}
        show={showProfessionOptions}
        setShow={setShowProfessionOptions}
        loading={false}
        searchFn={searchProfessions}
        onSelect={handleAutocompleteSelect}
      />

      <StyledFormField
        label="Annual Income"
  name="income"
  value={searchQuery.income}
  onChange={handleChange}
  selectOptions={annualIncomeOptions}
/>

      <StyledFormField
        label="Traditional Values"
        name="traditionalValues"
        value={searchQuery.traditionalValues}
        onChange={handleChange}
        selectOptions={traditionalValuesOptions}
      />
    </Box>
  </CollapsibleSection>
</div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleBackToDashboard}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${designClasses.secondaryButton}`}
              >
                Back to Dashboard
              </button>

              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${designClasses.primaryButton}`}
              >
                {loading
                  ? "Searching..."
                  : "Search Profiles"}
              </button>
            </div>

            {error && (
              <div
                className={`mt-4 rounded-xl p-3 text-sm ${designClasses.statusError}`}
                role="alert"
              >
                {error}
              </div>
            )}

            <Box sx={{ mt: 4 }}>
              <SearchResults results={searchResults} />
            </Box>
          </div>
        </div>
      </section>

        </div>
  </MemberLayout>
);
};

export default SearchPage;

