import React, { useState } from 'react';
import { useService } from '../ServiceContext';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Check } from 'lucide-react';

export default function ChecklistSetup() {
  const {
    trackSteps,
    setTrackSteps,
    stepErrors,
    goToNextStep,
    goToPreviousStep,
    currentStep
  } = useService();

  const [editingStep, setEditingStep] = useState(null);

  const addTrackStep = () => {
    const newOrder = trackSteps.length + 1;
    setTrackSteps((prev) => [
      ...prev,
      { title: '', order: newOrder, description: '' },
    ]);
  };

  const removeTrackStep = (index) => {
    const updated = trackSteps.filter((_, i) => i !== index);
    updated.forEach((step, i) => (step.order = i + 1));
    setTrackSteps(updated);
  };

  const updateTrackStep = (index, field, value) => {
    const updated = [...trackSteps];
    updated[index][field] = value;
    setTrackSteps(updated);
  };

  const moveTrackStep = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === trackSteps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : index;
    const updated = [...trackSteps];
    
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    updated.forEach((step, i) => {
      step.order = i + 1;
    });
    
    setTrackSteps(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Configure Checklist</h2>
          <p className="text-sm text-neutral-500">Define all steps required to complete the service process.</p>
        </div>
        <button
          onClick={addTrackStep}
          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm bg-white text-primary border border-primary hover:bg-primary-50 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Step
        </button>
      </div>

      {stepErrors.trackSteps && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
          {stepErrors.trackSteps}
        </div>
      )}

      <div className="space-y-4">
        {trackSteps.map((step, idx) => (
          <div
            key={idx}
            className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            {editingStep === idx ? (
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) =>
                      updateTrackStep(idx, 'title', e.target.value)
                    }
                    placeholder="Step title"
                    className={`w-full px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 ${
                      stepErrors[`step_${idx}_title`] 
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20' 
                        : 'border-neutral-300 focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  {stepErrors[`step_${idx}_title`] && (
                    <p className="mt-1 text-sm text-error-600">{stepErrors[`step_${idx}_title`]}</p>
                  )}
                </div>
                <div>
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      updateTrackStep(
                        idx,
                        'description',
                        e.target.value
                      )
                    }
                    placeholder="Step description"
                    className={`w-full px-4 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                      stepErrors[`step_${idx}_description`] 
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20' 
                        : 'border-neutral-300 focus:border-primary focus:ring-primary/20'
                    }`}
                    rows={2}
                  />
                  {stepErrors[`step_${idx}_description`] && (
                    <p className="mt-1 text-sm text-error-600">{stepErrors[`step_${idx}_description`]}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Validate before saving
                      if (!step.title || !step.description) {
                        return;
                      }
                      setEditingStep(null);
                    }}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm text-white hover:opacity-90 transition-opacity bg-primary shadow-sm"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingStep(null)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white font-semibold flex-shrink-0 bg-primary shadow-sm"
                >
                  {step.order}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                    {step.title || 'Untitled Step'}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    {step.description || 'No description'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveTrackStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveTrackStep(idx, 'down')}
                      disabled={idx === trackSteps.length - 1}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingStep(idx)}
                      className="p-2 text-info-600 hover:bg-info-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeTrackStep(idx)}
                      className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 rounded-lg font-medium bg-white text-neutral-700 border border-neutral-300 hover:border-primary hover:text-primary hover:bg-primary-50 transition-all"
        >
          Previous
        </button>
        <button
          onClick={goToNextStep}
          className="px-6 py-2 rounded-lg font-medium bg-primary text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}