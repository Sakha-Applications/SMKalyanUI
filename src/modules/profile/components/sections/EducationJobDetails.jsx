
import React, { useEffect } from "react";
import { Select, Input } from "../../../../shared/common/FormElements";
import EnhancedAutocomplete from "../helpers/EnhancedAutocomplete";
import { designClasses } from "../../../../shared/styles/designTokens";
import {
  workingStatusOptions,
  annualIncomeOptions,
} from "../../../../shared/config/profileOptions";

// MODIFIED: DataRow no longer applies border/background.
// It should only handle padding and text styling.
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

const EducationJobDetails = ({
  profileData,
  formData,
  setFormData,
  mode = "view",

  // Education autocomplete props
  educationOptions = [],
  educationInput = '',
  setEducationInput = () => {},
  educationLoading = false,
  setEducationOptions,
  searchEducations,

  // Profession autocomplete props
  professionOptions = [],
  professionInput = '',
  setProfessionInput = () => {},
  professionLoading = false,
  setProfessionOptions,
  searchProfessions,

  designationOptions = [],
  designationInput = '',
  setDesignationInput = () => {},
  designationLoading = false,
  setDesignationOptions,
  searchDesignations,
}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData?.((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (mode === "edit") {
      // Initialize education input
      if (formData?.education) {
        const educationText = typeof formData.education === 'object'
          ? formData.education.label || formData.education.value
          : formData.education;
        if (educationInput !== educationText) {
          setEducationInput(educationText);
        }
      }

      // Initialize profession input
      if (formData?.profession) {
        const professionText = typeof formData.profession === 'object'
          ? formData.profession.label || formData.profession.value
          : formData.profession;
        if (professionInput !== professionText) {
          setProfessionInput(professionText);
        }
      }
    }
  }, [mode, formData?.education, formData?.profession, setEducationInput, setProfessionInput, educationInput, professionInput]);

  const handleEducationChange = (selectedValue) => {
    setFormData(prev => ({
      ...prev,
      education: selectedValue
    }));
    setEducationInput(selectedValue.label || selectedValue.value || selectedValue);
  };

  const handleProfessionChange = (selectedValue) => {
    
    setFormData(prev => ({
      ...prev,
      profession: selectedValue
    }));
    setProfessionInput(selectedValue.label || selectedValue.value || selectedValue);
  };

  const handleDesignationChange = (selectedValue) => {
    
    setFormData(prev => ({
      ...prev,
      designation: selectedValue
    }));
    setDesignationInput(selectedValue.label || selectedValue.value || selectedValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mode === "edit" ? (
            <>
              {/* Education Autocomplete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education *
                </label>
                <EnhancedAutocomplete
                  id="education"
                  name="education"
                  label=""
                  options={educationOptions}
                  inputValue={educationInput}
                  inputSetter={setEducationInput}
                  onChange={handleEducationChange}
                  loading={educationLoading}
                  setOptions={setEducationOptions}
                  searchFn={searchEducations}
                  placeholder="Type to search education..."
                />
              </div>

              {/* Profession Autocomplete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession *
                </label>
                <EnhancedAutocomplete
                  id="profession"
                  name="profession"
                  label=""
                  options={professionOptions}
                  inputValue={professionInput}
                  inputSetter={setProfessionInput}
                  onChange={handleProfessionChange}
                  loading={professionLoading}
                  setOptions={setProfessionOptions}
                  searchFn={searchProfessions}
                  placeholder="Type to search profession..."
                />
              </div>

              {/* Designation - Replace this Input with EnhancedAutocomplete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <EnhancedAutocomplete
                  id="designation"
                  name="designation"
                  label=""
                  options={designationOptions}
                  inputValue={designationInput}
                  inputSetter={setDesignationInput}
                  onChange={handleDesignationChange}
                  loading={designationLoading}
                  setOptions={setDesignationOptions}
                  searchFn={searchDesignations}
                  placeholder="Type to search designation..."
                />
              </div>

              {/* Current Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Company
                </label>
                <Input
                  name="currentCompany"
                  value={formData?.currentCompany || ''}
                  onChange={handleChange}
                  placeholder="Enter current company"
                  className="w-full"
                />
              </div>

              {/* Working Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Status
                </label>
                <Select
                  name="workingStatus"
                  value={formData?.workingStatus || ''}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">Select</option>
                  {workingStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Income
                </label>
                <Select
                  name="annualIncome"
                  value={formData?.annualIncome || ''}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="">Select Income Range</option>
                  {annualIncomeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          ) : (
            // View Mode
            <>
              <DataRow
                label="Education"
                value={
                  typeof profileData?.education === 'object' && profileData?.education !== null
                    ? profileData.education.label
                    : profileData?.education
                }
              />
              <DataRow
                label="Profession"
                value={
                  typeof profileData?.profession === 'object' && profileData?.profession !== null
                    ? profileData.profession.label
                    : profileData?.profession
                }
              />
              <DataRow label="Current Company" value={profileData?.current_company || profileData?.currentCompany} />
              <DataRow
                label="Designation"
                value={
                  typeof profileData?.designation === 'object' && profileData?.designation !== null
                    ? profileData.designation.label
                    : profileData?.designation
                }
              />
              <DataRow label="Working Status" value={profileData?.working_status || profileData?.workingStatus} />
              <DataRow
  label="Annual Income"
  value={
    profileData?.annual_income === 0 ||
    profileData?.annual_income === "0" ||
    profileData?.annual_income === "0.00" ||
    profileData?.annualIncome === 0 ||
    profileData?.annualIncome === "0" ||
    profileData?.annualIncome === "0.00"
      ? "-"
      : profileData?.annual_income || profileData?.annualIncome
  }
/>
            </>
          )}
      </div>
    </div>
  );
};

export default EducationJobDetails;
