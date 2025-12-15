import React, { useEffect, useState } from 'react';
import { ProcessingStep } from '../types';

interface ProcessingOverlayProps {
  isVisible: boolean;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isVisible }) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: '1', label: 'Analyzing AI metadata patterns...', completed: false },
    { id: '2', label: 'Removing synthetic smoothness...', completed: false },
    { id: '3', label: 'Injecting natural optical imperfections...', completed: false },
    { id: '4', label: 'Simulating sensor noise and grain...', completed: false },
    { id: '5', label: 'Finalizing organic texture reconstruction...', completed: false },
  ]);

  useEffect(() => {
    if (isVisible) {
      // Reset steps
      setSteps(s => s.map(step => ({ ...step, completed: false })));

      const timeouts: ReturnType<typeof setTimeout>[] = [];
      
      steps.forEach((_, index) => {
        const timeout = setTimeout(() => {
          setSteps(currentSteps => 
            currentSteps.map((s, i) => i === index ? { ...s, completed: true } : s)
          );
        }, 1000 * (index + 0.5));
        timeouts.push(timeout);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
           <div className="inline-block relative w-16 h-16 mb-4">
             <div className="absolute inset-0 border-4 border-slate-600 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
             <svg className="absolute inset-0 m-auto w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
           </div>
           <h3 className="text-xl font-bold text-white tracking-tight">Processing Image</h3>
        </div>
        
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                step.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 bg-slate-800'
              }`}>
                {step.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                step.completed ? 'text-emerald-300 font-medium' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};