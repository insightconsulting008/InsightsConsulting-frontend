import React from 'react';
import { ServiceProvider, useService } from './ServiceContext';
import StepIndicator from './StepIndicator';
import ServiceInfo from './steps/ServiceInfo';
import PricingSetup from './steps/PricingSetup';
import DatasetSetup from './steps/DatasetSetup';
import ChecklistSetup from './steps/ChecklistSetup';
import ReviewPublish from './steps/ReviewPublish';

function AddServiceContent() {
  const { currentStep } = useService();

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <ServiceInfo />;
      case 2: return <PricingSetup />;
      case 3: return <DatasetSetup />;
      case 4: return <ChecklistSetup />;
      case 5: return <ReviewPublish />;
      default: return <ServiceInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Service Onboarding
              </h1>
              <p className="text-neutral-500 mt-2">
                Create a new service, define inputs, and configure process steps.
              </p>
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary-50 border border-primary-200 px-3 py-1.5 rounded-lg">
              {currentStep}/5 Steps
            </span>
          </div>
        </div>

        {/* Main content layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Step Indicator */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Setup Steps
              </h2>
              <StepIndicator />
            </div>
          </div>

          {/* Right Side - Step Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
              {/* Progress bar at top of content */}
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700">
                    Step {currentStep} of 5
                  </span>
                  <span className="text-sm text-neutral-500">
                    {Math.round((currentStep / 5) * 100)}% complete
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddService() {
  return (
    <ServiceProvider>
      <AddServiceContent />
    </ServiceProvider>
  );
}