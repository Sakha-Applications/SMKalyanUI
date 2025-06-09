// src/utils/combinePhoneFields.js

export const handlePhoneFieldChange = (prevData, name, value) => {
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

  for (const group of phoneGroups) {
    const { codeField, numberField, combinedField } = group;

    if (name === codeField || name === numberField) {
      const code = name === codeField ? value : prevData[codeField] || '';
      const number = name === numberField ? value : prevData[numberField] || '';
      return { [combinedField]: code + number };
    }
  }

  return null;
};
