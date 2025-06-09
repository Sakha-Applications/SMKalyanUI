// src/utils/combinePhoneFields.js

export const handlePhoneFieldChange = (prevData, name, value) => {
  // Define phone field groups with their corresponding combined fields
  const phoneGroups = [
    {
      codeField: 'phoneCountryCode',
      numberField: 'phoneNumber',
      combinedField: 'phone'
    },
    {
      codeField: 'alternatePhoneCountryCode',
      numberField: 'alternatePhoneNumber',
      combinedField: 'alternatePhone'
    },
    {
      codeField: 'guardianPhoneCountryCode',
      numberField: 'guardianPhoneNumber',
      combinedField: 'guardianPhone'
    },
    {
      codeField: 'reference1PhoneCountryCode',
      numberField: 'reference1PhoneNumber',
      combinedField: 'reference1Phone'
    },
    {
      codeField: 'reference2PhoneCountryCode',
      numberField: 'reference2PhoneNumber',
      combinedField: 'reference2Phone'
    }
  ];

  // Check if the changed field belongs to any phone group
  for (const group of phoneGroups) {
    const { codeField, numberField, combinedField } = group;

    if (name === codeField || name === numberField) {
      // Get the current values - use the new value for the changed field
      const code = name === codeField ? value : (prevData[codeField] || '+91');
      const number = name === numberField ? value : (prevData[numberField] || '');
      
      // Combine the fields - only if number exists
      const combinedValue = number ? `${code}${number}` : '';
      
      console.log(`📞 Combining ${codeField}(${code}) + ${numberField}(${number}) = ${combinedField}(${combinedValue})`);
      
      return { [combinedField]: combinedValue };
    }
  }

  // Return null if the field is not a phone-related field
  return null;
};