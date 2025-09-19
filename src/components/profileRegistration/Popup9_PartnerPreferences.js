// src/components/profileRegistration/Popup9_PartnerPreferences.js
import React, { useEffect, useState } from "react";
import { Label as L, TextArea as TA, Button as B, Select as S } from "../common/FormElements";
import Slider from "@mui/material/Slider";
import ValidationErrorDialog from "../common/ValidationErrorDialog";
import validateRequiredFields from "../common/validateRequiredFields";
import MultiSelectCheckbox from "../common/MultiSelectCheckbox";
import useApiData from "../../hooks/useApiData";
import MultiCountryStateCitySelector from "../common/MultiCountryStateCitySelector";

// Static option sets
const maritalStatusOptions = [
  { label: "Single (Never Married)" },
  { label: "Divorced" },
  { label: "Widowed" },
  { label: "Separated" },
  { label: "Anyone" },
];

const brideGroomCategoryOptions = [
  { label: "Domestic" },
  { label: "International" },
  { label: "Vaidhik" },
  { label: "Anyone" },
];

const hobbyOptions = [
  { label: "Reading" },
  { label: "Traveling" },
  { label: "Music" },
  { label: "Sports" },
  { label: "Art & Craft" },
  { label: "Cooking" },
  { label: "Meditation" },
  { label: "Gardening" },
  { label: "Photography" },
];

const subCasteOptions = [
  { label: "Madhva (ಮಾಧ್ವ)" },
  { label: "Smarta (ಸ್ಮಾರ್ತ)" },
  { label: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)" },
  { label: "Others (ಇತರರು)" },
];

// —— shared helpers (dedupe like Popup3) ——
const normKey = (x) => String(x?.label ?? x?.value ?? x).trim().toLowerCase();
const pickLabel = (x) => String(x?.label ?? x?.value ?? x).trim();
const dedupeToLabels = (values = []) =>
  [...new Map(values.map((v) => [normKey(v), pickLabel(v)])).values()];
const toUniqueSelectedObjects = (arr = []) =>
  [...new Map(arr.map((item) => [normKey(item), pickLabel(item)])).values()].map((label) => ({
    label,
    value: label,
  }));

// Small chevron icon that rotates when open
const Chevron = ({ open }) => (
  <svg
    className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : "rotate-0"}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
);

