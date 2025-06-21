import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaCamera, FaArrowRight } from 'react-icons/fa';
import PreferredProfilesSection from './preferredProfile/PreferredProfilesSection';

// Import the image
import backgroundImage from '../assets/Image/kalayan_bg_img.png'; // Adjust the path as needed

export default function Home() {
  // For demo purposes - in a real app, this would come from auth context or props
  const userProfileId = null; // Set to null for guests, or get from sessionStorage if logged in

  return (
    <div className="bg-gray-50 font-sans antialiased min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/home" className="text-xl font-bold text-indigo-700">
            Sarvamool - Kalyan Sakha Home Page
          </Link>
          <div className="space-x-4">
            <Link to="/home" className="text-gray-700 hover:text-indigo-500">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-500">About</Link>
            <Link
              to="/login"
              className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Section with Preferred Profiles */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Preferred Profiles Section */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <PreferredProfilesSection 
              showTicker={true}
              showCards={true}
              tickerLimit={6}
              cardsLimit={4}
              userProfileId={userProfileId}
            />
          </div>

          {/* Right Side - Main Content */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            {/* Hero Section */}
            <section
              className="py-16 relative bg-indigo-50 rounded-lg shadow-lg mb-8"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '350px',
              }}
            >
              {/* Optional: Add an overlay */}
              <div className="absolute inset-0 bg-indigo-50 opacity-20 rounded-lg"></div>
              
              {/* Main text container */}
              <div className="px-6 relative z-10">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-indigo-900 mb-6 leading-tight">
                  Welcome to Kalyan Sakha <br />
                  Connect with Your Perfect Match
                </h1>
                <p className="text-lg text-gray-700 mb-8 opacity-80">
                  Discover genuine connections within our supportive and trusted profiles.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/profile-register"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md flex items-center justify-center"
                  >
                    <FaUserPlus className="mr-2" /> Register Now
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold shadow-md text-center"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </section>
            {/* How We Help You Connect Section */}
            <section className="py-6 bg-white rounded-lg shadow-lg mb-8">
              <div className="px-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">How We Help You to Connect</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Create Your Profile Box */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mb-4">
                      <FaUserPlus className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Create Your Profile</h3>
                    <p className="text-gray-600 text-sm mb-4">Share your details and preferences to find compatible matches.</p>
                    <Link to="/profile-register" className="inline-flex items-center text-indigo-500 hover:text-indigo-700 text-sm font-medium">
                      Join Now <FaArrowRight className="ml-2" />
                    </Link>
                  </div>

                  {/* Discover Profiles Box */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                      <FaSearch className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Discover Profiles</h3>
                    <p className="text-gray-600 text-sm mb-4">Browse through diverse profiles and find someone special.</p>
                    <Link to="/profile-search" className="inline-flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium">
                      Browse <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust and Connection Section */}
            <section className="bg-indigo-50 rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6">A Foundation of Trust and Connection</h2>
                <div className="max-w-2xl mx-auto">
                  <p className="text-md text-gray-700 leading-relaxed mb-6 opacity-80">
                    Building a community where trust and genuine connections thrive. We focus on creating a safe and supportive environment for everyone.
                  </p>
                  
                  {/* Stats Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">5,280</div>
                      <h3 className="text-sm font-medium text-gray-700">Active Profiles</h3>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">1,620</div>
                      <h3 className="text-sm font-medium text-gray-700">Successful Matches</h3>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">148</div>
                      <h3 className="text-sm font-medium text-gray-700">New Members</h3>
                      <p className="text-xs text-gray-500">this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-4 mb-2">
            <Link to="/" className="hover:text-indigo-500">Home</Link>
            <Link to="/about" className="hover:text-indigo-500">About Us</Link>
            <Link to="/register" className="hover:text-indigo-500">Register</Link>
            <Link to="/login" className="hover:text-indigo-500">Login</Link>
            <Link to="/contact" className="hover:text-indigo-500">Contact</Link>
          </div>
          <p className="mb-1">Email: support@sarvamoola.org</p>
          <p>Phone: +31 12345 67890</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}