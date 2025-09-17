// src/components/common/validateRequiredFields.js

const validateRequiredFields = (formData, requiredFieldsConfig) => {
  console.log('🔍 Running validation on formData:', formData);
  console.log('📋 Required fields config:', requiredFieldsConfig);
  const errors = {};

  // --- START OF CHANGES ---
  // MODIFICATION: The loop is changed from 'for...of' to 'Object.keys()'.
  // This allows the function to correctly iterate over the configuration OBJECT
  // that is being sent from Popup1_BasicInfo.js, fixing the crash.
  for (const fieldName of Object.keys(requiredFieldsConfig)) {
    const value = formData[fieldName];
    const fieldLabel = requiredFieldsConfig[fieldName];
    console.log(`🧪 Validating field: ${fieldName} → Value:`, value);

    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      errors[fieldName] = `The ${fieldLabel} is mandatory. Please enter the correct ${fieldLabel}.`;
      console.warn(`❌ Validation failed for: ${fieldLabel}`);
    }
  }
  // --- END OF CHANGES ---

  console.log("🧾 Final errors:", errors);
  return errors;
};

export default validateRequiredFields;