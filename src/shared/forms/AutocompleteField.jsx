import {
  useEffect,
  useRef,
  useState,
} from "react";

const normalizeOption = (option) => {
  if (
    option === null ||
    option === undefined
  ) {
    return {
      value: "",
      label: "",
    };
  }

  if (
    typeof option === "string" ||
    typeof option === "number"
  ) {
    return {
      value: String(option),
      label: String(option),
    };
  }

  const label = String(
    option.label ??
      option.name ??
      option.value ??
      option.mother_tongue ??
      option.motherTongue ??
      option.place ??
      option.nativeplace ??
      option.nativePlace ??
      option.native_place ??
      option.education ??
      option.profession ??
      option.designation ??
      ""
  );

  return {
    ...option,
    value: option.value ?? label,
    label,
  };
};

const AutocompleteField = ({
  label,
  value = "",
  searchFn,
  onChange,
  placeholder,
  required = false,
  minimumCharacters = 2,
  delay = 300,
}) => {
  const [options, setOptions] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [open, setOpen] =
    useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);

  useEffect(() => {
    const searchValue = String(
      value || ""
    ).trim();

    if (
      searchValue.length <
      minimumCharacters
    ) {
      setOptions([]);
      setOpen(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const results =
          await searchFn(searchValue);

        const normalized = Array.isArray(
          results
        )
          ? results
              .map(normalizeOption)
              .filter(
                (option) => option.label
              )
          : [];

        setOptions(normalized);
        setOpen(normalized.length > 0);
      } catch (error) {
        console.error(
          `${label} lookup failed:`,
          error
        );

        setOptions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [
    value,
    searchFn,
    label,
    minimumCharacters,
    delay,
  ]);

  const selectOption = (option) => {
    onChange(option.label, option);
    setOptions([]);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <label className="block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      <input
        type="text"
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value, null)
        }
        placeholder={
          placeholder ||
          `Start typing ${label.toLowerCase()}`
        }
        autoComplete="off"
        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
      />

      {loading && (
        <span className="absolute right-3 top-9 text-xs text-slate-400">
          Loading...
        </span>
      )}

      {open && options.length > 0 && (
        <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {options.map(
            (option, index) => (
              <button
                key={`${option.value}-${index}`}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectOption(option);
                }}
                className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-[#00264d]"
              >
                {option.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteField;