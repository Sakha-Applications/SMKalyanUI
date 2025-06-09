// src/components/profileRegistration/handlers/handleIntermediateProfileUpdate.js

import axios from 'axios';
import getBaseUrl from '../../../utils/GetUrl';

const handleIntermediateProfileUpdate = async ({ formData, setIsProcessing }) => {
  setIsProcessing(true);

  try {
    console.log("🔁 Intermediate update triggered.");

    if (!formData.profileId) {
      console.warn("⚠️ Cannot update: Missing profileId");
      return false;
    }

    const updatePayload = { profileData: formData };

    console.log("📤 Intermediate payload:", JSON.stringify(updatePayload, null, 2));

    // ✅ Use PUT and pass profileId in the URL (required by backend)
    const response = await axios.put(
      `${getBaseUrl()}/api/direct/updateProfile/${formData.profileId}`,
      updatePayload
    );

    console.log("✅ Intermediate update response:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Error during intermediate update:", error);
    return false;
  } finally {
    setIsProcessing(false);
  }
};

export default handleIntermediateProfileUpdate;
