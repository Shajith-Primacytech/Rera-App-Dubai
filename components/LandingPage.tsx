import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden font-sans flex flex-col justify-between">
      {/* Background Image - High Quality Burj Khalifa 4K (Bridge & Water View) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=3000&auto=format&fit=crop')",
        }}
      >
      </div>

      {/* Gradient Overlay for text readability - Stronger at bottom for CTA */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80 pointer-events-none"></div>

      {/* Navbar Overlay */}
      <header className="w-full p-6 md:p-8 flex justify-between items-center z-20 shrink-0">
        <div className="flex items-center gap-2 text-white drop-shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8H7v8"/><line x1="17" y1="9" x2="17" y2="9"/></svg>
            <span className="text-lg font-bold tracking-widest uppercase">ReraSmart</span>
        </div>
        <button className="text-white hover:opacity-80 transition-opacity drop-shadow-md">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </header>

      {/* Hero Text - Centered but pushed up slightly */}
      <main className="flex-1 flex flex-col justify-center px-6 md:px-8 z-10 pb-4">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.85] tracking-tighter drop-shadow-2xl mb-8">
            SMART<br/>
            DECISIONS
          </h1>
          
          {/* New Purpose Section - Glassmorphism Card */}
          <div className="max-w-xl backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex items-start gap-4">
               <div className="p-2 bg-verve-accent/20 rounded-lg shrink-0">
                  <svg className="w-6 h-6 text-verve-accentLight" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
               </div>
               <div>
                  <h2 className="text-verve-accentLight font-bold text-sm md:text-base uppercase tracking-widest mb-2">
                    Dubai Landlord Assistant
                  </h2>
                  <p className="text-white text-base md:text-lg leading-relaxed font-medium opacity-95 text-shadow-sm">
                    Instantly calculate RERA-compliant rent increases, validate your 90-day notice periods, and unlock AI-powered strategies for your property renewals.
                  </p>
               </div>
            </div>
          </div>
      </main>

      {/* Bottom Content / CTA */}
      <div className="w-full p-6 md:p-8 z-20 pb-10 md:pb-16 shrink-0">
        <div className="max-w-md mx-auto md:mx-0">
             {/* CTA Button */}
             <button 
                onClick={onStart}
                className="w-full bg-white rounded-full py-4 px-2 pl-8 pr-2 flex justify-between items-center group transition-all hover:bg-gray-100 active:scale-[0.98] shadow-2xl"
             >
                <span className="text-verve-primary font-bold text-lg">Start Analysis</span>
                <div className="w-14 h-14 rounded-full bg-verve-dark flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </div>
             </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;