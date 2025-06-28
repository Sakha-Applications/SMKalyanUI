// src/components/ProfileModule/ViewOtherProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../../utils/GetUrl';

// Material-UI Accordion imports
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Make sure @mui/icons-material is installed

// Material-UI components for custom message and feedback
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Corrected import paths for the display sections
import BasicProfile from '../ModifyProfile/PartnerPreferences/sections/BasicProfile';
import BirthAndAstro from '../ModifyProfile/PartnerPreferences/sections/BirthAndAstro';
import EducationJobDetails from '../ModifyProfile/PartnerPreferences/sections/EducationJobDetails';
import ContactDetails from '../ModifyProfile/PartnerPreferences/sections/ContactDetails';
import FamilyDetails from '../ModifyProfile/PartnerPreferences/sections/FamilyDetails';
import HoroscopeDetails from '../ModifyProfile/PartnerPreferences/sections/HoroscopeDetails';
import AddressDetails from '../ModifyProfile/PartnerPreferences/sections/AddressDetails';
import ReferencesSection from '../ModifyProfile/PartnerPreferences/sections/ReferencesSection';


const ViewOtherProfilePage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false); // State to manage expanded accordion panels
  const [inviterMessage, setInviterMessage] = useState(''); // State for custom message
  const [isSendingInvitation, setIsSendingInvitation] = useState(false); // State for button loading
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar feedback
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Handler for accordion expansion change
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError("Profile ID is missing from the URL.");
        setLoading(false);
        return;
      }

      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${getBaseUrl()}/api/modifyProfile/byId`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { profileId: profileId }
        });

        if (response.status === 401) {
          throw new Error('Authentication required. Your session might have expired.');
        }

        if (!response.data) {
          setError("Profile not found.");
          setProfileData(null);
        } else {
          setProfileData(response.data);
          console.log("✅ Fetched other profile data:", response.data);
        }
      } catch (err) {
        console.error("❌ Error fetching other profile:", err);
        setError(err.message || "Failed to load profile.");
        if (err.response?.status === 401 || err.message.includes("Authentication required")) {
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError("Profile not found.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, navigate]);

  // Handler for sending invitation
  const handleSendInvitation = async () => {
    setIsSendingInvitation(true);
    setSnackbarOpen(false); // Close any existing snackbar

    const token = sessionStorage.getItem('token');
    if (!token) {
      setSnackbarSeverity('error');
      setSnackbarMessage('You must be logged in to send invitations.');
      setSnackbarOpen(true);
      setIsSendingInvitation(false);
      navigate('/login');
      return;
    }

    try {
      const payload = {
        invitee_profile_id: profileData.profile_id,
        inviter_message: inviterMessage.trim() || null, // Send trimmed message or null
      };

      const response = await axios.post(`${getBaseUrl()}/api/invitations/send`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSnackbarSeverity('success');
      setSnackbarMessage(response.data.message || 'Invitation sent successfully!');
      setSnackbarOpen(true);
      setInviterMessage(''); // Clear message field

    } catch (err) {
      console.error("❌ Error sending invitation:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to send invitation.';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsSendingInvitation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold">Profile Details: {profileData.name} ({profileData.profile_id})</h1>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><strong>Profile ID:</strong> {profileData.profile_id || profileData.profileId}</div>
            <div><strong>Name:</strong> {profileData.name}</div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Invitation Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <Typography variant="h6" className="text-indigo-800 mb-3">Invite to Review Profile</Typography>
            <TextField
              label="Optional message"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={inviterMessage}
              onChange={(e) => setInviterMessage(e.target.value)}
              margin="normal"
              disabled={isSendingInvitation}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendInvitation}
              disabled={isSendingInvitation}
            >
              {isSendingInvitation ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
          </div>

          {/* Accordion for Basic Details */}
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h6">Basic Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BasicProfile profileData={profileData} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion for Contact & Address Details */}
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
              <Typography variant="h6">Contact & Address Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AddressDetails profileData={profileData} />
              <ContactDetails profileData={profileData} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion for Education & Job Details */}
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
              {/* Removed the extra closing Typography tag here */}
              <Typography variant="h6">Education & Job Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <EducationJobDetails profileData={profileData} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion for Family Details */}
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
              <Typography variant="h6">Family Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FamilyDetails profileData={profileData} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion for Birth & Astro Details */}
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5a-content" id="panel5a-header">
              <Typography variant="h6">Birth & Astro Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BirthAndAstro profileData={profileData} />
              <HoroscopeDetails profileData={profileData} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion for References */}
          <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6a-content" id="panel6a-header">
              <Typography variant="h6">References</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ReferencesSection profileData={profileData} />
            </AccordionDetails>
          </Accordion>


          <div className="flex justify-center pt-6">
            <button
              className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
      {/* Snackbar for feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewOtherProfilePage;