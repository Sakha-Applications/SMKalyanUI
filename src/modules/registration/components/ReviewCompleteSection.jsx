const Summary = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-slate-900">
      {value || "—"}
    </p>
  </div>
);

const ReviewCompleteSection = ({
  formData,
  updateField,
}) => {
  return (
    <>
      <div className="grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Summary
          label="Name"
          value={formData.name}
        />

        <Summary
          label="Profile Created For"
          value={formData.profileCreatedFor}
        />

        <Summary
          label="Mother Tongue"
          value={
            formData.motherTongue
          }
        />

        <Summary
          label="Gotra"
          value={formData.gotra}
        />

        <Summary
          label="Profession"
          value={
            formData.profession
          }
        />

        <Summary
          label="Location"
          value={
            formData.currentLocation
          }
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="declarationAccepted"
          checked={
            formData.declarationAccepted
          }
          onChange={updateField}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
        />

        <span className="text-sm leading-6 text-slate-600">
          I confirm that the information
          provided is accurate and I agree
          to the platform's privacy and
          profile usage terms.
        </span>
      </label>
    </>
  );
};

export default ReviewCompleteSection;