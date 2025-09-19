import React, { useState, useEffect } from 'react';
import { Label as L, Input as I, Select as S, Button as B } from '../common/FormElements';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';

import useApiData from '../../hooks/useApiData';

const Popup6A_HoroscopeDetails = ({ 
  formData, 
  handleChange, 
  onNext, 
  onPrevious, 
  handleIntermediateProfileUpdate,
  setIsProcessing 
}) => {
  const {
    gotraOptions,
    rashiOptions,
    nakshatraOptions,
    searchGuruMatha,
  } = useApiData();

  const [errors, setErrors] = useState({});

  const [guruMathaInput, setGuruMathaInput] = useState(formData.guruMatha || '');
  const [guruMathaOptions, setGuruMathaOptions] = useState([]);
  const [showGuruMatha, setShowGuruMatha] = useState(false);
  const [loadingGuruMatha, setLoadingGuruMatha] = useState(false);

  const [justSelectedGuruMatha, setJustSelectedGuruMatha] = useState(false);

  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    const listener = (e) => {
      if (!e.target.closest('.autocomplete-dropdown')) setShowGuruMatha(false);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, []);

  useEffect(() => {
    if (justSelectedGuruMatha) {
      setJustSelectedGuruMatha(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (guruMathaInput.length >= 2) {
        setLoadingGuruMatha(true);
        const results = await searchGuruMatha(guruMathaInput);
        setGuruMathaOptions(results || []);
        setShowGuruMatha(true);
        setLoadingGuruMatha(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [guruMathaInput]);

  const handleSelect = (name, value, setter) => {
    setter(value.label);
    setShowGuruMatha(false);
    handleChange({ target: { name, value: value.label } });
  };

  const validateAndProceed = async () => {
    // ✅ FIX: match Popup6 style — use object instead of array
    const requiredFields = {
      gotra: "Gotra",
      rashi: "Rashi",
      nakshatra: "Nakshatra",
      charanaPada: "Charana Pada",
      subCaste: "Sub Caste",
      guruMatha: "Guru Matha"
    };

    const newErrors = validateRequiredFields(formData, requiredFields);
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
      {/* Sticky Header (same as Popup6) */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          Let's cover your Horoscope Details
        </h1>
      </header>

      {/* Scrollable Content (same as Popup6) */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <ValidationErrorDialog 
            errors={errors}
            isOpen={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
          />

          {/* Profile Info Header */}
          <div className="bg-slate-100 border border-slate-300 rounded-md p-3 mb-4 shadow-sm text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
            <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
            <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <L>Gotra <span className="text-red-500">*</span></L>
              <S name="gotra" value={formData.gotra || ''} onChange={handleChange} required error={!!errors.gotra} helperText={errors.gotra}>
                <option value="">Select Gotra</option>
                {gotraOptions.map((g, i) => <option key={i} value={g.label}>{g.label}</option>)}
              </S>
            </div>

            <div>
              <L>Rashi <span className="text-red-500">*</span></L>
              <S name="rashi" value={formData.rashi || ''} onChange={handleChange} required error={!!errors.rashi} helperText={errors.rashi}>
                <option value="">Select Rashi</option>
                {rashiOptions.map((r, i) => <option key={i} value={r.label}>{r.label}</option>)}
              </S>
            </div>

            <div>
              <L>Nakshatra <span className="text-red-500">*</span></L>
              <S name="nakshatra" value={formData.nakshatra || ''} onChange={handleChange} required error={!!errors.nakshatra} helperText={errors.nakshatra}>
                <option value="">Select Nakshatra</option>
                {nakshatraOptions.map((n, i) => <option key={i} value={n.label}>{n.label}</option>)}
              </S>
            </div>

            <div>
              <L>Charana Pada <span className="text-red-500">*</span></L>
              <S name="charanaPada" value={formData.charanaPada || ''} onChange={handleChange} required error={!!errors.charanaPada} helperText={errors.charanaPada}>
                <option value="">Select</option>
                <option value="1st Pada">1st Pada</option>
                <option value="2nd Pada">2nd Pada</option>
                <option value="3rd Pada">3rd Pada</option>
                <option value="4th Pada">4th Pada</option>
              </S>
            </div>

            <div>
              <L>Sub Caste <span className="text-red-500">*</span></L>
              <S name="subCaste" value={formData.subCaste || ''} onChange={handleChange} required error={!!errors.subCaste} helperText={errors.subCaste}>
                <option value="">Select</option>
                <option value="Madhva (ಮಾಧ್ವ)">Madhva (ಮಾಧ್ವ)</option>
                <option value="Smarta (ಸ್ಮಾರ್ತ)">Smarta (ಸ್ಮಾರ್ತ)</option>
                <option value="Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)">Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)</option>
                <option value="Others (ಇತರರು)">Others (ಇತರರು)</option>
              </S>
            </div>

            {/* Guru Matha Autocomplete */}
            <div className="autocomplete-dropdown md:col-span-2">
              <L>Guru Matha <span className="text-red-500">*</span></L>
              <I
                type="text"
                value={guruMathaInput}
                onChange={(e) => setGuruMathaInput(e.target.value)}
                placeholder="Start typing..."
                error={!!errors.guruMatha}
                helperText={errors.guruMatha || 'Start typing to search'}
                onBlur={() => setTimeout(() => setShowGuruMatha(false), 200)}
              />
              {loadingGuruMatha && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
              {showGuruMatha && guruMathaOptions.length > 0 && (
                <ul className="border rounded-md bg-white shadow-md max-h-40 overflow-y-auto mt-1 z-50 relative">
                  {guruMathaOptions.map((opt, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                      onMouseDown={() => {
                        setJustSelectedGuruMatha(true);
                        handleSelect('guruMatha', opt, setGuruMathaInput);
                      }}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <B variant="outline" onClick={onPrevious}>Previous</B>
            <B onClick={validateAndProceed}>Save & Next</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup6A_HoroscopeDetails;
