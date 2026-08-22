import React, { useEffect } from "react";
import { Input, Select } from "../../../../shared/common/FormElements";
import EnhancedAutocomplete from "../helpers/EnhancedAutocomplete";
import { designClasses } from "../../../../shared/styles/designTokens";

const DataRow = ({ label, value }) => (
  <div className="py-2">
    <p className={`text-sm ${designClasses.textSecondary}`}>
      <span className={`font-semibold ${designClasses.textPrimary}`}>
        {label}:
      </span>{" "}
      {value || "-"}
    </p>
  </div>
);

const FamilyDetails = ({
  profileData,
  formData = {},
  setFormData,
  mode = "view",
  fatherProfessionInput,
  setFatherProfessionInput,
  motherProfessionInput,
  setMotherProfessionInput,
  professionOptions = [],
  professionLoading = false,
  setProfessionOptions,
  searchProfessions,
}) => {

  const handleChange = (e) => {
    if (e.target && e.target.name) {
      const { name, value } = e.target;
      setFormData?.((prev) => ({ ...prev, [name]: value }));
    } else {
      const { name, value } = e;
      setFormData?.((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Helper function to safely extract display value
  const getDisplayValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.label || value.name || value.value || '';
    }
    return String(value);
  };

  // Helper function to extract profession name for backend
  const getProfessionName = (selectedValue) => {
    if (!selectedValue) return '';
    
    // If it's already a string, return it
    if (typeof selectedValue === 'string') return selectedValue;
    
    // If it's an object, prioritize name/label over value/id
    if (typeof selectedValue === 'object') {
      return selectedValue.name || selectedValue.label || selectedValue.value || '';
    }
    
    return String(selectedValue);
  };

  // Improved handlers for profession changes
  const handleFatherProfessionChange = (selectedValue) => {

    // Extract the profession name for backend
    const professionName = getProfessionName(selectedValue);
    
    // Update form data with profession name (not the object or ID)
    setFormData(prev => ({
      ...prev,
      fatherProfession: professionName
    }));
    
    // Update input display value
    setFatherProfessionInput(professionName);
  };

  const handleMotherProfessionChange = (selectedValue) => {
   
    // Extract the profession name for backend
    const professionName = getProfessionName(selectedValue);
    
    // Update form data with profession name (not the object or ID)
    setFormData(prev => ({
      ...prev,
      motherProfession: professionName
    }));
    
    // Update input display value
    setMotherProfessionInput(professionName);
    
  };

   // Fixed useEffect to prevent circular dependencies
   useEffect(() => {
     if (mode !== "edit") return;

     // Only initialize if the input is empty or significantly different
     const initializeProfessionInputs = () => {
       // Initialize father's profession input
       if (formData?.fatherProfession && !fatherProfessionInput) {
         const fatherDisplayValue = getDisplayValue(formData.fatherProfession);
         setFatherProfessionInput(fatherDisplayValue);
       }

       // Initialize mother's profession input
       if (formData?.motherProfession && !motherProfessionInput) {
         const motherDisplayValue = getDisplayValue(formData.motherProfession);
         setMotherProfessionInput(motherDisplayValue);
       }
     };

     initializeProfessionInputs();
   }, [mode, formData?.fatherProfession, formData?.motherProfession, fatherProfessionInput, motherProfessionInput, setFatherProfessionInput, setMotherProfessionInput]);

   // Separate effect to handle clearing inputs when form data is cleared
   useEffect(() => {
     if (mode === "edit") {
       if (!formData?.fatherProfession && fatherProfessionInput) {
         setFatherProfessionInput('');
       }
       if (!formData?.motherProfession && motherProfessionInput) {
         setMotherProfessionInput('');
       }
     }
   }, [formData?.fatherProfession, formData?.motherProfession, mode, fatherProfessionInput, motherProfessionInput, setFatherProfessionInput, setMotherProfessionInput]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === "edit" ? (
            <>
              {/* Father's Name */}
              <div>
                <label htmlFor="fatherName" className={designClasses.fieldLabel}>
                  Father's Name
                </label>
                <Input
                  name="fatherName"
                  value={formData?.fatherName || ''}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Father's Profession - Enhanced Autocomplete */}
              <div>
                <label htmlFor="fatherProfession" className={designClasses.fieldLabel}>
                  Father's Profession
                </label>
                <EnhancedAutocomplete
                  id="fatherProfession"
                  name="fatherProfession"
                  label=""
                  options={professionOptions}
                  inputValue={fatherProfessionInput || ''}
                  inputSetter={setFatherProfessionInput}
                  onChange={handleFatherProfessionChange}
                  loading={professionLoading}
                  setOptions={setProfessionOptions}
                  searchFn={searchProfessions}
                  placeholder="Type to search profession..."
                  className="w-full"
                />
              </div>

              {/* Mother's Name */}
              <div>
                <label htmlFor="motherName" className={designClasses.fieldLabel}>
                  Mother's Name
                </label>
                <Input
                  name="motherName"
                  value={formData?.motherName || ''}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Mother's Profession - Enhanced Autocomplete */}
              <div>
                <label htmlFor="motherProfession" className={designClasses.fieldLabel}>
                  Mother's Profession
                </label>
                <EnhancedAutocomplete
                  id="motherProfession"
                  name="motherProfession"
                  label=""
                  options={professionOptions}
                  inputValue={motherProfessionInput || ''}
                  inputSetter={setMotherProfessionInput}
                  onChange={handleMotherProfessionChange}
                  loading={professionLoading}
                  setOptions={setProfessionOptions}
                  searchFn={searchProfessions}
                  placeholder="Type to search profession..."
                  className="w-full"
                />
              </div>

              {/* No. of Brothers */}
              <div>
                <label htmlFor="noOfBrothers" className={designClasses.fieldLabel}>
                  No. of Brothers
                </label>
                <Select name="noOfBrothers" value={formData?.noOfBrothers || ''} onChange={handleChange} className="w-full">
                  <option value="">Select</option>
                  <option value="No Brothers">No Brothers</option>
                  <option value="1 Brother - Married">1 Brother - Married</option>
                  <option value="1 Brother - Unmarried">1 Brother - Unmarried</option>
                  <option value="2 Brothers - Married">2 Brothers - Married</option>
                  <option value="1 Brother Married, 1 Brother Unmarried">1 Brother Married, 1 Brother Unmarried</option>
                  <option value="2 Brothers - Unmarried">2 Brothers - Unmarried</option>
                  <option value="More than 2 Brothers">More than 2 Brothers</option>
                </Select>
              </div>

              {/* No. of Sisters */}
              <div>
                <label htmlFor="noOfSisters" className={designClasses.fieldLabel}>
                  No. of Sisters
                </label>
                <Select name="noOfSisters" value={formData?.noOfSisters || ''} onChange={handleChange} className="w-full">
                  <option value="">Select</option>
                  <option value="No Sisters">No Sisters</option>
                  <option value="1 Sister - Married">1 Sister - Married</option>
                  <option value="1 Sister - Unmarried">1 Sister - Unmarried</option>
                  <option value="2 Sisters - Married">2 Sisters - Married</option>
                  <option value="1 Sister Married, 1 Sister Unmarried">1 Sister Married, 1 Sister Unmarried</option>
                  <option value="2 Sisters - Unmarried">2 Sisters - Unmarried</option>
                  <option value="More than 2 Sisters">More than 2 Sisters</option>
                </Select>
              </div>

              {/* Family Status */}
              <div>
                <label htmlFor="familyStatus" className={designClasses.fieldLabel}>
                  Family Status
                </label>
                <Select name="familyStatus" value={formData?.familyStatus || ''} onChange={handleChange} className="w-full">
                  <option value="">Select</option>
                  <option value="Middle Class">Middle Class</option>
                  <option value="Upper Middle Class">Upper Middle Class</option>
                  <option value="Rich">Rich</option>
                  <option value="Affluent">Affluent</option>
                </Select>
              </div>

              {/* Family Type */}
              <div>
                <label htmlFor="familyType" className={designClasses.fieldLabel}>
                  Family Type
                </label>
                <Select name="familyType" value={formData?.familyType || ''} onChange={handleChange} className="w-full">
                  <option value="">Select</option>
                  <option value="Nuclear">Nuclear</option>
                  <option value="Joint">Joint</option>
                  <option value="Extended">Extended</option>
                </Select>
              </div>

              {/* Family Values */}
              <div>
                <label htmlFor="familyValues" className={designClasses.fieldLabel}>
                  Family Values
                </label>
                <Select name="familyValues" value={formData?.familyValues || ''} onChange={handleChange} className="w-full">
                  <option value="">Select</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Liberal">Liberal</option>
                </Select>
              </div>
            </>
          ) : (
            // View Mode - Display existing data
            <>
              <DataRow label="Father's Name" value={profileData?.fatherName || profileData?.father_name} />
              <DataRow 
                label="Father's Profession" 
                value={getDisplayValue(profileData?.fatherProfession || profileData?.father_profession)} 
              />
              <DataRow label="Mother's Name" value={profileData?.motherName || profileData?.mother_name} />
              <DataRow 
                label="Mother's Profession" 
                value={getDisplayValue(profileData?.motherProfession || profileData?.mother_profession)} 
              />
              <DataRow label="No. of Brothers" value={profileData?.noOfBrothers || profileData?.siblings?.split(',')[0]?.trim()} />
              <DataRow label="No. of Sisters" value={profileData?.noOfSisters || profileData?.siblings?.split(',')[1]?.trim()} />
              <DataRow label="Family Status" value={profileData?.familyStatus || profileData?.family_status} />
              <DataRow label="Family Type" value={profileData?.familyType || profileData?.family_type} />
              <DataRow label="Family Values" value={profileData?.familyValues || profileData?.family_values} />
            </>
          )}
      </div>
    </div>
  );
};

export default FamilyDetails;
