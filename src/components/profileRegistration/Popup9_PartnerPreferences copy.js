import React, { useState } from 'react';
import Page1 from './Popup9_PartnerPreferences_Page1';
import Page2 from './Popup9_PartnerPreferences_Page2';
import Page3 from './Popup9_PartnerPreferences_Page3';

const Popup9_PartnerPreferences = ({
  formData,
  handleChange,
  handleIntermediateProfileUpdate,
  setIsProcessing,
  onPrevious,
  onNext
}) => {
  const [step, setStep] = useState(0);

  const goToNext = () => setStep((prev) => Math.min(prev + 1, 2));
  const goToPrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleFinalSave = async () => {
    const success = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
    if (success) onNext();
  };

  const pageProps = {
    formData,
    handleChange,
    onNext: step === 2 ? handleFinalSave : goToNext,
    onPrevious: step === 0 ? onPrevious : goToPrevious
  };

  return (
    <div>
      {step === 0 && <Page1 {...pageProps} />}
      {step === 1 && <Page2 {...pageProps} />}
      {step === 2 && <Page3 {...pageProps} />}
    </div>
  );
};

export default Popup9_PartnerPreferences;
