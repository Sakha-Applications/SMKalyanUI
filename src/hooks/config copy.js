// src/config.js

const getApiUrl = () => {
  // Use REACT_APP_ prefix for React environment variables
  const apiUrl = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/'
      : 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/');
      
  // Remove trailing slash if present
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};

const config = {
  apiUrl: getApiUrl(),
  photoBaseUrl: process.env.REACT_APP_PHOTO_BASE_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net'
      : 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net')
};

export default config;