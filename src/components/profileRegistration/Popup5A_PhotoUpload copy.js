// src/components/profileRegistration/Popup5A_PhotoUpload.js

import React, { useState } from 'react';
import { Label as L, Button as B } from '../common/FormElements';
import {
  handlePhotoChange,
  handleUploadPhotos
} from '../UploadProfilePhoto/photoUploadUtils';

const Popup5A_PhotoUpload = ({
  formData,
  onNext,
  onPrevious,
  setIsProcessing
}) => {
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Limit to one photo during registration
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 1); // only one
    e.target.value = null; // clear input for re-selection
    handlePhotoChange(
      { target: { files } },
      setPhotos,
      setPhotoPreviews,
      setUploadError,
      0 // at registration there are no existing photos
    );
  };

  const handleUpload = async () => {
    if (!formData.profileId || !formData.email) {
      setUploadError('Profile not initialized yet. Please complete earlier steps.');
      return;
    }

    await handleUploadPhotos(
      { id: formData.profileId, email: formData.email },
      photos,
      true, // set as default
      setUploading,
      setUploadError,
      setPhotos,
      setPhotoPreviews,
      () => {}, // setIsDefaultPhoto not needed
      () => {}, // getUploadedPhotos not needed here
      () => {}, // fetchDefaultPhoto not needed here
      () => {}, // setUploadedPhotos not needed here
      () => {}, // setDefaultPhoto not needed here
      () => {}, // setGettingPhotos not needed
      () => {}  // setFetchError not needed
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 p-5 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white text-center">
          You're all set! Now add a photo to get even better matches
        </h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Info banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800 font-medium">
            Optional Step: You can upload <strong>one photo</strong> now, or skip and do it later from your Dashboard.
          </p>
        </div>

        <div>
          <L htmlFor="photoUpload">Choose a Photo</L>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full border p-2 rounded"
          />
        </div>

        {uploadError && <p className="text-red-500">{uploadError}</p>}

        {photoPreviews.length > 0 && (
          <div className="mt-4 flex justify-center">
            <img
              src={photoPreviews[0]}
              alt="preview"
              className="w-32 h-32 object-cover rounded shadow border"
            />
          </div>
        )}

        {photos.length > 0 && (
          <div className="flex justify-center">
            <B onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </B>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between p-6 border-t">
        <B variant="outline" onClick={onPrevious}>Previous</B>
        <B onClick={onNext}>Skip / Next</B>
      </div>
    </div>
  );
};

export default Popup5A_PhotoUpload;
