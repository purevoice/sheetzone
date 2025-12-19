
import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`p-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300
            ${isDragging ? 'border-indigo-400 bg-gray-700' : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-800'}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleChange}
            />
            <div className="flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mb-4 transition-colors duration-300 ${isDragging ? 'text-indigo-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16a4 4 0 01-4 4H7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v6m0 0l-3-3m3 3l3-3" />
                </svg>
                <p className="text-xl font-semibold text-gray-200">
                    Drag & drop your Excel or CSV file here
                </p>
                <p className="text-gray-400 mt-1">or <span className="font-medium text-indigo-400">click to browse</span></p>
                <p className="text-sm text-gray-500 mt-4">Supported formats: .xlsx, .xls, .csv</p>
            </div>
        </div>
        {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center" role="alert">
                <p className="font-semibold">Analysis Failed</p>
                <p>{error}</p>
            </div>
        )}
    </div>
  );
};
