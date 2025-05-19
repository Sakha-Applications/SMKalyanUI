// src/config.js

const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  photoBaseUrl: process.env.REACT_APP_PHOTO_BASE_URL || 'http://localhost:3001'
};

module.exports = config;