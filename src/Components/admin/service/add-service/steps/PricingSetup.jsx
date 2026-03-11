import React, { useEffect } from 'react';
import { useService } from '../ServiceContext';
import { Percent } from 'lucide-react';

export default function PricingSetup() {
  const {
    basicInfo,
    setBasicInfo,
    priceMode,
    setPriceMode,
    discountPercentage,
    setDiscountPercentage,
    stepErrors,
    goToNextStep,
    goToPreviousStep,
    currentStep
  } = useService();

  const calculateDiscountPercentage = () => {
    const individualPrice = parseFloat(basicInfo.individualPrice);
    const offerPrice = parseFloat(basicInfo.offerPrice);
    if (!isNaN(individualPrice) && !isNaN(offerPrice) && individualPrice > 0) {
      const discount = ((individualPrice - offerPrice) / individualPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const calculateOfferPriceFromPercentage = () => {
    const individualPrice = parseFloat(basicInfo.individualPrice);
    const discount = parseFloat(discountPercentage);
    if (!isNaN(individualPrice) && !isNaN(discount) && discount >= 0 && discount <= 100) {
      const offerPrice = individualPrice - (individualPrice * discount) / 100;
      return Math.round(offerPrice);
    }
    return 0;
  };

  const handlePriceModeChange = (mode) => {
    setPriceMode(mode);
    if (mode === 'fixed') {
      setDiscountPercentage('');
      if (priceMode === 'percentage') {
        setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
      }
    } else {
      setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
    }
  };

  const calculateFinalPriceWithGST = () => {
    let priceToCalculate = 0;
    
    if (priceMode === 'fixed') {
      priceToCalculate = parseFloat(basicInfo.offerPrice);
    } else {
      priceToCalculate = calculateOfferPriceFromPercentage();
    }
    
    if (isNaN(priceToCalculate) || priceToCalculate <= 0) {
      priceToCalculate = parseFloat(basicInfo.individualPrice);
    }
    
    const gstPercentage = parseFloat(basicInfo.gstPercentage);
    
    if (!isNaN(priceToCalculate) && priceToCalculate > 0 && 
        !isNaN(gstPercentage) && gstPercentage >= 0) {
      const gstAmount = (priceToCalculate * gstPercentage) / 100;
      return Math.round(priceToCalculate + gstAmount);
    }
    
    return 0;
  };

  const handleDiscountPercentageChange = (value) => {
    setDiscountPercentage(value);
    if (value && !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 100) {
      const calculatedOfferPrice = calculateOfferPriceFromPercentage();
      setBasicInfo(prev => ({ 
        ...prev, 
        offerPrice: calculatedOfferPrice.toString() 
      }));
    } else {
      setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
    }
  };

  useEffect(() => {
  const handleWheel = (e) => {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  };

  window.addEventListener("wheel", handleWheel);
  return () => window.removeEventListener("wheel", handleWheel);
}, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Pricing Setup</h2>
        <p className="text-sm text-neutral-500">Set your pricing strategy for this service.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-800">
            Pricing Mode
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePriceModeChange('fixed')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                priceMode === 'fixed'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Fixed Price
            </button>
            <button
              onClick={() => handlePriceModeChange('percentage')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                priceMode === 'percentage'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Discount %
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-800">
              Actual Price <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                min="1"
                value={basicInfo.individualPrice}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    individualPrice: e.target.value,
                  }))
                }
                placeholder="1099"
                className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  stepErrors.individualPrice 
                    ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20' 
                    : 'border-neutral-300 focus:border-primary focus:ring-primary/20'
                }`}
              />
            </div>
            {stepErrors.individualPrice && (
              <p className="mt-1 text-sm text-error-600">{stepErrors.individualPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-800">
              {priceMode === 'percentage' ? 'Discount Percentage' : 'Offer Price'}
              <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              {priceMode === 'percentage' ? (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                    <Percent className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                    placeholder="35"
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      stepErrors.discountPercentage 
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20' 
                        : 'border-neutral-300 focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                </>
              ) : (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={basicInfo.offerPrice}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        offerPrice: e.target.value,
                      }))
                    }
                    placeholder="700"
                    className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      stepErrors.offerPrice 
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20' 
                        : 'border-neutral-300 focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                </>
              )}
            </div>
            
            {priceMode === 'fixed' && basicInfo.individualPrice && basicInfo.offerPrice && (
              <div className="mt-1">
                <span className="text-xs text-neutral-500">
                  Discount: {calculateDiscountPercentage()}%
                </span>
              </div>
            )}
            
            {priceMode === 'percentage' && discountPercentage && basicInfo.individualPrice && (
              <div className="mt-1">
                <span className="text-xs text-neutral-500">
                  Offer Price: ₹{calculateOfferPriceFromPercentage()}
                </span>
              </div>
            )}
            
            {stepErrors.discountPercentage && (
              <p className="mt-1 text-sm text-error-600">{stepErrors.discountPercentage}</p>
            )}
            {stepErrors.offerPrice && (
              <p className="mt-1 text-sm text-error-600">{stepErrors.offerPrice}</p>
            )}
          </div>
        </div>

        {/* GST Section */}
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={basicInfo.isGstApplicable}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  isGstApplicable: e.target.checked,
                }))
              }
              className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary/20 focus:ring-2"
            />
            <span className="ml-2 text-sm font-medium text-neutral-800">
              GST Applicable
            </span>
          </div>
          
          {basicInfo.isGstApplicable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-800">
                  GST Percentage <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={basicInfo.gstPercentage}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        gstPercentage: e.target.value,
                      }))
                    }
                    placeholder="18"
                    className={`w-full pl-3 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      stepErrors.gstPercentage 
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-500/20' 
                        : 'border-neutral-300 focus:border-primary focus:ring-primary/20'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                    %
                  </span>
                </div>
                {stepErrors.gstPercentage && (
                  <p className="mt-1 text-sm text-error-600">{stepErrors.gstPercentage}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-800">
                  Final Price (Incl. GST)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={calculateFinalPriceWithGST()}
                    readOnly
                    className="w-full pl-7 pr-3 py-2 border border-neutral-300 bg-neutral-50 rounded-lg text-sm text-neutral-900"
                  />
                </div>
                <div className="mt-1">
                  <span className="text-xs text-neutral-500">
                    {priceMode === 'fixed' ? 'Offer Price + GST' : 'Discounted Price + GST'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
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