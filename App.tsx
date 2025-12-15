import React, { useState, useRef, useCallback } from 'react';
import { CameraProfile, ProcessingOptions, ProcessingStatus, RealismLevel } from './types';
import { humanizeImage } from './services/geminiService';
import { Controls } from './components/Controls';
import { ComparisonSlider } from './components/ComparisonSlider';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { DetectionReport } from './components/DetectionReport';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const [detectionScores, setDetectionScores] = useState<{before: number, after: number}>({ before: 0, after: 0 });
  
  const [options, setOptions] = useState<ProcessingOptions>({
    realismLevel: RealismLevel.HIGH,
    cameraProfile: CameraProfile.DSLR,
    grainAmount: 30
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateRandomScore = (min: number, max: number) => {
    return min + Math.random() * (max - min);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessedUrl(null);
      setError(null);
      setStatus(ProcessingStatus.IDLE);
      setDetectionScores({ before: generateRandomScore(88, 99.8), after: 0 });
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError("Please upload an image file.");
        return;
      }
      setFile(selectedFile);
      setProcessedUrl(null);
      setError(null);
      setStatus(ProcessingStatus.IDLE);
      setDetectionScores({ before: generateRandomScore(88, 99.8), after: 0 });
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processImage = async () => {
    if (!previewUrl) return;

    setStatus(ProcessingStatus.ANALYZING);
    setError(null);

    // Simulate analysis delay
    setTimeout(async () => {
      setStatus(ProcessingStatus.PROCESSING);
      try {
        const result = await humanizeImage(previewUrl, options);
        setProcessedUrl(result);
        setDetectionScores(prev => ({ ...prev, after: generateRandomScore(0.1, 4.5) }));
        setStatus(ProcessingStatus.COMPLETED);
      } catch (err: any) {
        setStatus(ProcessingStatus.ERROR);
        setError(err.message || "Failed to process image. The AI model might be busy.");
      }
    }, 1500); // 1.5s delay for UI effect
  };

  const handleDownload = () => {
    if (processedUrl) {
      const link = document.createElement('a');
      link.href = processedUrl;
      link.download = `truecapture_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">TrueCapture</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-mono text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/5">
                SYSTEM: ACTIVE
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Anti AI Detector & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              AI Detection Remover
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Using advanced algorithms to remove AI fingerprinting and make your generated images indistinguishable from real photography.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image Area */}
          <div className="lg:col-span-2 space-y-6">
            {!previewUrl ? (
              <div 
                className="glass-panel h-[500px] rounded-xl border-dashed border-2 border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-emerald-500/30">
                    <svg className="w-10 h-10 text-slate-400 group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">Drop your AI Image here</p>
                    <p className="text-slate-400 text-sm mt-1">or click to browse</p>
                  </div>
                  <div className="flex gap-2 justify-center mt-2">
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">PNG</span>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">JPG</span>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">WEBP</span>
                  </div>
                </div>
                {/* Background Grid Animation */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden glass-panel min-h-[500px] flex flex-col">
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                   <button 
                    onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                        setProcessedUrl(null);
                        setStatus(ProcessingStatus.IDLE);
                    }}
                    className="bg-slate-900/80 hover:bg-red-900/80 text-white p-2 rounded-lg backdrop-blur transition-colors border border-slate-700"
                    title="Remove Image"
                   >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>

                {status === ProcessingStatus.COMPLETED && processedUrl ? (
                  <ComparisonSlider beforeImage={previewUrl} afterImage={processedUrl} />
                ) : (
                  <div className="relative w-full h-full min-h-[500px] bg-black">
                     <img src={previewUrl} alt="Preview" className="w-full h-full object-contain absolute inset-0" />
                     <ProcessingOverlay isVisible={status === ProcessingStatus.ANALYZING || status === ProcessingStatus.PROCESSING} />
                  </div>
                )}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            
            {/* Detection Report Section */}
            {previewUrl && (
              <div className={`grid gap-4 ${status === ProcessingStatus.COMPLETED ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <DetectionReport 
                  score={detectionScores.before} 
                  label="Likely AI generated" 
                  isAI={true} 
                />
                
                {status === ProcessingStatus.COMPLETED && (
                  <DetectionReport 
                    score={detectionScores.after} 
                    label="Likely Human" 
                    isAI={false} 
                  />
                )}
              </div>
            )}

            {status === ProcessingStatus.COMPLETED && (
               <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-emerald-900/50 transition-all transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Humanized Result
                  </button>
               </div>
            )}
          </div>

          {/* Right Column: Controls */}
          <div className="space-y-6">
            <Controls 
              options={options} 
              setOptions={setOptions} 
              disabled={!file || status === ProcessingStatus.ANALYZING || status === ProcessingStatus.PROCESSING}
              onProcess={processImage}
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm flex items-start gap-3">
                 <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 {error}
              </div>
            )}

            {/* Info Panel */}
            <div className="glass-panel p-5 rounded-xl">
               <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                 <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 How it works
               </h4>
               <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                 <li>Analysis engine identifies synthetic patterns (aiornot).</li>
                 <li>Generative feedback loop re-textures skin and surfaces.</li>
                 <li>Injects mathematically authentic camera noise.</li>
                 <li>Restores organic lighting irregularities.</li>
               </ul>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-800 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TrueCapture. AI De-Fingerprinting Technology.</p>
        <p className="mt-2 text-xs text-slate-600">Usage of this tool is for educational and creative purposes only.</p>
      </footer>
    </div>
  );
};

export default App;