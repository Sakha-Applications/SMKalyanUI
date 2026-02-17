// src/components/profileRegistration/handlers/handleFinalSubmit.js
import axios from 'axios';
import getBaseUrl from '../../../utils/GetUrl';

const STATUS_ORDER = ['DRAFT', 'SUBMITTED', 'PAYMENT_SUBMITTED', 'APPROVED'];
const normalizeStatus = (s) => (typeof s === 'string' ? s.trim().toUpperCase() : '');
const maxStatus = (current, desired) => {
  const c = normalizeStatus(current);
  const d = normalizeStatus(desired);
  const ci = STATUS_ORDER.indexOf(c);
  const di = STATUS_ORDER.indexOf(d);
  if (di === -1) return c || '';
  if (ci === -1) return d;
  return STATUS_ORDER[Math.max(ci, di)];
};

const formatDOBForBackend = (dob) => {
  if (!dob) return null;
  if (dob instanceof Date) {
    const year = dob.getFullYear();
    const month = String(dob.getMonth() + 1).padStart(2, '0');
    const day = String(dob.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else if (typeof dob === 'string' && dob.includes('T')) {
    return dob.split('T')[0];
  }
  return dob;
};

const calculateAge = (dob) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`;
};

const handleFinalSubmit = async ({ formData, setIsProcessing, setShowDonationDialog }) => {
  setIsProcessing(true);

  try {
    console.log("🚀 Final profile submission started...");

    const formattedDOB = formatDOBForBackend(formData.dob);
    const finalAge = calculateAge(formattedDOB);

    // ✅ Ensure status becomes at least SUBMITTED on final submit, but never downgrades
    const nextStatus = maxStatus(formData.profileStatus, 'SUBMITTED');

    const payload = {
      ...formData,
      dob: formattedDOB,
      currentAge: finalAge,
      profileStatus: nextStatus
    };

    console.log("📤 Final payload to backend:", JSON.stringify(payload, null, 2));

    if (!formData.profileId) {
      alert("❌ Missing profile ID. Cannot complete submission.");
      return;
    }

    const response = await axios.put(
      `${getBaseUrl()}/api/direct/updateProfile/${formData.profileId}`,
      { profileData: payload }
    );

    if (response.status === 200) {
      console.log("✅ Final profile update successful:", response.data);

      sessionStorage.setItem("tempProfileData", JSON.stringify({
        profileId: formData.profileId,
        email: formData.email,
        phone: formData.phoneNumber,
        name: formData.name
      }));

      setShowDonationDialog(true);
    } else {
      throw new Error("⚠️ Final update response not OK.");
    }

  } catch (error) {
    console.error("❌ Final submission error:", error.response?.data || error.message);
    alert("An error occurred while submitting your profile.");
  } finally {
    setIsProcessing(false);
  }
};

export default handleFinalSubmit;
