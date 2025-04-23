// frontend/src/components/BackHomeButton.js
import React from 'react';
import { Link } from 'react-router-dom';

function BackHomeButton() {
  return (
    <Link to="/" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md mt-4">
      Back to Home
    </Link>
  );
}

export default BackHomeButton;