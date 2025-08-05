// /frontend/src/App.js

import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import ChatWindow from './components/ChatWindow';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  // We no longer need the 'appState' variable
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatKey, setChatKey] = useState(1);

  const handleAnalyze = async (file) => {
    setUploadedImage(file);
    setIsLoading(true); // This now controls the UI state
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      setChatKey(prevKey => prevKey + 1);

    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setError('');
    setChatKey(prevKey => prevKey + 1);
  };

  // The renderLeftPanel function has been removed.

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Pneumonia Detection using X-Ray Analysis
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          An AI-powered tool to assist with preliminary diagnosis.
        </p>
      </header>
      
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden" style={{height: 'calc(100vh - 10rem)'}}>
        
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <h2 className="text-2xl font-bold text-gray-800">X-Ray Analysis</h2>
            </div>
            {/* The "Start Over" button now appears based on the same conditions */}
            {(analysisResult || error) && (
              <button 
                onClick={handleClear}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
          <div className="flex-grow relative bg-gray-50 rounded-lg">
            {/* --- NEW: Simplified Conditional Rendering Logic --- */}
            {isLoading ? (
              // 1. If loading, show the loading state
              <ResultsDisplay isLoading={true} />
            ) : error ? (
              // 2. If there's an error, show the error message
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                  <p className="font-bold">Analysis Failed</p>
                  <p>{error}</p>
                </div>
              </div>
            ) : analysisResult ? (
              // 3. If we have a result, show the results
              <ResultsDisplay uploadedImage={uploadedImage} analysisResult={analysisResult} isLoading={false} />
            ) : (
              // 4. Otherwise, show the initial upload form
              <UploadForm onAnalyze={handleAnalyze} isLoading={false} />
            )}
            {/* --- End of New Logic --- */}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col bg-gray-100 border-l">
          <div className="flex items-center mb-4 pb-4 border-b">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            <h2 className="text-2xl font-bold text-gray-800">AI Assistant</h2>
          </div>
          <div className="flex-grow">
            <ChatWindow 
              key={chatKey} 
              analysisContext={analysisResult ? JSON.stringify(analysisResult, null, 2) : ''} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
