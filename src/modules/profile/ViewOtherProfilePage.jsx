/* MERGED FILE GENERATED: Base = ViewOtherProfilePage copy 3.jsx + Contact Unlock logic */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import profileService from "../../services/profileService";

import Typography from "@mui/material/Typography";
import MemberLayout from "../../shared/layouts/MemberLayout";
import CollapsibleSection from "../../shared/components/CollapsibleSection";
import { designClasses } from "../../shared/styles/designTokens";

// Material-UI components for custom message and feedback
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import BasicProfile from "./components/sections/BasicProfile";
import AddressDetails from "./components/sections/AddressDetails";
import EducationJobDetails from "./components/sections/EducationJobDetails";
import FamilyDetails from "./components/sections/FamilyDetails";
import HoroscopeDetails from "./components/sections/HoroscopeDetails";
import ReferencesSection from "./components/sections/ReferencesSection";
import countryData from 'country-telephone-data';


const FALLBACK_DEFAULT_IMAGE_PATH =
  "/ProfilePhotos/defaultImage.jpg";

const ViewOtherProfilePage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [inviterMessage, setInviterMessage] = useState(''); // State for custom message
  const [isSendingInvitation, setIsSendingInvitation] = useState(false); // State for button loading
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar feedback
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Ã¢Å“â€¦ Contact details unlock (counted & limited in backend via /api/share-contact-details)
  const [contactData, setContactData] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);

  // Ã¢Å“â€¦ Carousel state (ONLY in ViewOtherProfilePage)
  const [photos, setPhotos] = useState([]); // normalized: [{ id, fullUrl, blobName }]
  const [activeIndex, setActiveIndex] = useState(0);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState('');
  const [, setBrokenUrls] = useState(() => new Set());

  const fallbackImageUrl =
  FALLBACK_DEFAULT_IMAGE_PATH;

  const mergedProfileData = useMemo(() => {
  if (!profileData) return null;

  const merged = contactData ? { ...profileData, ...contactData } : profileData;

    // ---------- ADDRESS SPLIT (align with MyProfilePage save order) ----------
  // MyProfilePage stores: house, street, area, city, state, country, pin
  const splitAddressSmart = (addressString = '', prefix = 'communication') => {
    if (!addressString || typeof addressString !== 'string') return {};

    const parts = addressString.split(',').map(p => p.trim()).filter(Boolean);

    // Default mapping (7-part): house, street, area, city, state, country, pin  Ã¢Å“â€¦ (matches MyProfilePage)
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


  const toggleSection = (sectionId) => {
  setActiveSection((current) =>
    current === sectionId ? null : sectionId
  );
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
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError("Profile ID is missing from the URL.");
        setLoading(false);
        return;
      }

setLoading(true);
setError(null);

try {
  const data =
    await profileService.getProfileById(profileId);

  if (!data) {
          setError("Profile not found.");
          setProfileData(null);
        } else {
          
          //setProfileData(response.data);
          const raw = data || {};

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
    communicationPIN: parts[6] || ''   // Ã¢Å“â€¦ uppercase PIN
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

setProfileData(normalized);
    }
      } catch (err) {
        console.error(
  "Unable to load profile:",
  err
);
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

  // Ã¢Å“â€¦ Load photos (restore copy behavior + robust URL handling)
// Ã¢Å“â€¦ Load photos (copy behavior, but FIXED for url_path + windows photo_path)
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

    // Ã¢Å“â€¦ Prefer url_path FIRST (your backend returns correct /profilePhotos/...)
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

    if (fullUrl && !/^https?:\/\//i.test(fullUrl)) {
  fullUrl =
    fullUrl.startsWith("/")
      ? fullUrl
      : `/${fullUrl}`;
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

    try {
  const list =
    await profileService.getProfilePhotos(pid);

  const normalized = list
    .map(normalizePhoto)
    .filter((photo) => photo?.fullUrl);

  if (cancelled) {
    return;
  }

  if (normalized.length > 0) {
    setPhotos(normalized);
    return;
  }

  const defaultPhoto =
    await profileService.getDefaultPhoto(pid);

  if (cancelled) {
    return;
  }

  const normalizedDefault =
    normalizePhoto(defaultPhoto);

  if (normalizedDefault?.fullUrl) {
    setPhotos([normalizedDefault]);
  } else {
    setPhotos([
      {
        id: null,
        fullUrl: fallbackImageUrl,
        blobName: "",
      },
    ]);

    setPhotosError(
      "Photos not available for this profile."
    );
  }
    } catch (err) {
      if (cancelled) return;
      console.error("Ã¢ÂÅ’ [ViewOtherProfilePage] Failed to load photos:", err);
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
}, [profileData]);

  const handleUnlockContactDetails = async () => {
    if (!profileData) return;

    setContactLoading(true);

    try {
      const payload = {
        sharedProfileId: profileData.profile_id || profileId,
        sharedProfileName: profileData.name || ''
      };

const data =
  await profileService.shareContactDetails(payload);

setContactData(data || {});
setActiveSection("contact");

      setSnackbarMessage('Contact details unlocked successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (err) {
      console.error("Ã¢ÂÅ’ [ViewOtherProfilePage] Error unlocking contact details:", err);

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
          type="button"
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={handleReturn}
        >
          Close and Return
        </button>
      </div>
    );
  }

  return (
    <MemberLayout>
      <div className="w-full space-y-6">

        {/* Profile Header */}
        <div
          className={`overflow-hidden rounded-2xl border ${designClasses.border} ${designClasses.surface}`}
        >
          <div className={`border-b p-5 sm:p-6 ${designClasses.border}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className={`text-2xl font-bold ${designClasses.textPrimary}`}
                >
                  View Profile
                </h1>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Review profile information and connect with this member.
                </p>
              </div>

              <div className="text-sm">
                <div className={designClasses.textSecondary}>
                  Profile ID
                </div>

                <div
                  className={`font-semibold ${designClasses.textPrimary}`}
                >
                  {profileData.profile_id || profileId || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2
                  className={`text-lg font-semibold ${designClasses.textPrimary}`}
                >
                  Photos
                </h2>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Profile photos shared by this member.
                </p>
              </div>

              {photosLoading && (
                <span className={`text-sm ${designClasses.textSecondary}`}>
                  Loading photos...
                </span>
              )}
            </div>

            {photosError ? (
              <div className="text-sm text-red-600">
                {photosError}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md">
                  <img
                    src={
                      photos[activeIndex]?.fullUrl ||
                      fallbackImageUrl
                    }
                    alt="Profile"
                    className="h-80 w-full rounded-xl border object-cover"
                    onError={() =>
                      setBrokenUrls((prev) =>
                        new Set(prev).add(activeIndex)
                      )
                    }
                  />
                </div>

                {photos.length > 1 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {photos.map((photo, index) => (
                      <button
                        key={photo.id || index}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-14 w-14 overflow-hidden rounded-lg border ${
                          index === activeIndex
                            ? "border-[#002B55]"
                            : "border-gray-300"
                        }`}
                        title={`Photo ${index + 1}`}
                      >
                        <img
                          src={photo.fullUrl || fallbackImageUrl}
                          alt={`Profile ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-4">
          <CollapsibleSection
            number={1}
            title="Personal Details"
            description="Basic profile and personal information."
            open={activeSection === "personal"}
            onToggle={() => toggleSection("personal")}
          >
            <BasicProfile profileData={profileData} />
          </CollapsibleSection>

          <CollapsibleSection
            number={2}
            title="Contact & Address"
            description="Contact and address information."
            open={activeSection === "contact"}
            onToggle={() => toggleSection("contact")}
          >
            {!contactData ? (
              <div className="space-y-4">
                <p className={`text-sm ${designClasses.textSecondary}`}>
                  Contact details are protected. Viewing them will count
                  toward your permitted contact views for the current cycle.
                </p>

                <Button
                  variant="contained"
                  onClick={handleUnlockContactDetails}
                  disabled={contactLoading}
                >
                  {contactLoading
                    ? "Loading..."
                    : "View Contact Details"}
                </Button>
              </div>
            ) : (
              <AddressDetails profileData={mergedProfileData} />
            )}
          </CollapsibleSection>

          <CollapsibleSection
            number={3}
            title="Education & Career"
            description="Education, profession and employment details."
            open={activeSection === "career"}
            onToggle={() => toggleSection("career")}
          >
            <EducationJobDetails profileData={profileData} />
          </CollapsibleSection>

          <CollapsibleSection
            number={4}
            title="Family Details"
            description="Family background and family information."
            open={activeSection === "family"}
            onToggle={() => toggleSection("family")}
          >
            <FamilyDetails profileData={profileData} />
          </CollapsibleSection>

          <CollapsibleSection
            number={5}
            title="Horoscope & Cultural Details"
            description="Gotra, Rashi, Nakshatra and related information."
            open={activeSection === "horoscope"}
            onToggle={() => toggleSection("horoscope")}
          >
            <HoroscopeDetails profileData={profileData} />
          </CollapsibleSection>

          <CollapsibleSection
            number={6}
            title="References"
            description="Reference contact information."
            open={activeSection === "references"}
            onToggle={() => toggleSection("references")}
          >
            <ReferencesSection profileData={profileData} />
          </CollapsibleSection>
        </div>

        {/* Connect */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 ${designClasses.border} ${designClasses.surface}`}
        >
          <h2
            className={`text-lg font-semibold ${designClasses.textPrimary}`}
          >
            Connect with this Profile
          </h2>

          <p
            className={`mb-4 mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Send a message along with your invitation.
          </p>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={inviterMessage}
            onChange={(e) => setInviterMessage(e.target.value)}
            placeholder="Type your message..."
            variant="outlined"
          />

          <div className="mt-4 flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-lg border border-[#002B55] bg-white px-6 py-2.5 font-semibold text-[#002B55] transition hover:bg-gray-50"
              onClick={handleReturn}
            >
              Back
            </button>

            <button
              type="button"
              className="rounded-lg bg-[#002B55] px-6 py-2.5 font-semibold text-white transition hover:bg-[#001f3d] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSendInvitation}
              disabled={isSendingInvitation}
            >
              {isSendingInvitation
                ? "Sending..."
                : "Send Invitation"}
            </button>
          </div>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </MemberLayout>
  );

};

export default ViewOtherProfilePage;
