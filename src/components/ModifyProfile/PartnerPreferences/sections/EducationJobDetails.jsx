// components/ModifyProfile/PartnerPreferences/sections/EducationJobDetails.jsx

import React, { useEffect } from "react";
import { Select, Input } from "../../../common/FormElements";
import EnhancedAutocomplete from "../helpers/EnhancedAutocomplete";

// MODIFIED: DataRow no longer applies border/background.
// It should only handle padding and text styling.
const DataRow = ({ label, value }) => (
  <div className="p-4"> {/* Removed bg-gray-50, rounded-lg, border, border-gray-200 */}
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {value || '-'}
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
  }, [mode, formData?.education, formData?.profession, setEducationInput, setProfessionInput]);

  const handleEducationChange = (selectedValue) => {
    console.log("🔍 Education selected:", selectedValue);
    setFormData(prev => ({
      ...prev,
      education: selectedValue
    }));
    setEducationInput(selectedValue.label || selectedValue.value || selectedValue);
  };

  const handleProfessionChange = (selectedValue) => {
    console.log("🔍 Profession selected:", selectedValue);
    setFormData(prev => ({
      ...prev,
      profession: selectedValue
    }));
    setProfessionInput(selectedValue.label || selectedValue.value || selectedValue);
  };

  const handleDesignationChange = (selectedValue) => {
    console.log("🔍 Designation selected:", selectedValue);
    setFormData(prev => ({
      ...prev,
      designation: selectedValue
    }));
    setDesignationInput(selectedValue.label || selectedValue.value || selectedValue);
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 border-indigo-200">
        Education & Job Details
      </h2>

      {/* NEW: This is the single enclosing div for the entire section's content */}
      {/* It wraps both the 'edit' mode and 'view' mode content */}
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="Working in Private Company">Working in Private Company</option>
                  <option value="Working in Government / Public Sector">Working in Government / Public Sector</option>
                  <option value="Business / Self Employed">Business / Self Employed</option>
                  <option value="Defense / Civil Services">Defense / Civil Services</option>
                  <option value="Not working">Not working</option>
                  <option value="Others">Others</option>
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
                  <option value="Below ₹2 Lakh">Below ₹2 Lakh</option>
                  <option value="₹2 to ₹4 Lakh">₹2 to ₹4 Lakh</option>
                  <option value="₹4 to ₹6 Lakh">₹4 to ₹6 Lakh</option>
                  <option value="₹6 to ₹10 Lakh">₹6 to ₹10 Lakh</option>
                  <option value="₹10 to ₹15 Lakh">₹10 to ₹15 Lakh</option>
                  <option value="₹15 to ₹25 Lakh">₹15 to ₹25 Lakh</option>
                  <option value="₹25 to ₹50 Lakh">₹25 to ₹50 Lakh</option>
                  <option value="₹50 Lakh to ₹1 Crore">₹50 Lakh to ₹1 Crore</option>
                  <option value="Above ₹1 Crore">Above ₹1 Crore</option>
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
              <DataRow label="Annual Income" value={profileData?.annual_income || profileData?.annualIncome} />
            </>
          )}
        </div>
      </div> {/* This closes the main section-level div */}
    </section>
  );
};

export default EducationJobDetails;