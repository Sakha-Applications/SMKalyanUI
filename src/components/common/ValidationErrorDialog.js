// ValidationErrorDialog.js - New component for showing validation errors
import React from 'react';

const ValidationErrorDialog = ({ errors, isOpen, onClose }) => {
  if (!isOpen || Object.keys(errors).length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Validation Errors
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Please fix the following errors before proceeding:
          </p>
          <ul className="space-y-2">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-sm text-gray-700">{message}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            OK, I'll Fix These
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorDialog;