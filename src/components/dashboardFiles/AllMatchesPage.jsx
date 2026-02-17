import React from 'react';
import MatchGrid from './MatchGrid';
import { Link, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const AllMatchesPage = () => {
  const userProfileId = sessionStorage.getItem("profileId");
  const status = (sessionStorage.getItem("profileStatus") || "").toString().trim().toUpperCase();

  if (status && status !== "APPROVED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-indigo-800 mb-3 text-center">Matches</h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="font-semibold text-blue-900">Your profile is under review.</div>
            <div className="text-sm text-blue-900 mt-1">
              Matches will be available once your profile is approved.
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Current status: <span className="font-medium">{status}</span>
            </div>

            <div className="mt-4 text-center">
              <Button component={Link} to="/dashboard" sx={{ color: "#10a8eeff", '&:hover': { color: "#3f51b5" } }}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">All Suggested Matches</h1>

        <Button component={Link} to="/dashboard" sx={{ color: "#10a8eeff", '&:hover': { color: "#3f51b5" } }}>
          Back to Dashboard
        </Button>

        <MatchGrid profileId={userProfileId} />
      </div>
    </div>
  );
};

export default AllMatchesPage;
