import React from "react";
import { Input } from "../../../../shared/common/FormElements";
import { TextField, MenuItem } from "@mui/material";
import { designClasses } from "../../../../shared/styles/designTokens";
import { phoneCountryCodeOptions } from "../../../../shared/config/phoneOptions";

const DataRow = ({ label, value }) => (
  <div className="py-2">
    <p className={`text-sm ${designClasses.textSecondary}`}>
      <span className={`font-semibold ${designClasses.textPrimary}`}>
        {label}:
      </span>{" "}
      {value || "-"}
    </p>
  </div>
);

const ReferencesSection = ({
  profileData,
  formData = {},
  setFormData,
  mode = "view",
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData?.((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mode === "edit" ? (
          <>
            {/* Reference 1 */}
            <div className="md:col-span-2 grid grid-cols-1 gap-4 border-b pb-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="reference1Name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Reference 1 Name
                </label>

                <Input
                  name="reference1Name"
                  value={formData?.reference1Name || ""}
                  onChange={handleChange}
                  placeholder="Enter reference 1 name"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="reference1PhoneNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Reference 1 Phone
                </label>

                <div className="flex w-full space-x-2">
                  <TextField
                    select
                    name="reference1PhoneCountryCode"
                    value={
                      formData?.reference1PhoneCountryCode ||
                      "+91"
                    }
                    onChange={handleChange}
                    sx={{
                      minWidth: 140,
                      maxWidth: 200,
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      "& .MuiInputBase-root": {
                        height: "40px",
                      },
                      "& .MuiInputBase-input": {
                        padding: "8px 14px",
                      },
                    }}
                  >
                    {phoneCountryCodeOptions.map((option) => (
                      <MenuItem
                        key={`${option.iso2}-${option.code}`}
                        value={option.code}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Input
                    name="reference1PhoneNumber"
                    type="tel"
                    value={formData?.reference1PhoneNumber || ""}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Reference 2 */}
            <div className="md:col-span-2 grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
              <div>
                <label
                  htmlFor="reference2Name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Reference 2 Name
                </label>

                <Input
                  name="reference2Name"
                  value={formData?.reference2Name || ""}
                  onChange={handleChange}
                  placeholder="Enter reference 2 name"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="reference2PhoneNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Reference 2 Phone
                </label>

                <div className="flex w-full space-x-2">
                  <TextField
                    select
                    name="reference2PhoneCountryCode"
                    value={
                      formData?.reference2PhoneCountryCode ||
                      "+91"
                    }
                    onChange={handleChange}
                    sx={{
                      minWidth: 140,
                      maxWidth: 200,
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      "& .MuiInputBase-root": {
                        height: "40px",
                      },
                      "& .MuiInputBase-input": {
                        padding: "8px 14px",
                      },
                    }}
                  >
                    {phoneCountryCodeOptions.map((option) => (
                      <MenuItem
                        key={`${option.iso2}-${option.code}`}
                        value={option.code}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Input
                    name="reference2PhoneNumber"
                    type="tel"
                    value={formData?.reference2PhoneNumber || ""}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DataRow
              label="Reference 1 Name"
              value={profileData?.reference1Name}
            />

            <DataRow
              label="Reference 1 Phone"
              value={`${
                profileData?.reference1PhoneCountryCode || ""
              } ${
                profileData?.reference1PhoneNumber ||
                profileData?.reference1Phone ||
                "-"
              }`}
            />

            <DataRow
              label="Reference 2 Name"
              value={profileData?.reference2Name}
            />

            <DataRow
              label="Reference 2 Phone"
              value={`${
                profileData?.reference2PhoneCountryCode || ""
              } ${
                profileData?.reference2PhoneNumber ||
                profileData?.reference2Phone ||
                "-"
              }`}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ReferencesSection;