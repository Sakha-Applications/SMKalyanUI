// src/components/common/FullWidthHobbiesGrid.jsx

import React from "react";
import { hobbyOptions } from './hobbyOptions';

const FullWidthHobbiesGrid = ({ label = "Hobbies", fieldName, formData, handleChange }) => {
  // Ensure formData[fieldName] is always an array
  const current = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];

  // Utility to toggle selection
  const toggle = (itemLabel, isChecked) => {
    let next = isChecked
      ? current.filter((h) => String(h).trim().toLowerCase() !== itemLabel.toLowerCase())
      : [...current, itemLabel];

    const norm = (x) => String(x).trim().toLowerCase();
    const pick = (x) => String(x).trim();

    const uniqueValues = [...new Map(next.map((v) => [norm(v), pick(v)])).values()];

    handleChange({
      target: { name: fieldName, value: uniqueValues },
    });
  };

  return (
    <div className="md:col-span-2">
      <label className="mb-2 block font-semibold text-gray-700">{label}</label>

      <div className="border rounded-lg p-3 bg-white max-h-64 overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">
          
          {/* ---------- COLUMN 1 ---------- */}
          <div>
            <div className="font-semibold text-gray-700 mb-2">General Hobbies</div>
            <div className="space-y-1">
              {hobbyOptions.slice(0, Math.ceil(hobbyOptions.length / 2)).map((opt, idx) => {
                const itemLabel = String(opt.label ?? opt).trim();
                const isChecked = current
                  .map((h) => String(h).trim().toLowerCase())
                  .includes(itemLabel.toLowerCase());

                return (
                  <label
                    key={idx}
                    className="flex items-start space-x-2 text-sm cursor-pointer rounded-md px-2 py-1 hover:bg-pink-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={isChecked}
                      onChange={() => toggle(itemLabel, isChecked)}
                    />
                    <span className="whitespace-normal break-words">{itemLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ---------- COLUMN 2 ---------- */}
          <div>
            <div className="font-semibold text-gray-700 mb-2">Spiritual & Activities</div>
            <div className="space-y-1">
              {hobbyOptions.slice(Math.ceil(hobbyOptions.length / 2)).map((opt, idx) => {
                const itemLabel = String(opt.label ?? opt).trim();
                const isChecked = current
                  .map((h) => String(h).trim().toLowerCase())
                  .includes(itemLabel.toLowerCase());

                return (
                  <label
                    key={idx}
                    className="flex items-start space-x-2 text-sm cursor-pointer rounded-md px-2 py-1 hover:bg-pink-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={isChecked}
                      onChange={() => toggle(itemLabel, isChecked)}
                    />
                    <span className="whitespace-normal break-words">{itemLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FullWidthHobbiesGrid;
