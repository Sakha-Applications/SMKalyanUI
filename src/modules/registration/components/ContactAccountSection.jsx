import countryData from "country-telephone-data";

const countryCodeOptions =
  countryData.allCountries.map((country) => ({
    code: `+${country.dialCode}`,
    label: `${country.name} (+${country.dialCode})`,
    iso2: country.iso2,
  }));

const inputClassName =
  "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

const Field = ({
  label,
  required = false,
  children,
}) => (
  <label className="block text-sm font-medium text-slate-700">
    <span>
      {label}

      {required && (
        <span className="ml-1 text-red-600">
          *
        </span>
      )}
    </span>

    {children}
  </label>
);

const ContactAccountSection = ({
  formData,
  updateField,
  handlePhoneChange,
  availability,
  availabilityChecking,
  onEmailBlur,
  onPhoneBlur,
}) => {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Mobile Number" required>
        <div className="grid grid-cols-[minmax(120px,0.9fr)_minmax(0,2fr)] gap-2">
          <select
            name="phoneCountryCode"
            value={formData.phoneCountryCode}
            onChange={handlePhoneChange}
            className={inputClassName}
            aria-label="Country code"
          >
            {countryCodeOptions.map(
              (option) => (
                <option
                  key={`${option.iso2}-${option.code}`}
                  value={option.code}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <input
  type="tel"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handlePhoneChange}
  onBlur={onPhoneBlur}
            className={inputClassName}
            placeholder="Enter mobile number"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={15}
          />
        </div>

        <div className="mt-1.5 min-h-[18px] text-xs">
  {availabilityChecking?.phone ? (
    <span className="text-slate-500">
      Checking phone availability...
    </span>
  ) : availability?.phone ===
    "taken" ? (
    <span className="font-medium text-red-600">
      This phone number is already registered. Please login instead.
    </span>
  ) : availability?.phone ===
    "free" ? (
    <span className="font-medium text-emerald-700">
      Phone number is available.
    </span>
  ) : formData.phone ? (
    <span className="text-slate-500">
      Registered number:{" "}
      {formData.phone}
    </span>
  ) : null}
</div>
      </Field>

      <Field
        label="Email Address"
        required
      >
        <input
  type="email"
  name="email"
  value={formData.email}
  onChange={updateField}
  onBlur={onEmailBlur}
          className={inputClassName}
          placeholder="name@example.com"
          autoComplete="email"
        />
  <div className="mt-1.5 min-h-[18px] text-xs">
  {availabilityChecking?.email ? (
    <span className="text-slate-500">
      Checking email availability...
    </span>
  ) : availability?.email ===
    "taken" ? (
    <span className="font-medium text-red-600">
      This email is already registered. Please login instead.
    </span>
  ) : availability?.email ===
    "free" ? (
    <span className="font-medium text-emerald-700">
      Email is available.
    </span>
  ) : null}
</div>
      </Field>

      <Field label="Password" required>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={updateField}
          className={inputClassName}
          autoComplete="new-password"
        />
      </Field>

      <Field
        label="Confirm Password"
        required
      >
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={updateField}
          className={inputClassName}
          autoComplete="new-password"
        />
      </Field>
    </div>
  );
};

export default ContactAccountSection;