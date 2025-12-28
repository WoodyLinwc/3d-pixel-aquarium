
import React from 'react';

interface UIOverlayProps {
  fishCount: number;
  onAddFish: () => void;
  onRemoveFish: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ fishCount, onAddFish, onRemoveFish }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between items-start pointer-events-none select-none">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">
          PIXEL TANK <span className="text-blue-400">3D</span>
        </h1>
        <p className="text-blue-200/60 font-medium text-sm">RELAX • OBSERVE • ZEN</p>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-4 pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
        <div className="flex flex-col items-center justify-center pr-4 border-r border-white/10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">In Tank</span>
          <span className="text-2xl font-mono text-white">{fishCount}</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onRemoveFish}
            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/20 active:scale-95 border border-white/10 rounded-xl transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
            </svg>
          </button>
          
          <button 
            onClick={onAddFish}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:scale-95 border border-blue-400/30 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
