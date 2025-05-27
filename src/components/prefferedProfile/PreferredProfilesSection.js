import React, { useState, useEffect } from 'react';
import { Star, MapPin, Briefcase, Calendar, Heart, User, Clock, Eye, X } from 'lucide-react';
import getBaseUrl from '../../utils/GetUrl';

const API_BASE = `${getBaseUrl()}/api/preferred-profiles`;

const api = {
  getForDisplay: async (limit = 12) => {
    const response = await fetch(`${API_BASE}/display?limit=${limit}&format=cards`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  }
};

const Modal = ({ type, onClose }) => {
  const isView = type === 'view';
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-4">
          {isView ? <Eye className="w-10 h-10 text-blue-500" /> : <Heart className="w-10 h-10 text-pink-500" />}
        </div>
        <h2 className="text-xl font-bold mb-2">
          {isView ? 'View Profile - Coming Soon' : 'Send Interest - Coming Soon'}
        </h2>
        
        <p className="text-gray-600">
  {isView
    ? `You will soon be able to view detailed profiles with more information.`
    : `We are working on letting you send interest to this profile.`}
</p>

      </div>
    </div>
  );
};

const PreferredProfilesCards = ({ limit = 12, refreshInterval = 300000, showHeader = true }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalType, setModalType] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await api.getForDisplay(limit);
      console.log('API Response:', response); // Debug log
      setProfiles(response.data || []);
      setLastUpdated(new Date());
      setCurrentIndex(0);
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

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!profiles.length) return <div className="text-center text-gray-500">No preferred profiles found.</div>;

  const profile = profiles[currentIndex];
  console.log('Current profile:', profile); // Debug log

  // FIXED: Enhanced profile data with safety checks
  const safeProfile = {
    profile_id: profile?.profile_id || 'N/A',
    name: profile?.name || profile?.member_name || 'N/A',
    member_name: profile?.member_name || profile?.name || 'N/A',
    current_age: profile?.current_age || 0,
    city: profile?.city || 'Not specified',
    profession: profile?.profession || 'Not specified',
    gotra: profile?.gotra || 'Not specified',
    rashi: profile?.rashi || 'Not specified',
    nakshatra: profile?.nakshatra || 'Not specified',
    display_summary: profile?.display_summary || 
                    profile?.transaction_details || 
                    `${profile?.name || profile?.member_name || 'This profile'} is a preferred member looking for a life partner.`
  };

  return (
    <div className="w-full relative">
      {modalType && <Modal type={modalType} onClose={() => setModalType(null)} />}

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

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentIndex(currentIndex === 0 ? profiles.length - 1 : currentIndex - 1)}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-pink-100 text-pink-700 font-bold text-xl rounded-full p-3 hover:bg-pink-200 z-10 shadow"
      >&lt;</button>
      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % profiles.length)}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-pink-100 text-pink-700 font-bold text-xl rounded-full p-3 hover:bg-pink-200 z-10 shadow"
      >&gt;</button>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group transition-all duration-300">
        <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4">
          <div className="absolute top-2 right-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-1">{safeProfile.name}</h3>
            <p className="text-white/80 text-sm">Profile ID: {safeProfile.profile_id}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Age</span>
              </div>
              <p className="text-gray-800 font-semibold">
                {safeProfile.current_age > 0 ? `${safeProfile.current_age} years` : 'Not specified'}
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">City</span>
              </div>
              <p className="text-gray-800 font-semibold">{safeProfile.city}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">Profession</span>
            </div>
            <p className="text-gray-800 font-semibold">{safeProfile.profession}</p>
          </div>

          <div>
            <div className="text-gray-600 font-medium mb-2">Gotra</div>
            <p className="text-gray-800 font-semibold">{safeProfile.gotra}</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-amber-800 mb-3">Astrological Details</h4>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nakshatra:</span>
                <span className="font-semibold text-gray-800">{safeProfile.nakshatra}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rashi:</span>
                <span className="font-semibold text-gray-800">{safeProfile.rashi}</span>
              </div>
            </div>
          </div>

          {safeProfile.display_summary && (
            <div>
              <div className="text-gray-600 font-medium mb-2">About</div>
              <p className="text-gray-700 text-sm leading-relaxed">{safeProfile.display_summary}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium"
                onClick={() => setModalType('view')}
              >View Profile</button>
              <button
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                onClick={() => setModalType('interest')}
              >Send Interest</button>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span>PREFERRED PROFILE</span>
            </span>
          </div>

          {/* Debug information - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 mt-4 p-2 bg-gray-50 rounded">
              <strong>Debug Info:</strong><br/>
              Profile ID: {profile?.profile_id}<br/>
              Name: {profile?.name}<br/>
              Member Name: {profile?.member_name}<br/>
              Age: {profile?.current_age}<br/>
              City: {profile?.city}<br/>
              Has transaction_details: {profile?.transaction_details ? 'Yes' : 'No'}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <span>Profiles refresh automatically every {Math.floor(refreshInterval / 60000)} minutes</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <PreferredProfilesCards limit={12} refreshInterval={30000} showHeader={true} />
      </div>
    </div>
  );
}