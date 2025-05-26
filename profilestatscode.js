import React, { useState, useEffect } from 'react';
import { Star, Clock, CheckCircle, User, Calendar, DollarSign } from 'lucide-react';

// API service
const API_BASE = `https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/preferred-profiles`;

const api = {
  getForDisplay: async (limit = 12, format = 'cards') => {
    const response = await fetch(`${API_BASE}/display?limit=${limit}&format=${format}`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  }
};

const PreferredProfilesCards = ({ 
  limit = 12, 
  refreshInterval = 300000,
  showPaymentInfo = false,
  showHeader = true 
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
      <div className="w-full">
        {showHeader && (
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-gray-600">Loading preferred members...</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-8">
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
      <div className="w-full text-center py-8">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-600 mb-1">No Preferred Members</h3>
        <p className="text-gray-500 text-sm">No active preferred profiles to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-800">Preferred Members</h3>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
              {profiles.length} Active
            </span>
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-xs">PREFERRED</span>
                </div>
                <span className="text-xs">{getUrgencyIcon(profile.urgency)}</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <h4 className="font-medium text-gray-800 truncate">
                  {profile.member_name}
                </h4>
              </div>

              {profile.display_summary && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {profile.display_summary}
                </p>
              )}

              {/* Status info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Days Left:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(profile.urgency)}`}>
                    {profile.days_remaining} days
                  </span>
                </div>

                {profile.display_date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Since:</span>
                    <span className="text-gray-700 text-xs">{profile.display_date}</span>
                  </div>
                )}

                {showPaymentInfo && profile.payment_amount && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Amount:</span>
                    <span className="text-green-600 font-medium flex items-center text-xs">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {profile.payment_amount}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Until: {profile.validity_date}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-xs text-gray-400 mt-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span>Refreshes every {Math.floor(refreshInterval / 60000)} minutes</span>
        </div>
      </div>
    </div>
  );
};

// Demo component showing how to use it in a parent page
export default function App() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Your other page content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard</p>
        </div>

        {/* Other sections of your page */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Statistics</h3>
            <p className="text-gray-600">Some stats here...</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <p className="text-gray-600">Activity feed...</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <p className="text-gray-600">Action buttons...</p>
          </div>
        </div>

        {/* Preferred Profiles Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PreferredProfilesCards 
            limit={8}
            refreshInterval={300000}
            showPaymentInfo={false}
            showHeader={true}
          />
        </div>
      </div>
    </div>
  );
}