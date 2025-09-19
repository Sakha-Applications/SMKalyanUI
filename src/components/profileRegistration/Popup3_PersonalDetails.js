// src/components/profileRegistration/Popup3_PersonalDetails.js

import React, { useState, useEffect } from 'react';
import { Label as L, Input as I, Select as S, TextArea, Button as B } from '../common/FormElements';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import CountryStateCitySelector from "../common/CountryStateCitySelector";
import useApiData from '../../hooks/useApiData';

const Popup3_PersonalDetails = ({
  formData,
  handleChange,
  handleTimeBlur,
  onNext,
  onPrevious,
  setIsProcessing,
  handleIntermediateProfileUpdate
}) => {
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // --- Horoscope data sources (options + search) ---
  const {
    gotraOptions,
    rashiOptions,
    nakshatraOptions,
    searchGuruMatha,
  } = useApiData();

  // --- Guru Matha autocomplete state/logic ---
  const [guruMathaInput, setGuruMathaInput] = useState(formData.guruMatha || '');
  const [guruMathaOptions, setGuruMathaOptions] = useState([]);
  const [showGuruMatha, setShowGuruMatha] = useState(false);
  const [loadingGuruMatha, setLoadingGuruMatha] = useState(false);
  const [justSelectedGuruMatha, setJustSelectedGuruMatha] = useState(false);

  useEffect(() => {
    const listener = (e) => {
      if (!e.target.closest('.autocomplete-dropdown')) setShowGuruMatha(false);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, []);

  // 🔧 FIX #1: Stop relisting after selection; hide when input matches selected value or < 2 chars
  useEffect(() => {
    if (justSelectedGuruMatha) {
      setJustSelectedGuruMatha(false);
      return;
    }

    const input = (guruMathaInput || '').trim();
    const selected = (formData.guruMatha || '').trim();

    // If input is short OR exactly equals the selected value, hide & clear the list
    if (input.length < 2 || input === selected) {
      setShowGuruMatha(false);
      setGuruMathaOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingGuruMatha(true);
      const results = await searchGuruMatha(input);
      setGuruMathaOptions(results || []);
      setShowGuruMatha((results || []).length > 0);
      setLoadingGuruMatha(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [guruMathaInput, justSelectedGuruMatha, formData.guruMatha, searchGuruMatha]);

  const handleSelectGuruMatha = (value) => {
    setJustSelectedGuruMatha(true);
    setGuruMathaInput(value.label);
    setGuruMathaOptions([]);        // ✅ clear options after selection
    setShowGuruMatha(false);        // ✅ keep list hidden
    handleChange({ target: { name: 'guruMatha', value: value.label } });
  };

  const hobbyOptions = [
    { label: 'Reading' },
    { label: 'Traveling' },
    { label: 'Music' },
    { label: 'Sports' },
    { label: 'Art & Craft' },
    { label: 'Cooking' },
    { label: 'Meditation' },
    { label: 'Gardening' },
    { label: 'Photography' }
  ];

  const getAgeWithMonths = (dob) => {
    if (!dob) return '';
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months = (months + 12) % 12;
    }
    return `${years} years${months > 0 ? ` ${months} months` : ''}`;
  };

  const validateAndProceed = async () => {
    const newErrors = {};
    // existing validations
    if (!formData.marriedStatus) newErrors.marriedStatus = "Married Status is required";
    if (!formData.heightFeet || !formData.heightInches) newErrors.height = "Height is required";
    if (!formData.profileCategory) newErrors.profileCategory = "Bride/Groom category is required";

    // --- horoscope required validations ---
    if (!formData.gotra) newErrors.gotra = "Gotra is required";
    if (!formData.rashi) newErrors.rashi = "Rashi is required";
    if (!formData.nakshatra) newErrors.nakshatra = "Nakshatra is required";
    if (!formData.charanaPada) newErrors.charanaPada = "Charana Pada is required";
    if (!formData.subCaste) newErrors.subCaste = "Sub Caste is required";
    if (!formData.guruMatha) newErrors.guruMatha = "Guru Matha is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const success = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
      if (success) onNext();
    } else {
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          Ready to create your profile? Let's get started!
          Please fill in your Personal Details
        </h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <ValidationErrorDialog 
            errors={errors}
            isOpen={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
          />

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <L htmlFor="marriedStatus">Married Status <span className="text-red-500">*</span></L>
              <S name="marriedStatus" value={formData.marriedStatus} onChange={handleChange} required error={!!errors.marriedStatus}>
                <option value="">Select</option>
                <option value="Single (Never Married)">Single (Never Married)</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
              </S>
            </div>

            <div>
              <L>Height <span className="text-red-500">*</span></L>
              <div className="flex space-x-2">
                <S name="heightFeet" value={formData.heightFeet || ''} onChange={handleChange} required className="w-1/2" error={!!errors.height}>
                  <option value="">Feet</option>
                  {[4, 5, 6, 7].map(f => <option key={f} value={f}>{f} ft</option>)}
                </S>
                <S name="heightInches" value={formData.heightInches || ''} onChange={handleChange} required className="w-1/2" error={!!errors.height}>
                  <option value="">Inches</option>
                  {[...Array(12).keys()].map(i => <option key={i} value={i}>{i} in</option>)}
                </S>
              </div>
            </div>

            <div>
              <L htmlFor="profileCategory">Bride/Groom Category <span className="text-red-500">*</span></L>
              <S
                name="profileCategory"
                value={formData.profileCategory || ''}
                onChange={handleChange}
                required
                error={!!errors.profileCategory}
                className="w-full"
              >
                <option value="">Select Category</option>
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
                <option value="Vaidhik">Vaidhik</option>
                <option value="Anyone">Anyone</option>
              </S>
            </div>

            <div>
              <L htmlFor="timeOfBirth">Time of Birth</L>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={formData.timeOfBirth ? dayjs(formData.timeOfBirth, 'HH:mm:ss') : null}
                  onChange={(time) => {
                    const formatted = time ? time.format('HH:mm:ss') : '';
                    handleChange({ target: { name: 'timeOfBirth', value: formatted } });
                  }}
                  renderInput={(params) => (
                    <I
                      {...params}
                      name="timeOfBirth"
                      error={!!errors.timeOfBirth}
                      helperText={errors.timeOfBirth}
                      className="w-full"
                    />
                  )}
                />
              </LocalizationProvider>
              <div>
                <small>Select time of birth in hh:mm AM/PM format (e.g. 08:30 AM)</small>
              </div>
            </div>

            {/* --- Horoscope fields --- */}
            <div>
              <L>Gotra <span className="text-red-500">*</span></L>
              <S
                name="gotra"
                value={formData.gotra || ''}
                onChange={handleChange}
                required
                error={!!errors.gotra}
              >
                <option value="">Select Gotra</option>
                {(gotraOptions || []).map((g, i) => (
                  <option key={i} value={g.label}>{g.label}</option>
                ))}
              </S>
              {errors.gotra && <small className="text-red-500">{errors.gotra}</small>}
            </div>

            <div>
              <L>Rashi <span className="text-red-500">*</span></L>
              <S
                name="rashi"
                value={formData.rashi || ''}
                onChange={handleChange}
                required
                error={!!errors.rashi}
              >
                <option value="">Select Rashi</option>
                {(rashiOptions || []).map((r, i) => (
                  <option key={i} value={r.label}>{r.label}</option>
                ))}
              </S>
              {errors.rashi && <small className="text-red-500">{errors.rashi}</small>}
            </div>

            <div>
              <L>Nakshatra <span className="text-red-500">*</span></L>
              <S
                name="nakshatra"
                value={formData.nakshatra || ''}
                onChange={handleChange}
                required
                error={!!errors.nakshatra}
              >
                <option value="">Select Nakshatra</option>
                {(nakshatraOptions || []).map((n, i) => (
                  <option key={i} value={n.label}>{n.label}</option>
                ))}
              </S>
              {errors.nakshatra && <small className="text-red-500">{errors.nakshatra}</small>}
            </div>

            <div>
              <L>Charana Pada <span className="text-red-500">*</span></L>
              <S
                name="charanaPada"
                value={formData.charanaPada || ''}
                onChange={handleChange}
                required
                error={!!errors.charanaPada}
              >
                <option value="">Select</option>
                <option value="1st Pada">1st Pada</option>
                <option value="2nd Pada">2nd Pada</option>
                <option value="3rd Pada">3rd Pada</option>
                <option value="4th Pada">4th Pada</option>
              </S>
              {errors.charanaPada && <small className="text-red-500">{errors.charanaPada}</small>}
            </div>

            {/* Row: Sub Caste + Guru Matha */}
            <div>
              <L>Sub Caste <span className="text-red-500">*</span></L>
              <S
                name="subCaste"
                value={formData.subCaste || ''}
                onChange={handleChange}
                required
                error={!!errors.subCaste}
              >
                <option value="">Select</option>
                <option value="Madhva (ಮಾಧ್ವ)">Madhva (ಮಾಧ್ವ)</option>
                <option value="Smarta (ಸ್ಮಾರ್ತ)">Smarta (ಸ್ಮಾರ್ತ)</option>
                <option value="Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)">Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)</option>
                <option value="Others (ಇತರರು)">Others (ಇತರರು)</option>
              </S>
              {errors.subCaste && <small className="text-red-500">{errors.subCaste}</small>}
            </div>

            <div className="relative autocomplete-dropdown">
              <L>Guru Matha <span className="text-red-500">*</span></L>
              <I
                type="text"
                value={guruMathaInput}
                onChange={(e) => setGuruMathaInput(e.target.value)}
                placeholder="Start typing..."
                error={!!errors.guruMatha}
                className="w-full min-h-[40px]"
                onFocus={() => {
                  const input = (guruMathaInput || '').trim();
                  const selected = (formData.guruMatha || '').trim();
                  setShowGuruMatha(input.length >= 2 && input !== selected && (guruMathaOptions || []).length > 0);
                }}
                onBlur={() => setTimeout(() => setShowGuruMatha(false), 200)}
              />
              {!errors.guruMatha && (
                <small className="text-gray-400">Start typing to search</small>
              )}
              {errors.guruMatha && <small className="text-red-500">{errors.guruMatha}</small>}

              {loadingGuruMatha && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
              {showGuruMatha && (guruMathaOptions || []).length > 0 && (
                <ul className="absolute left-0 right-0 border rounded-md bg-white shadow-md max-h-40 overflow-y-auto mt-1 z-50">
                  {guruMathaOptions.map((opt, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                      onMouseDown={() => handleSelectGuruMatha(opt)}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Hobbies full width */}
            <div className="md:col-span-2">
              <MultiSelectCheckbox
                label="Hobbies"
                name="hobbies"
                options={hobbyOptions}
                selectedValues={
                  // ensure we don't render duplicates from formData either
                  Array.from(new Set((formData.hobbies || []).map(h => String(h).trim())))
                    .map(h => ({ label: h, value: h }))
                }
                onChange={(name, values) => {
                  // 🔧 FIX #2: dedupe (trim + case-insensitive) before saving
                  const norm = (x) => String(x?.label ?? x?.value ?? x).trim().toLowerCase();
                  const pick = (x) => String(x?.label ?? x?.value ?? x).trim();
                  const uniqueValues = [...new Map(values.map(v => [norm(v), pick(v)])).values()];
                  handleChange({ target: { name, value: uniqueValues } });
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            {/* Previous button hidden intentionally 
            <B variant="outline" onClick={onPrevious}>Previous</B>*/}
            <B onClick={validateAndProceed}>Save & Next</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup3_PersonalDetails;
