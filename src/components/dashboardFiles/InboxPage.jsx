// src/pages/InboxPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../../utils/GetUrl';
import { Typography, Box, Paper, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

// Optional: If you have a default profile image for display
const FALLBACK_DEFAULT_IMAGE_PATH = '/ProfilePhotos/defaultImage.jpg';

// Styled component for individual invitation cards
const InvitationCard = styled(Paper)(({ theme }) => ({
  padding: '16px',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

const ProfileImage = styled('img')({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '16px',
  border: '2px solid #a0a0a0',
});

const StatusBadge = styled(Box)(({ status }) => ({
  padding: '4px 8px',
  borderRadius: '12px',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  color: 'white',
  backgroundColor: 
    status === 'PENDING' ? '#ff9800' : // Orange
    status === 'VIEWED' ? '#2196f3' :  // Blue
    status === 'ACCEPTED' ? '#4caf50' : // Green
    status === 'REJECTED' ? '#f44336' : // Red
    '#607d8b', // Grey for unknown
}));


const InboxPage = () => {
  const navigate = useNavigate();
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllInvitations = async () => {
      setLoading(true);
      setError(null);
      const token = sessionStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        // Fetch Received Invitations
        const receivedResponse = await axios.get(`${getBaseUrl()}/api/invitations/received`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (receivedResponse.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        setReceivedInvitations(receivedResponse.data || []);
        console.log("✅ Fetched received invitations:", receivedResponse.data);

        // Fetch Sent Invitations
        const sentResponse = await axios.get(`${getBaseUrl()}/api/invitations/sent`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (sentResponse.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        setSentInvitations(sentResponse.data || []);
        console.log("✅ Fetched sent invitations:", sentResponse.data);

      } catch (err) {
        console.error("❌ Error fetching all invitations:", err);
        setError(err.message || 'Failed to load invitations.');
        if (err.message.includes('Session expired') || err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllInvitations();
  }, [navigate]);

  const handleViewProfileClick = (profileId) => {
    navigate(`/view-profile/${profileId}`);
  };

  // Conditional rendering for no data
  const renderNoInvitations = (message) => (
    <Typography variant="body1" align="center" className="text-gray-700 py-4">
      {message}
    </Typography>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>Loading invitations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography color="error" variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

  // Combined check for no invitations
  if (receivedInvitations.length === 0 && sentInvitations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold text-center">Your Inbox</h1>
          </div>
          <div className="p-6">
            {renderNoInvitations("You have no invitations (received or sent) at the moment.")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold text-center">Your Inbox</h1>
        </div>
        
        {/* Main Content Area - Two Columns */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Invitations Received */}
          <div>
            <Typography variant="h5" sx={{ mb: 3, color: 'indigo.800', fontWeight: 'bold' }}>
              Connections Received
            </Typography>
            {receivedInvitations.length === 0 ? (
              renderNoInvitations("You have no new invitations at the moment.")
            ) : (
              <div>
                {receivedInvitations.map((inv) => (
                  <InvitationCard key={inv.invitation_id} elevation={2}>
                    <ProfileImage src={`${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}`} alt="Inviter Profile" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" color="primary">
                        From {inv.inviter_name || inv.inviter_profile_id}
                      </Typography>
                      {inv.inviter_message && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                          "{inv.inviter_message}"
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Received: {new Date(inv.sent_at).toLocaleDateString()}{' '}
                        <StatusBadge status={inv.status}>{inv.status}</StatusBadge>
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleViewProfileClick(inv.inviter_profile_id)}
                      sx={{ ml: 2, flexShrink: 0 }}
                    >
                      View Profile
                    </Button>
                  </InvitationCard>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Invitations Sent */}
          <div>
            <Typography variant="h5" sx={{ mb: 3, color: 'indigo.800', fontWeight: 'bold' }}>
              Connectionss Sent
            </Typography>
            {sentInvitations.length === 0 ? (
              renderNoInvitations("You haven't sent any invitations yet.")
            ) : (
              <div>
                {sentInvitations.map((inv) => (
                  <InvitationCard key={inv.invitation_id} elevation={2}>
                    <ProfileImage src={`${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}`} alt="Invitee Profile" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" color="primary">
                        To {inv.invitee_name || inv.invitee_profile_id}
                      </Typography>
                      {inv.inviter_message && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                          "{inv.inviter_message}"
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Sent: {new Date(inv.sent_at).toLocaleDateString()}{' '}
                        <StatusBadge status={inv.status}>{inv.status}</StatusBadge>
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleViewProfileClick(inv.invitee_profile_id)}
                      sx={{ ml: 2, flexShrink: 0 }}
                    >
                      View Profile
                    </Button>
                  </InvitationCard>
                ))}
              </div>
            )}
          </div>

        </div> {/* End of two-column grid */}
        
        {/* Back to Dashboard Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, pb: 4 }}> {/* Added padding-bottom */}
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/dashboard')}
            >
                Back to Dashboard
            </Button>
        </Box>

      </div>
    </div>
  );
};

export default InboxPage;