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

  // 🔹 NEW: Popup4 confirmation dialog state (mirrors Popup2 confirmation pattern)
  const [showPopup4ConfirmDialog, setShowPopup4ConfirmDialog] = useState(false);

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

  // 🔹 NEW: Popup4 confirmation handler (Continue → next step, Later → exit)
  const handlePopup4Confirmation = (proceedNow) => {
    setShowPopup4ConfirmDialog(false);
    if (proceedNow) {
      setCurrentStep(currentStep + 1);
    } else {
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
          // 🔹 NEW: give Popup4 a way to open its confirmation dialog after save
          setShowPopup4ConfirmDialog={setShowPopup4ConfirmDialog}
        />
      </StepContainer>

      {/* User Created Confirmation Dialog */}
      <Dialog open={showUserCreatedDialog} maxWidth="sm" fullWidth>
        <DialogTitle>User Profile is Registered Successfully! ✅</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your login credentials are:
          </Typography>
          <Typography><strong>User ID:</strong> {userCreationData?.userId}</Typography>
          <Typography><strong>Password:</strong> {userCreationData?.password}</Typography>
          <Typography><strong>Profile ID:</strong> {userCreationData?.profileId}</Typography>
          <Typography sx={{ mt: 2 }}>
            Complete profile creation will help you to get the better response..You need to provide more details to create you profile...
            Would you like to continue Creating your profile now or do it later?
            Recommend you to continue now to get the best experience out of our platform. You can always update your profile later from the dashboard.
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

      {/* 🔹 NEW: Popup4 Confirmation Dialog (mirrors Popup2 UX) */}
      <Dialog open={showPopup4ConfirmDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Your Profile is created Successfully! ✅</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your Career &amp; Education details have been saved.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Complete profile creation will help you to get the better response..
            We need to capture more details for your profile Would you like to continue now or complete the rest later?
            Recommend you to continue now to get the best experience out of our platform. You can always update your profile later from the dashboard.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePopup4Confirmation(false)} variant="outlined" color="warning">
            Complete Later
          </Button>
          <Button onClick={() => handlePopup4Confirmation(true)} variant="contained" color="success">
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
            Registration Fee is manadatory to search profiles. Would you consider making a small registration fee and donation to help us keep this platform growing? Every contribution counts. ❤️
            Once payment is sucessful, our team will review and activate your profile.
            You can even make payment later from the dashboard.
            Please note that your profile will not be visible to others until the registration fee is paid and the profile is activated by our team. We appreciate your support in helping us create a thriving community!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Cancel />} onClick={() => handleDonationChoice(false)} variant="outlined">
            Not Now
          </Button>
          <Button startIcon={<Favorite />} onClick={() => handleDonationChoice(true)} variant="contained" color="primary">
            Yes, I'll Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileRegistration;
