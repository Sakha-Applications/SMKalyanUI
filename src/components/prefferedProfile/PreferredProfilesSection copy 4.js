import React, { useState, useEffect } from 'react';
import { Star, MapPin, Briefcase, Calendar, Heart, User, Clock, ChevronLeft, ChevronRight, Pause, Play, X, Eye } from 'lucide-react';
import getBaseUrl from '../../utils/GetUrl';
import { useNavigate } from 'react-router-dom';

// API service
const API_BASE = `${getBaseUrl()}/api/preferred-profiles`;

console.log('Preferred Profiles API URL:', API_BASE);

const api = {
  getForDisplay: async (limit = 12) => {
    const response = await fetch(`${API_BASE}/display?limit=${limit}&format=cards`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  }
};

const PreferredProfilesCarousel = ({ 
  limit = 12, 
  refreshInterval = 300000,
  showHeader = true,
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view' or 'interest'
  
  const navigate = useNavigate();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await api.getForDisplay(limit);
      setProfiles(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    
    const interval = setInterval(fetchProfiles, refreshInterval);
    return () => clearInterval(interval);
  }, [limit, refreshInterval]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || profiles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % profiles.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, profiles.length, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % profiles.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + profiles.length) % profiles.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  const handleViewProfile = () => {
    setModalType('view');
    setShowComingSoonModal(true);
  };

  const handleSendInterest = () => {
    setModalType('interest');
    setShowComingSoonModal(true);
  };

  const closeComingSoonModal = () => {
    setShowComingSoonModal(false);
    setModalType('');
  };

  // Helper function to safely display values
  const displayValue = (value, fallback = 'Not Available') => {
    return value && value !== 'null' && value !== 'undefined' ? value : fallback;
  };

  if (loading) {
    return (
      <div className="w-full">
        {showHeader && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-pink-500 animate-pulse" />
            <span className="text-lg font-semibold text-gray-700">Loading Preferred Profiles...</span>
          </div>
        )}
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-xl h-96 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-red-600 mb-4 text-lg">Unable to load preferred profiles</div>
        <button 
          onClick={fetchProfiles}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Preferred Profiles Available</h3>
        <p className="text-gray-500">Check back later for new preferred profiles</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      {showHeader && (
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Star className="w-8 h-8 text-pink-500" />
            <h2 className="text-3xl font-bold text-gray-800">Preferred Profiles</h2>
            <Star className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-gray-600 mb-4">Handpicked matrimonial profiles for you</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
              {profiles.length} Premium Profiles
            </span>
            {lastUpdated && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Main Profile Card */}
        <div className="relative overflow-hidden">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-500">
              {/* Card Header with Star Badge */}
              <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6">
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
                
                {/* Profile Photo Placeholder */}
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {displayValue(currentProfile.name)}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Profile ID: {displayValue(currentProfile.profile_id)}
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-5">
                {/* Basic Info Row */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Age</span>
                    </div>
                    <p className="text-gray-800 font-semibold text-lg">
                      {displayValue(currentProfile.age)} {currentProfile.age ? 'years' : ''}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">City</span>
                    </div>
                    <p className="text-gray-800 font-semibold text-lg">
                      {displayValue(currentProfile.residing_city || currentProfile.current_location)}
                    </p>
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">Profession</span>
                  </div>
                  <p className="text-gray-800 font-semibold text-lg">
                    {displayValue(currentProfile.profession)}
                  </p>
                </div>

                {/* Gotra */}
                <div>
                  <div className="text-gray-600 font-medium mb-2">Gotra</div>
                  <p className="text-gray-800 font-semibold text-lg">
                    {displayValue(currentProfile.gotra)}
                  </p>
                </div>

                {/* Astrological Details */}
                {(currentProfile.nakshatra || currentProfile.rashi) && (
                  <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-amber-800 mb-3">Astrological Details</h4>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      {currentProfile.nakshatra && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nakshatra:</span>
                          <span className="font-semibold text-gray-800">
                            {displayValue(currentProfile.nakshatra)}
                          </span>
                        </div>
                      )}
                      {currentProfile.rashi && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rashi:</span>
                          <span className="font-semibold text-gray-800">
                            {displayValue(currentProfile.rashi)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* About */}
                {currentProfile.display_summary && (
                  <div>
                    <div className="text-gray-600 font-medium mb-2">About</div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {currentProfile.display_summary}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleViewProfile}
                      className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={handleSendInterest}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Send Interest
                    </button>
                  </div>
                </div>

                {/* Premium Badge */}
                <div className="text-center">
                  <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    <span>PREFERRED PROFILE</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200 z-10"
          disabled={profiles.length <= 1}
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200 z-10"
          disabled={profiles.length <= 1}
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-center space-x-6">
        {/* Dot Indicators */}
        <div className="flex space-x-2">
          {profiles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-pink-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <button
          onClick={toggleAutoPlay}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isAutoPlaying ? 'Pause' : 'Play'}</span>
        </button>

        {/* Counter */}
        <div className="text-sm text-gray-500">
          {currentIndex + 1} of {profiles.length}
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-gray-500 mt-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <span>Profiles refresh automatically every {Math.floor(refreshInterval / 60000)} minutes</span>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 relative">
            <button
              onClick={closeComingSoonModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="mb-4">
                {modalType === 'view' ? (
                  <Eye className="w-16 h-16 text-blue-500 mx-auto" />
                ) : (
                  <Heart className="w-16 h-16 text-pink-500 mx-auto" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {modalType === 'view' ? 'View Profile' : 'Send Interest'}
              </h3>
              <p className="text-gray-600 mb-6">
                {modalType === 'view' 
                  ? 'This feature is coming soon! We\'re working hard to bring you detailed profile viewing.'
                  : 'This feature is coming soon! We\'re working hard to bring you the ability to send interest to profiles.'
                }
              </p>
              <button
                onClick={closeComingSoonModal}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo component
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <PreferredProfilesCarousel 
          limit={6}
          refreshInterval={30000}
          showHeader={true}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </div>
    </div>
  );
}