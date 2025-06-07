// src/components/profileRegistration/Popup9_PartnerPreferences_Page3.js

import React, { useEffect, useState } from 'react';
import { Label as L, Button as B } from '../common/FormElements';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import useApiData from '../../hooks/useApiData';

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
  const countryOptions = [
    { label: 'India' },
    { label: 'USA' },
    { label: 'UK' },
    { label: 'Canada' },
    { label: 'Australia' },
    { label: 'Germany' },
    { label: 'Singapore' },
    { label: 'UAE' }
  ];

  const dietOptions = [
    { label: 'Vegetarian' },
    { label: 'Eggetarian' },
    { label: 'Non-Vegetarian' },
    { label: 'Vegan' },
    { label: 'Doesn\'t Matter' }
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
}, [professionInput, searchProfessions



]);

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
    <div className="space-y-6">
      <div className="bg-slate-100 border border-slate-300 rounded-md p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
        <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
        <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
      </div>

      <h2 className="text-lg font-semibold">Geographic Preferences</h2>

      <div>
        <MultiSelectCheckbox
          label="Origin of Native"
          name="preferredNativeOrigins"
          placeholder="Type to search Native (min 2 characters)"
          options={originOptions}
          selectedValues={formatSelectedValues('preferredNativeOrigins')}
          onSearch={setOriginInput}
          searchInput={originInput}
          loading={originLoading}
          onChange={(name, values) => {
            handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } });
            setOriginInput('');
          }}
        />
      </div>

      <div>
        <MultiSelectCheckbox
          label="City Living In"
          name="preferredCities"
          placeholder="Type to search City (min 2 characters)"
          options={cityOptions}
          selectedValues={formatSelectedValues('preferredCities')}
          onSearch={setCityInput}
          searchInput={cityInput}
          loading={cityLoading}
          onChange={(name, values) => {
            handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } });
            setCityInput('');
          }}
        />
      </div>

      <div>
        <MultiSelectCheckbox
          label="Country Living In"
          name="preferredCountries"
          options={countryOptions}
          selectedValues={formatSelectedValues('preferredCountries')}
          onChange={(name, values) =>
            handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } })
          }
        />
      </div>

      <h2 className="text-lg font-semibold">Lifestyle Preferences</h2>

      <div>
        <MultiSelectCheckbox
          label="Dietary Preference"
          name="preferredDiet"
          options={dietOptions}
          selectedValues={formatSelectedValues('preferredDiet')}
          onChange={(name, values) =>
            handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } })
          }
        />
      </div>

      <div>
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
      target: {
        name,
        value: values.map(v => v.label || v.value || v)
      }
    });
    setProfessionInput(''); // Clear input after selection
  }}
/>

     </div>

      <div>
  <MultiSelectCheckbox
  label="Hobbies"
  name="preferredHobbies"
  options={hobbyOptions}
  selectedValues={formatSelectedValues('preferredHobbies')}
  onChange={(name, values) =>
    handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } })
  }
/>
      </div>

      <div className="flex justify-between pt-6">
        <B variant="outline" onClick={onPrevious}>⬅️ Previous</B>
        <B onClick={onNext}>Save & Finish ✅</B>
      </div>
    </div>
  );
};

export default Popup9_PartnerPreferences_Page3;
