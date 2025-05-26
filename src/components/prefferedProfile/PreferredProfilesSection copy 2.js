import React, { useState, useEffect } from 'react';
import { Star, MapPin, Briefcase, Calendar, Heart, User, Clock } from 'lucide-react';
import getBaseUrl from '../../utils/GetUrl';
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

const PreferredProfilesCards = ({ 
  limit = 12, 
  refreshInterval = 300000,
  showHeader = true 
}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

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

  if (loading) {
    return (
      <div className="w-full">
        {showHeader && (
          <div className="flex items-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-pink-500 animate-pulse" />
            <span className="text-lg font-semibold text-gray-700">Loading Preferred Profiles...</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>
          ))}
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

  return (
    <div className="w-full">
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

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.profile_id || profile.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Card Header with Star Badge */}
            <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4">
              <div className="absolute top-2 right-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              
              {/* Profile Photo Placeholder */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-10 h-10 text-white" />
                {/* Future: <img src={profile.photo} alt={profile.name} className="w-20 h-20 rounded-full object-cover" /> */}
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">
                  {profile.name || profile.member_name || 'Profile Name'}
                </h3>
                <p className="text-white/80 text-sm">
                  Profile ID: {profile.profile_id || profile.id || 'N/A'}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 space-y-4">
              {/* Basic Info Row */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Age</span>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {profile.age || '28'} years
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">City</span>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {profile.residing_city || profile.city || 'Bangalore'}
                  </p>
                </div>
              </div>

              {/* Profession */}
              <div>
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">Profession</span>
                </div>
                <p className="text-gray-800 font-semibold">
                  {profile.profession || 'Software Engineer'}
                </p>
              </div>

              {/* Gotra */}
              <div>
                <div className="text-gray-600 font-medium mb-2">Gotra</div>
                <p className="text-gray-800 font-semibold">
                  {profile.gotra || 'Bharadwaj'}
                </p>
              </div>

              {/* Astrological Details */}
              <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-amber-800 mb-3">Astrological Details</h4>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nakshatra:</span>
                    <span className="font-semibold text-gray-800">
                      {profile.nakshatra || 'Rohini'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rashi:</span>
                    <span className="font-semibold text-gray-800">
                      {profile.rashi || 'Vrishabh'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {profile.display_summary && (
                <div>
                  <div className="text-gray-600 font-medium mb-2">About</div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {profile.display_summary}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium">
                    View Profile
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Send Interest
                  </button>
                </div>
              </div>

              {/* Premium Badge */}
              <div className="text-center">
                <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span>PREFERRED PROFILE</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <span>Profiles refresh automatically every {Math.floor(refreshInterval / 60000)} minutes</span>
        </div>
      </div>
    </div>
  );
};

// Demo component
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <PreferredProfilesCards 
          limit={12}
          refreshInterval={30000}
          showHeader={true}
        />
      </div>
    </div>
  );
}