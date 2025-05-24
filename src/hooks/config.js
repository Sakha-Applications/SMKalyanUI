// src/config.js

const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/',
  photoBaseUrl: process.env.REACT_APP_PHOTO_BASE_URL || 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net'
};

module.exports = config;