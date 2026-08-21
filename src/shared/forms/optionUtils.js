export const getOptionLabel = (option) => {
  if (option === null || option === undefined) {
    return "";
  }

  if (
    typeof option === "string" ||
    typeof option === "number"
  ) {
    return String(option);
  }

  return String(
    option.label ??
      option.name ??
      option.value ??
      option.mother_tongue ??
      option.motherTongue ??
      option.gotra ??
      option.gotraName ??
      option.gotra_name ??
      option.place ??
      option.placeName ??
      option.place_name ??
      option.nativePlace ??
      option.native_place ??
      option.education ??
      option.educationName ??
      option.education_name ??
      option.profession ??
      option.professionName ??
      option.profession_name ??
      option.designation ??
      option.designationName ??
      option.designation_name ??
      ""
  );
};

export const normalizeOption = (option) => {
  const label = getOptionLabel(option);

  if (!label) {
    return null;
  }

  return {
    ...(typeof option === "object" && option !== null
      ? option
      : {}),
    value:
      typeof option === "object" &&
      option !== null &&
      option.value !== undefined
        ? option.value
        : label,
    label,
  };
};