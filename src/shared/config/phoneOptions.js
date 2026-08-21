import countryData from "country-telephone-data";

export const phoneCountryCodeOptions =
  countryData.allCountries.map((country) => ({
    code: `+${country.dialCode}`,
    label: `${country.name} (+${country.dialCode})`,
    iso2: country.iso2,
  }));

export default phoneCountryCodeOptions;