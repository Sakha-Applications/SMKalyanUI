const validateRequiredFields = (formData, fieldConfig) => {
  const newErrors = {};
  console.log("🔍 Running validation on formData:", formData);
  console.log("📋 Required fields config:", fieldConfig);

  for (const { name, label } of fieldConfig) {
    const value = formData[name];
    console.log(`🧪 Validating field: ${name} → Value:`, value);

    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      newErrors[name] = `The ${label} is mandatory. Please enter the correct ${label}.`;
      console.warn(`❌ Validation failed for: ${label}`);
    }
  }

  console.log("🧾 Final errors:", newErrors);
  return newErrors;
};

// Add proper export
export default validateRequiredFields;