import React, { useState, useEffect } from 'react';
import { Star, Clock, CheckCircle, User, Calendar, DollarSign } from 'lucide-react';

// API service functions
const API_BASE = `https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/preferred-profiles`;

const api = {
  getForDisplay: async (limit = 10, format = 'ticker') => {
    const response = await fetch(`${API_BASE}/display?limit=${limit}&format=${format}`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  },
  
  getForTicker: async (limit = 10) => {
    const response = await fetch(`${API_BASE}/ticker?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch ticker profiles');
    return response.json();
  }
};

// Ticker Component - Scrolling horizontal display
const PreferredProfilesTicker = ({ 
  limit = 10, 
  speed = 50, 
  refreshInterval = 300000 
}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await api.getForDisplay(limit, 'ticker');
      setProfiles(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ticker profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    
    // Set up periodic refresh
    const interval = setInterval(fetchProfiles, refreshInterval);
    return () => clearInterval(interval);
  }, [limit, refreshInterval]);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="text-amber-700 font-medium">Loading preferred members...</span>
        </div>
      </div>
    );
  }

  if (error || profiles.length === 0) {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">No preferred members to display</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-b border-amber-200">
        <Star className="w-5 h-5 text-amber-600 mr-2" />
        <span className="text-amber-800 font-semibold text-sm">Preferred Members</span>
        <div className="ml-auto flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-amber-600">Live</span>
        </div>
      </div>
      
      <div className="relative overflow-hidden py-3">
        <div 
          className="flex animate-scroll whitespace-nowrap"
          style={{
            animationDuration: `${Math.max(profiles.length * 8, 30)}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        >
          {profiles.concat(profiles).map((profile, index) => (
            <div
              key={`${profile.profile_id}-${index}`}
              className="inline-flex items-center mx-6 flex-shrink-0"
            >
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-amber-100">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-800 font-medium mr-3">
                  {profile.member_name}
                </span>
                {profile.display_summary && (
                  <span className="text-gray-600 text-sm max-w-xs truncate">
                    {profile.display_summary}
                  </span>
                )}
                <div className="ml-3 flex items-center text-xs text-amber-600">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{profile.days_remaining}d left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation-name: scroll;
        }
      `}</style>
    </div>
  );
};

// Profile Cards Component - Grid display with detailed information
const PreferredProfilesCards = ({ 
  limit = 12, 
  refreshInterval = 300000,
  showPaymentInfo = false 
}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await api.getForDisplay(limit, 'cards');
      setProfiles(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    
    // Set up periodic refresh
    const interval = setInterval(fetchProfiles, refreshInterval);
    return () => clearInterval(interval);
  }, [limit, refreshInterval]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'urgent': return '🔴';
      case 'moderate': return '🟡';
      default: return '🟢';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Error loading preferred profiles</div>
        <button 
          onClick={fetchProfiles}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Preferred Members</h3>
        <p className="text-gray-500">No active preferred profiles to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-gray-800">Preferred Members</h2>
          <span className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded-full">
            {profiles.length} Active
          </span>
        </div>
        
        {lastUpdated && (
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">PREFERRED</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-amber-100">
                    {getUrgencyIcon(profile.urgency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="font-semibold text-gray-800 truncate">
                  {profile.member_name}
                </h3>
              </div>

              {profile.display_summary && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {profile.display_summary}
                </p>
              )}

              {/* Status and timing info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Days Remaining:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(profile.urgency)}`}>
                    {profile.days_remaining} days
                  </span>
                </div>

                {profile.display_date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Member Since:</span>
                    <span className="text-gray-700">{profile.display_date}</span>
                  </div>
                )}

                {showPaymentInfo && profile.payment_amount && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Amount:</span>
                    <span className="text-green-600 font-medium flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {profile.payment_amount}
                    </span>
                  </div>
                )}
              </div>

              {/* Validity indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Valid until: {profile.validity_date}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-xs text-gray-400 mt-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Auto-refreshes every {Math.floor(refreshInterval / 60000)} minutes</span>
        </div>
      </div>
    </div>
  );
};

// Combined Dashboard Component
const PreferredProfilesDashboard = () => {
  const [view, setView] = useState('both'); // 'ticker', 'cards', 'both'

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Preferred Members Dashboard</h1>
        
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setView('both')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'both' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Both
          </button>
          <button
            onClick={() => setView('ticker')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'ticker' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ticker Only
          </button>
          <button
            onClick={() => setView('cards')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'cards' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cards Only
          </button>
        </div>
      </div>

      {/* Ticker Display */}
      {(view === 'ticker' || view === 'both') && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Live Ticker</h2>
          <PreferredProfilesTicker limit={15} refreshInterval={300000} />
        </div>
      )}

      {/* Cards Display */}
      {(view === 'cards' || view === 'both') && (
        <div className="space-y-2">
          <PreferredProfilesCards 
            limit={12} 
            refreshInterval={300000}
            showPaymentInfo={false} // Set to true if you want to show payment amounts
          />
        </div>
      )}
    </div>
  );
};

// Main Export - you can use individual components or the full dashboard
export default function App() {
  return <PreferredProfilesDashboard />;
}