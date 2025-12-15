import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalculationResult, RentDetails, AiAdvice, RiskLevel } from '../types';

interface ResultDashboardProps {
  result: CalculationResult | null;
  details: RentDetails | null;
  advice: AiAdvice | null;
  loadingAdvice: boolean;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ result, details, advice, loadingAdvice }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!result || !details) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[32px] shadow-card opacity-80 min-h-[500px]">
        <div className="w-24 h-24 bg-verve-bg rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-verve-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-verve-primary mb-2">Ready to Analyze</h3>
        <p className="text-gray-400 max-w-xs">Enter your property details and notice dates on the left to see your rent increase eligibility and actionable risk assessment.</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Current', amount: details.currentRent },
    { name: result.valuationUsed ? 'Valuation' : 'Index', amount: result.valuationUsed && details.valuationAmount ? details.valuationAmount : details.marketRent },
    { name: 'Allowed', amount: result.newMaxRent },
  ];

  const formatCurrency = (val: number) => `AED ${(val / 1000).toFixed(1)}k`;
  
  const getRiskColor = (level: RiskLevel) => {
    switch(level) {
        case 'Low': return 'bg-green-100 text-green-700 border-green-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'High': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleSection = (id: string) => {
      setExpandedSection(expandedSection === id ? null : id);
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      {/* --- Row 1: Primary Status Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Main Decision */}
        <div className={`p-6 rounded-[28px] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px] ${result.isEligible ? 'bg-verve-accent text-white' : 'bg-gray-100 text-verve-primary'}`}>
             {result.isEligible && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
             )}
          <div>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${result.isEligible ? 'text-white/80' : 'text-gray-500'}`}>Decision</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{result.isEligible ? 'Increase' : 'Hold'}</span>
                {result.isEligible && <span className="text-2xl font-medium opacity-80">+{result.increasePercentage}%</span>}
              </div>
          </div>
          <p className={`mt-3 text-sm font-medium ${result.isEligible ? 'text-white/90' : 'text-gray-500'}`}>
            {result.plainEnglishSummary}
          </p>
        </div>

        {/* Card 2: Financials */}
        <div className="bg-white p-6 rounded-[28px] shadow-card flex flex-col justify-between min-h-[160px]">
          <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">New Maximum Rent</h3>
              <div className="text-3xl font-bold text-verve-primary">
                <span className="text-lg align-top mr-1 text-gray-400 font-medium">AED</span>
                {result.newMaxRent.toLocaleString()}
              </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
             {result.isEligible ? (
                 <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg flex items-center w-fit">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    +{result.maxIncreaseAmount.toLocaleString()} AED / yr
                 </span>
             ) : (
                 <span className="text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-lg w-fit">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path></svg>
                    No change allowed
                 </span>
             )}
          </div>
        </div>
        
        {/* Card 3: Notice & Risk */}
        <div className="bg-white p-6 rounded-[28px] shadow-card flex flex-col justify-between min-h-[160px]">
            <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Notice & Risk</h3>
                <div className="flex flex-col gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold w-fit ${result.isNoticeValid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {result.isNoticeValid ? (
                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Valid Notice</>
                        ) : (
                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Invalid Notice</>
                        )}
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold w-fit ${getRiskColor(result.riskLevel)}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Risk: {result.riskLevel}
                    </div>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-tight">
                {result.noticeMessage}
            </p>
        </div>

      </div>
      
      {/* --- Warning Banner (Edge Cases) --- */}
      {result.edgeCaseWarning && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex gap-3 items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <div>
                <h4 className="text-sm font-bold text-yellow-800">Review Required</h4>
                <p className="text-sm text-yellow-700 leading-relaxed mt-1">{result.edgeCaseWarning}</p>
            </div>
        </div>
      )}

      {/* --- Row 2: Explanations & Advice --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Why & Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Why This Happened Section */}
            <div className="bg-white p-6 rounded-[28px] shadow-card">
                <h3 className="font-bold text-lg text-verve-primary mb-3">Why This Result?</h3>
                <p className="text-verve-primary/80 text-sm leading-relaxed mb-4">
                    {result.whyResult}
                </p>
                <div className="h-px bg-gray-100 my-4"></div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="uppercase font-bold tracking-wide">RDC Outcome Expectation</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-semibold text-gray-500">Non-binding</span>
                </div>
                <p className="text-gray-600 text-sm italic mt-2">
                    "{result.rdcExpectation}"
                </p>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-[28px] shadow-card flex flex-col min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-verve-primary">Comparison</h3>
                    <div className="flex gap-2">
                        <span className="flex items-center text-[10px] text-gray-400 uppercase font-bold"><span className="w-2 h-2 rounded-full bg-verve-blue mr-1"></span> Current</span>
                        <span className="flex items-center text-[10px] text-gray-400 uppercase font-bold"><span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span> {result.valuationUsed ? 'Valuation' : 'Index'}</span>
                        <span className="flex items-center text-[10px] text-gray-400 uppercase font-bold"><span className="w-2 h-2 rounded-full bg-verve-accent mr-1"></span> Limit</span>
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barSize={60}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={formatCurrency} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#A4C3D2' : index === 1 ? '#E5E7EB' : '#8EB69B'} />
                        ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Right Column: Recommended Steps (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
             <div className="bg-white p-6 rounded-[28px] shadow-card flex flex-col h-full">
                <h3 className="font-bold text-lg text-verve-primary mb-4 flex justify-between items-center">
                    Recommended Next Steps
                    {loadingAdvice && <span className="w-4 h-4 rounded-full border-2 border-verve-accent border-t-transparent animate-spin"></span>}
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {loadingAdvice ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : advice ? (
                        <div className="space-y-4">
                            {advice.nextSteps.map((step, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50/50 hover:bg-verve-bg/50 rounded-xl transition-colors cursor-default group">
                                    <div className="min-w-[24px] h-6 rounded-full bg-verve-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                                </div>
                            ))}
                            
                            <div className="mt-6 p-4 bg-verve-bg/50 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Market Insight</p>
                                <p className="text-sm text-gray-600 italic">"{advice.marketContext}"</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Analysis pending...</p>
                    )}
                </div>
            </div>
        </div>

      </div>
      
      <div className="mt-4 text-center">
        <p className="text-[10px] text-gray-400 max-w-2xl mx-auto">
            Disclaimer: This tool provides guidance based on publicly available RERA rules (Decree No. 43 of 2013) and common practices. It does not constitute legal advice. Final decisions rest with the Dubai Land Department and the Rent Dispute Center (RDC).
        </p>
      </div>
    </div>
  );
};

export default ResultDashboard;