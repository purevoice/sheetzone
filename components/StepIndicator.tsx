
import React from 'react';

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

const Step: React.FC<{ step: number; label: string; isActive: boolean }> = ({ step, label, isActive }) => {
  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors
        ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
        {step}
      </div>
      <span className={`ml-3 font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center space-x-4">
      <Step step={1} label="Upload Data" isActive={currentStep === 1} />
      <div className="flex-grow h-1 bg-gray-700 rounded-full w-24">
        <div 
          className="h-1 bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: currentStep === 2 ? '100%' : '0%' }}
        ></div>
      </div>
      <Step step={2} label="Analyze in Sheet" isActive={currentStep === 2} />
    </div>
  );
};
