// src/components/profileRegistration/Popup9_PartnerPreferences_Page2.js

import React, { useEffect, useState } from 'react';
import { Label as L, Button as B } from '../common/FormElements';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import useApiData from '../../hooks/useApiData';

const Popup9_PartnerPreferences_Page2 = ({ formData, handleChange, onNext, onPrevious }) => {
  const { gotraOptions, nakshatraOptions, rashiOptions, searchGuruMatha } = useApiData();

  const subCasteOptions = [
    { label: "Madhva (ಮಾಧ್ವ)" },
    { label: "Smarta (ಸ್ಮಾರ್ತ)" },
    { label: "Srivaishnava (ಶ್ರೀವೈಷ್ಣವ)" },
    { label: "Others (ಇತರರು)" }
  ];

  const [guruMathaLoading, setGuruMathaLoading] = useState(false);
  const [guruMathaInput, setGuruMathaInput] = useState('');
  const [guruMathaOptions, setGuruMathaOptions] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (guruMathaInput.length >= 2) {
        setGuruMathaLoading(true);
        const results = await searchGuruMatha(guruMathaInput);
        if (Array.isArray(results)) {
          const options = results.map((item) => ({ label: item.label || item }));
          setGuruMathaOptions(options);
        }
        setGuruMathaLoading(false);
      } else {
        setGuruMathaOptions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [guruMathaInput, searchGuruMatha]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 border border-slate-300 rounded-md p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
        <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
        <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
      </div>

      <h2 className="text-lg font-semibold">Cultural / Spiritual Preferences</h2>

      <div>
        <MultiSelectCheckbox
          label="Sub Caste"
          name="preferredSubCastes"
          options={subCasteOptions}
          selectedValues={formData.preferredSubCastes || []}
          onChange={(name, values) => handleChange({ target: { name, value: values.map(v => v.label || v) } })}
        />
      </div>

      <MultiSelectCheckbox
        label="Guru Matha"
        name="preferredGuruMathas"
         placeholder="Type to search Guru matha (min 2 characters)"
        options={guruMathaOptions}
        selectedValues={(formData.preferredGuruMathas || []).map(item => ({
          label: typeof item === 'string' ? item : item.label || item.value,
          value: typeof item === 'string' ? item : item.value || item.label
        }))}
        onSearch={(value) => setGuruMathaInput(value)}
        searchInput={guruMathaInput}
        onChange={(name, values) => {
          handleChange({
            target: {
              name,
              value: values.map(v => v.label || v.value || v)
            }
            
          });
          setGuruMathaInput('');
        }}
        loading={guruMathaLoading}
      />

      <div>
        <MultiSelectCheckbox
          label="Gotra"
          name="preferredGotras"
          options={gotraOptions}
          selectedValues={formData.preferredGotras || []}
          onChange={(name, values) => handleChange({ target: { name, value: values.map(v => v.label || v) } })}
        />
      </div>

      <div>
        <MultiSelectCheckbox
          label="Nakshatra"
          name="preferredNakshatras"
          options={nakshatraOptions}
          selectedValues={formData.preferredNakshatras || []}
          onChange={(name, values) => handleChange({ target: { name, value: values.map(v => v.label || v) } })}
        />
      </div>

      <div>
        <MultiSelectCheckbox
          label="Rashi"
          name="preferredRashis"
          options={rashiOptions}
          selectedValues={formData.preferredRashis || []}
          onChange={(name, values) => handleChange({ target: { name, value: values.map(v => v.label || v) } })}
        />
      </div>

      <div className="flex justify-between pt-6">
        <B variant="outline" onClick={onPrevious}>⬅️ Previous</B>
        <B onClick={onNext}>Next ➡️</B>
      </div>
    </div>
  );
};

export default Popup9_PartnerPreferences_Page2;
