import React, { useState } from 'react';
import { UnitType, RentDetails } from '../types';
import { estimateMarketRent } from '../services/geminiService';

interface InputCardProps {
  onCalculate: (data: RentDetails) => void;
}

const InputCard: React.FC<InputCardProps> = ({ onCalculate }) => {
  const [currentRent, setCurrentRent] = useState<string>('');
  const [marketRent, setMarketRent] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [unitType, setUnitType] = useState<UnitType>(UnitType.APARTMENT);
  const [bedrooms, setBedrooms] = useState<string>('1 Bedroom');
  const [estimating, setEstimating] = useState(false);
  
  // New State Fields
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [noticeDate, setNoticeDate] = useState<string>('');
  const [hasValuation, setHasValuation] = useState(false);
  const [valuationAmount, setValuationAmount] = useState<string>('');
  const [tenantFlipFlop, setTenantFlipFlop] = useState(false);

  const handleCalculate = () => {
    onCalculate({
      currentRent: Number(currentRent),
      marketRent: Number(marketRent),
      area,
      unitType,
      bedrooms,
      expiryDate,
      noticeDate,
      hasValuation,
      valuationAmount: hasValuation ? Number(valuationAmount) : undefined,
      tenantFlipFlop
    });
  };

  const handleAiEstimate = async () => {
    if (!area) return;
    setEstimating(true);
    const estimated = await estimateMarketRent(area, unitType, bedrooms);
    if (estimated) {
      setMarketRent(estimated.toString());
    }
    setEstimating(false);
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-card flex flex-col h-full relative overflow-y-auto custom-scrollbar">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-verve-accent/10 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-verve-primary">Property & Lease</h2>
        <p className="text-gray-400 text-sm mt-1">Enter details for RERA validation</p>
      </div>

      <div className="space-y-5 flex-1">
        {/* Area Input */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Community / Area</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Dubai Marina"
            className="w-full bg-verve-bg border-none rounded-2xl px-4 py-3 text-verve-primary font-medium focus:ring-2 focus:ring-verve-accent/50 transition-all placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Type</label>
            <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value as UnitType)}
                className="w-full bg-verve-bg border-none rounded-2xl px-4 py-3 text-verve-primary font-medium focus:ring-2 focus:ring-verve-accent/50 transition-all appearance-none cursor-pointer"
            >
                <option value={UnitType.APARTMENT}>Apartment</option>
                <option value={UnitType.VILLA}>Villa</option>
            </select>
            </div>
             <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Beds</label>
            <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-verve-bg border-none rounded-2xl px-4 py-3 text-verve-primary font-medium focus:ring-2 focus:ring-verve-accent/50 transition-all appearance-none cursor-pointer"
            >
                <option value="Studio">Studio</option>
                <option value="1 Bedroom">1 Bed</option>
                <option value="2 Bedrooms">2 Beds</option>
                <option value="3 Bedrooms">3 Beds</option>
                <option value="4+ Bedrooms">4+ Beds</option>
            </select>
            </div>
        </div>

        {/* Current Rent */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Current Annual Rent (AED)</label>
          <input
            type="number"
            value={currentRent}
            onChange={(e) => setCurrentRent(e.target.value)}
            placeholder="e.g. 80000"
            className="w-full bg-verve-bg border-none rounded-2xl px-4 py-3 text-verve-primary font-bold text-lg focus:ring-2 focus:ring-verve-accent/50 transition-all placeholder-gray-400"
          />
        </div>

        {/* Dates Section */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
           <p className="text-xs font-bold text-verve-primary mb-3 flex items-center gap-1">
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             90-Day Notice Check
           </p>
           <div className="space-y-3">
             <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Contract Expiry</label>
                <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-verve-primary focus:outline-none focus:border-verve-accent"
                />
             </div>
             <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Date Notice Sent</label>
                <input
                    type="date"
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-verve-primary focus:outline-none focus:border-verve-accent"
                />
             </div>
           </div>
        </div>

        {/* Market Rent & Valuation */}
        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {hasValuation ? 'Valuation Amount (AED)' : 'RERA Market Index (AED)'}
            </label>
            {!hasValuation && (
                <button 
                    onClick={handleAiEstimate}
                    disabled={!area || estimating}
                    className="text-[10px] font-bold text-verve-accent hover:text-verve-primary transition-colors disabled:opacity-50 uppercase tracking-wider flex items-center gap-1"
                >
                    {estimating ? 'Thinking...' : '✨ AI Estimate'}
                </button>
            )}
          </div>
          
          <input
            type="number"
            value={hasValuation ? valuationAmount : marketRent}
            onChange={(e) => hasValuation ? setValuationAmount(e.target.value) : setMarketRent(e.target.value)}
            placeholder="0"
            className="w-full bg-verve-bg border-none rounded-2xl px-4 py-3 text-verve-primary font-bold text-lg focus:ring-2 focus:ring-verve-accent/50 transition-all placeholder-gray-400"
          />
          
          <div className="mt-3 flex items-center gap-2">
            <input 
                type="checkbox" 
                id="valuation" 
                checked={hasValuation} 
                onChange={(e) => setHasValuation(e.target.checked)}
                className="w-4 h-4 text-verve-accent rounded border-gray-300 focus:ring-verve-accent"
            />
            <label htmlFor="valuation" className="text-xs text-gray-600 select-none cursor-pointer">I have a valuation certificate</label>
          </div>
        </div>
        
        {/* Tenant Flip Flop */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
             <input 
                type="checkbox" 
                id="flipflop" 
                checked={tenantFlipFlop} 
                onChange={(e) => setTenantFlipFlop(e.target.checked)}
                className="w-4 h-4 text-verve-accent rounded border-gray-300 focus:ring-verve-accent"
            />
            <label htmlFor="flipflop" className="text-xs text-gray-600 select-none cursor-pointer leading-tight">
                Tenant declined initially but now requests renewal?
            </label>
        </div>

      </div>

      <div className="mt-8">
        <button
          onClick={handleCalculate}
          disabled={!currentRent || (!marketRent && !valuationAmount)}
          className="w-full bg-verve-primary text-white font-semibold py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-verve-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            <span>Analyze Rent</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default InputCard;