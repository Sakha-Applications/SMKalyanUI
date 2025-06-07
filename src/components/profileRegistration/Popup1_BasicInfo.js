import React, { useState, useEffect } from 'react';
import { Label, Input, Select, RadioGroup, Button } from '../common/FormElements';
import useApiData from '../../hooks/useApiData';
import validateRequiredFields from '../common/validateRequiredFields';
import ValidationErrorDialog from '../common/ValidationErrorDialog';

const Popup1_BasicInfo = ({ formData, handleChange, onNext }) => {
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const { searchMotherTongues, getMotherTongueById, searchPlaces, getPlaceById } = useApiData();

  const [motherTongueInput, setMotherTongueInput] = useState(formData.motherTongue || '');
  const [residingCityInput, setResidingCityInput] = useState(formData.currentLocation || '');

  const [mtOptions, setMtOptions] = useState([]);
  const [rcOptions, setRcOptions] = useState([]);

  const [mtShow, setMtShow] = useState(false);
  const [rcShow, setRcShow] = useState(false);

  const [loadingMT, setLoadingMT] = useState(false);
  const [loadingRC, setLoadingRC] = useState(false);

  const [justSelectedMT, setJustSelectedMT] = useState(false);
  const [justSelectedRC, setJustSelectedRC] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick(setMtShow));
    document.addEventListener("mousedown", handleOutsideClick(setRcShow));
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick(setMtShow));
      document.removeEventListener("mousedown", handleOutsideClick(setRcShow));
    };
  }, []);

  const handleOutsideClick = (setShow) => (e) => {
    if (!e.target.closest('.autocomplete-dropdown')) setShow(false);
  };

  const handleSelect = (name, value, inputSetter, showSetter, justSelectedSetter) => {
    justSelectedSetter(true);
    inputSetter(value.label);
    showSetter(false);
    setTimeout(() => document.activeElement?.blur(), 0);
    handleChange({ target: { name, value: value.label } });
    if (value.id) {
      handleChange({ target: { name: `${name}Id`, value: value.id } });
    }
  };

  const renderAutocomplete = (label, inputVal, setInputVal, options, show, loading, showSetter, fieldName, justSelectedSetter) => {
    const isError = !!errors[fieldName];
    const hasTyped = inputVal.length > 0;
    const isShort = hasTyped && inputVal.length < 2;
    const helperText = isError
      ? errors[fieldName]
      : isShort
      ? `Enter at least 2 characters to search ${label}`
      : `Start typing to search ${label}`;

    return (
      <div className="autocomplete-dropdown relative">
        <Label>{label} <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Start typing ${label.toLowerCase()}...`}
          required
          error={isError}
          helperText={helperText}
        />
        {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
        {show && options.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 w-full max-h-48 overflow-y-auto z-10 mt-1 shadow-md">
            {options.map((opt, i) => (
              <li
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(fieldName, opt, setInputVal, showSetter, justSelectedSetter)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (justSelectedMT) {
      setJustSelectedMT(false);
      return;
    }
    const timer = setTimeout(async () => {
      if (motherTongueInput.length >= 2) {
        setLoadingMT(true);
        const result = await searchMotherTongues(motherTongueInput);
        setMtOptions(result);
        setMtShow(true);
        setLoadingMT(false);
      } else {
        setMtShow(false);
        setMtOptions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [motherTongueInput]);

  useEffect(() => {
    if (justSelectedRC) {
      setJustSelectedRC(false);
      return;
    }
    const timer = setTimeout(async () => {
      if (residingCityInput.length >= 2) {
        setLoadingRC(true);
        const result = await searchPlaces(residingCityInput);
        setRcOptions(result);
        setRcShow(true);
        setLoadingRC(false);
      } else {
        setRcShow(false);
        setRcOptions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [residingCityInput]);

  useEffect(() => {
    if (formData.motherTongue && !isNaN(formData.motherTongue)) {
      getMotherTongueById(formData.motherTongue).then((data) => {
        if (data?.label) setMotherTongueInput(data.label);
      });
    }
    if (formData.currentLocation && !isNaN(formData.currentLocation)) {
      getPlaceById(formData.currentLocation).then((data) => {
        if (data?.label) {
          setResidingCityInput(data.label);
          handleChange({ target: { name: 'currentLocation', value: data.label } });
        }
      });
    }
  }, []);

  const validateAndProceed = () => {
    const requiredFields = [
      { name: "name", label: "Name" },
      { name: "profileCreatedFor", label: "Profile Created For" },
      { name: "gender", label: "Gender" },
      { name: "motherTongue", label: "Mother Tongue" },
      { name: "currentLocation", label: "Residing City" }
    ];

    const newErrors = validateRequiredFields(formData, requiredFields);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      <ValidationErrorDialog 
        errors={errors}
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
      />

      <div>
        <Label htmlFor="profileCreatedFor">This Profile is For <span className="text-red-500">*</span></Label>
        <Select
          name="profileCreatedFor"
          value={formData.profileCreatedFor}
          onChange={handleChange}
          required
          error={!!errors.profileCreatedFor}
          helperText={errors.profileCreatedFor}
        >
          <option value="">-- Select --</option>
          <option value="Self">MySelf</option>
          <option value="Son">My Son</option>
          <option value="Daughter">My Daughter</option>
          <option value="Sibling">My Sibling (Brother/Sister)</option>
          <option value="Relatives">My Relative</option>
          <option value="Friends">My Friend</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="name">Full Name (as per records) <span className="text-red-500">*</span></Label>
        <Input
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
      </div>

      <div>
        <RadioGroup
          name="gender"
          legend="Gender"
          options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]}
          selectedValue={formData.gender || ''}
          onChange={handleChange}
          required
        />
        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
      </div>

      {formData.gender && (
        <div>
          <Label>You are Registering for :</Label>
          <Input value={formData.gender === "Male" ? "Bridegroom (Groom)" : "Bride"} readOnly />
          <Label className="mt-2">Searching for Registered :</Label>
          <Input value={formData.gender === "Male" ? "Bride" : "Bridegroom (Groom)"} readOnly />
        </div>
      )}

      {renderAutocomplete("Mother Tongue", motherTongueInput, setMotherTongueInput, mtOptions, mtShow, loadingMT, setMtShow, "motherTongue", setJustSelectedMT)}

      {renderAutocomplete("Residing City", residingCityInput, setResidingCityInput, rcOptions, rcShow, loadingRC, setRcShow, "currentLocation", setJustSelectedRC)}

      <div className="flex justify-end pt-4">
        <Button onClick={validateAndProceed} variant="primary">Next</Button>
      </div>
    </div>
  );
};

export default Popup1_BasicInfo;