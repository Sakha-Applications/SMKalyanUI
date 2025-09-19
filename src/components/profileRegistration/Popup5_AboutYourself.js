// src/components/profileRegistration/Popup5_AboutYourself.js

import React, { useEffect, useState } from 'react';
import { Label as L, TextArea, Button as B } from '../common/FormElements';
import ValidationErrorDialog from '../common/ValidationErrorDialog';
import validateRequiredFields from '../common/validateRequiredFields';
import { getDefaultAboutText } from '../../utils/defaultAboutTemplates';

const Popup5_AboutYourself = ({
  formData,
  handleChange,
  onNext,
  onPrevious,
  setIsProcessing,
  handleIntermediateProfileUpdate
}) => {
  const [errors, setErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // ✅ One-time auto-fill: only if field is missing/empty on FIRST load
  useEffect(() => {
    const v = (formData.aboutBrideGroom || '').trim();
    if (!v) {
      const draft = getDefaultAboutText(formData);
      handleChange({ target: { name: 'aboutBrideGroom', value: draft } });
    }
    // no deps => run once on mount; we intentionally don't add formData/gender to avoid overwriting later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateAndProceed = async () => {
    const requiredFields = {
      aboutBrideGroom: 'About Yourself',
    };

    const newErrors = validateRequiredFields(formData, requiredFields);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const ok = await handleIntermediateProfileUpdate?.({ formData, setIsProcessing });
      if (ok !== false) onNext();
    } else {
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header (matches your other popups) */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          We’ve added a quick intro about you, review and feel free to modify
        </h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <ValidationErrorDialog
            errors={errors}
            isOpen={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
          />

          <div className="md:col-span-2">
            <L htmlFor="aboutBrideGroom">
              About Yourself <span className="text-red-500">*</span>
            </L>
            <TextArea
              name="aboutBrideGroom"
              value={formData.aboutBrideGroom || ''}
              onChange={handleChange}
              rows={10}
              required
              error={!!errors.aboutBrideGroom}
              placeholder="Write something about yourself..."
            />
            {errors.aboutBrideGroom && (
              <small className="text-red-600">{errors.aboutBrideGroom}</small>
            )}
            <div className="mt-2 text-xs text-gray-500">
              Tip: You can personalize the pre-filled text with more details (e.g., specific interests, city, or goals).
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <B variant="outline" onClick={onPrevious}>Previous</B>
            <B onClick={validateAndProceed}>Save & Next</B>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup5_AboutYourself;
