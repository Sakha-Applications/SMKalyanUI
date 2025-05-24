// frontend/src/components/About.js
import React from 'react';
import { Link } from 'react-router-dom';
// import BackHomeButton from '../hooks/BackHomeButton'; // Corrected import path

function About() {
  return (
    <div className="bg-gray-50 font-sans antialiased min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/home" className="text-xl font-bold text-indigo-700">
          Profile Management Home
          </Link>
            </div>
      </nav>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">About Us</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
  Inspired by the unwavering devotion and selfless service of Lord Hanuman, this platform is dedicated to helping individuals connect and find their life partners within a community built on trust and shared values. Just as Hanuman tirelessly served Lord Rama, bridging distances and fostering meaningful relationships, our application strives to bridge hearts and create lasting unions. Our objective is rooted in the principle of selfless service, aiming to empower individuals in their journey to find companionship.
</p>
<p className="text-lg text-gray-700 leading-relaxed mb-8">
  We believe in the strength of community and the beauty of finding a partner who complements your life's purpose. Like Hanuman's strength and loyalty, we aim to provide a reliable and secure space for you to connect authentically. Through this platform, we encourage you to embark on your search with faith and sincerity, knowing that you are part of a community inspired by noble ideals. May your journey be filled with meaningful connections and lead you to a fulfilling partnership. Discover the story behind ProfileConnect and our mission to help you find meaningful connections. We believe in creating a safe and supportive environment where individuals can connect based on shared interests and values. Our platform offers features designed to enhance your experience and make the process of finding your perfect match enjoyable and rewarding.
</p>

          {/* You can add more content about your team, values, etc. here */}
        </div>
      </section>

      {/* Footer (Optional - you can reuse the Home footer or create a specific one) */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm">
        <div className="container mx-auto px-6">
          <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default About;