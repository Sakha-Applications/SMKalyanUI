// src/components/dashboardFiles/ProfileCard/ProfileCard.jsx
import React from 'react';
import styles from './ProfileCard.module.css'; // Import CSS Module

const ProfileCard = ({ profile, imageUrl, onCardClick }) => {
  // Destructure profile data with fallbacks
  const {
    profile_id,
    name,
    current_age, // Age from backend
    height,      // Height from backend (assuming format like "5'7" or "170 cm")
    current_location, // Location from backend
    gotra,
  } = profile;

  // Ensure photoUrl is always valid
  const photoSrc = imageUrl || '/ProfilePhotos/defaultImage.jpg'; // Use a robust default path

  return (
    <div className={styles.card} onClick={() => onCardClick(profile_id)}>
      <div className={styles.photoContainer}>
        <img
          src={photoSrc}
          alt={`Photo of ${name || 'Profile'}`}
          className={styles.profilePhoto}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop on error
            e.target.src = '/ProfilePhotos/defaultImage.jpg'; // Fallback for broken images
          }}
        />
      </div>
      <div className={styles.details}>
        <p className={styles.name}>{name || 'N/A'}</p>
        <p><strong>Age:</strong> {current_age ? `${parseInt(current_age)} yrs` : 'N/A'}</p>
        <p><strong>Height:</strong> {height || 'N/A'}</p>
        <p><strong>Location:</strong> {current_location || 'N/A'}</p>
        {gotra && <p><strong>Gotra:</strong> {gotra}</p>}
        {/* Use a button or anchor depending on desired navigation */}
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