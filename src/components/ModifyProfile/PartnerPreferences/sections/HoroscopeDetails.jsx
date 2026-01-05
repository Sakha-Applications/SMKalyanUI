// src/components/ModifyProfile/PartnerPreferences/sections/HoroscopeDetails.jsx

import React, { useEffect } from "react";
import { Select, Input as I } from "../../../common/FormElements";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import EnhancedAutocomplete from "../helpers/EnhancedAutocomplete";
import CountryStateCitySelector from "../../../common/CountryStateCitySelector";

// MODIFIED: DataRow no longer applies border/background.
// It should only handle padding and text styling.
const DataRow = ({ label, value }) => (
  <div className="p-4"> {/* Removed bg-gray-50, rounded-lg, border, border-gray-200 */}
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {value || '-'}
    </p>
  </div>
);

const HoroscopeDetails = ({
  profileData,
  formData,
  setFormData,
  mode = "view",
  gotraOptions = [],
  rashiOptions = [],
  nakshatraOptions = [],
  guruMathaOptions = [],
  guruMathaInput = '',
  setGuruMathaInput = () => {},
  guruMathaLoading = false,
  setGuruMathaOptions = () => {},
  searchGuruMatha = () => {},
}) => {

    const handleGuruMathaChange = (selectedValue) => {
    console.log("🔍 Guru Matha selected:", selectedValue);
    setFormData(prev => ({
      ...prev,
      guruMatha: selectedValue
    }));
  };

  const handleDropdownChange = (e, options, fieldName) => {
    const selectedValue = e.target.value;

    if (!selectedValue) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: null
      }));
      return;
    }

    const selectedObject = options.find(opt => String(opt.value) === String(selectedValue));

    console.log(`🔍 ${fieldName} selection:`, { selectedValue, selectedObject, options });

    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedObject || { label: selectedValue, value: selectedValue }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData?.((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">
        Horoscope Details
      </h2>

      {/* THIS IS THE MAIN ENCLOSING DIV FOR THE ENTIRE SECTION'S CONTENT */}
      {/* It wraps both the 'edit' mode and 'view' mode content */}
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              {/* BIRTH INFORMATION GROUPING */}
              <div className="md:col-span-2"> {/* This div spans both columns */}
                {/* Date, Time, Age - Nested Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Date of Birth - Read-only TextField */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                      </label>
                      <TextField
                          name="dob"
                          value={profileData?.dob ? profileData.dob.split('T')[0] : '-'}
                          InputProps={{
                              readOnly: true,
                              disableUnderline: true
                          }}
                          variant="standard"
                          sx={{
                              width: '100%',
                              backgroundColor: '#f0f0f0',
                              borderRadius: 1,
                              '& .MuiInputBase-root': { height: '40px' },
                              '& .MuiInputBase-input': { padding: '8px 14px' }
                          }}
                      />
                  </div>

                  {/* Time of Birth - Allow modification */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time of Birth *
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                              value={formData.timeOfBirth ? dayjs(formData.timeOfBirth, 'HH:mm:ss') : null}
                              onChange={(time) => {
                                  const formatted = time ? time.format('HH:mm:ss') : '';
                                  handleChange({ target: { name: 'timeOfBirth', value: formatted } });
                              }}
                              slotProps={{
                                  textField: {
                                      fullWidth: true,
                                      required: true,
                                      className: "w-full"
                                  }
                              }}
                          />
                      </LocalizationProvider>
                      <div>
                          <small>Select time of birth in hh:mm:ss format (e.g. 08:30:00)</small>
                      </div>
                  </div>

                  {/* Current Age - Read-only Input, displaying dynamic age */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Age
                      </label>
                      <I type="text" value=
                      {profileData?.current_age}
                      readOnly className="w-full bg-gray-100 cursor-not-allowed" />
                  </div>
                </div>

                {/* Place of Birth (Country, State, City) - Use CountryStateCitySelector */}
                <CountryStateCitySelector
                  formData={formData}
                  handleChange={handleChange}
                  countryField="placeOfBirthCountry"
                  stateField="placeOfBirthState"
                  cityField="placeOfBirth"
                  labelPrefix="Place of Birth"
                />
              </div>
              {/* END: Grouping for Date, Time, Age */}

              {/* Gotra Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gotra *
                </label>
                <Select
                  name="gotra"
                  value={formData?.gotra?.value || ''}
                  onChange={(e) => handleDropdownChange(e, gotraOptions, "gotra")}
                  className="w-full"
                >
                  <option value="">-- Select Gotra --</option>
                  {gotraOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {formData?.gotra && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formData.gotra.label}
                  </p>
                )}
              </div>

              {/* Rashi Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rashi *
                </label>
                <Select
                  name="rashi"
                  value={formData?.rashi?.value || ''}
                  onChange={(e) => handleDropdownChange(e, rashiOptions, "rashi")}
                  className="w-full"
                >
                  <option value="">-- Select Rashi --</option>
                  {rashiOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {formData?.rashi && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formData.rashi.label}
                  </p>
                )}
              </div>

              {/* Nakshatra Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nakshatra *
                </label>
                <Select
                  name="nakshatra"
                  value={formData?.nakshatra?.value || ''}
                  onChange={(e) => handleDropdownChange(e, nakshatraOptions, "nakshatra")}
                  className="w-full"
                >
                  <option value="">-- Select Nakshatra --</option>
                  {nakshatraOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {formData?.nakshatra && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formData.nakshatra.label}
                  </p>
                )}
              </div>

              {/* Charana Pada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charana Pada
                </label>
                <Select
                  name="charanaPada"
                  value={formData?.charanaPada || ''}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">-- Select Pada --</option>
                  <option value="1st Pada">1st Pada</option>
                  <option value="2nd Pada">2nd Pada</option>
                  <option value="3rd Pada">3rd Pada</option>
                  <option value="4th Pada">4st Pada</option>
                </Select>
              </div>

              {/* Sub Caste */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Caste
                </label>
                <Select
                  name="subCaste"
                  value={formData?.subCaste || ''}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">Select</option>
                  <option value="Madhva (ಮಾಧ್ವ)">Madhva (ಮಾಧ್ವ)</option>
                  <option value="Smarta (ಸ್ಮಾರ್ತ)">Smarta (ಸ್ಮಾರ್ತ)</option>
                  <option value="Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)">Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)</option>
                  <option value="Others (ಇತರರು)">Others (ಇತರರು)</option>
                </Select>
              </div>

              {/* Guru Matha Autocomplete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guru Matha
                </label>
                <EnhancedAutocomplete
                  id="guruMatha"
                  name="guruMatha"
                  label=""
                  options={guruMathaOptions}
                  inputValue={guruMathaInput}
                  inputSetter={setGuruMathaInput}
                  onChange={handleGuruMathaChange}
                  loading={guruMathaLoading}
                  setOptions={setGuruMathaOptions}
                  searchFn={searchGuruMatha}
                  placeholder="Type to search Guru Matha..."
                />
                {formData?.guruMatha && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {typeof formData.guruMatha === 'object' ? formData.guruMatha.label : formData.guruMatha}
                  </p>
                )}
              </div>
            </>
          ) : (
            // View Mode - Display existing data with robust checks
            <>
              <DataRow
                  label="Date of Birth"
                  value={profileData?.dob ? profileData.dob.split('T')[0] : '-'}
              />
              <DataRow
                  label="Time of Birth"
                  value={profileData?.time_of_birth || profileData?.timeOfBirth || '-'}
              />
              <DataRow
                  label="Current Age"
                  value={profileData?.currentAge || '-'}
              />
              {/* Place of Birth Details */}
              <DataRow
                  label="Place of Birth Country"
                  value={profileData?.placeOfBirthCountry || '-'}
              />
              <DataRow
                  label="Place of Birth State"
                  value={profileData?.placeOfBirthState || '-'}
              />
              <DataRow
                  label="Place of Birth City"
                  value={profileData?.placeOfBirth || '-'}
              />

              {/* Gotra */}
              <DataRow
                label="Gotra"
                value={
                  typeof profileData?.gotra === 'object' && profileData.gotra !== null
                    ? profileData.gotra.label
                    : profileData?.gotra || '-'
                }
              />
              {/* Rashi */}
              <DataRow
                label="Rashi"
                value={
                  typeof profileData?.rashi === 'object' && profileData.rashi !== null
                    ? profileData.rashi.label
                    : profileData?.rashi || '-'
                }
              />
              {/* Nakshatra */}
              <DataRow
                label="Nakshatra"
                value={
                  typeof profileData?.nakshatra === 'object' && profileData.nakshatra !== null
                    ? profileData.nakshatra.label
                    : profileData?.nakshatra || '-'
                }
              />
              {/* Charana Pada */}
              <DataRow
                label="Charana Pada"
                value={profileData?.charanaPada || profileData?.charana_pada || '-'}
              />
              {/* Sub Caste */}
              <DataRow
                label="Sub Caste"
                value={profileData?.subCaste || profileData?.sub_caste || '-'}
              />
              {/* Guru Matha */}
              <DataRow
                label="Guru Matha"
                value={
                  typeof profileData?.guruMatha === 'object' && profileData.guruMatha !== null
                    ? profileData.guruMatha.label
                    : profileData?.guruMatha || profileData?.guru_matha || '-'
                }
              />
            </>
          )}
        </div>
      </div> {/* This closes the main section-level div */}
    </section>
  );
};

export default HoroscopeDetails;