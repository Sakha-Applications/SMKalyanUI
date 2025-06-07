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

const handleUserAndProfileCreation = async ({
  formData,
  setFormData,
  setProfileAlreadyCreated,
  setUserAlreadyCreated,
  setUserCreationData,
  setShowUserCreatedDialog,
  setProfileCreationData,
  setIsProcessing,
  navigate
}) => {
  setIsProcessing(true);

  try {
    console.log("➡️ Step 1: Creating new profile...");
    const profileResponse = await axios.post(`${getBaseUrl()}/api/addProfile`, {
      profileData: formData
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
    const emailPayload = {
      email: userId,
      profileId
    };

    const emailResponse = await axios.post(`${getBaseUrl()}/api/send-email`, emailPayload);
    console.log("✅ Email sent response:", emailResponse.data);

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
    setIsProcessing(false);
    return false;
  }
};

export default handleUserAndProfileCreation;
