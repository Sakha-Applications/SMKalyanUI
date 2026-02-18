import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import SearchResults from "./SearchResults";
import useApiData from "../../hooks/useApiData";
import getBaseUrl from "../../utils/GetUrl";
import { Link, useNavigate } from "react-router-dom";
import StyledFormField from "../common/StyledFormField";
import AutocompleteInput from "../common/renderAutocomplete";
import CountryStateCitySelector from "../common/CountryStateCitySelector";
//import dayjs from "dayjs";

const BasicSearchForm = () => {
  const navigate = useNavigate();

  // --- Opposite mapping (UI-side only for debug; server enforces it) ---
  const getOppositeProfileFor = (myProfileFor) => {
    if (!myProfileFor) return "";
    const val = String(myProfileFor).trim().toLowerCase();
    if (val === "bride") return "Bridegroom";
    if (val === "bridegroom") return "Bride";
    return "";
  };

  // Existing localStorage-based attempt (kept as-is), but we now rely on myProfileId from sessionStorage
  const getLoggedInUserProfileFor = () => {
    try {
      const raw =
        localStorage.getItem("userProfile") ||
        localStorage.getItem("profile") ||
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        localStorage.getItem("profileFor") ||
        localStorage.getItem("myProfileFor");

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

  // ✅ Normalize API base so we always call <host>/api/...
  const getApiBaseUrl = () => {
    const base = String(getBaseUrl() || "").replace(/\/+$/, "");
    if (!base) return "";
    if (base.endsWith("/api")) return base;
    return `${base}/api`;
  };

    // --- Lock "Looking For" based on logged-in user's profileFor (Bride/Bridegroom) ---
  const [isLookingForLocked, setIsLookingForLocked] = useState(false);

  const getMyProfileForFromStorage = () => {
    try {
      // try sessionStorage first (more reliable in your app)
      const ss =
        sessionStorage.getItem("profileFor") ||
        sessionStorage.getItem("myProfileFor") ||
        sessionStorage.getItem("profile_for");
      if (ss === "Bride" || ss === "Bridegroom") return ss;

      // fallback to your existing localStorage-based attempt
      const ls = getLoggedInUserProfileFor();
      if (ls === "Bride" || ls === "Bridegroom") return ls;

      return "";
    } catch {
      return "";
    }
  };

  const [searchQuery, setSearchQuery] = useState({
    profileId: "",
    profileFor: "",
    minAge: "",
    maxAge: "",
    maritalStatus: "",
    motherTongue: "",
    gotra: "",
    subCaste: "",
    guruMatha: "",
    currentCityOfResidence: "",
    currentLocationCountry: "",
    currentLocationState: "",
    income: "",
    traditionalValues: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    isLoading: apiDataLoading,
    error: apiDataError,
    gotraOptions,
    searchMotherTongues,
    getMotherTongueById,
    searchGuruMatha,
    searchPlaces,
    getPlaceById,
  } = useApiData();

  const [motherTongueInput, setMotherTongueInput] = useState(
    searchQuery.motherTongue || ""
  );
  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
  const [showMotherTongueOptions, setShowMotherTongueOptions] = useState(false);

  const [guruMathaInput, setGuruMathaInput] = useState(searchQuery.guruMatha || "");
  const [guruMathaOptions, setGuruMathaOptions] = useState([]);
  const [showGuruMathaOptions, setShowGuruMathaOptions] = useState(false);

  const profileForOptions = [
    { label: "Bride", value: "Bride" },
    { label: "Bridegroom", value: "Bridegroom" },
  ];

  const maritalStatusOptions = [
    { label: "Single (Never Married)", value: "Single (Never Married)" },
    { label: "Divorced", value: "Divorced" },
    { label: "Separated", value: "Separated" },
    { label: "Widowed", value: "Widowed" },
  ];

  const subCasteOptions = [
    { label: "Madhva (ಮಾಧ್ವ)", value: "Madhva (ಮಾಧ್ವ)" },
    { label: "Smarta (ಸ್ಮಾರ್ತ)", value: "Smarta (ಸ್ಮಾರ್ತ)" },
    { label: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)", value: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)" },
    { label: "Others (ಇತರರು)", value: "Others (ಇತರರು)" },
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
    { label: "Above ₹1 Crore", value: "Above ₹1 Crore" },
  ];

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
    console.log("🧾 UI DEBUG localStorage keys:", Object.keys(localStorage || {}));
    console.log("🧾 UI DEBUG sessionStorage keys:", Object.keys(sessionStorage || {}));

    const myProfileId = sessionStorage.getItem("profileId") || "";
    console.log("🧾 UI DEBUG myProfileId(from sessionStorage.profileId):", myProfileId || "(EMPTY)");

    const myProfileFor = getLoggedInUserProfileFor();
    console.log("🧾 UI DEBUG myProfileFor(from localStorage attempt):", myProfileFor || "(EMPTY)");
    console.log("🧾 UI DEBUG opposite LookingFor(would be):", getOppositeProfileFor(myProfileFor) || "(EMPTY)");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    useEffect(() => {
  let cancelled = false;

  const applyLock = (myProfileForResolved) => {
    const opposite = getOppositeProfileFor(myProfileForResolved);

    if (opposite) {
      setSearchQuery((prev) => ({ ...prev, profileFor: opposite }));
      setIsLookingForLocked(true);
      console.log("🔒 Looking For locked to:", opposite, "| myProfileFor:", myProfileForResolved);
    } else {
      setIsLookingForLocked(false);
      console.log("ℹ️ Looking For not locked. myProfileFor:", myProfileForResolved || "(EMPTY)");
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
          const token =
            sessionStorage.getItem("token") ||
            sessionStorage.getItem("authToken") ||
            localStorage.getItem("token") ||
            localStorage.getItem("authToken");

          const headers = {};
          if (token) headers.Authorization = `Bearer ${token}`;

          const apiBaseUrl = getApiBaseUrl(); // this is <host>/api
          const url = `${apiBaseUrl}/profile/${encodeURIComponent(myProfileId)}`;
          console.log("🧾 UI DEBUG Fetching my profileFor from:", url);

          const res = await fetch(url, { headers });
          if (res.ok) {
            const data = await res.json();
            myProfileForResolved =
              data?.profile_for || data?.profileFor || data?.profileForValue || "";

            // cache for next time (optional but helpful)
            if (myProfileForResolved) {
              sessionStorage.setItem("profileFor", myProfileForResolved);
            }
          } else {
            console.warn("⚠️ Could not fetch my profileFor. HTTP:", res.status);
          }
        } catch (e) {
          console.warn("⚠️ Error fetching my profileFor:", e?.message || e);
        }
      }
    }

    if (!cancelled) applyLock(myProfileForResolved);
  };

  init();

  return () => {
    cancelled = true;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔒 Do not allow edits to "Looking For" if locked
    if (name === "profileFor" && isLookingForLocked) {
      console.log("🔒 Ignoring change to profileFor (locked).");
      return;
    }

    setSearchQuery((prev) => ({ ...prev, [name]: value }));
    console.log(`handleChange called: ${name}: ${value}`);
  };

  const handleAutocompleteSelect = (name, value, id = null) => {
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
    if (id) {
      setSearchQuery((prev) => ({ ...prev, [`${name}Id`]: id }));
    }
  };

  const safeReadJsonOrTextError = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!isJson) {
      const txt = await response.text();
      const snippet = String(txt || "").slice(0, 200);
      console.log("❌ UI DEBUG Non-JSON response content-type:", contentType);
      console.log("❌ UI DEBUG Non-JSON response snippet:", snippet);
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
      const myProfileId = sessionStorage.getItem("profileId") || "";
      console.log("🧾 UI DEBUG handleSearch myProfileId:", myProfileId || "(EMPTY)");

      const myProfileFor = getLoggedInUserProfileFor(); // may be empty; server will derive from myProfileId
      console.log("🧾 UI DEBUG handleSearch myProfileFor:", myProfileFor || "(EMPTY)");

      const payload = { ...searchQuery };

      // ✅ CRITICAL: send logged-in profile id so backend can fetch myProfileFor from DB
      payload.myProfileId = myProfileId;

      // Keep this for backward compatibility/debug; backend will not rely on it
      payload.myProfileFor = myProfileFor;

      if (!payload.profileFor) {
        console.log("✅ UI DEBUG profileFor not selected. Backend must apply opposite filter using myProfileId → DB → myProfileFor.");
      } else {
        console.log("ℹ️ UI DEBUG profileFor selected by user:", payload.profileFor);
      }

      console.log("🧾 UI DEBUG Sending search request payload:", payload);

      // Prefer sessionStorage token (your login stores token there)
      const token =
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      console.log("🧾 BASIC SEARCH UI token present:", !!token);

      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const apiBaseUrl = getApiBaseUrl();
      console.log("🧾 BASIC SEARCH UI apiBaseUrl:", apiBaseUrl);

      // ✅ Correct route
      const url = `${apiBaseUrl}/searchProfiles`;
      console.log("🧾 BASIC SEARCH UI final URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
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
      console.error("Search failed:", err);
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/Dashboard");
  };

  if (apiDataLoading) {
    return <Typography>Loading essential search options...</Typography>;
  }

  if (apiDataError) {
    return (
      <Typography color="error">
        Error loading search options: {apiDataError.message}
      </Typography>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-xl font-bold text-indigo-700">
            Profile Search
          </Link>
          <div className="space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-8">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold">Basic Profile Search</h1>
          </div>

          <div className="p-6">
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
  selectOptions={profileForOptions}
  disabled={isLookingForLocked}
/>


              <StyledFormField label="Min Age" type="number" name="minAge" value={searchQuery.minAge} onChange={handleChange} />
              <StyledFormField label="Max Age" type="number" name="maxAge" value={searchQuery.maxAge} onChange={handleChange} />

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
                label="Gotra Other than"
                name="gotra"
                value={searchQuery.gotra}
                onChange={handleChange}
                selectOptions={gotraOptions.map((g) => ({ label: g.label, value: g.label }))}
              />

              <StyledFormField
                label="Sub-caste"
                name="subCaste"
                value={searchQuery.subCaste}
                onChange={handleChange}
                selectOptions={subCasteOptions}
              />

              <AutocompleteInput
                label="Guru-maTtha"
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

              <StyledFormField
                label="Income"
                name="income"
                value={searchQuery.income}
                onChange={handleChange}
                selectOptions={incomeOptions}
              />

              <StyledFormField
                label="Traditional Values"
                name="traditionalValues"
                value={searchQuery.traditionalValues}
                onChange={handleChange}
                selectOptions={traditionalValuesOptions}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
              <Button variant="outlined" color="secondary" onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>

              <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </Box>

            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 4 }}>
              <SearchResults results={searchResults} />
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

export default BasicSearchForm;
