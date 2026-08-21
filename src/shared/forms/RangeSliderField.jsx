import Slider from "@mui/material/Slider";

const RangeSliderField = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (item) => item,
}) => {
  const safeValue = Array.isArray(value)
    ? value
    : [min, max];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>

        <span className="text-sm font-semibold text-[#00264d]">
          {formatValue(safeValue[0])} –{" "}
          {formatValue(safeValue[1])}
        </span>
      </div>

      <div className="px-2">
        <Slider
          value={safeValue}
          min={min}
          max={max}
          step={step}
          onChange={(_, nextValue) => {
            if (Array.isArray(nextValue)) {
              onChange(nextValue);
            }
          }}
          valueLabelDisplay="auto"
          valueLabelFormat={formatValue}
          sx={{
            color: "#d79a1e",
            "& .MuiSlider-thumb": {
              backgroundColor: "#00264d",
            },
            "& .MuiSlider-track": {
              backgroundColor: "#d79a1e",
              border: "none",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#cbd5e1",
            },
          }}
        />
      </div>
    </div>
  );
};

export default RangeSliderField;