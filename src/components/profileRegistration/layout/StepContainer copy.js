// src/components/profileRegistration/layout/StepContainer.js

import React from 'react';

const StepContainer = ({
  currentStep,
  popups,
  formData,
  profileAlreadyCreated,
  userAlreadyCreated,
  children
}) => {
  return (
    <div className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto overflow-hidden transform transition-all duration-300 ease-in-out scale-100">

        {/* Header 
        <header className="bg-gradient-to-r from-rose-500 to-pink-500 p-5">
          <h1 className="text-2xl font-bold text-white text-center">
            {popups[currentStep].name} (Step {currentStep + 1} of {popups.length})
          </h1>
          {(profileAlreadyCreated || userAlreadyCreated) && (
            <p className="text-white text-center text-sm mt-1 opacity-90">
              ✅ {profileAlreadyCreated && userAlreadyCreated ? 'Profile and User created' :
                  profileAlreadyCreated ? 'Profile created' : 'User created'} - continuing registration
            </p>
          )}
        </header>
*/}
       

        {/* Popup Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StepContainer;
