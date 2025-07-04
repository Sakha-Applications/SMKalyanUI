import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LoginScreen from './components/LoginScreen';
// import ProfileRegisterForm from './components/ProfileRegisterForm';
import ProfileRegisterForm from './components/profileRegistration/ProfileRegisterForm';
import ProfileSearchForm from './components/ProfileSearchForm';
import ViewOtherProfilePage from './components/ProfileModule/ViewOtherProfilePage'; // Adjust path if different

import BasicSearchForm from './components/Search/BasicSearchForm'; 
import AllMatchesPage from './components/dashboardFiles/AllMatchesPage';
import InboxPage from './components/dashboardFiles/InboxPage';
import AdvancedSearchForm from './components/Search/AdvancedSearchForm';

import ResetPasswordScreen from './components/ResetPasswordScreen';
import Dashboard from './components/Dashboard';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import UploadPhoto from './components/UploadProfilePhoto/ProfilePhotoUploadForm';
import ModifyProfile from './components/ModifyProfile';
import RenewProfile from './components/RenewProfile';
import Donate from './components/Donate';
import About from './components/About';
import ContactDetails from './components/ViewContactDetails/ViewContactDetailsForm';
import SharingContactDetails from './components/ViewContactDetails/SharingContactDetails';
import PublicHome from './components/PublicHome'; // Import the new component
import MakePreferred from './components/preferredProfile/MakePreferred';
import PreferredPayment from './components/preferredProfile/PreferredPayment';
import PartnerPreferencesPage from "./components/ModifyProfile/PartnerPreferencesPage";
import MyProfilePage from "./components/ModifyProfile/MyProfilePage";

// Protected route component
const ProtectedRoute = ({ children }) => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        // Redirect to login if not logged in
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
           {/*     <Route path="/" element={<PublicHome />} />*/}
              <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/profile-register" element={<ProfileRegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="/reset-password" element={<ResetPasswordScreen />} />
                <Route path="/about" element={<About />} />
<Route path="/partner-preferences" element={<PartnerPreferencesPage />} />
<Route path="/my-profile" element={<MyProfilePage />} />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile-search"
                    element={
                        <ProtectedRoute>
                            <ProfileSearchForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/upload-photo"
                    element={
                        <ProtectedRoute>
                            <UploadPhoto />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/modify-profile"
                    element={
                        <ProtectedRoute>
                            <ModifyProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contact-details"
                    element={
                        <ProtectedRoute>
                            <ContactDetails />
                        </ProtectedRoute>
                    }
                />
                <Route path="/all-matches" element={<AllMatchesPage />} />
                <Route
                    path="/renew-profile"
                    element={
                        <ProtectedRoute>
                            <RenewProfile />
                        </ProtectedRoute>
                    }
                />

                  {/* NEW: Protected Route for Inbox Page */}
                <Route
                    path="/inbox" // This is the route path for the Inbox tab
                    element={
                        <ProtectedRoute>
                            <InboxPage />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/donate"
                    element={
                        <ProtectedRoute>
                            <Donate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sharingcontactdetails" // Add this route
                    element={
                        <ProtectedRoute>
                            <SharingContactDetails />
                        </ProtectedRoute>
                    }
                />
                
                <Route path="/make-preferred" element={<MakePreferred />} />
<Route path="/preferred-payment" element={<PreferredPayment />} />
<Route
                    path="/view-profile/:profileId" // Define the dynamic route parameter
                    element={
                        <ProtectedRoute>
                            <ViewOtherProfilePage />
                        </ProtectedRoute>
                    }
                />
            <Route
                    path="/basic-search"
                    element={
                        <ProtectedRoute>
                            <BasicSearchForm />
                        </ProtectedRoute>
                    }
                />

<Route
    path="/advanced-search"
    element={
        <ProtectedRoute>
            <AdvancedSearchForm />
        </ProtectedRoute>
    }
/>


            
            </Routes>
        </Router>
    );
}

export default App;