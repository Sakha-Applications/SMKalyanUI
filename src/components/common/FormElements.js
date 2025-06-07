// src/components/common/FormElements.js
// Contains reusable UI components for forms.

import React from 'react';

export const Label = ({ htmlFor, children, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-700 mb-1 ${className}`}>
    {children}
  </label>
);

export const Input = ({ id, name, type = 'text', value, onChange, onBlur, placeholder, required, readOnly, className = '', helperText, error }) => (
  <div>
    <input
      id={id || name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      autoComplete="off" // Often good for custom forms
      className={`appearance-none block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300'} 
                 rounded-md shadow-sm placeholder-slate-400 focus:outline-none 
                 focus:ring-pink-500 focus:border-pink-500 sm:text-sm 
                 ${readOnly ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'} ${className}`}
    />
    {helperText && <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>{helperText}</p>}
  </div>
);

export const Select = ({ id, name, value, onChange, required, children, className = '', helperText, error }) => (
  <div>
    <select
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300'} 
                 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 
                 focus:border-pink-500 sm:text-sm ${className}`}
    >
      {children}
    </select>
     {helperText && <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>{helperText}</p>}
  </div>
);

export const RadioGroup = ({ name, options, selectedValue, onChange, required, className='', legend }) => (
  <fieldset className={className}>
    {legend && <legend className="block text-sm font-medium text-slate-700 mb-1">{legend} {required && <span className="text-red-500">*</span>}</legend>}
    <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
      {options.map(option => (
        <label key={option.value} className="flex items-center space-x-1 sm:space-x-2 cursor-pointer py-1">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            required={required}
            className="h-4 w-4 text-pink-600 border-slate-400 focus:ring-pink-500"
          />
          <span className="text-sm text-slate-700">{option.label}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = 'inline-flex items-center justify-center px-6 py-2.5 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150';
  const variants = {
    primary: `bg-pink-600 hover:bg-pink-700 text-white border-transparent focus:ring-pink-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    outline: `bg-white hover:bg-slate-50 text-slate-700 border-slate-300 focus:ring-pink-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-slate-100 hover:bg-slate-200 text-pink-700 border-transparent focus:ring-pink-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

export const TextArea = ({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  className = '',
  disabled = false,
  name = '',
  id = '',
}) => {
  const baseStyle = `block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm`;
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '';

  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseStyle} ${disabledStyle} ${className}`}
    />
  );
};