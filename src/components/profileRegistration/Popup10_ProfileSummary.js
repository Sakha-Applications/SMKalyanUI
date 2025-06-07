import React, { useState } from 'react';
import { Button } from '../common/FormElements';
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center text-gray-700">Profile Summary</h2>
      <p className="text-gray-600 text-center">Please review the details you have entered before completing your profile.</p>

      {/* Displaying a subset of important fields. Add more as needed. */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-2">
        <p><strong>Profile ID:</strong> {formData.profileId}</p>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phoneNumber}</p>
        <p><strong>Gender:</strong> {formData.gender}</p>
        <p><strong>Education:</strong> {formData.education}</p>
        <p><strong>Profession:</strong> {formData.profession}</p>
        <p><strong>City:</strong> {formData.currentLocation}</p>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="secondary" onClick={onPrevious} disabled={isProcessing}>Previous</Button>
        <Button type="button" variant="primary" onClick={handleCompleteClick} disabled={isProcessing}>
          Complete Profile
        </Button>
      </div>

      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to complete your profile? You can make modifications later.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="secondary">Cancel</Button>
          <Button onClick={handleConfirm} variant="primary">Yes, Complete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Popup10_ProfileSummary;
