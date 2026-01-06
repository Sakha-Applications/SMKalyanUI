
const  getPhotoBaseUrl = () => {
  // Set NODE_ENV in scripts if needed; React uses "development" and "production" by default
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  } else {
    return 'https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net';
  }
};
export default getPhotoBaseUrl;