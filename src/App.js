import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LoginScreen from './components/LoginScreen';
import ProfileRegisterForm from './components/ProfileRegisterForm';
import ProfileSearchForm from './components/ProfileSearchForm';
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
import MakePreferred from './components/prefferedProfile/MakePreferred';
import PreferredPayment from './components/prefferedProfile/PreferredPayment';

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
                <Route path="/" element={<PublicHome />} />
              <Route path="/home" element={<Home />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/profile-register" element={<ProfileRegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="/reset-password" element={<ResetPasswordScreen />} />
                <Route path="/about" element={<About />} />

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
                <Route
                    path="/renew-profile"
                    element={
                        <ProtectedRoute>
                            <RenewProfile />
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
            </Routes>
        </Router>
    );
}

export default App;