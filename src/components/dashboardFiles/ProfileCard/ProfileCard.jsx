// src/components/dashboardFiles/ProfileCard/ProfileCard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import styles from './ProfileCard.module.css'; // Import CSS Module

const ProfileCard = ({ profile, imageUrl, onCardClick }) => {
  // Destructure profile data with fallbacks
  const {
    profile_id,
    name,
    current_age, // Age from backend
    height, // Height from backend (assuming format like "5'7" or "170 cm")
    current_location, // Location from backend
    gotra,
    photos, // OPTIONAL: multiple photos array from backend if available
  } = profile;

  // Build list of photos (supports: profile.photos[], single imageUrl, default)
  const photoList = useMemo(() => {
    const list = [];

    // If backend provides multiple photos
    if (Array.isArray(photos) && photos.length > 0) {
      photos.forEach((p) => {
        if (p && typeof p === 'string') list.push(p);
      });
    }

    // If parent passes imageUrl as single photo
    if (imageUrl && typeof imageUrl === 'string') {
      // Avoid duplicate if same URL already present
      if (!list.includes(imageUrl)) list.push(imageUrl);
    }

    // Ensure at least 1 photo
    if (list.length === 0) list.push('/ProfilePhotos/defaultImage.jpg');

    return list;
  }, [photos, imageUrl]);

  const [photoIndex, setPhotoIndex] = useState(0);

  // If card re-renders with a different profile, reset index
  useEffect(() => {
    setPhotoIndex(0);
  }, [profile_id]);

  const currentPhotoSrc = photoList[photoIndex] || '/ProfilePhotos/defaultImage.jpg';
  const hasMultiplePhotos = photoList.length > 1;

  const handleNext = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photoList.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === 0 ? photoList.length - 1 : prev - 1));
  };

  return (
    <div className={styles.card} onClick={() => onCardClick(profile_id)}>
      <div className={styles.photoContainer}>
        <img
          src={currentPhotoSrc}
          alt={`Photo of ${name || 'Profile'}`}
          className={styles.profilePhoto}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop on error
            e.target.src = '/ProfilePhotos/defaultImage.jpg'; // Fallback for broken images
          }}
        />

        {/* Next/Prev buttons ONLY if multiple photos exist */}
        {hasMultiplePhotos && (
          <div className={styles.photoControls} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrev}
              aria-label="Previous photo"
              title="Previous photo"
            >
              ‹
            </button>

            <div className={styles.photoCount} title="Photo position">
              {photoIndex + 1}/{photoList.length}
            </div>

            <button
              type="button"
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Next photo"
              title="Next photo"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className={styles.details}>
        <p className={styles.name}>{name || 'N/A'}</p>
        <p>
          <strong>Age:</strong> {current_age ? `${parseInt(current_age)} yrs` : 'N/A'}
        </p>
        <p>
          <strong>Height:</strong> {height || 'N/A'}
        </p>
        <p>
          <strong>Location:</strong> {current_location || 'N/A'}
        </p>
        {gotra && (
          <p>
            <strong>Gotra:</strong> {gotra}
          </p>
        )}

        <button
          className={styles.viewProfileButton}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from firing again
            onCardClick(profile_id); // Re-use the existing handler for consistency
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
