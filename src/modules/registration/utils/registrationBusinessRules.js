export const deriveProfileFor = (
  gender
) => {
  if (gender === "Female") {
    return "Bride";
  }

  if (gender === "Male") {
    return "Bridegroom";
  }

  return "";
};

export const getLockedGender = (
  profileCreatedFor
) => {
  if (
    profileCreatedFor === "Son"
  ) {
    return "Male";
  }

  if (
    profileCreatedFor ===
    "Daughter"
  ) {
    return "Female";
  }

  return "";
};

export const generateProfileId = (
  name,
  phone
) => {
  if (
    !name ||
    !phone ||
    typeof name !== "string" ||
    typeof phone !== "string"
  ) {
    return "";
  }

  const trimmedName =
    name.trim();

  const trimmedPhone =
    phone.trim();

  if (
    trimmedName.length < 2 ||
    trimmedPhone.length < 5
  ) {
    return "";
  }

  const namePrefix =
    trimmedName
      .substring(0, 2)
      .toUpperCase();

  const phoneDigits =
    trimmedPhone.replace(
      /\D/g,
      ""
    );

  if (
    phoneDigits.length < 5
  ) {
    return "";
  }

  const positions = [];

  while (
    positions.length < 5
  ) {
    const position =
      Math.floor(
        Math.random() *
          phoneDigits.length
      );

    if (
      !positions.includes(
        position
      )
    ) {
      positions.push(position);
    }
  }

  positions.sort(
    (a, b) => a - b
  );

  const selectedDigits =
    positions
      .map(
        (position) =>
          phoneDigits[position]
      )
      .join("");

  return `${namePrefix}${selectedDigits}`;
};

export const normalizeSelectedValues = (values) => {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => {
      if (
        item === null ||
        item === undefined
      ) {
        return "";
      }

      if (
        typeof item === "string" ||
        typeof item === "number"
      ) {
        return String(item);
      }

      return String(
        item.label ??
          item.value ??
          item.name ??
          ""
      );
    })
    .filter(Boolean);
};

export const heightRangeInchesToCm = (range) => {
  if (
    !Array.isArray(range) ||
    range.length !== 2
  ) {
    return [];
  }

  return range.map((value) =>
    Math.round(Number(value) * 2.54)
  );
};

export const calculateCurrentAgeText = (dob) => {
  if (!dob) {
    return "";
  }

  const birth = new Date(dob);

  if (Number.isNaN(birth.getTime())) {
    return "";
  }

  const today = new Date();

  let years =
    today.getFullYear() -
    birth.getFullYear();

  let months =
    today.getMonth() -
    birth.getMonth();

  if (
    months < 0 ||
    (
      months === 0 &&
      today.getDate() <
        birth.getDate()
    )
  ) {
    years -= 1;
    months =
      (months + 12) % 12;
  }

  return `${years} years${
    months > 0
      ? ` ${months} months`
      : ""
  }`;
};