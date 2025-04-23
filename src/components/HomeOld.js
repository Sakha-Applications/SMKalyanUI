import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Mock user data and authentication (replace with your actual auth system)
const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const mockAuth = {
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  login: (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          localStorage.setItem('isAuthenticated', 'true');
          resolve({ success: true, user: mockUser });
        } else {
          resolve({ success: false, message: 'Invalid credentials' });
        }
      }, 1000);
    });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
    }
  },
};

const MenuPage = ({ user, onLogout }: { user: typeof mockUser; onLogout: () => void }) => {
  return (
    <div className="flex flex-col md:flex-row h-full p-4 md:p-8 gap-8">
      {/* Left Column (Navigation) */}
      <div className="md:w-1/4 space-y-4">
        <div className="shadow-lg rounded-md bg-white p-4">
          <div className="text-lg font-semibold">
            Welcome, {user.name}!
          </div>
          <p className="text-gray-600">Manage your profile and find your partner.</p>
          <div className="space-y-2 mt-4">
            <Link to="/profile-register" className="block w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
              Modify Profile
            </Link>
            <Link to="/profile-search" className="block w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
              Search Matches
            </Link>
            <a href="#" className="block w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
              View Contact Details
            </a>
            <a href="#" className="block w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
              Renew Profile
            </a>
            <a href="#" className="block w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors">
              Donate for the Cause
            </a>
            <button
              className="w-full text-left px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors mt-4"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Right Column (About Us/Inspiration) */}
      <div className="md:w-3/4">
        <div className="shadow-lg rounded-md bg-white p-6">
          <h2 className="text-lg font-semibold mb-2">About Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Inspired by the unwavering devotion and selfless service of Lord Hanuman,
            this platform is dedicated to helping individuals connect and find their
            life partners within a community built on trust and shared values. Just
            as Hanuman tirelessly served Lord Rama, bridging distances and fostering
            meaningful relationships, our application strives to bridge hearts and
            create lasting unions.
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Our objective is rooted in the principle of selfless service, aiming to
            empower individuals in their journey to find companionship. We believe
            in the strength of community and the beauty of finding a partner who
            complements your life's purpose. Like Hanuman's strength and loyalty, we
            aim to provide a reliable and secure space for you to connect
            authentically.
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Through this platform, we encourage you to embark on your search with
            faith and sincerity, knowing that you are part of a community inspired
            by noble ideals. May your journey be filled with meaningful connections
            and lead you to a fulfilling partnership.
          </p>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(mockAuth.isAuthenticated());
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(mockAuth.isAuthenticated());
    if (mockAuth.isAuthenticated()) {
      setUser(mockUser);
      navigate('/menu');
    }
  }, [navigate]);

  const handleLogin = (loggedInUser: typeof mockUser) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    navigate('/menu');
  };

  const handleLogout = () => {
    mockAuth.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  if (isAuthenticated) {
    return <MenuPage user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f7f6",
    }}>
      {/* ✅ Elegant Box Container */}
      <div style={{
        width: "800px",
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
        textAlign: "center",
      }}>
        {/* ✅ Title */}
        <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>Profile Management System</h1>

        {/* ✅ Welcome Message */}
        <p style={{
          fontSize: "16px",
          color: "#555",
          lineHeight: "1.6",
          marginBottom: "30px",
        }}>
          Welcome to the Profile Management System! This platform allows you to
          efficiently manage user profiles through registration, searching, and photo
          uploads. Securely store and easily access the information you need.
        </p>

        {/* ✅ Navigation Box */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ecf0f1",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
        }}>
          {/* ✅ Register Profile */}
          <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
            <Link to="/profile-register" style={{
              textDecoration: "none",
              color: "#2980b9",
              fontWeight: "bold",
              fontSize: "18px",
            }}>Register Profile</Link>
            <p style={{ fontSize: "12px", color: "#777", marginTop: "5px" }}>
              Create a new profile and store details securely.
            </p>
          </div>

          {/* ✅ Vertical Divider */}
          <div style={{ width: "2px", height: "40px", backgroundColor: "#bbb" }}></div>

          {/* ✅ Search Profile */}
          <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
            <Link to="/profile-search" style={{
              textDecoration: "none",
              color: "#2980b9",
              fontWeight: "bold",
              fontSize: "18px",
            }}>Search Profiles</Link>
            <p style={{ fontSize: "12px", color: "#777", marginTop: "5px" }}>
              Find and manage existing profiles quickly.
            </p>
          </div>

          {/* ✅ Vertical Divider */}
          <div style={{ width: "2px", height: "40px", backgroundColor: "#bbb" }}></div>

          {/* ✅ Upload Photo */}
          <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
            <Link to="/upload-photo" style={{
              textDecoration: "none",
              color: "#2980b9",
              fontWeight: "bold",
              fontSize: "18px",
            }}>Upload Photo</Link>
            <p style={{ fontSize: "12px", color: "#777", marginTop: "5px" }}>
              Upload photos to existing profiles.
            </p>
          </div>

          {/* ✅ Vertical Divider */}
          <div style={{ width: "2px", height: "40px", backgroundColor: "#bbb" }}></div>

          {/* ✅ Login Link */}
          <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>
            <Link to="/login" style={{
              textDecoration: "none",
              color: "#2980b9",
              fontWeight: "bold",
              fontSize: "18px",
            }}>Login</Link>
            <p style={{ fontSize: "12px", color: "#777", marginTop: "5px" }}>Login to your account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
