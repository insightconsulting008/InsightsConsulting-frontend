import React from 'react';
import { useService } from './ServiceContext';

export default function NavigationButtons() {
  const { currentStep, setCurrentStep } = useService();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
      <button
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          currentStep === 1
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-white text-neutral-700 border border-neutral-300 hover:border-primary hover:text-primary hover:bg-primary-50'
        }`}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={currentStep === 5}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          currentStep === 5
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/30'
        }`}
      >
        Next
      </button>
    </div>
  );
}