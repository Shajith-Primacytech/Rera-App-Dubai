import React, { useState } from 'react';
import InputCard from './components/InputCard';
import ResultDashboard from './components/ResultDashboard';
import LandingPage from './components/LandingPage';
import { calculateRentIncrease } from './services/reraService';
import { getAiAdvice } from './services/geminiService';
import { CalculationResult, RentDetails, AiAdvice } from './types';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [rentDetails, setRentDetails] = useState<RentDetails | null>(null);
  const [advice, setAdvice] = useState<AiAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleCalculation = async (data: RentDetails) => {
    setRentDetails(data);
    const calcResult = calculateRentIncrease(data);
    setResult(calcResult);
    
    // Reset advice while fetching new one
    setAdvice(null);
    setLoadingAdvice(true);

    const aiAdvice = await getAiAdvice(data, calcResult);

    setAdvice(aiAdvice);
    setLoadingAdvice(false);
  };

  if (!showDashboard) {
    return <LandingPage onStart={() => setShowDashboard(true)} />;
  }

  return (
    <div className="min-h-screen bg-verve-bg p-4 md:p-8 font-sans text-verve-primary selection:bg-verve-accent selection:text-white animate-in fade-in duration-500">
      {/* Navbar / Header */}
      <nav className="max-w-[1400px] mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDashboard(false)}>
            <div className="w-8 h-8 bg-verve-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-verve-primary/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8H7v8"/><line x1="17" y1="9" x2="17" y2="9"/></svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-verve-primary">ReraSmart</span>
        </div>
        
        <div className="hidden md:flex bg-white px-1 p-1 rounded-full shadow-sm items-center border border-gray-100">
            <button className="px-6 py-2 rounded-full bg-verve-bg text-verve-primary font-semibold text-sm">Dashboard</button>
            <a href="https://dubailand.gov.ae/en/eservices/rental-index" target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full text-gray-500 hover:text-verve-primary font-medium text-sm transition-colors">Official RERA</a>
            <button className="px-6 py-2 rounded-full text-gray-500 hover:text-verve-primary font-medium text-sm transition-colors">Support</button>
        </div>

        <div className="flex items-center gap-4">
             {/* Profile removed as requested */}
             <button 
                onClick={() => setShowDashboard(false)} 
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100 text-gray-600"
                title="Back to Home"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
             </button>
        </div>
      </nav>

      {/* Main Content Grid */}
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Col: Input Form */}
        <div className="md:col-span-5 lg:col-span-4 xl:col-span-3 h-full">
          <InputCard onCalculate={handleCalculation} />
        </div>

        {/* Right Col: Dashboard */}
        <div className="md:col-span-7 lg:col-span-8 xl:col-span-9 h-full">
           <ResultDashboard 
             result={result} 
             details={rentDetails} 
             advice={advice}
             loadingAdvice={loadingAdvice}
           />
        </div>

      </main>
    </div>
  );
}

export default App;