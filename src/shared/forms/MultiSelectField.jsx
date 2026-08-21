import {
  Autocomplete,
  Checkbox,
  TextField,
} from "@mui/material";

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
      option.education ??
      option.profession ??
      option.designation ??
      option.place ??
      option.nativeplace ??
      option.nativePlace ??
      option.native_place ??
      ""
  );

  return {
    ...option,
    value:
      option.value ??
      label,
    label,
  };
};

const MultiSelectField = ({
  label,
  options = [],
  value = [],
  searchValue = "",
  onSearchChange,
  onChange,
  placeholder,
  loading = false,
  required = false,
}) => {
  const normalizedOptions = options
    .map(normalizeOption)
    .filter(
      (option) => option.label
    );

  const normalizedValue = value
    .map(normalizeOption)
    .filter(
      (option) => option.label
    );

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={normalizedOptions}
        value={normalizedValue}
        inputValue={searchValue}
        loading={loading}
        isOptionEqualToValue={(
          option,
          selected
        ) =>
          String(option.value) ===
          String(selected.value)
        }
        getOptionLabel={(option) =>
          option.label || ""
        }
        onInputChange={(
          _,
          nextValue,
          reason
        ) => {
          if (
            reason === "input" &&
            onSearchChange
          ) {
            onSearchChange(
              nextValue
            );
          }

          if (
            reason === "clear" &&
            onSearchChange
          ) {
            onSearchChange("");
          }
        }}
        onChange={(
          _,
          selectedOptions
        ) => {
          onChange(
            selectedOptions.map(
              (option) => ({
                value:
                  option.value,
                label:
                  option.label,
              })
            )
          );
        }}
        renderOption={(
          props,
          option,
          { selected }
        ) => {
          const {
            key,
            ...optionProps
          } = props;

          return (
            <li
              key={key}
              {...optionProps}
            >
              <Checkbox
                checked={selected}
                sx={{
                  color:
                    "#94a3b8",
                  "&.Mui-checked":
                    {
                      color:
                        "#d79a1e",
                    },
                }}
              />

              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            required={
              required &&
              normalizedValue.length ===
                0
            }
            placeholder={
              placeholder ||
              `Select ${label}`
            }
            size="small"
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  minHeight:
                    "42px",
                  borderRadius:
                    "0.75rem",
                  backgroundColor:
                    "#ffffff",

                  "&.Mui-focused fieldset":
                    {
                      borderColor:
                        "#d79a1e",
                    },
                },

              "& .MuiAutocomplete-input":
                {
                  fontSize:
                    "0.875rem",
                },
            }}
          />
        )}
      />
    </div>
  );
};

export default MultiSelectField;