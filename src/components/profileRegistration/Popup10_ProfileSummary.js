// src/components/profileRegistration/Popup10_ProfileSummary.js

import React, { useState } from 'react';
import { Button as B } from '../common/FormElements';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';

const Popup10_ProfileSummary = ({ formData, onPrevious, onNext, isProcessing }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCompleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    onNext(); // Proceed to donation page
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header (Popup6 style) */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          Profile Summary
        </h1>
      </header>

      {/* Scrollable Content (Popup6 style) */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            Please review the details you have entered before completing your profile.
          </p>

          {/* Profile Info Header (Popup6 style) */}
          <div className="bg-slate-100 border border-slate-300 rounded-md p-4 shadow-sm text-sm space-y-2">
            <p><strong>Profile ID:</strong> {formData.profileId}</p>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phoneNumber}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Education:</strong> {formData.education}</p>
            <p><strong>Profession:</strong> {formData.profession}</p>
            <p><strong>City:</strong> {formData.currentLocation}</p>
          </div>

          {/* Navigation (Popup6 style) */}
          <div className="flex justify-between pt-6">
            <B type="button" variant="outline" onClick={onPrevious} disabled={isProcessing}>
              ⬅️ Previous
            </B>
            <B type="button" onClick={handleCompleteClick} disabled={isProcessing}>
              Complete Profile ✅
            </B>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to complete your profile? You can make modifications later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <B onClick={handleCancel} variant="outline">Cancel</B>
          <B onClick={handleConfirm}>Yes, Complete</B>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Popup10_ProfileSummary;
