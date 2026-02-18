// src/components/Search/AdvancedSearchForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
    Typography,
    Button,
    Box,
} from "@mui/material";
import AdvancedSearchResults from "./AdvancedSearchResults.js";
import useApiData from "../../hooks/useApiData.js";
import getBaseUrl from '../../utils/GetUrl.js';
import { Link, useNavigate } from 'react-router-dom';
import StyledFormField from '../common/StyledFormField.jsx';
import AutocompleteInput from '../common/renderAutocomplete.jsx'; // This is the AutocompleteInput from your working context
import CountryStateCitySelector from "../common/CountryStateCitySelector.js";
import MultiSelectCheckbox from '../common/MultiSelectCheckbox.js';

const AdvancedSearchForm = () => {
    const navigate = useNavigate();
// --- Default "Looking For" based on logged-in user's profile type ---
const getOppositeProfileFor = (myProfileFor) => {
  if (!myProfileFor) return "";
  const val = String(myProfileFor).trim().toLowerCase();
  if (val === "bride") return "Bridegroom";
  if (val === "bridegroom") return "Bride";
  return "";
};

const getLoggedInUserProfileFor = () => {
  try {
    const ss =
      sessionStorage.getItem("profileFor") ||
      sessionStorage.getItem("myProfileFor") ||
      sessionStorage.getItem("profile_for");
    if (ss === "Bride" || ss === "Bridegroom") return ss;

    const raw =
      localStorage.getItem("userProfile") ||
      localStorage.getItem("profile") ||
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    if (!raw) return "";

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


  const [isLookingForLocked, setIsLookingForLocked] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState({
        profileId: "",
        profileFor: "",
        minAge: "",
        maxAge: "",
        maritalStatus: "",
        motherTongue: "",
        profileCategory: "",
        heightMinFeet: "",
        heightMinInches: "",
        heightMaxFeet: "",
        heightMaxInches: "",
        hobbies: [],

        currentLocationCountry: "",
        currentLocationState: "",
        currentCityOfResidence: "",
        nativePlaceCountry: "",
        nativePlaceState: "",
        nativePlace: "",

        education: "",
        profession: "",
        workingStatus: "",
        income: "",

        fatherProfession: "",
        motherProfession: "",
        familyStatus: "",
        familyType: "",
        traditionalValues: "",

        gotra: "",
        rashi: "",
        nakshatra: "",
        subCaste: "",
        guruMatha: "",

        religiousValues: "",
        castingDetails: "",
        faithLiving: "",
        dailyRituals: "",
        observersRajamanta: "",
        observersChaturmasya: "",
    });

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Local states for Autocomplete `show` flags, as your current AutocompleteInput expects them
    const [motherTongueShow, setMotherTongueShow] = useState(false);
    const [guruMathaShow, setGuruMathaShow] = useState(false);
    // Education and Profession might not need 'show' state if their options are static and not dynamically searched
    const [educationShow, setEducationShow] = useState(false); // Kept for consistency if renderAutocomplete uses it
    const [professionShow, setProfessionShow] = useState(false); // Kept for consistency if renderAutocomplete uses it


    const {
        isLoading: apiDataLoading,
        error: apiDataError,
        gotraOptions,
        rashiOptions,
        nakshatraOptions,
        // These are functions to fetch dynamic autocomplete options
        searchMotherTongues,
        searchGuruMatha,
        searchProfessions, // This is a function that returns professions based on query
        professionOptions: allProfessionOptions, // This is the full list from useApiData initial fetch
        searchEducation, // This is a function that returns educations based on query
        educationOptions: allEducationOptions, // This is the full list from useApiData initial fetch
        searchPlaces,
    } = useApiData();


    // States to control the text input for Autocomplete components
    const [motherTongueInput, setMotherTongueInput] = useState(searchQuery.motherTongue || "");
    const [guruMathaInput, setGuruMathaInput] = useState(searchQuery.guruMatha || "");
    const [educationInput, setEducationInput] = useState(searchQuery.education || "");
    const [professionInput, setProfessionInput] = useState(searchQuery.profession || "");
    // Father/Mother profession were not autocompletes, removed their input states here for clarity.
    // If they were, they'd need similar setup.

    // States to hold the options (suggestions) for Autocomplete components
    // These will be dynamically updated by the AutocompleteInput component via `setOptions` prop and `searchFn`.
    const [motherTongueAutocompleteOptions, setMotherTongueAutocompleteOptions] = useState([]);
    const [guruMathaAutocompleteOptions, setGuruMathaAutocompleteOptions] = useState([]);
    const [professionAutocompleteOptions, setProfessionAutocompleteOptions] = useState([]);
    const [educationAutocompleteOptions, setEducationAutocompleteOptions] = useState([]);


    // Effect to initialize autocomplete input fields when searchQuery changes
    // This makes sure if you programmatically set searchQuery.motherTongue, the input updates.
    useEffect(() => {
        setMotherTongueInput(searchQuery.motherTongue || "");
        setGuruMathaInput(searchQuery.guruMatha || "");
        setEducationInput(searchQuery.education || "");
        setProfessionInput(searchQuery.profession || "");
        // Only update if current input differs from searchQuery value
    }, [
        searchQuery.motherTongue, searchQuery.guruMatha,
        searchQuery.education, searchQuery.profession,
    ]);

  useEffect(() => {
    const myProfileFor = getLoggedInUserProfileFor();
    const opposite = getOppositeProfileFor(myProfileFor);

    if (opposite) {
      setSearchQuery((prev) => ({ ...prev, profileFor: opposite }));
      setIsLookingForLocked(true);
    } else {
      setIsLookingForLocked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    // Define static options for Select fields (unchanged)
    const profileForOptions = [
        { label: "Bride", value: "Bride" },
        { label: "Bridegroom", value: "Bridegroom" }
    ];

    const maritalStatusOptions = [
        { label: "Single (Never Married)", value: "Single (Never Married)" },
        { label: "Divorced", value: "Divorced" },
        { label: "Separated", value: "Separated" },
        { label: "Widowed", value: "Widowed" }
    ];

    const profileCategoryOptions = [
        { label: "Select Category", value: "" },
        { label: "Domestic-India", value: "Domestic-India" },
        { label: "International", value: "International" },
        { label: "Vaidika", value: "Vaidika" },
        { label: "Anyone", value: "Anyone" },
    ];

    const hobbyOptions = [
{ label: 'Reading' },
      { label: 'Traveling' },
      { label: 'Music' },
      { label: 'Sports' },
      { label: 'Art & Craft' },
      { label: 'Cooking' },
      { label: 'Meditation' },
      { label: 'Gardening' },
      { label: 'Photography' },
      { label: 'Contributing to Social Activities' },
      { label: 'Intersted / Participating in Aradhana' },
      { label: 'Intersted / Participating in Patha' },
      { label: 'Intersted / Participating in Pravachana' },
      { label: 'Intersted / Participating in Bhajane' },
      { label: 'Intersted / Practicing Puja' },
      { label: 'Intersted / Practicing Sandhyavandane' },
      { label: 'Intersted / Practicing Tulasi Puje' },
      { label: 'Menstruration Practices' },
      { label: 'Observing Chaturmasya' }
    ];

    const workingStatusOptions = [
        { label: "Select", value: "" },
        { label: "Working in Private Company", value: "Working in Private Company" },
        { label: "Working in Government / Public Sector", value: "Working in Government / Public Sector" },
        { label: "Business / Self Employed", value: "Business / Self Employed" },
        { label: "Defense / Civil Services", value: "Defense / Civil Services" },
        { label: "Not working", value: "Not working" },
        { label: "Others", value: "Others" },
    ];

    const incomeOptions = [
        { label: "Select Income Range", value: "" },
        { label: "Below ₹2 Lakh", value: "Below ₹2 Lakh" },
        { label: "₹2 to ₹4 Lakh", value: "₹2 to ₹4 Lakh" },
        { label: "₹4 to ₹6 Lakh", value: "₹4 to ₹6 Lakh" },
        { label: "₹6 to ₹10 Lakh", value: "₹6 to ₹10 Lakh" },
        { label: "₹10 to ₹15 Lakh", value: "₹10 to ₹15 Lakh" },
        { label: "₹15 to ₹25 Lakh", value: "₹15 to ₹25 Lakh" },
        { label: "₹25 to ₹50 Lakh", value: "₹25 to ₹50 Lakh" },
        { label: "₹50 Lakh to ₹1 Crore", value: "₹50 Lakh to ₹1 Crore" },
        { label: "Above ₹1 Crore", value: "Above ₹1 Crore" }
    ];

    const familyStatusOptions = [
        { label: "Select Status", value: "" },
        { label: "Middle Class", value: "Middle Class" },
        { label: "Upper Middle Class", value: "Upper Middle Class" },
        { label: "Rich", value: "Rich" },
        { label: "Affluent", value: "Affluent" }
    ];

    const familyTypeOptions = [
        { label: "Select Type", value: "" },
        { label: "Nuclear", value: "Nuclear" },
        { label: "Joint", value: "Joint" },
        { label: "Extended", value: "Extended" }
    ];

    const subCasteOptions = [
        { label: "Madhva (ಮಾಧ್ವ)", value: "Madhva (ಮಾಧ್ವ)" },
        { label: "Smarta (ಸ್ಮಾರ್ತ)", value: "Smarta (ಸ್ಮಾರ್ತ)" },
        { label: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)", value: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)" },
        { label: "Others (ಇತರರು)", value: "Others (ಇತರರು)" }
    ];

    const religiousValuesOptions = [
        { label: "Select Religious Values", value: "" },
        { label: "Very Religious", value: "Very Religious" },
        { label: "Religious", value: "Religious" },
        { label: "Somewhat Religious", value: "Somewhat Religious" },
        { label: "Not Religious", value: "Not Religious" }
    ];
    const faithLivingOptions = [
        { label: "Select Faith Living", value: "" },
        { label: "Orthodox", value: "Orthodox" },
        { label: "Traditional", value: "Traditional" },
        { label: "Moderate", value: "Moderate" },
        { label: "Liberal", value: "Liberal" }
    ];
    const dailyRitualsOptions = [
        { label: "Select Daily Rituals", value: "" },
        { label: "Regular", value: "Regular" },
        { label: "Occasional", value: "Occasional" },
        { label: "Rarely", value: "Rarely" },
        { label: "Never", value: "Never" }
    ];
    const observersRajamantaOptions = [
        { label: "Select Observers Rajamanta", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Sometimes", value: "Sometimes" }
    ];
    const observersChaturmasyaOptions = [
        { label: "Select Observers Chaturmasya", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Sometimes", value: "Sometimes" }
    ];


    const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // 🔒 Do not allow edits to "Looking For" if locked
    if (name === "profileFor" && isLookingForLocked) {
        console.log("🔒 Ignoring change to profileFor (locked).");
        return;
    }

    setSearchQuery((prev) => ({ ...prev, [name]: value }));
    console.log(`handleChange called: ${name}: ${value}`);
}, [isLookingForLocked]);


    // NEW: Generic handler for AutocompleteInput's text change
    const handleAutocompleteInputChange = useCallback((name, value) => {
        if (name === "motherTongue") setMotherTongueInput(value);
        else if (name === "guruMatha") setGuruMathaInput(value);
        else if (name === "education") setEducationInput(value);
        else if (name === "profession") setProfessionInput(value);
        // Important: Also update the searchQuery for the actual search
        setSearchQuery((prev) => ({ ...prev, [name]: value }));
    }, []);


    const handleAutocompleteSelect = useCallback((name, value) => {
        // This handler is used by AutocompleteInput (src/components/common/renderAutocomplete.jsx)
        // It's passed as `onSelect` prop to AutocompleteInput.
        const selectedValue = typeof value === 'object' && value !== null
            ? value.value || value.label || ''
            : value;
        setSearchQuery((prev) => ({ ...prev, [name]: selectedValue }));
        // Also update the input state to reflect the selected value
        if (name === "motherTongue") setMotherTongueInput(selectedValue);
        else if (name === "guruMatha") setGuruMathaInput(selectedValue);
        else if (name === "education") setEducationInput(selectedValue);
        else if (name === "profession") setProfessionInput(selectedValue);
    }, []);

    const handleMultiSelectChange = useCallback((name, selectedOptions) => {
        const values = selectedOptions.map(option => option.value);
        setSearchQuery((prev) => ({ ...prev, [name]: values }));
    }, []);


    const getApiBaseUrl = () => {
  const base = String(getBaseUrl() || "").replace(/\/+$/, "");
  if (!base) return "";
  if (base.endsWith("/api")) return base;
  return `${base}/api`;
};

const safeReadJsonOrTextError = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    const txt = await response.text();
    const snippet = String(txt || "").slice(0, 200);
    console.log("❌ ADV SEARCH UI Non-JSON response content-type:", contentType);
    console.log("❌ ADV SEARCH UI Non-JSON response snippet:", snippet);
    throw new Error(
      `Non-JSON response from API (content-type: ${contentType}). Check API base URL (/api).`
    );
  }
  return await response.json();
};

const handleSearch = async () => {
  setLoading(true);
  setError(null);
  try {
    const searchPayload = { ...searchQuery };

    // ✅ CRITICAL: send logged-in profile id so backend can fetch myProfileFor from DB
    const myProfileId = sessionStorage.getItem("profileId") || "";
    console.log("🧾 ADV SEARCH UI myProfileId(from sessionStorage.profileId):", myProfileId || "(EMPTY)");
    searchPayload.myProfileId = myProfileId;

    // Optional debug/backward compat (may be empty)
    const myProfileFor = getLoggedInUserProfileFor();
    console.log("🧾 ADV SEARCH UI myProfileFor(from localStorage attempt):", myProfileFor || "(EMPTY)");
    searchPayload.myProfileFor = myProfileFor;

    // ✅ IMPORTANT: Do NOT force opposite in UI. Keep blank if user didn't select.
    if (!searchPayload.profileFor) {
      console.log("✅ ADV SEARCH UI profileFor not selected. Backend must apply opposite filter using myProfileId → DB → myProfileFor.");
    } else {
      console.log("ℹ️ ADV SEARCH UI profileFor selected by user:", searchPayload.profileFor);
    }

    // Convert min height from feet/inches to "X'Y\"" string
    if (searchQuery.heightMinFeet !== "" && searchQuery.heightMinInches !== "") {
      searchPayload.heightMin = `${searchQuery.heightMinFeet}'${searchQuery.heightMinInches}"`;
    } else {
      searchPayload.heightMin = "";
    }

    // Convert max height from feet/inches to "X'Y\"" string
    if (searchQuery.heightMaxFeet !== "" && searchQuery.heightMaxInches !== "") {
      searchPayload.heightMax = `${searchQuery.heightMaxFeet}'${searchQuery.heightMaxInches}"`;
    } else {
      searchPayload.heightMax = "";
    }

    delete searchPayload.heightMinFeet;
    delete searchPayload.heightMinInches;
    delete searchPayload.heightMaxFeet;
    delete searchPayload.heightMaxInches;

    console.log("🧾 ADV SEARCH UI sending payload:", searchPayload);

    const token =
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    console.log("🧾 ADV SEARCH UI token present:", !!token);

    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}/advancedSearchProfiles`;
    console.log("🧾 ADV SEARCH UI final URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(searchPayload),
    });

    if (!response.ok) {
      const errPayload = await safeReadJsonOrTextError(response);
      throw new Error(
        errPayload?.error || errPayload?.message || `HTTP error! Status: ${response.status}`
      );
    }

    const data = await safeReadJsonOrTextError(response);
    setSearchResults(data);
  } catch (err) {
    console.error("Advanced Search failed:", err);
    setError(err.message || "Advanced Search failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

    const handleBackToDashboard = () => {
        navigate('/Dashboard');
    };

    if (apiDataLoading) {
        return <Typography className="text-center py-8">Loading essential search options...</Typography>;
    }

    if (apiDataError) {
        return <Typography color="error" className="text-center py-8">Error loading search options: {apiDataError.message}</Typography>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 font-inter">
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/" className="text-xl font-bold text-indigo-700">
                        Advanced Profile Search
                    </Link>
                    <div className="space-x-4">
                        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">Dashboard</Link>
                    </div>
                </div>
            </nav>

            <section className="py-8">
                <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
                        <h1 className="text-2xl font-bold">Advanced Profile Search</h1>
                    </div>

                    <div className="p-6">
                        {/* 1. Basic & Personal Filters Section */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Basic & Personal Filters</h3>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
                                gap: 3,
                                maxWidth: "100%",
                            }}>
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
  selectOptions={profileForOptions}
  disabled={isLookingForLocked}
/>


                                {/* Profile Category: should come after Looking For */}
                                <StyledFormField
                                    label="Profile Category"
                                    name="profileCategory"
                                    value={searchQuery.profileCategory}
                                    onChange={handleChange}
                                    selectOptions={profileCategoryOptions}
                                />
                                {/* Marital Status and Mother Tongue: moved here */}
                                <StyledFormField
                                    label="Marital Status"
                                    name="maritalStatus"
                                    value={searchQuery.maritalStatus}
                                    onChange={handleChange}
                                    selectOptions={maritalStatusOptions}
                                />
                                {/* AutocompleteInput for Mother Tongue */}
                                <AutocompleteInput
                                    label="Mother Tongue"
                                    name="motherTongue"
                                    inputValue={motherTongueInput}
                                    inputSetter={(val) => handleAutocompleteInputChange("motherTongue", val)} // Pass custom setter
                                    options={motherTongueAutocompleteOptions} // These will be dynamically set by AutocompleteInput's searchFn
                                    setOptions={setMotherTongueAutocompleteOptions} // Pass AutocompleteInput's internal option setter
                                    loading={apiDataLoading} // Or specific loading state for this autocomplete
                                    searchFn={searchMotherTongues} // Function to fetch suggestions
                                    onSelect={handleAutocompleteSelect}
                                    show={motherTongueShow}
                                    setShow={setMotherTongueShow}
                                />
                                <div>   </div> {/* Placeholder for grid alignment */}
                                
                                <StyledFormField
                                    label="Min Age"
                                    type="number"
                                    name="minAge"
                                    value={searchQuery.minAge}
                                    onChange={handleChange}
                                />
                                <StyledFormField
                                    label="Max Age"
                                    type="number"
                                    name="maxAge"
                                    value={searchQuery.maxAge}
                                    onChange={handleChange}
                                />

                                {/* MIN HEIGHT - Feet & Inches (logically grouped) */}
                                <div>
                                    <StyledFormField
                                        label="Min Height (Feet)"
                                        name="heightMinFeet"
                                        value={searchQuery.heightMinFeet}
                                        onChange={handleChange}
                                        selectOptions={[4, 5, 6, 7].map(f => ({ label: `${f} ft`, value: String(f) }))}
                                    />
                                </div>
                                <div>
                                    <StyledFormField
                                        label="Min Height (Inches)"
                                        name="heightMinInches"
                                        value={searchQuery.heightMinInches}
                                        onChange={handleChange}
                                        selectOptions={[...Array(12).keys()].map(i => ({ label: `${i} in`, value: String(i) }))}
                                    />
                                </div>
                                {/* MAX HEIGHT - Feet & Inches (logically grouped) */}
                                <div>
                                    <StyledFormField
                                        label="Max Height (Feet)"
                                        name="heightMaxFeet"
                                        value={searchQuery.heightMaxFeet}
                                        onChange={handleChange}
                                        selectOptions={[4, 5, 6, 7].map(f => ({ label: `${f} ft`, value: String(f) }))}
                                    />
                                </div>
                                <div>
                                    <StyledFormField
                                        label="Max Height (Inches)"
                                        name="heightMaxInches"
                                        value={searchQuery.heightMaxInches}
                                        onChange={handleChange}
                                        selectOptions={[...Array(12).keys()].map(i => ({ label: `${i} in`, value: String(i) }))}
                                    />
                                </div>


{/* Hobbies full width */}
<div className="md:col-span-2">
  {/* Replaced <L> with a standard styled div/label to avoid reference errors */}
  <label className="mb-2 block text-sm font-medium text-gray-700">Hobbies</label>

  <div className="border rounded-lg p-3 bg-white max-h-64 overflow-y-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ---------- COLUMN 1 (General) ---------- */}
      <div>
        <div className="font-semibold text-gray-700 mb-2">General Hobbies</div>
        <div className="space-y-1">
          {hobbyOptions.slice(0, Math.ceil(hobbyOptions.length / 2)).map((opt, idx) => {
            // Handle both string array or object array options
            const label = opt.label || opt;
            const value = opt.value || opt;
            
            // Check against searchQuery.hobbies
            const isChecked = searchQuery.hobbies.includes(value);

            return (
              <label
                key={idx}
                className="flex items-start space-x-2 text-sm cursor-pointer rounded-md px-2 py-1 hover:bg-pink-50"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  checked={isChecked}
                  onChange={() => {
                    const current = searchQuery.hobbies || [];
                    let nextValues;
                    
                    if (isChecked) {
                      // Remove if already checked
                      nextValues = current.filter((h) => h !== value);
                    } else {
                      // Add if not checked
                      nextValues = [...current, value];
                    }

                    // Call your existing handler
                    // NOTE: Depending on how handleMultiSelectChange is written, 
                    // you might need to pass just 'nextValues' or a synthetic event.
                    // Assuming it acts like a standard input handler:
                    handleMultiSelectChange({ target: { name: 'hobbies', value: nextValues } });
                  }}
                />
                <span className="whitespace-normal break-words text-gray-700">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ---------- COLUMN 2 (Spiritual/Activities) ---------- */}
      <div>
        <div className="font-semibold text-gray-700 mb-2">Spiritual & Activities</div>
        <div className="space-y-1">
          {hobbyOptions.slice(Math.ceil(hobbyOptions.length / 2)).map((opt, idx) => {
            const label = opt.label || opt;
            const value = opt.value || opt;
            const isChecked = searchQuery.hobbies.includes(value);

            return (
              <label
                key={idx}
                className="flex items-start space-x-2 text-sm cursor-pointer rounded-md px-2 py-1 hover:bg-pink-50"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  checked={isChecked}
                  onChange={() => {
                    const current = searchQuery.hobbies || [];
                    let nextValues;
                    
                    if (isChecked) {
                      nextValues = current.filter((h) => h !== value);
                    } else {
                      nextValues = [...current, value];
                    }

                    handleMultiSelectChange({ target: { name: 'hobbies', value: nextValues } });
                  }}
                />
                <span className="whitespace-normal break-words text-gray-700">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  </div>
</div>


                            
                            
                            </Box>
                        </div>

                        {/* 2. Horoscope Details Section */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Horoscope Details</h3>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
                                gap: 3,
                                maxWidth: "100%",
                            }}>
                                {/* First Gotra */}
                                <StyledFormField
                                    label="Gotra"
                                    name="gotra"
                                    value={searchQuery.gotra}
                                    onChange={handleChange}
                                    selectOptions={gotraOptions.map(g => ({ label: g.label, value: g.label }))}
                                />
                                {/* Then Sub-caste */}
                                <StyledFormField
                                    label="Sub-caste"
                                    name="subCaste"
                                    value={searchQuery.subCaste}
                                    onChange={handleChange}
                                    selectOptions={subCasteOptions}
                                />
                                {/* Then Rashi */}
                                <StyledFormField
                                    label="Rashi"
                                    name="rashi"
                                    value={searchQuery.rashi}
                                    onChange={handleChange}
                                    selectOptions={rashiOptions.map(r => ({ label: r.label, value: r.label }))}
                                />
                                {/* Then Nakshatra */}
                                <StyledFormField
                                    label="Nakshatra"
                                    name="nakshatra"
                                    value={searchQuery.nakshatra}
                                    onChange={handleChange}
                                    selectOptions={nakshatraOptions.map(n => ({ label: n.label, value: n.label }))}
                                />
                                {/* Then Guru-maTtha */}
                                <AutocompleteInput
                                    label="Guru-maTtha"
                                    name="guruMatha"
                                    inputValue={guruMathaInput}
                                    inputSetter={(val) => handleAutocompleteInputChange("guruMatha", val)} // Pass custom setter
                                    options={guruMathaAutocompleteOptions}
                                    setOptions={setGuruMathaAutocompleteOptions}
                                    loading={apiDataLoading}
                                    searchFn={searchGuruMatha}
                                    onSelect={handleAutocompleteSelect}
                                    show={guruMathaShow}
                                    setShow={setGuruMathaShow}
                                />
                            </Box>
                        </div>

                        {/* 3. Location Details Section (now with 2 columns explicitly) */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Location Details</h3>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' }, // Adjusted to ensure 2 columns explicitly on medium/large
                                gap: 3,
                                maxWidth: "100%",
                            }}>
                                {/* Residing Location Column */}
                                <Box sx={{
                                    borderRight: { md: '1px solid #ccc' }, // Add a visual separator for the two columns
                                    paddingRight: { md: 2 }, // Padding for separator
                                    gridColumn: { xs: 'span 1', md: '1 / 2' } // Ensure it takes first column on md+
                                }}>
                                    <CountryStateCitySelector
                                        formData={searchQuery}
                                        handleChange={handleChange}
                                        countryField="currentLocationCountry"
                                        stateField="currentLocationState"
                                        cityField="currentCityOfResidence"
                                        labelPrefix="Residing"
                                        searchFn={searchPlaces}
                                    />
                                </Box>
                                {/* Native Place Column */}
                                <Box sx={{
                                    paddingLeft: { md: 2 }, // Padding for separator
                                    gridColumn: { xs: 'span 1', md: '2 / 3' } // Ensure it takes second column on md+
                                }}>
                                    <CountryStateCitySelector
                                        formData={searchQuery}
                                        handleChange={handleChange}
                                        countryField="nativePlaceCountry"
                                        stateField="nativePlaceState"
                                        cityField="nativePlace"
                                        labelPrefix="Native"
                                        searchFn={searchPlaces}
                                    />
                                </Box>
                            </Box>
                        </div>

                        {/* 4. Educational & Professional Details Section */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Educational & Professional Details</h3>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
                                gap: 3,
                                maxWidth: "100%",
                            }}>
                                {/* AutocompleteInput for Education */}
                                <AutocompleteInput
                                    label="Education"
                                    name="education"
                                    inputValue={educationInput}
                                    inputSetter={(val) => handleAutocompleteInputChange("education", val)} // Pass custom setter
                                    options={educationAutocompleteOptions}
                                    setOptions={setEducationAutocompleteOptions}
                                    loading={apiDataLoading}
                                    searchFn={searchEducation} // This will dynamically update options
                                    onSelect={handleAutocompleteSelect}
                                    show={educationShow}
                                    setShow={setEducationShow}
                                />
                                {/* AutocompleteInput for Profession */}
                                <AutocompleteInput
                                    label="Profession"
                                    name="profession"
                                    inputValue={professionInput}
                                    inputSetter={(val) => handleAutocompleteInputChange("profession", val)} // Pass custom setter
                                    options={professionAutocompleteOptions}
                                    setOptions={setProfessionAutocompleteOptions}
                                    loading={apiDataLoading}
                                    searchFn={searchProfessions} // This will dynamically update options
                                    onSelect={handleAutocompleteSelect}
                                    show={professionShow}
                                    setShow={setProfessionShow}
                                />
                                <StyledFormField
                                    label="Working Status"
                                    name="workingStatus"
                                    value={searchQuery.workingStatus}
                                    onChange={handleChange}
                                    selectOptions={workingStatusOptions}
                                />
                                <StyledFormField
                                    label="Annual Income"
                                    name="income"
                                    value={searchQuery.income}
                                    onChange={handleChange}
                                    selectOptions={incomeOptions}
                                />
                            </Box>
                        </div>

                        {/* 5. Family Details Section */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Family Details</h3>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
                                gap: 3,
                                maxWidth: "100%",
                            }}>

                                <StyledFormField
                                    label="Family Status"
                                    name="familyStatus"
                                    value={searchQuery.familyStatus}
                                    onChange={handleChange}
                                    selectOptions={familyStatusOptions}
                                />
                                <StyledFormField
                                    label="Family Type"
                                    name="familyType"
                                    value={searchQuery.familyType}
                                    onChange={handleChange}
                                    selectOptions={familyTypeOptions}
                                />
                                <StyledFormField
                                    label="Traditional Values"
                                    name="traditionalValues"
                                    value={searchQuery.traditionalValues}
                                    onChange={handleChange}
                                    selectOptions={religiousValuesOptions}
                                    placeholder="e.g., Conservative, Moderate, Liberal"
                                />
                            </Box>
                        </div>

                        {/* 6. Religious Details Section (now including Observers Rajamanta & Observers Chaturmasya) */}
                        <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Religious Details</h3>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)' },
                                gap: 3,
                                maxWidth: "100%",
                            }}>
                                <StyledFormField
                                    label="Religious Values"
                                    name="religiousValues"
                                    value={searchQuery.religiousValues}
                                    onChange={handleChange}
                                    selectOptions={religiousValuesOptions}
                                />
                                <StyledFormField
                                    label="Casting Details"
                                    name="castingDetails"
                                    value={searchQuery.castingDetails}
                                    onChange={handleChange}
                                    placeholder="e.g., Sub-sect details"
                                />
                                <StyledFormField
                                    label="Faith Living"
                                    name="faithLiving"
                                    value={searchQuery.faithLiving}
                                    onChange={handleChange}
                                    selectOptions={faithLivingOptions}
                                />
                                <StyledFormField
                                    label="Daily Rituals"
                                    name="dailyRituals"
                                    value={searchQuery.dailyRituals}
                                    onChange={handleChange}
                                    selectOptions={dailyRitualsOptions}
                                />
                                {/* Moved from "Additional Observances" section */}
                                <StyledFormField
                                    label="Observers Rajamanta"
                                    name="observersRajamanta"
                                    value={searchQuery.observersRajamanta}
                                    onChange={handleChange}
                                    selectOptions={observersRajamantaOptions}
                                />
                                {/* Moved from "Additional Observances" section */}
                                <StyledFormField
                                    label="Observers Chaturmasya"
                                    name="observersChaturmasya"
                                    value={searchQuery.observersChaturmasya}
                                    onChange={handleChange}
                                    selectOptions={observersChaturmasyaOptions}
                                />
                            </Box>
                        </div>


                        {/* Search and Back Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleBackToDashboard}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Back to Dashboard
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </Box>

                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        {/* Search Results */}
                        <Box sx={{ mt: 4 }}>
                            <AdvancedSearchResults results={searchResults} />
                        </Box>
                    </div>
                </div>
            </section>

            <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-8">
                <div className="container mx-auto px-6">
                    <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default AdvancedSearchForm;