const Popup9_PartnerPreferences = ({
  formData,
  handleChange,
  handleIntermediateProfileUpdate,
  setIsProcessing,
  onPrevious,
  onNext,
}) => {
  // Section collapses
  const [openBasic, setOpenBasic] = useState(true);
  const [openLocation, setOpenLocation] = useState(false);
  const [openEduCareer, setOpenEduCareer] = useState(false);
  const [openCultural, setOpenCultural] = useState(false);
  const [openLifestyle, setOpenLifestyle] = useState(false);

  // Validation
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Data hooks
  const {
    searchEducation,
    searchMotherTongues,
    gotraOptions,
    rashiOptions,
    nakshatraOptions,
    searchGuruMatha,
    searchPlaces,
    searchProfessions,
  } = useApiData();

  // ===== Searchable multiselect states =====
  // Education
  const [educationInput, setEducationInput] = useState("");
  const [educationOptions, setEducationOptions] = useState([]);
  const [educationLoading, setEducationLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (educationInput.length >= 2) {
        setEducationLoading(true);
        try {
          const results = await searchEducation(educationInput);
          const mapped = (results || []).map((item) => ({
            label: item.label || item.name || item.education || item,
            value: item.label || item.name || item.education || item,
          }));
          setEducationOptions(mapped);
        } finally {
          setEducationLoading(false);
        }
      } else if (educationInput.length === 0) {
        setEducationOptions([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [educationInput, searchEducation]);

  // Mother Tongues
  const [motherTongueInput, setMotherTongueInput] = useState("");
  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
  const [motherTongueLoading, setMotherTongueLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (motherTongueInput.length >= 2) {
        setMotherTongueLoading(true);
        try {
          const results = await searchMotherTongues(motherTongueInput);
          const mapped = (results || []).map((item) => ({
            label: item.mother_tongue || item.label || item,
            value: item.mother_tongue || item.label || item,
          }));
          setMotherTongueOptions(mapped);
        } finally {
          setMotherTongueLoading(false);
        }
      } else if (motherTongueInput.length === 0) {
        setMotherTongueOptions([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [motherTongueInput, searchMotherTongues]);

  const handleEducationChange = (name, values) => {
    handleChange({ target: { name, value: dedupeToLabels(values) } });
    setEducationInput("");
  };
  const handleMotherTongueChange = (name, values) => {
    handleChange({ target: { name, value: dedupeToLabels(values) } });
    setMotherTongueInput("");
  };

  // Guru Matha search
  const [guruMathaInput, setGuruMathaInput] = useState("");
  const [guruMathaOptions, setGuruMathaOptions] = useState([]);
  const [guruMathaLoading, setGuruMathaLoading] = useState(false);

  useEffect(() => {
    const d = setTimeout(async () => {
      if (guruMathaInput.length >= 2) {
        setGuruMathaLoading(true);
        const results = await searchGuruMatha(guruMathaInput);
        setGuruMathaOptions(
          Array.isArray(results)
            ? results.map((r) => ({ label: r.label || r }))
            : []
        );
        setGuruMathaLoading(false);
      } else {
        setGuruMathaOptions([]);
      }
    }, 300);
    return () => clearTimeout(d);
  }, [guruMathaInput, searchGuruMatha]);

  // Places & Professions search
  const [originInput, setOriginInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [professionInput, setProfessionInput] = useState("");

  const [professionOptions, setProfessionOptions] = useState([]);
  const [professionLoading, setProfessionLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (professionInput.length >= 2) {
        setProfessionLoading(true);
        const res = await searchProfessions(professionInput);
        setProfessionOptions(
          Array.isArray(res) ? res.map((i) => ({ label: i.label || i })) : []
        );
        setProfessionLoading(false);
      } else {
        setProfessionOptions([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [professionInput, searchProfessions]);

  // Helpers
  const cmToFeetInches = (cm) => {
    const inchesTotal = Math.round(cm / 2.54);
    const feet = Math.floor(inchesTotal / 12);
    const inches = inchesTotal % 12;
    return `${feet}ft ${inches}in`;
  };

  const ageRange = formData.ageRange || [25, 35];
  const heightRange = formData.heightRange || [150, 180];
  const incomeRange = formData.preferredIncomeRange || [5, 20];

  // Save / Validate (keep minimal requireds like earlier)
  const handleSave = async () => {
    const requiredFields = {
      expectations: "Expectations",
      preferredMaritalStatus: "Preferred Marital Status",
      preferredBrideGroomCategory: "Preferred Bride/Groom Category",
    };
    const newErrors = validateRequiredFields(formData || {}, requiredFields || {});
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      setShowErrorDialog(true);
      return;
    }
    const ok = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
    if (ok) onNext();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white">What are you looking for in a partner?
</h1>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <ValidationErrorDialog
            errors={errors}
            isOpen={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
          />

          {/* ========== 1) Basic Details ========== */}
          <section className="bg-white rounded-lg shadow border">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 border-b font-semibold"
              onClick={() => setOpenBasic((s) => !s)}
            >
              <span>Basic Details</span>
              <Chevron open={openBasic} />
            </button>
            {openBasic && (
              <div className="p-4 space-y-6">
                <div>
                  <L>Expectations</L>
                  <TA
                    name="expectations"
                    value={formData.expectations || ""}
                    onChange={handleChange}
                    placeholder="Write something about your preferred match..."
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <L>Preferred Age Range</L>
                    <span className="text-sm text-gray-600">
                      {ageRange[0]} – {ageRange[1]} yrs
                    </span>
                  </div>
                  <Slider
                    value={ageRange}
                    onChange={(e, val) =>
                      handleChange({ target: { name: "ageRange", value: val } })
                    }
                    valueLabelDisplay="off"
                    min={18}
                    max={60}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <L>Preferred Height Range</L>
                    <span className="text-sm text-gray-600">
                      {cmToFeetInches(heightRange[0])} – {cmToFeetInches(heightRange[1])}
                    </span>
                  </div>
                  <Slider
                    value={heightRange}
                    onChange={(e, val) =>
                      handleChange({
                        target: { name: "heightRange", value: val },
                      })
                    }
                    valueLabelDisplay="off"
                    min={120}
                    max={210}
                    marks={[120, 150, 180, 210].map((v) => ({
                      value: v,
                      label: cmToFeetInches(v),
                    }))}
                  />
                </div>

                <div>
                  <L htmlFor="preferredMaritalStatus">Preferred Marital Status</L>
                  <S
                    name="preferredMaritalStatus"
                    value={formData.preferredMaritalStatus || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- Select --</option>
                    {maritalStatusOptions.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </S>
                </div>

                <MultiSelectCheckbox
                  label="Preferred Mother Tongue"
                  name="preferredMotherTongues"
                  options={motherTongueOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredMotherTongues)}
                  onSearch={setMotherTongueInput}
                  searchInput={motherTongueInput}
                  onChange={(name, values) =>
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    })
                  }
                  placeholder="Type to search mother tongue (min 2 characters)"
                  loading={motherTongueLoading}
                />

                <div>
                  <L htmlFor="preferredBrideGroomCategory">Preferred Bride/Groom Category</L>
                  <S
                    name="preferredBrideGroomCategory"
                    value={formData.preferredBrideGroomCategory || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- Select --</option>
                    {brideGroomCategoryOptions.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </S>
                </div>

                <MultiSelectCheckbox
                  label="Gotra"
                  name="preferredGotras"
                  options={gotraOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredGotras)}
                  onChange={(name, values) =>
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    })
                  }
                />
              </div>
            )}
          </section>

          {/* ========== 2) Location ========== */}
          <section className="bg-white rounded-lg shadow border">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 border-b font-semibold"
              onClick={() => setOpenLocation((s) => !s)}
            >
              <span>Location</span>
              <Chevron open={openLocation} />
            </button>
            {openLocation && (
              <div className="p-4 space-y-6">
                <MultiCountryStateCitySelector
                  labelPrefix="Origin of Native"
                  name="preferredNativeOrigins"
                  selectedValues={formData.preferredNativeOrigins || []}
                  onChange={(name, values) =>
                    handleChange({ target: { name, value: values } })
                  }
                />

                <MultiCountryStateCitySelector
                  labelPrefix="City Living In"
                  name="preferredCities"
                  selectedValues={formData.preferredCities || []}
                  onChange={(name, values) =>
                    handleChange({ target: { name, value: values } })
                  }
                />
              </div>
            )}
          </section>

          {/* ========== 3) Education & Career ========== */}
          <section className="bg-white rounded-lg shadow border">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 border-b font-semibold"
              onClick={() => setOpenEduCareer((s) => !s)}
            >
              <span>Education & Career</span>
              <Chevron open={openEduCareer} />
            </button>
            {openEduCareer && (
              <div className="p-4 space-y-6">
                <MultiSelectCheckbox
                  label="Preferred Education"
                  name="preferredEducation"
                  options={educationOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredEducation)}
                  onSearch={setEducationInput}
                  searchInput={educationInput}
                  onChange={(name, values) =>
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    })
                  }
                  placeholder="Type to search education (min 2 characters)"
                  loading={educationLoading}
                />

                <MultiSelectCheckbox
                  label="Preferred Profession"
                  name="preferredProfessions"
                  options={professionOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredProfessions)}
                  onSearch={setProfessionInput}
                  searchInput={professionInput}
                  loading={professionLoading}
                  onChange={(name, values) => {
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    });
                    setProfessionInput("");
                  }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <L>Annual Income in INR Lacs</L>
                    <span className="text-sm text-gray-600">
                      ₹{incomeRange[0]} – ₹{incomeRange[1]} Lakh
                    </span>
                  </div>
                  <Slider
                    value={incomeRange}
                    onChange={(e, val) =>
                      handleChange({
                        target: { name: "preferredIncomeRange", value: val },
                      })
                    }
                    valueLabelDisplay="off"
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            )}
          </section>

          {/* ========== 4) Cultural Details ========== */}
          <section className="bg-white rounded-lg shadow border">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 border-b font-semibold"
              onClick={() => setOpenCultural((s) => !s)}
            >
              <span>Cultural Details</span>
              <Chevron open={openCultural} />
            </button>
            {openCultural && (
              <div className="p-4 space-y-6">
                <MultiSelectCheckbox
                  label="Sub Caste"
                  name="preferredSubCastes"
                  options={subCasteOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredSubCastes)}
                  onChange={(name, values) =>
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    })
                  }
                />

                <MultiSelectCheckbox
                  label="Guru Matha"
                  name="preferredGuruMathas"
                  placeholder="Type to search Guru matha (min 2 characters)"
                  options={guruMathaOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredGuruMathas)}
                  onSearch={setGuruMathaInput}
                  searchInput={guruMathaInput}
                  onChange={(name, values) => {
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    });
                    setGuruMathaInput("");
                  }}
                  loading={guruMathaLoading}
                />

                <MultiSelectCheckbox
                  label="Nakshatra"
                  name="preferredNakshatras"
                  options={nakshatraOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredNakshatras)}
                  onChange={(name, values) =>
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    })
                  }
                />

                <MultiSelectCheckbox
                  label="Rashi"
                  name="preferredRashis"
                  options={rashiOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredRashis)}
                  onChange={(name, values) =>
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    })
                  }
                />
              </div>
            )}
          </section>

          {/* ========== 5) Lifestyle ========== */}
          <section className="bg-white rounded-lg shadow border">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 border-b font-semibold"
              onClick={() => setOpenLifestyle((s) => !s)}
            >
              <span>Lifestyle</span>
              <Chevron open={openLifestyle} />
            </button>
            {openLifestyle && (
              <div className="p-4">
                <MultiSelectCheckbox
                  label="Hobbies"
                  name="preferredHobbies"
                  options={hobbyOptions}
                  selectedValues={toUniqueSelectedObjects(formData.preferredHobbies)}
                  onChange={(name, values) =>
                    handleChange({
                      target: { name, value: dedupeToLabels(values) },
                    })
                  }
                />
              </div>
            )}
          </section>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <B variant="outline" onClick={onPrevious}>
              Previous
            </B>
            <B onClick={handleSave}>Save & Finish ✅</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup9_PartnerPreferences;
