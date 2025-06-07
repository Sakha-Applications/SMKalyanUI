import React from 'react';
import { Button } from '../common/FormElements';

const Popup5_UploadPhotos = ({ onNext, onPrevious }) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-xl font-semibold text-gray-700">Upload Photos</h2>
      <p className="text-gray-500">📸 This functionality is coming soon. Please proceed to the next step.</p>

      <div className="flex justify-center space-x-4 mt-6">
        <Button onClick={onPrevious} variant="outlined">⬅️ Previous</Button>
        <Button onClick={onNext} variant="primary">Next ➡️</Button>
      </div>
    </div>
  );
};

export default Popup5_UploadPhotos;
