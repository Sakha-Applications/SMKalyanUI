// src/components/profileRegistration/Popup6_FamilyDetails.js

import React, { useState } from "react";
import { Label as L, Input as I, Select as S, Button as B } from "../common/FormElements";
import useApiData from "../../hooks/useApiData";
import renderAutocomplete from "./helpers/renderAutocomplete";
import ValidationErrorDialog from "../common/ValidationErrorDialog";

const Popup6_FamilyDetails = ({
  formData,
  handleChange,
  onNext,
  onPrevious,
  handleIntermediateProfileUpdate,
  setIsProcessing,
}) => {
  const { searchProfessions } = useApiData();

  // local inputs for the two autocompletes
  const [fatherProfessionInput, setFatherProfessionInput] = useState(formData.fatherProfession || "");
  const [motherProfessionInput, setMotherProfessionInput] = useState(formData.motherProfession || "");

  // option lists + open flags
  const [fatherOptions, setFatherOptions] = useState([]);
  const [motherOptions, setMotherOptions] = useState([]);
  const [showFatherOptions, setShowFatherOptions] = useState(false);
  const [showMotherOptions, setShowMotherOptions] = useState(false);

  // validation
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const validateAndProceed = async () => {
    // 🔎 Popup4-style manual validation object
    const newErrors = {};
    if (!formData.fatherName) newErrors.fatherName = "Father's Name is required";
    if (!formData.motherName) newErrors.motherName = "Mother's Name is required";
    if (!fatherProfessionInput) newErrors.fatherProfession = "Father's Profession is required";
    if (!motherProfessionInput) newErrors.motherProfession = "Mother's Profession is required";
    if (!formData.noOfBrothers) newErrors.noOfBrothers = "Number of Brothers is required";
    if (!formData.noOfSisters) newErrors.noOfSisters = "Number of Sisters is required";
    if (!formData.familyStatus) newErrors.familyStatus = "Family Status is required";
    if (!formData.familyType) newErrors.familyType = "Family Type is required";
    if (!formData.familyValues) newErrors.familyValues = "Family Values is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // sync autocomplete selections into formData
      handleChange({ target: { name: "fatherProfession", value: fatherProfessionInput } });
      handleChange({ target: { name: "motherProfession", value: motherProfessionInput } });

      const success = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
      if (success) onNext();
    } else {
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky gradient header — same look/feel as Popup4 */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
            Let's collect your Family Details
            </h1>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <ValidationErrorDialog
            errors={errors}
            isOpen={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
          />

          {/* Fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <L>Father's Name *</L>
              <I name="fatherName" value={formData.fatherName || ""} onChange={handleChange} />
              {errors.fatherName && <p className="text-red-600 text-sm mt-1">{errors.fatherName}</p>}
            </div>

            {renderAutocomplete({
              label: "Father's Profession *",
              name: "fatherProfession",
              inputValue: fatherProfessionInput,
              inputSetter: setFatherProfessionInput,
              show: showFatherOptions,
              setShow: setShowFatherOptions,
              options: fatherOptions,
              setOptions: setFatherOptions,
              searchFn: searchProfessions,
              handleChange,
              errors,
            })}

            <div>
              <L>Mother's Name *</L>
              <I name="motherName" value={formData.motherName || ""} onChange={handleChange} />
              {errors.motherName && <p className="text-red-600 text-sm mt-1">{errors.motherName}</p>}
            </div>

            {renderAutocomplete({
              label: "Mother's Profession *",
              name: "motherProfession",
              inputValue: motherProfessionInput,
              inputSetter: setMotherProfessionInput,
              show: showMotherOptions,
              setShow: setShowMotherOptions,
              options: motherOptions,
              setOptions: setMotherOptions,
              searchFn: searchProfessions,
              handleChange,
              errors,
            })}

            <div>
              <L>No. of Brothers *</L>
              <S name="noOfBrothers" value={formData.noOfBrothers || ""} onChange={handleChange}>
                <option value="">Select</option>
                <option value="No Brothers">No Brothers</option>
                <option value="1 Brother - Married">1 Brother - Married</option>
                <option value="1 Brother - Unmarried">1 Brother - Unmarried</option>
                <option value="2 Brothers - Married">2 Brothers - Married</option>
                <option value="1 Brother Married, 1 Brother Unmarried">1 Brother Married, 1 Brother Unmarried</option>
                <option value="2 Brothers - Unmarried">2 Brothers - Unmarried</option>
                <option value="More than 2 Brothers">More than 2 Brothers</option>
              </S>
              {errors.noOfBrothers && <p className="text-red-600 text-sm mt-1">{errors.noOfBrothers}</p>}
            </div>

            <div>
              <L>No. of Sisters *</L>
              <S name="noOfSisters" value={formData.noOfSisters || ""} onChange={handleChange}>
                <option value="">Select</option>
                <option value="No Sisters">No Sisters</option>
                <option value="1 Sister - Married">1 Sister - Married</option>
                <option value="1 Sister - Unmarried">1 Sister - Unmarried</option>
                <option value="2 Sisters - Married">2 Sisters - Married</option>
                <option value="1 Sister Married, 1 Sister Unmarried">1 Sister Married, 1 Sister Unmarried</option>
                <option value="2 Sisters - Unmarried">2 Sisters - Unmarried</option>
                <option value="More than 2 Sisters">More than 2 Sisters</option>
              </S>
              {errors.noOfSisters && <p className="text-red-600 text-sm mt-1">{errors.noOfSisters}</p>}
            </div>

            <div>
              <L>Family Status *</L>
              <S name="familyStatus" value={formData.familyStatus || ""} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Middle Class">Middle Class</option>
                <option value="Upper Middle Class">Upper Middle Class</option>
                <option value="Rich">Rich</option>
                <option value="Affluent">Affluent</option>
              </S>
              {errors.familyStatus && <p className="text-red-600 text-sm mt-1">{errors.familyStatus}</p>}
            </div>

            <div>
              <L>Family Type *</L>
              <S name="familyType" value={formData.familyType || ""} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Nuclear">Nuclear</option>
                <option value="Joint">Joint</option>
                <option value="Extended">Extended</option>
              </S>
              {errors.familyType && <p className="text-red-600 text-sm mt-1">{errors.familyType}</p>}
            </div>

            <div>
              <L>Family Values *</L>
              <S name="familyValues" value={formData.familyValues || ""} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Traditional">Traditional</option>
                <option value="Moderate">Moderate</option>
                <option value="Modern">Modern</option>
                <option value="Liberal">Liberal</option>
              </S>
              {errors.familyValues && <p className="text-red-600 text-sm mt-1">{errors.familyValues}</p>}
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between pt-6">
            <B variant="outline" onClick={onPrevious}>
              Previous
            </B>
            <B onClick={validateAndProceed}>Save & Next</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup6_FamilyDetails;
