const FormField = ({
  label,
  name,
  required = false,
  error,
  helpText,
  children,
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-800"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {helpText && !error && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;