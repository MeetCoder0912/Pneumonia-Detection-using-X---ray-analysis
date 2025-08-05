// /frontend/src/components/ResultsDisplay.js

import React from 'react';

function ResultsDisplay({ analysisResult, uploadedImage, isLoading }) {
  
  // A helper to parse the findings text into a list for better formatting
  const parseFindings = (findingsText) => {
    if (!findingsText || !findingsText.includes('-')) {
      return [findingsText];
    }
    return findingsText.split('- ').filter(item => item.trim() !== '' && item.toLowerCase() !== 'potential findings:');
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Analyzing Image</p>
        <p className="text-gray-500">Please wait while the AI processes the X-ray...</p>
      </div>
    );
  }

  if (!analysisResult) {
    return null; // Don't show anything if there are no results yet
  }

  const findingsList = parseFindings(analysisResult.findings);

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Analysis Complete</h2>
      <div className="flex-grow overflow-y-auto">
        <div className="mb-4">
          <img 
            src={URL.createObjectURL(uploadedImage)} 
            alt="Uploaded X-Ray" 
            className="w-full h-auto max-h-64 object-contain rounded-lg border" 
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Potential Findings:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {findingsList.map((finding, index) => (
              <li key={index}>{finding.trim()}</li>
            ))}
          </ul>
          {/* FIX: Added this block to display the confidence score */}
          {analysisResult.confidence && (
            <p className="mt-3">
              <strong className="font-semibold text-gray-700">Confidence:</strong> {analysisResult.confidence}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-500 italic mt-4">{analysisResult.disclaimer}</p>
      </div>
    </div>
  );
}

export default ResultsDisplay;
