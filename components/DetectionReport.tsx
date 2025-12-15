import React from 'react';

interface DetectionReportProps {
  score: number;
  label: string;
  isAI: boolean;
  className?: string;
}

export const DetectionReport: React.FC<DetectionReportProps> = ({ score, label, isAI, className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-500 ${
      isAI 
        ? 'bg-red-500/10 border-red-500/20 shadow-lg shadow-red-500/10' 
        : 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/10'
    } ${className}`}>
      {/* Background Pulse Animation for High AI */}
      {isAI && (
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-red-500/20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
      )}
      {!isAI && (
         <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
      )}
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-3">
          <div>
             <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
               {isAI ? (
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               )}
               {isAI ? 'Detection Alert' : 'Verification Pass'}
             </h4>
             <div className={`text-lg font-bold flex items-center gap-2 ${isAI ? 'text-red-400' : 'text-emerald-400'}`}>
               {isAI ? (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               )}
               {label}
             </div>
          </div>
          <div className="text-right">
             <div className="text-2xl font-black text-white tracking-tight">
               {score.toFixed(1)}%
             </div>
             <div className="text-xs text-slate-500 font-medium">AI Probability</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500 font-medium px-0.5">
            <span>Human</span>
            <span>AI</span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-slate-700/50">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isAI ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
              style={{ width: `${score}%` }}
            >
               <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};