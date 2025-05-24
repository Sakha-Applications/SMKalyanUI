import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaCamera, FaArrowRight } from 'react-icons/fa';

// Import the image
import backgroundImage from '../assets/Image/kalayan_bg_img.png'; // Adjust the path as needed

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans antialiased min-h-screen"> {/* Added min-h-screen */}
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6"> {/* Added container and mx-auto */}
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

      {/* Hero Section */}
  {/* Hero Section */}
<section
  className="py-20 relative bg-indigo-50"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '400px',
  }}
>
  {/* Optional: Add an overlay - MOVED TO BE FIRST so it doesn't cover interactive elements */}
  <div className="absolute inset-0 bg-indigo-50 opacity-20"></div>
  
  {/* Main text container - made it relative instead of absolute */}
  <div className="container mx-auto px-6 relative z-10">
    <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 leading-tight">
      Welcome to Kalyan Sakha <br />
      Connect with Your Perfect Match
    </h1>
    <p className="text-lg text-gray-700 mb-10 opacity-80">
      Discover genuine connections within our supportive and trusted profiles.
    </p>
    <div className="flex space-x-4">
      <Link
        to="/profile-register"
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md flex items-center"
      >
        <FaUserPlus className="mr-2" /> Register Now
      </Link>
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
      <section className="py-6 bg-white">
        <div className="container mx-auto text-center px-6"> {/* Added container and mx-auto */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-12">How We Help You to Connect</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"> {/* Added max-w-6xl and mx-auto */}
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
            
          </div>
        </div>
      </section>

      {/* Trust and Connection Section */}
      <section className="py-20 bg-indigo-50 text-center">
        <div className="container mx-auto px-6"> {/* Added container and mx-auto */}
          <h2 className="text-2xl font-semibold text-indigo-700 mb-8">A Foundation of Trust and Connection</h2>
          <div className="max-w-2xl mx-auto"> {/* Added max-w-2xl and mx-auto */}
            <p className="text-md text-gray-700 leading-relaxed mb-6 opacity-80">
              Building a community where trust and genuine connections thrive. We focus on creating a safe and supportive environment for everyone.
            </p>
            {/* You could add a small image or icon here if desired */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm">
        <div className="container mx-auto px-6"> {/* Added container and mx-auto */}
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