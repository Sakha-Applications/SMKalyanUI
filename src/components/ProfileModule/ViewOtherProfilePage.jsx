/* MERGED FILE GENERATED: Base = ViewOtherProfilePage copy 3.jsx + Contact Unlock logic */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../../utils/GetUrl';

// Material-UI Accordion imports
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
import countryData from 'country-telephone-data';


// ⬇️ reuse same pattern as SearchResults (base for images)
const API_BASE_URL = `${getBaseUrl()}`;
const FALLBACK_DEFAULT_IMAGE_PATH = '/profilePhotos/defaultImage.jpg';

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

  // ✅ Contact details unlock (counted & limited in backend via /api/share-contact-details)
  const [contactData, setContactData] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);

  // ✅ Carousel state (ONLY in ViewOtherProfilePage)
  const [photos, setPhotos] = useState([]); // normalized: [{ id, fullUrl, blobName }]
  const [activeIndex, setActiveIndex] = useState(0);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState('');
  const [brokenUrls, setBrokenUrls] = useState(() => new Set());

  const fallbackImageUrl = useMemo(() => `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`, []);

  const mergedProfileData = useMemo(() => {
  if (!profileData) return null;

  const merged = contactData ? { ...profileData, ...contactData } : profileData;

    // ---------- ADDRESS SPLIT (align with MyProfilePage save order) ----------
  // MyProfilePage stores: house, street, area, city, state, country, pin
  const splitAddressSmart = (addressString = '', prefix = 'communication') => {
    if (!addressString || typeof addressString !== 'string') return {};

    const parts = addressString.split(',').map(p => p.trim()).filter(Boolean);

    // Default mapping (7-part): house, street, area, city, state, country, pin  ✅ (matches MyProfilePage)
    let house = parts[0] || '';
    let street = parts[1] || '';
    let area = parts[2] || '';
    let city = parts[3] || '';
    let state = parts[4] || '';
    let country = parts[5] || '';
    let pin = parts[6] || '';

    // Handle 5-part format: house, street, area, city, pin
    // Example: "405, road10, hoskerihalli, Bengaluru, 560098"
    if (parts.length === 5) {
      const last = parts[4] || '';
      const fourth = parts[3] || '';
      const isLastNumeric = /^\d{4,10}$/.test(last);
      if (isLastNumeric) {
        house = parts[0] || '';
        street = parts[1] || '';
        area = parts[2] || '';
        city = fourth || '';
        pin = last || '';
        state = '';
        country = '';
      }
    }

    return {
      [`${prefix}HouseNo`]: house,
      [`${prefix}Street`]: street,
      [`${prefix}Area`]: area,
      // IMPORTANT: AddressDetails.jsx expects PIN uppercase
      [`${prefix}PIN`]: pin,
      [`${prefix}City`]: city,
      [`${prefix}State`]: state,
      [`${prefix}Country`]: country
    };
  };

  const commAddr = merged.communication_address || merged.communicationAddress || '';
  const resAddr  = merged.residence_address || merged.residenceAddress || '';

  const withAddress = {
    ...merged,

    // Keep full strings for fallback rows
    communicationAddress: merged.communicationAddress || merged.communication_address || '',
    residenceAddress: merged.residenceAddress || merged.residence_address || '',

    // Split fields for AddressDetails view-mode
    ...splitAddressSmart(commAddr, 'communication'),
    ...splitAddressSmart(resAddr, 'residence')
  };

  // ---------- PHONE SPLITTING ----------
    // ---------- PHONE SPLITTING (align with MyProfilePage) ----------
  const parsePhoneNumberForInput = (fullNumberString) => {
    if (!fullNumberString || typeof fullNumberString !== 'string') {
      return { code: '', number: '' };
    }

    // Normalize common separators (spaces, hyphens, brackets)
    let s = fullNumberString.trim().replace(/[\s\-()]/g, '');

    let bestMatchCode = '';
    let bestMatchNumber = s;

    const sortedCountryCodes = countryData.allCountries
      .map(c => `+${c.dialCode}`)
      .sort((a, b) => b.length - a.length); // longest first

    for (const dialCode of sortedCountryCodes) {
      // Stored like +9198...
      if (s.startsWith(dialCode)) {
        bestMatchCode = dialCode;
        bestMatchNumber = s.substring(dialCode.length);
        break;
      }
      // Stored like 9198... (without +)
      if (dialCode.startsWith('+') && s.startsWith(dialCode.substring(1))) {
        bestMatchCode = dialCode;
        bestMatchNumber = s.substring(dialCode.length - 1);
        break;
      }
    }

    // Fallback
    if (!bestMatchCode) {
      bestMatchCode = '+91';
      bestMatchNumber = s.replace(/^\+/, '');
    }

    return { code: bestMatchCode, number: (bestMatchNumber || '').trim() };
  };

  const mainPhone = parsePhoneNumberForInput(withAddress.phone || withAddress.phoneNumber);
  const altPhone = parsePhoneNumberForInput(
    withAddress.alternate_phone || withAddress.alternatePhone || withAddress.alternatePhoneNumber
  );
  const guardianPhone = parsePhoneNumberForInput(
    withAddress.guardian_phone || withAddress.guardianPhone || withAddress.guardianPhoneNumber
  );

  return {
    ...withAddress,
    phoneCountryCode: withAddress.phoneCountryCode || mainPhone.code || '',
    phoneNumber: withAddress.phoneNumber || mainPhone.number || '',

    alternatePhoneCountryCode: withAddress.alternatePhoneCountryCode || altPhone.code || '',
    alternatePhoneNumber: withAddress.alternatePhoneNumber || altPhone.number || '',

    guardianPhoneCountryCode: withAddress.guardianPhoneCountryCode || guardianPhone.code || '',
    guardianPhoneNumber: withAddress.guardianPhoneNumber || guardianPhone.number || ''
  };

}, [profileData, contactData]);


  // Handler for accordion expansion change
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // added on 31-Dec-25 for handling
  const location = useLocation();

  const handleReturn = () => {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo"); // e.g. "/dashboard" or "/basic-search"

    // If opened in a new tab via window.open, close works (browser allows)
    if (window.opener && !window.opener.closed) {
      window.close();
      return;
    }

    // If caller provided a return path, use it
    if (returnTo) {
      navigate(returnTo);
      return;
    }

    // Otherwise try browser back
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    // Fallback
    navigate("/dashboard");
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('sid');
    console.log("[Debug] Token found in URL:", urlToken ? "YES (starts with " + urlToken.substring(0, 10) + "...)" : "NO");

    if (urlToken) {
      sessionStorage.setItem('token', urlToken);
      const newUrl = window.location.pathname + window.location.search.replace(/([?&])sid=[^&]+(&|$)/, '$1').replace(/[?&]$/, '');
      window.history.replaceState({}, document.title, newUrl);
      console.log("[Debug] Token stored and URL cleaned:", newUrl);
    } else {
      console.warn("[Debug] No 'sid' found in URL. Checking existing session...");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError("Profile ID is missing from the URL.");
        setLoading(false);
        return;
      }

      const token = sessionStorage.getItem('token');

      console.log("[Debug] fetchProfile starting. Token in storage:", token ? "FOUND" : "MISSING");
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

        if (!response.data) {
          setError("Profile not found.");
          setProfileData(null);
        } else {
          
          //setProfileData(response.data);
          const raw = response.data || {};

// ===============================
// ADDRESS SPLITTING LOGIC
// ===============================
const splitAddress = (addressString = '') => {
  if (!addressString || typeof addressString !== 'string') {
    return {};
  }

  const parts = addressString.split(',').map(p => p.trim());

   return {
    communicationHouseNo: parts[0] || '',
    communicationStreet: parts[1] || '',
    communicationArea: parts[2] || '',
    communicationCity: parts[3] || '',
    communicationState: parts[4] || '',
    communicationCountry: parts[5] || '',
    communicationPIN: parts[6] || ''   // ✅ uppercase PIN
  };

};

// ===============================
// PHONE SPLITTING LOGIC
// ===============================
const splitPhone = (value) => {
  if (!value) return { code: '', number: '' };

  const s = String(value).trim();
  const m = s.match(/^(\+\d{1,4})(\d{6,})$/);

  if (m) return { code: m[1], number: m[2] };

  return { code: '', number: s };
};

const mainPhone = splitPhone(raw.phone);
const altPhone = splitPhone(raw.alternate_phone);
const guardianPhone = splitPhone(raw.guardian_phone);

const normalized = {
  ...raw,

  // ===============================
  // ADDRESS
  // ===============================
  communicationAddress: raw.communication_address,
  ...splitAddress(raw.communication_address),

  residenceAddress: raw.residence_address,

  // ===============================
  // PHONE
  // ===============================
  phoneCountryCode: mainPhone.code,
  phoneNumber: mainPhone.number,

  alternatePhoneCountryCode: altPhone.code,
  alternatePhoneNumber: altPhone.number,

  guardianPhoneCountryCode: guardianPhone.code,
  guardianPhoneNumber: guardianPhone.number
};

console.log("✅ Normalized Other Profile Data:", normalized);

setProfileData(normalized);

          console.log("✅ Fetched other profile data:", response.data);
        }
      } catch (err) {
        console.error("❌ Error fetching other profile:", err);
        setError(err.message || "Failed to load profile.");
        if (err.response?.status === 401) {
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

  // ✅ Load photos (restore copy behavior + robust URL handling)
// ✅ Load photos (copy behavior, but FIXED for url_path + windows photo_path)
useEffect(() => {
  if (!profileData) return;

  const pid = profileData.profile_id || profileData.profileId;
  if (!pid) {
    console.warn("[ViewOtherProfilePage] profileData missing profile_id/profileId. Using fallback photo.");
    setPhotos([{ id: null, fullUrl: fallbackImageUrl, blobName: "" }]);
    setActiveIndex(0);
    setPhotosError("");
    return;
  }

  let cancelled = false;

  const normalizePhoto = (p) => {
    if (!p) return null;

    const idVal = p.id ?? p.photo_id ?? p.photoId ?? null;

    // ✅ Prefer url_path FIRST (your backend returns correct /profilePhotos/...)
    // Avoid using photo_path if it's a Windows disk path
    let fullUrl =
      p.url_path ??
      p.fullUrl ??
      p.urlPath ??
      "";

    const filename = p.filename ?? p.blob_name ?? p.blobName ?? "";

    // If url_path missing but filename exists, fallback to /profilePhotos/<filename>
    if (!fullUrl && filename) {
      fullUrl = `/profilePhotos/${filename}`;
    }

    // If somehow fullUrl is a Windows path, ignore it and use filename fallback
    if (fullUrl && /^[a-zA-Z]:\\/.test(fullUrl)) {
      fullUrl = filename ? `/profilePhotos/${filename}` : "";
    }

    // Prefix relative URL with API_BASE_URL (which is just getBaseUrl(), no /api)
    if (fullUrl && !/^https?:\/\//i.test(fullUrl)) {
      const clean = fullUrl.startsWith("/") ? fullUrl : `/${fullUrl}`;
      fullUrl = `${API_BASE_URL}${clean}`;
    }

    return {
      id: idVal ?? filename ?? Math.random(),
      blobName: filename,
      fullUrl: fullUrl || fallbackImageUrl,
    };
  };

  const loadCarousel = async () => {
    console.log(`[ViewOtherProfilePage] Loading carousel photos for profileId: ${pid}`);
    setPhotosLoading(true);
    setPhotosError("");
    setBrokenUrls(new Set());
    setActiveIndex(0);
    setPhotos([]);

    const token = sessionStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    try {
      const photosRes = await axios.get(`${API_BASE_URL}/api/get-photos`, {
        headers,
        params: { profileId: pid },
      });

      const list = Array.isArray(photosRes.data) ? photosRes.data : [];
      const normalized = list.map(normalizePhoto).filter((x) => x && x.fullUrl);

      if (cancelled) return;

      if (normalized.length > 0) {
        setPhotos(normalized);
        return;
      }

      // If empty → try default photo endpoint
      try {
        const defRes = await axios.get(`${API_BASE_URL}/api/get-default-photo`, {
          headers,
          params: { profileId: pid },
        });

        if (cancelled) return;

        const defNorm = normalizePhoto(defRes.data);
        if (defNorm?.fullUrl) {
          setPhotos([defNorm]);
        } else {
          setPhotos([{ id: null, fullUrl: fallbackImageUrl, blobName: "" }]);
          setPhotosError("Photos not available for this profile.");
        }
      } catch (defErr) {
        if (cancelled) return;

        if (defErr?.response?.status === 404) {
          setPhotos([{ id: null, fullUrl: fallbackImageUrl, blobName: "" }]);
          setPhotosError("Photos not available for this profile.");
        } else {
          console.warn("[ViewOtherProfilePage] get-default-photo failed:", defErr?.message);
          setPhotos([{ id: null, fullUrl: fallbackImageUrl, blobName: "" }]);
          setPhotosError("Failed to load photos.");
        }
      }
    } catch (err) {
      if (cancelled) return;
      console.error("❌ [ViewOtherProfilePage] Failed to load photos:", err);
      setPhotos([{ id: null, fullUrl: fallbackImageUrl, blobName: "" }]);
      setPhotosError("Failed to load photos.");
    } finally {
      if (!cancelled) setPhotosLoading(false);
    }
  };

  loadCarousel();

  return () => {
    cancelled = true;
  };
}, [profileData, API_BASE_URL, fallbackImageUrl]);



  const handleUnlockContactDetails = async () => {
    if (!profileData) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
      setSnackbarMessage('Authentication error. Please log in again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      navigate('/login');
      return;
    }

    setContactLoading(true);

    try {
      const payload = {
        sharedProfileId: profileData.profile_id || profileId,
        sharedProfileName: profileData.name || ''
      };

      console.log("🔓 [ViewOtherProfilePage] Unlocking contact details via share-contact-details:", payload);

      const resp = await axios.post(
        `${getBaseUrl()}/api/share-contact-details`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ [ViewOtherProfilePage] Contact details unlocked:", resp?.data);

      setContactData(resp?.data || {});
      setExpanded('panel2');

      setSnackbarMessage('Contact details unlocked successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (err) {
      console.error("❌ [ViewOtherProfilePage] Error unlocking contact details:", err);

      if (err.response?.status === 403) {
        const data = err.response.data || {};
        const limit = data.limit;
        const used = data.used;

        let msg = data.message
          ? data.message
          : 'You have reached the contact view limit. Please recharge to view more profiles.';

        const parts = [];
        if (used !== undefined) parts.push(`Used: ${used}`);
        if (limit !== undefined) parts.push(`Limit: ${limit}`);
        if (parts.length > 0) msg = `${msg} (${parts.join(', ')})`;

        setSnackbarMessage(msg);
      } else if (err.response?.status === 401) {
        setSnackbarMessage('Authentication required. Please log in again.');
        navigate('/login');
      } else {
        setSnackbarMessage(err.response?.data?.message || err.message || 'Failed to unlock contact details.');
      }

      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setContactLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    setIsSendingInvitation(true);
    try {
      setSnackbarMessage("Invitation flow unchanged (not modified here).");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } finally {
      setIsSendingInvitation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h6">Loading profile...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Typography variant="h6" color="error">{error}</Typography>
        <button
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={handleReturn}
        >
          Close and Return
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Typography variant="h6">Profile not found.</Typography>
        <button
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={handleReturn}
        >
          Close and Return
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <Typography variant="h4" className="text-white font-bold">
              View Profile
            </Typography>
            <Typography variant="subtitle1" className="text-indigo-100 mt-1">
              Profile ID: {profileData.profile_id || profileId}
            </Typography>
          </div>

          <div className="p-8 space-y-6">

            {/* ✅ Keep your Photos UI (from copy) */}
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" className="text-indigo-800">Photos</Typography>
                {photosLoading && (
                  <span className="text-sm text-gray-600">Loading photos...</span>
                )}
              </div>

              {photosError ? (
                <div className="text-sm text-red-600">{photosError}</div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md">
                    <img
                      src={(photos[activeIndex] && photos[activeIndex].fullUrl) ? photos[activeIndex].fullUrl : fallbackImageUrl}
                      alt="Profile"
                      className="w-full h-80 object-cover rounded-lg border"
                      onError={() => setBrokenUrls(prev => new Set(prev).add(activeIndex))}
                    />
                  </div>

                  {Array.isArray(photos) && photos.length > 1 && (
                    <div className="flex gap-2 mt-3 flex-wrap justify-center">
                      {photos.map((p, idx) => (
                        <button
                          key={p.id || idx}
                          onClick={() => setActiveIndex(idx)}
                          className={`border rounded overflow-hidden ${idx === activeIndex ? 'border-indigo-600' : 'border-gray-300'}`}
                          style={{ width: 56, height: 56 }}
                          title={`Photo ${idx + 1}`}
                        >
                          <img
                            src={p.fullUrl || fallbackImageUrl}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Basic Details (from copy structure) */}
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="h6">Basic Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <BasicProfile profileData={profileData} />
              </AccordionDetails>
            </Accordion>

            {/* ✅ Contact & Address Details (Unlocked via share-contact-details; counted & limited) */}
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                <Typography variant="h6">Contact & Address Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {!contactData ? (
                  <div className="flex flex-col gap-3">
                    <Typography variant="body2" color="text.secondary">
                      To view contact details, click below. This will count toward your allowed contact views (X) for the current cycle.
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUnlockContactDetails}
                      disabled={contactLoading}
                    >
                      {contactLoading ? 'Loading...' : 'View Contact Details'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <AddressDetails profileData={mergedProfileData} />
                    <ContactDetails profileData={mergedProfileData} />
                  </>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
                <Typography variant="h6">Education & Job Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <EducationJobDetails profileData={profileData} />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
                <Typography variant="h6">Family Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FamilyDetails profileData={profileData} />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5a-content" id="panel5a-header">
                <Typography variant="h6">Horoscope Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <HoroscopeDetails profileData={profileData} />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6a-content" id="panel6a-header">
                <Typography variant="h6">References</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ReferencesSection profileData={profileData} />
              </AccordionDetails>
            </Accordion>

            {/* Connect to Review Profile section (preserved intent) */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <Typography variant="h6" className="text-gray-800 mb-4">
                Connect to Review Profile
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                value={inviterMessage}
                onChange={(e) => setInviterMessage(e.target.value)}
                placeholder="Type your message..."
                variant="outlined"
                className="bg-white"
              />

              <div className="flex justify-end mt-4">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSendInvitation}
                  disabled={isSendingInvitation}
                >
                  {isSendingInvitation ? "Sending..." : "Send Invitation"}
                </Button>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleReturn}
              >
                Close and Return
              </button>
            </div>
          </div>
        </div>
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewOtherProfilePage;
