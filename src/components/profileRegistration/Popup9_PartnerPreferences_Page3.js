// src/components/profileRegistration/Popup9_PartnerPreferences_Page3.js

import React, { useEffect, useState } from 'react';
import { Label as L, Button as B } from '../common/FormElements';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import useApiData from '../../hooks/useApiData';
import MultiStateCitySelector from '../common/MultiStateCitySelector';
import MultiCountrySelector from '../common/MultiCountrySelector';
import MultiCountryStateCitySelector from '../common/MultiCountryStateCitySelector';

const Popup9_PartnerPreferences_Page3 = ({ formData, handleChange, onNext, onPrevious }) => {
  const { searchPlaces, searchProfessions } = useApiData();

  const [originInput, setOriginInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [originOptions, setOriginOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const [professionInput, setProfessionInput] = useState('');
  const [professionOptions, setProfessionOptions] = useState([]);
  const [professionLoading, setProfessionLoading] = useState(false);

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

  const formatSelectedValues = (field) =>
    (formData[field] || []).map(item => ({
      label: typeof item === 'string' ? item : item.label || item.value,
      value: typeof item === 'string' ? item : item.value || item.label
    }));

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (originInput.length >= 2) {
        setOriginLoading(true);
        const res = await searchPlaces(originInput);
        setOriginOptions(Array.isArray(res) ? res.map(item => ({ label: item.label || item })) : []);
        setOriginLoading(false);
      } else {
        setOriginOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [originInput, searchPlaces]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (professionInput.length >= 2) {
        setProfessionLoading(true);
        const res = await searchProfessions(professionInput);
        setProfessionOptions(Array.isArray(res) ? res.map(item => ({ label: item.label || item })) : []);
        setProfessionLoading(false);
      } else {
        setProfessionOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [professionInput, searchProfessions]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (cityInput.length >= 2) {
        setCityLoading(true);
        const res = await searchPlaces(cityInput);
        setCityOptions(Array.isArray(res) ? res.map(item => ({ label: item.label || item })) : []);
        setCityLoading(false);
      } else {
        setCityOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [cityInput, searchPlaces]);

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header (Popup6 style) */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          Partner Preferences – Location & Lifestyle
        </h1>
      </header>

      {/* Scrollable Content (Popup6 style) */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Profile summary header (Popup6 style) */}
          <div className="bg-slate-100 border border-slate-300 rounded-md p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
            <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
            <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
          </div>

          <h2 className="text-lg font-semibold">Geographic Preferences</h2>

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

          <h2 className="text-lg font-semibold">Lifestyle Preferences</h2>

          <MultiSelectCheckbox
            label="Profession Preference"
            name="preferredProfessions"
            options={professionOptions}
            selectedValues={formatSelectedValues('preferredProfessions')}
            onSearch={setProfessionInput}
            searchInput={professionInput}
            loading={professionLoading}
            onChange={(name, values) => {
              handleChange({
                target: { name, value: values.map(v => v.label || v.value || v) }
              });
              setProfessionInput('');
            }}
          />

          <MultiSelectCheckbox
            label="Hobbies"
            name="preferredHobbies"
            options={hobbyOptions}
            selectedValues={formatSelectedValues('preferredHobbies')}
            onChange={(name, values) =>
              handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } })
            }
          />

          {/* Navigation (Popup6 style) */}
          <div className="flex justify-between pt-6">
            <B variant="outline" onClick={onPrevious}>⬅️ Previous</B>
            <B onClick={onNext}>Save & Finish ✅</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup9_PartnerPreferences_Page3;
