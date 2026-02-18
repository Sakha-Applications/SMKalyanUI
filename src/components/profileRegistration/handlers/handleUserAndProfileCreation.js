// src/components/profileRegistration/handlers/handleUserAndProfileCreation.js
import axios from 'axios';
import getBaseUrl from '../../../utils/GetUrl';

const generateRandomPassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const checkProfileExists = async (profileId) => {
  if (!profileId) return false;

  try {
    console.log("🔍 Step 0: Checking if profile already exists...");
    console.log("📤 Profile ID check payload:", profileId);

    const response = await axios.get(`${getBaseUrl()}/api/profile/${profileId}`);

    const exists = !!response?.data?.profileId;
    console.log(`✅ Profile ${profileId} ${exists ? "exists" : "not found"}`);
    
    return exists;
  } catch (error) {
    console.error("❌ Error checking if profile exists:", error);
    return false;
  }
};


const handleUserAndProfileCreation = async ({
  formData,
  setFormData,
  setProfileAlreadyCreated,
  setUserAlreadyCreated,
  setUserCreationData,
  setShowUserCreatedDialog,
  setProfileCreationData,
  setIsProcessing,
  navigate,
  setErrorMessage // Add this to show error messages to user
}) => {
  setIsProcessing(true);

  try {
    // Step 0: Check if profile already exists
    const profileExists = await checkProfileExists(formData.profileId);

if (profileExists) {
  console.log("⚠️ Profile already exists:", formData.profileId);
  setIsProcessing(false);
  return false;
}
    // Step 1: Create new profile
    
    
    console.log("➡️ Step 1: Creating new profile...");
    console.log("📤 Profile creation payload:", JSON.stringify({ profileData: formData }, null, 2));
//changed on 16-FEB-2024 by to add status as SUBMITTED on profile creation
  //  const profileResponse = await axios.post(`${getBaseUrl()}/api/addProfile`, {
    //  profileData: formData
   // });

   // ✅ Ensure new profile starts in DRAFT
const createProfilePayload = {
  ...formData,
  profileStatus: (formData.profileStatus && formData.profileStatus.trim()) ? formData.profileStatus : 'DRAFT'
};

const profileResponse = await axios.post(`${getBaseUrl()}/api/addProfile`, {
  profileData: createProfilePayload
});

    console.log("✅ Profile creation response:", profileResponse.data);

    if (!profileResponse.data?.profileId) {
      throw new Error('Profile creation failed. No profileId returned.');
    }

    const profileId = profileResponse.data.profileId;
    const userId = formData.email;
    const password = generateRandomPassword();

    setFormData(prev => ({
      ...prev,
      profileId,
      password,
      userId
    }));

    setProfileAlreadyCreated(true);

    console.log("➡️ Step 2: Creating user login...");

    const loginPayload = {
      profileId,
      user_id: userId,
      password,
      role: 'USER',
      is_active: 'Yes',
      notes: ''
    };

    console.log("📤 Sending login payload:", loginPayload);

    const loginResponse = await axios.post(`${getBaseUrl()}/api/userlogin`, loginPayload);
    console.log("✅ User login created:", loginResponse.data);

    setUserAlreadyCreated(true);

    console.log("📧 Step 3: Sending confirmation email...");
    console.log("📧 Step 3: Sending confirmation email...");
const emailPayload = { email: userId, profileId };

// ✅ attach token if present (route is now protected in backend)
const token = sessionStorage.getItem("token");
const headers = token ? { Authorization: `Bearer ${token}` } : {};

try {
  const emailResponse = await axios.post(
    `${getBaseUrl()}/api/send-email`,
    emailPayload,
    { headers }
  );
  console.log("✅ Email sent response:", emailResponse.data);
} catch (emailErr) {
  // ✅ DO NOT block registration if email fails
  console.warn(
    "⚠️ Email send failed (non-blocking).",
    emailErr?.response?.status,
    emailErr?.response?.data || emailErr?.message
  );
}


    // Store for later auto-login
    setProfileCreationData({
      profileId,
      userId,
      password
    });

    // Store full user creation data for dialog display
    setUserCreationData({
      profileId,
      userId,
      password,
      email: formData.email,
      phone: formData.phoneNumber,
      name: formData.name
    });

    // Show user confirmation dialog
    setShowUserCreatedDialog(true);

    setIsProcessing(false);
    return true;

  } catch (error) {
    console.error("❌ Error during user/profile creation:", error?.response?.data || error.message);
    
    // Set user-friendly error message
    if (setErrorMessage) {
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.message.includes('Profile already exists')) {
        setErrorMessage('A profile with this email or phone number already exists. Please check your details or try logging in.');
      } else {
        setErrorMessage('An error occurred during registration. Please try again.');
      }
    }
    
    setIsProcessing(false);
    return false;
  }
};

export default handleUserAndProfileCreation;