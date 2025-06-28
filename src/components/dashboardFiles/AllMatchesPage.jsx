// D:\1. Data\1. Personal DOcument\00.SM\NewProject\dev\SMKalyanUI\src\components\dashboardFiles/AllMatchesPage.jsx
import React from 'react';
import MatchGrid from './MatchGrid';

const AllMatchesPage = () => {
  // It's good practice to ensure profileId is available for MatchGrid.
  // MatchGrid already fetches user preferences internally, but passing profileId is clean.
  const userProfileId = sessionStorage.getItem("profileId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">All Suggested Matches</h1>
        {/*
          MatchGrid already handles its own loading, errors, and authentication redirects.
          It will use the userProfileId passed to it.
        */}
        <MatchGrid profileId={userProfileId} />
      </div>
    </div>
  );
};

export default AllMatchesPage;