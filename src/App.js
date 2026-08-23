import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LoginScreen from './components/LoginScreen';
import SinglePageRegistration from './modules/registration/SinglePageRegistration';
import ViewOtherProfilePage from "./modules/profile/ViewOtherProfilePage"; // Adjust path if different

import SearchPage from "./modules/search/SearchPage";
import MatchesPage from "./modules/matches/MatchesPage";
import ConnectionsPage from "./modules/connections/ConnectionsPage";
import ResetPasswordScreen from './components/ResetPasswordScreen';
import Dashboard from "./modules/dashboard/Dashboard";
import DiscoverResultsPage from "./modules/dashboard/DiscoverResultsPage";
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import PhotoManagementPage from "./modules/photoManagement/PhotoManagementPage";
import RechargeContactViewsPage from "./modules/payments/RechargeContactViewsPage";
import RegistrationFeePaymentPage from "./modules/payments/RegistrationFeePaymentPage";
import About from './components/About';
import AdvertiseProfilePage from "./modules/advertisements/AdvertiseProfilePage";
import AdvertisementPaymentPage from "./modules/payments/AdvertisementPaymentPage";
import PreferencesPage from "./modules/preferences/PreferencesPage";
import ProfilePage from "./modules/profile/ProfilePage";
import AdminDashboard from './components/admin/AdminDashboard';

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

const OperationalRoute = ({ children }) => {
  const isLoggedIn =
    sessionStorage.getItem("isLoggedIn") === "true";

  const role = (
    sessionStorage.getItem("userRole") || ""
  ).toUpperCase();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (
    !["ADMIN", "MODERATOR"].includes(role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
           
              <Route path="/" element={<Home />} />
<Route path="/login" element={<LoginScreen />} />
<Route
  path="/profile-register"
  element={<SinglePageRegistration />}
/>
<Route
  path="/new-register"
  element={
    <Navigate
      to="/profile-register"
      replace
    />
  }
/>
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
                            <SearchPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/upload-photo"
                    element={
                        <ProtectedRoute>
                            <PhotoManagementPage />
                        </ProtectedRoute>
                    }
                />
<Route
    path="/modify-profile"
    element={
        <ProtectedRoute>
            <Navigate to="/my-profile" replace />
        </ProtectedRoute>
    }
/>

<Route
  path="/discover/:type"
  element={
    <ProtectedRoute>
      <DiscoverResultsPage />
    </ProtectedRoute>
  }
/>

<Route
    path="/my-profile"
    element={
        <ProtectedRoute>
            <ProfilePage />
        </ProtectedRoute>
    }
/>
<Route
    path="/partner-preferences"
    element={
        <ProtectedRoute>
            <PreferencesPage />
        </ProtectedRoute>
    }
/>
                
                <Route
    path="/all-matches"
    element={
        <ProtectedRoute>
            <MatchesPage />
        </ProtectedRoute>
    }
/>
                <Route
                    path="/renew-profile"
                    element={
                        <ProtectedRoute>
                            <RechargeContactViewsPage />
                        </ProtectedRoute>
                    }
                />

                  {/* Protected Message Box route */}
                <Route
                    path="/inbox"
                    element={
                        <ProtectedRoute>
                            <ConnectionsPage />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/donate"
                    element={
                        <ProtectedRoute>
                            <RegistrationFeePaymentPage />
                        </ProtectedRoute>
                    }
                />
                                
                <Route
    path="/make-preferred"
    element={
        <ProtectedRoute>
            <AdvertiseProfilePage />
        </ProtectedRoute>
    }
/>
<Route
    path="/preferred-payment"
    element={
        <ProtectedRoute>
            <AdvertisementPaymentPage />
        </ProtectedRoute>
    }
/>      
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
      <Navigate
        to="/profile-search"
        replace
      />
    </ProtectedRoute>
  }
/>

<Route
  path="/advanced-search"
  element={
    <ProtectedRoute>
      <Navigate
        to="/profile-search"
        replace
      />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <OperationalRoute>
  <AdminDashboard />
</OperationalRoute>  }
/>


            
            </Routes>
        </Router>
    );
}

export default App;