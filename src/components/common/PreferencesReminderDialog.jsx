// src/components/common/PreferencesReminderDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material';

const PreferencesReminderDialog = ({ open, onClose, onSetPreferences, onFindMatches }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="preferences-dialog-title">
      <DialogTitle id="preferences-dialog-title">
        Improve Your Matches
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please ensure you mention your preferences properly to get better matching profiles.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Setting detailed preferences helps us find the most compatible profiles for you.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSetPreferences} variant="contained" color="primary">
          Set Preferences
        </Button>
        <Button onClick={onFindMatches} variant="outlined" color="secondary" sx={{ ml: 1 }}>
          Find Matches Anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreferencesReminderDialog;