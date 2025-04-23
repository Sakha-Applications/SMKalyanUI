import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import { FaUserPlus, FaSearch, FaCamera, FaArrowRight } from 'react-icons/fa'; // Import icons

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans antialiased">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-xl font-bold text-indigo-700">
            ProfileConnect
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-500">Home</Link>
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

      {/* Hero Section */}
      <section className="bg-indigo-50 py-24">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 leading-tight">
            Connect with Your Perfect Match
          </h1>
          <p className="text-lg text-gray-700 mb-10 opacity-80">
            Discover genuine connections within our supportive and trusted community.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md text-lg font-semibold shadow-md flex items-center">
              <FaUserPlus className="mr-2" /> Join Now
            </button>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold shadow-md"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* How We Help You Connect Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-12">How We Help You Connect</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Create Your Profile Box */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
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
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                <FaSearch className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Discover Profiles</h3>
              <p className="text-gray-600 text-sm mb-4">Browse through diverse profiles and find someone special.</p>
              <Link to="/profile-search" className="inline-flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium">
                Browse <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Share Your Moments Box */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-4">
                <FaCamera className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Share Your Moments</h3>
              <p className="text-gray-600 text-sm mb-4">Upload photos and share your story to attract meaningful connections.</p>
              <Link to="/upload-photo" className="inline-flex items-center text-green-500 hover:text-green-700 text-sm font-medium">
                Upload <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Connection Section */}
      <section className="py-20 bg-indigo-50 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-8">A Foundation of Trust and Connection</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-md text-gray-700 leading-relaxed mb-6 opacity-80">
              Building a community where trust and genuine connections thrive. We focus on creating a safe and supportive environment for everyone.
            </p>
            {/* You could add a small image or icon here if desired */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-4 mb-2">
            <Link to="/" className="hover:text-indigo-500">Home</Link>
            <Link to="/about" className="hover:text-indigo-500">About Us</Link>
            <Link to="/register" className="hover:text-indigo-500">Register</Link>
            <Link to="/login" className="hover:text-indigo-500">Login</Link>
            <Link to="/contact" className="hover:text-indigo-500">Contact</Link>
          </div>
          <p className="mb-1">Email: support@profileconnect.com</p>
          <p>Phone: +31 12345 67890</p>
          <p className="mt-2">&copy; 2025 ProfileConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}