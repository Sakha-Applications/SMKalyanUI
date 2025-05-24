import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Replace window.confirm with a custom alert
    alert("Are you sure you want to logout?");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-3xl font-bold text-indigo-800">
            Kalyan Sakha Home
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Welcome, User</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Navigation Panel */}
            <div className="w-full md:w-1/4 bg-indigo-800 text-white">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 border-b border-indigo-600 pb-2">
                  Navigation
                </h2>
                <nav className="space-y-4">
                  <div className="dashboard-nav-item">
                    <Link to="/modify-profile" className="block py-3 px-4 hover:bg-indigo-700 rounded transition">
                      <span className="material-icons align-middle mr-2">edit</span>
                      Modify Profile
                    </Link>
                  </div>
                  
                  <div className="dashboard-nav-item">
                    <Link to="/contact-details" className="block py-3 px-4 hover:bg-indigo-700 rounded transition">
                      <span className="material-icons align-middle mr-2">contact_phone</span>
                      View Contact Details
                    </Link>
                  </div>
                  <div className="dashboard-nav-item">
                    <Link to="/renew-profile" className="block py-3 px-4 hover:bg-indigo-700 rounded transition">
                      <span className="material-icons align-middle mr-2">autorenew</span>
                      Renew Profile Activation
                    </Link>
                  </div>
                  <div className="dashboard-nav-item">
  <Link to="/make-preferred" className="block py-3 px-4 hover:bg-indigo-700 rounded transition">
    <span className="material-icons align-middle mr-2">stars</span>
    Make Profile Preferred
  </Link>
</div>
                  <div className="dashboard-nav-item">
                    <Link to="/donate" className="block py-3 px-4 hover:bg-indigo-700 rounded transition">
                      <span className="material-icons align-middle mr-2">favorite</span>
                      Donate for the Cause
                    </Link>
                  </div>
                  <div className="dashboard-nav-item">
                    <Link to="/upload-photo" className="block py-3 px-4 hover:bg-indigo-700 rounded transition">
                      <span className="material-icons align-middle mr-2">add_a_photo</span>
                      Upload Photo
                    </Link>
                  </div>
                </nav>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-3/4 p-8">
              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-orange-800 mb-4">Our Mission</h2>
                <div className="prose text-gray-700">
                  <p className="mb-3">
                    Inspired by the unwavering devotion and selfless service of Lord Hanuman, this platform is dedicated to helping individuals connect and find their life partners within a community built on trust and shared values. Just as Hanuman tirelessly served Lord Rama, bridging distances and fostering meaningful relationships, our application strives to bridge hearts and create lasting unions.
                  </p>
                  <p className="mb-3">
                    Our objective is rooted in the principle of selfless service, aiming to empower individuals in their journey to find companionship. We believe in the strength of community and the beauty of finding a partner who complements your life's purpose. Like Hanuman's strength and loyalty, we aim to provide a reliable and secure space for you to connect authentically.
                  </p>
                  <p>
                    Through this platform, we encourage you to embark on your search with faith and sincerity, knowing that you are part of a community inspired by noble ideals. May your journey be filled with meaningful connections and lead you to a fulfilling partnership.
                  </p>
                </div>
              </div>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    <span className="material-icons text-5xl">diversity_1</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">Active Profiles</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">5,280</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    <span className="material-icons text-5xl">favorite</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">Successful Matches</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">1,620</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    <span className="material-icons text-5xl">people</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">New Members</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">148</p>
                  <p className="text-sm text-gray-500">this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
