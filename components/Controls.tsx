import React from 'react';
import { CameraProfile, ProcessingOptions, RealismLevel } from '../types';

interface ControlsProps {
  options: ProcessingOptions;
  setOptions: React.Dispatch<React.SetStateAction<ProcessingOptions>>;
  disabled: boolean;
  onProcess: () => void;
}

const PRESETS = [
  {
    id: 'fast',
    label: 'Fast',
    description: 'Web / Social',
    settings: {
      realismLevel: RealismLevel.STANDARD,
      cameraProfile: CameraProfile.PHONE,
      grainAmount: 10
    }
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Realistic DSLR',
    settings: {
      realismLevel: RealismLevel.HIGH,
      cameraProfile: CameraProfile.DSLR,
      grainAmount: 30
    }
  },
  {
    id: 'max',
    label: 'Max Quality',
    description: 'Cinematic Film',
    settings: {
      realismLevel: RealismLevel.ULTRA,
      cameraProfile: CameraProfile.FILM,
      grainAmount: 50
    }
  }
];

export const Controls: React.FC<ControlsProps> = ({ options, setOptions, disabled, onProcess }) => {
  
  const isPresetActive = (presetSettings: typeof PRESETS[0]['settings']) => {
    return (
      options.realismLevel === presetSettings.realismLevel &&
      options.cameraProfile === presetSettings.cameraProfile &&
      options.grainAmount === presetSettings.grainAmount
    );
  };

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Configuration Engine
        </h3>
        <p className="text-sm text-slate-400">Customize the de-fingerprinting parameters.</p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Presets</label>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((preset) => {
            const active = isPresetActive(preset.settings);
            return (
              <button
                key={preset.id}
                onClick={() => setOptions({ ...options, ...preset.settings })}
                disabled={disabled}
                className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 ${
                  active
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                <span className={`font-semibold text-sm ${active ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {preset.label}
                </span>
                <span className="text-[10px] opacity-70 mt-0.5">{preset.description}</span>
                {active && (
                   <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-800 my-2"></div>

      {/* Realism Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">De-noising Intensity</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(RealismLevel).map((level) => (
            <button
              key={level}
              onClick={() => setOptions({ ...options, realismLevel: level })}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                options.realismLevel === level
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
              disabled={disabled}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Profile */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Target Camera Profile</label>
        <select
          value={options.cameraProfile}
          onChange={(e) => setOptions({ ...options, cameraProfile: e.target.value as CameraProfile })}
          className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          disabled={disabled}
        >
          {Object.values(CameraProfile).map((profile) => (
            <option key={profile} value={profile}>
              {profile}
            </option>
          ))}
        </select>
      </div>

      {/* Grain Amount Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-300">Synthetic Noise Injection</label>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
            {options.grainAmount}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={options.grainAmount}
          onChange={(e) => setOptions({ ...options, grainAmount: Number(e.target.value) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          disabled={disabled}
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Clean</span>
          <span>Heavy Grain</span>
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={disabled}
        className={`w-full py-3.5 rounded-lg text-white font-semibold tracking-wide transition-all duration-300 relative overflow-hidden group ${
          disabled
            ? 'bg-slate-700 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30'
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {disabled ? 'Processing...' : 'Run Humanizer Algorithm'}
          {!disabled && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
};