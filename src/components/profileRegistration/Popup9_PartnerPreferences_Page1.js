// src/components/profileRegistration/Popup9_PartnerPreferences_Page1.js

import React, { useState, useEffect } from 'react';
import { Label, TextArea, Button, Select, RadioGroup } from '../common/FormElements';
import { Slider } from '@mui/material';
import useApiData from '../../hooks/useApiData';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';

const maritalStatusOptions = [
  { label: 'Single (Never Married)' },
  { label: 'Divorced' },
  { label: 'Widowed' },
  { label: 'Separated' },
  { label: 'Anyone' }
];

const brideGroomCategoryOptions = [
  { label: 'Domestic' },
  { label: 'International' },
  { label: 'Vaidhik' },
  { label: 'Anyone' }
];

const Popup9_PartnerPreferences_Page1 = ({ formData, handleChange, onNext, onPrevious }) => {
  const { searchEducation, searchMotherTongues } = useApiData();

  const [educationInput, setEducationInput] = useState('');
  const [educationOptions, setEducationOptions] = useState([]);
  const [educationLoading, setEducationLoading] = useState(false);

  const [motherTongueInput, setMotherTongueInput] = useState('');
  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
  const [motherTongueLoading, setMotherTongueLoading] = useState(false);

  const [errors, setErrors] = useState({});
const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (educationInput.length >= 2) {
        setEducationLoading(true);
        try {
          const results = await searchEducation(educationInput);
          const mapped = results.map((item) => ({
            label: item.label || item.name || item.education || item,
            value: item.label || item.name || item.education || item
          }));
          setEducationOptions(mapped);
        } catch {
          setEducationOptions([]);
        } finally {
          setEducationLoading(false);
        }
      } else if (educationInput.length === 0) {
        setEducationOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [educationInput, searchEducation]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (motherTongueInput.length >= 2) {
        setMotherTongueLoading(true);
        try {
          const results = await searchMotherTongues(motherTongueInput);
          const mapped = results.map((item) => ({
            label: item.mother_tongue || item.label || item,
            value: item.mother_tongue || item.label || item
          }));
          setMotherTongueOptions(mapped);
        } catch {
          setMotherTongueOptions([]);
        } finally {
          setMotherTongueLoading(false);
        }
      } else if (motherTongueInput.length === 0) {
        setMotherTongueOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [motherTongueInput, searchMotherTongues]);

  const handleEducationChange = (name, values) => {
    handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } });
    setEducationInput('');
  };

  const handleMotherTongueChange = (name, values) => {
    handleChange({ target: { name, value: values.map(v => v.label || v.value || v) } });
    setMotherTongueInput('');
  };

  const cmToFeetInches = (cm) => {
    const inchesTotal = Math.round(cm / 2.54);
    const feet = Math.floor(inchesTotal / 12);
    const inches = inchesTotal % 12;
    return `${feet}ft ${inches}in`;
  };

  const validateAndProceed = async () => {
  const requiredFields = [
    { name: "preferredMaritalStatus", label: "Preferred Marital Status" },
     { name: "expectations", label: "Expectations" },
    { name: "preferredBrideGroomCategory", label: "Preferred Bride/Groom Category" },
    
  ];

  const newErrors = validateRequiredFields(formData, requiredFields);
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    onNext(); // Since this is client-side only
  } else {
    setShowErrorDialog(true);
  }
};

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 border border-slate-300 rounded-md p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div><strong>Profile ID:</strong> {formData.profileId || 'N/A'}</div>
        <div><strong>Name:</strong> {formData.name || 'N/A'}</div>
        <div><strong>Login ID:</strong> {formData.userId || 'N/A'}</div>
      </div>

      <h2 className="text-lg font-semibold">General Preferences</h2>

      <div>
        <Label>Expectations</Label>
        <TextArea name="expectations" value={formData.expectations || ''} onChange={handleChange} 
        placeholder="Write something about your preferred match..." rows={3} />
      </div>

      <div>
        <Label>Preferred Age Range</Label>
        <Slider value={formData.ageRange || [25, 35]} onChange={(e, val) => handleChange({ target: { name: 'ageRange', value: val } })} valueLabelDisplay="auto" min={18} max={60} />
      </div>

      <div>
        <Label>Preferred Height Range (in ft/in)</Label>
        <Slider
          value={formData.heightRange || [150, 180]}
          onChange={(e, val) => handleChange({ target: { name: 'heightRange', value: val } })}
          valueLabelDisplay="on"
          min={120}
          max={210}
          marks={[120, 150, 180, 210].map(val => ({ value: val, label: cmToFeetInches(val) }))}
          valueLabelFormat={(value) => cmToFeetInches(value)}
        />
      </div>

      <div>
        <Label>Annual Income in INR Lacs</Label>
        <Slider
          value={formData.preferredIncomeRange || [5, 20]}
          onChange={(e, val) => handleChange({ target: { name: 'preferredIncomeRange', value: val } })}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          step={1}
        />
      </div>

      <MultiSelectCheckbox
        label="Preferred Education"
        name="preferredEducation"
        options={educationOptions}
        selectedValues={(formData.preferredEducation || []).map(item => ({ label: item.label || item, value: item.value || item }))}
        onSearch={setEducationInput}
        searchInput={educationInput}
        onChange={handleEducationChange}
        placeholder="Type to search education (min 2 characters)"
        loading={educationLoading}
      />

      <MultiSelectCheckbox
        label="Preferred Mother Tongue"
        name="preferredMotherTongues"
        options={motherTongueOptions}
        selectedValues={(formData.preferredMotherTongues || []).map(item => ({ label: item.label || item, value: item.value || item }))}
        onSearch={setMotherTongueInput}
        searchInput={motherTongueInput}
        onChange={handleMotherTongueChange}
        placeholder="Type to search mother tongue (min 2 characters)"
        loading={motherTongueLoading}
      />

      <Label htmlFor="preferredMaritalStatus">Preferred Marital Status</Label>
<Select name="preferredMaritalStatus" value={formData.preferredMaritalStatus || ''} onChange={handleChange}>
  <option value="">-- Select --</option>
  {maritalStatusOptions.map(opt => (
    <option key={opt.label} value={opt.label}>{opt.label}</option>
  ))}
</Select>

<Label htmlFor="preferredBrideGroomCategory">Preferred Bride/Groom Category</Label>
<Select name="preferredBrideGroomCategory" value={formData.preferredBrideGroomCategory || ''} onChange={handleChange}>
  <option value="">-- Select --</option>
  {brideGroomCategoryOptions.map(opt => (
    <option key={opt.label} value={opt.label}>{opt.label}</option>
  ))}
</Select>



      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>⬅️ Previous</Button>
        <Button onClick={onNext}>Next ➡️</Button>
      </div>
    </div>
  );
};

export default Popup9_PartnerPreferences_Page1;
