
import React from 'react';
import { FileUpload } from './components/FileUpload';
import { SheetView } from './components/SheetView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { StepIndicator } from './components/StepIndicator';
import { useFileProcessor } from './hooks/useFileProcessor';
import type { DataRow } from './types';

export default function App() {
  const { data, isLoading, error, processFile, reset } = useFileProcessor();
  const hasData = data.length > 0;

  const handleFileSelect = (file: File) => {
    processFile(file);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 font-sans">
      {isLoading && <LoadingSpinner />}
      <header className="flex-shrink-0 w-full text-center p-4 bg-gray-900 z-20 shadow-md">
        <div className="flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-2xl font-bold text-white tracking-tight">Offline Data Pivot Analyzer</h1>
        </div>
        {!hasData && (
            <p className="mt-1 text-md text-gray-400">
                Analyze Excel & CSV files instantly. Your data stays on your device.
            </p>
        )}
      </header>
      
      <main className="flex-grow w-full flex flex-col items-center justify-center p-4 overflow-hidden">
        {!hasData ? (
          <div className="w-full max-w-2xl">
              <StepIndicator currentStep={1} />
              <div className="mt-6">
                <FileUpload onFileSelect={handleFileSelect} error={error} />
              </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <StepIndicator currentStep={2} />
                <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Analyze New File
                </button>
            </div>
            <div id="spreadsheet-container" className="flex-grow h-full w-full bg-gray-800 rounded-xl overflow-hidden shadow-2xl relative">
                <SheetView data={data} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}