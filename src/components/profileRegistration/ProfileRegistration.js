// src/components/profileRegistration/ProfileRegistration.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Favorite, VolunteerActivism, Cancel } from '@mui/icons-material';
import { popups } from './helpers/popupConfig';
import StepContainer from './layout/StepContainer';
import getBaseUrl from '../../utils/GetUrl';

import handleUserAndProfileCreation from './handlers/handleUserAndProfileCreation';
import handleIntermediateProfileUpdate from './handlers/handleIntermediateProfileUpdate';
import handleFinalSubmit from './handlers/handleFinalSubmit';

import useFormData from '../../hooks/useFormData';

const ProfileRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileAlreadyCreated, setProfileAlreadyCreated] = useState(false);
  const [userAlreadyCreated, setUserAlreadyCreated] = useState(false);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [showUserCreatedDialog, setShowUserCreatedDialog] = useState(false);
  const [profileCreationData, setProfileCreationData] = useState(null);
  const [userCreationData, setUserCreationData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { formData, setFormData, handleChange, handleDOBChange, handleTimeBlur } = useFormData();
  const navigate = useNavigate();

  const ActivePopupComponent = popups[currentStep]?.component;

  const handleNextPopup = async () => {
    if (currentStep > 1 && currentStep < popups.length - 1) {
      const updateSuccess = await handleIntermediateProfileUpdate({ formData, setIsProcessing });
      if (!updateSuccess) return;
    }

    if (currentStep < popups.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleFinalSubmit({ formData, setIsProcessing, navigate, setShowDonationDialog });
    }
  };

  const handlePopup2Signup = async () => {
    
    const success = await handleUserAndProfileCreation({
      formData,
      setFormData,
      setProfileAlreadyCreated,
      setUserAlreadyCreated,
      setUserCreationData,
      setShowUserCreatedDialog,
      setProfileCreationData,
      setIsProcessing,
      navigate
    });
    
    
  };

  const handlePreviousPopup = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUserCreationConfirmation = (proceedNow) => {
    setShowUserCreatedDialog(false);
    if (proceedNow) {
      setCurrentStep(currentStep + 1);
    } else {
      alert(`Please save your login credentials:\nUser ID: ${userCreationData?.userId}\nPassword: ${userCreationData?.password}`);
      navigate("/");
    }
  };

  const handleDonationChoice = async (wantsToDonate) => {
    setShowDonationDialog(false);
    let loginSuccess = false;

    const loginUserId = formData.userId || userCreationData?.userId;
    const loginPassword = userCreationData?.password;

    if (loginUserId && loginPassword) {
      console.log("🔐 Attempting auto-login before redirect...");
      try {
        const loginPayload = {
          userId: loginUserId,
          password: loginPassword
        };
        const response = await fetch(`${getBaseUrl()}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(loginPayload)
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("donationIntent", wantsToDonate ? "yes" : "no");
          loginSuccess = true;
        }
      } catch (error) {
        console.warn("Auto-login failed:", error);
      }
    }

    if (wantsToDonate) {
      navigate("/donate");
    } else {
      if (loginSuccess) {
        navigate("/dashboard");
      } else {
        alert("Profile complete. Please login manually.");
        navigate("/");
      }
    }
  };

  if (!ActivePopupComponent) return null;

  return (
    <>
      <StepContainer
        currentStep={currentStep}
        popups={popups}
        formData={formData}
        profileAlreadyCreated={profileAlreadyCreated}
        userAlreadyCreated={userAlreadyCreated}
      >
        <ActivePopupComponent
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleDOBChange={handleDOBChange}
          handleTimeBlur={handleTimeBlur}
          onNext={currentStep === 1 ? handlePopup2Signup : handleNextPopup}
          onPrevious={handlePreviousPopup}
          currentStep={currentStep}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          // Additional props for Popup2
          setProfileAlreadyCreated={setProfileAlreadyCreated}
          setUserAlreadyCreated={setUserAlreadyCreated}
          setUserCreationData={setUserCreationData}
          setShowUserCreatedDialog={setShowUserCreatedDialog}
          setProfileCreationData={setProfileCreationData}
          navigate={navigate}
          isLastStep={currentStep === popups.length - 1}
          handleIntermediateProfileUpdate={handleIntermediateProfileUpdate}
        />
      </StepContainer>

      {/* User Created Confirmation Dialog */}
      <Dialog open={showUserCreatedDialog} maxWidth="sm" fullWidth>
        <DialogTitle>User Account Created Successfully! ✅</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your login credentials are:
          </Typography>
          <Typography><strong>User ID:</strong> {userCreationData?.userId}</Typography>
          <Typography><strong>Password:</strong> {userCreationData?.password}</Typography>
          <Typography><strong>Profile ID:</strong> {userCreationData?.profileId}</Typography>
          <Typography sx={{ mt: 2 }}>
            Would you like to continue completing your profile now or do it later?
          </Typography>
        </DialogContent>
          <DialogActions>
          <Button onClick={() => handleUserCreationConfirmation(false)} variant="outlined" color="warning">
            Complete Later
          </Button>
          <Button onClick={() => handleUserCreationConfirmation(true)} variant="contained" color="success">
            Continue Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Donation Prompt Dialog */}
      <Dialog open={showDonationDialog} maxWidth="xs" fullWidth onClose={() => setShowDonationDialog(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VolunteerActivism sx={{ color: '#f44336' }} /> Support Our Mission
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your profile has been submitted successfully. 🙌
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Would you consider making a small donation to help us keep this platform free and growing? Every contribution counts. ❤️
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Cancel />} onClick={() => handleDonationChoice(false)} variant="outlined">
            Not Now
          </Button>
          <Button startIcon={<Favorite />} onClick={() => handleDonationChoice(true)} variant="contained" color="primary">
            Yes, I'll Donate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileRegistration;