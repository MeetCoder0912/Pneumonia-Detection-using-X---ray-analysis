// /frontend/src/components/UploadForm.js

import React, { useState } from 'react';
import Spinner from './Spinner';

function UploadForm({ onAnalyze, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (!selectedFile) return;
    onAnalyze(selectedFile);
  };

  // This function handles the drag-and-drop functionality
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div 
      className="h-full flex flex-col items-center justify-center text-center p-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label 
        htmlFor="file-upload" 
        className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414A1 1 0 0116.414 3H17a4 4 0 014 4v5a4 4 0 01-4 4H7z"></path></svg>
        <p className="text-lg text-gray-600">
          <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-gray-500 mt-1">PNG, JPG, or DICOM</p>
        <input 
          id="file-upload" 
          type="file" 
          className="sr-only"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/dicom, .dcm"
        />
      </label>

      {selectedFile && !isLoading && (
        <div className="w-full mt-4">
          <p className="text-green-600 font-medium mb-4">
            File selected: {selectedFile.name}
          </p>
          <button
            onClick={handleAnalyzeClick}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Analyze Image
          </button>
        </div>
      )}

      {isLoading && (
        <div className="w-full mt-4">
            <button
                disabled
                className="w-full bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
                <Spinner />
                Analyzing...
            </button>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
