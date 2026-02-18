import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import getBaseUrl from "../../utils/GetUrl";

const API_BASE_URL = `${getBaseUrl()}`;
const BACKEND_DEFAULT_IMAGE_URL = "/ProfilePhotos/defaultImage.jpg";

const ContactDetailsResults = ({ results }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [profilePhotos, setProfilePhotos] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      console.log("🖼️ Fetching photos for profiles:", results.map(p => p.profile_id).join(", "));
      const photosByProfile = {};

      for (const profile of results) {
        try {
          console.log(`🖼️ Fetching photos for profile ID: ${profile.profile_id}`);
          const response = await axios.get(`${API_BASE_URL}/api/get-photos?profileId=${profile.profile_id}`);

          photosByProfile[profile.profile_id] = (response.data || []).map(photo => {
            const parts = photo.photo_path.split(/[\\\/]/);
            const filename = parts[parts.length - 1];
            return {
              path: `/ProfilePhotos/${filename}`,
              isDefault: photo.is_default === 1,
              filename
            };
          });

          console.log(`🖼️ Processed photos for profile ${profile.profile_id}:`, photosByProfile[profile.profile_id]);
        } catch (error) {
          console.error(`❌ Error fetching photos for profile ${profile.profile_id}:`, error);
          photosByProfile[profile.profile_id] = [];
        }
      }

      setProfilePhotos(photosByProfile);
    };

    if (results && results.length > 0) fetchPhotos();
  }, [results]);

  const getDefaultPhotoUrl = (profileId) => {
    const photos = profilePhotos[profileId];
    if (!photos || photos.length === 0) {
      return `${API_BASE_URL}${BACKEND_DEFAULT_IMAGE_URL}`;
    }
    const defaultPhoto = photos.find(photo => photo.isDefault);
    return defaultPhoto ? `${API_BASE_URL}${defaultPhoto.path}` : `${API_BASE_URL}${photos[0].path}`;
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleGetDetails = async (profile) => {
    console.log("🔍 Getting details for profile:", profile);
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setSnackbarMessage("Authentication error. Please log in again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsLoading(false);
        return;
      }

      console.log(`🔄 Sending request to share contact details for profile ${profile.profile_id}`);

      const response = await axios.post(
        `${API_BASE_URL}/api/share-contact-details`,
        {
          sharedProfileId: profile.profile_id,
          sharedProfileName: profile.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Contact details shared successfully:", response?.data);

      // Navigate to the screen-only view page
      navigate("/sharingcontactdetails", { state: { profile } });

    } catch (error) {
      console.error("❌ Error sharing contact details:", error);

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data || {};

        if (status === 403) {
          // ✅ Recharge wording + show limit/used if provided by backend
          const limit = data.limit;
          const used = data.used;

          let msg = data.message
            ? data.message
            : "You have reached the contact view limit. Please recharge to view more profiles.";

          const parts = [];
          if (used !== undefined) parts.push(`Used: ${used}`);
          if (limit !== undefined) parts.push(`Limit: ${limit}`);
          if (parts.length > 0) msg = `${msg} (${parts.join(", ")})`;

          setSnackbarMessage(msg);
        } else {
          setSnackbarMessage(
            `Server error (${status}): ${data.message || "Failed to get contact details"}`
          );
        }
      } else if (error.request) {
        setSnackbarMessage("No response received from server. Please check your connection and try again.");
      } else {
        setSnackbarMessage(`Error: ${error.message}`);
      }

      setSnackbarSeverity("error");
      setSnackbarOpen(true);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Contact Details ({results.length} {results.length === 1 ? "result" : "results"})
      </Typography>

      {/* ✅ Policy: NO Print / Email / Download actions */}

      <Box id="printable-contact-details">
        {results.map((profile) => (
          <Paper key={profile.profile_id} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid xs={12} sm={4} md={3} lg={2}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 150,
                    height: "auto",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={getDefaultPhotoUrl(profile.profile_id)}
                    alt={profile.name || "Profile Photo"}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      console.error(`❌ Error loading image for profile ${profile.profile_id}`);
                      e.target.src = `${API_BASE_URL}${BACKEND_DEFAULT_IMAGE_URL}`;
                    }}
                  />
                </Box>
              </Grid>

              <Grid xs={12} sm={8} md={5} lg={5}>
                <Typography variant="subtitle1"><strong>Profile ID:</strong> {profile.profile_id}</Typography>
                <Typography variant="subtitle1"><strong>Married Status:</strong> {profile.married_status}</Typography>
                <Typography variant="subtitle1"><strong>Name:</strong> {profile.name}</Typography>
                <Typography variant="subtitle1"><strong>Current Location:</strong> {profile.current_location}</Typography>
                <Typography variant="subtitle1"><strong>Mother Tongue:</strong> {profile.mother_tongue}</Typography>
                <Typography variant="subtitle1"><strong>Gotra:</strong> {profile.gotra}</Typography>
                <Typography variant="subtitle1"><strong>Age:</strong> {profile.current_age}</Typography>
                <Typography variant="subtitle1"><strong>Father Name:</strong> {profile.father_name}</Typography>
                <Typography variant="subtitle1"><strong>Siblings:</strong> {profile.siblings}</Typography>
              </Grid>

              <Grid xs={12} md={4} lg={5}>
                <Typography variant="subtitle1"><strong>Expectations:</strong> {profile.expectations}</Typography>
                <Typography variant="subtitle1"><strong>Phone Number:</strong> {profile.phone}</Typography>
                <Typography variant="subtitle1"><strong>Communication Address:</strong> {profile.communication_address}</Typography>
                <Typography variant="subtitle1"><strong>Education:</strong> {profile.education}</Typography>
                <Typography variant="subtitle1"><strong>Profession:</strong> {profile.profession}</Typography>
                <Typography variant="subtitle1"><strong>Designation:</strong> {profile.designation}</Typography>
                <Typography variant="subtitle1"><strong>Current Company:</strong> {profile.current_company}</Typography>
                <Typography variant="subtitle1"><strong>Annual Income:</strong> {profile.annual_income}</Typography>
              </Grid>

              <Grid xs={12} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleGetDetails(profile)}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Get Details"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactDetailsResults;
