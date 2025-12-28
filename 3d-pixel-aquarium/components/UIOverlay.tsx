import React from "react";

interface UIOverlayProps {
  fishCount: number;
  onAddFish: () => void;
  onRemoveFish: () => void;
  onRefresh: () => void;
  seaweedCount: number;
  onAddSeaweed: () => void;
  onRemoveSeaweed: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  fishCount,
  onAddFish,
  onRemoveFish,
  onRefresh,
  seaweedCount,
  onAddSeaweed,
  onRemoveSeaweed,
}) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between items-start pointer-events-none select-none">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">
          PIXEL TANK <span className="text-blue-400">3D</span>
        </h1>
        <p className="text-blue-200/60 font-medium text-sm">
          RELAX • OBSERVE • ZEN
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col gap-3 pointer-events-auto">
        {/* Fish Controls */}
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <div className="flex flex-col items-center justify-center pr-4 border-r border-white/10">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              Fish
            </span>
            <span className="text-2xl font-mono text-white">{fishCount}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onRemoveFish}
              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/20 active:scale-95 border border-white/10 rounded-xl transition-all duration-200 group"
              title="Remove Fish"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M20 12H4"
                />
              </svg>
            </button>

            <button
              onClick={onAddFish}
              className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:scale-95 border border-blue-400/30 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-200 group"
              title="Add Fish"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            <button
              onClick={onRefresh}
              className="w-12 h-12 flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 active:scale-95 border border-cyan-400/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 group"
              title="Refresh Fish"
            >
              <svg
                className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Seaweed Controls */}
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <div className="flex flex-col items-center justify-center pr-4 border-r border-white/10">
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
              Seaweed
            </span>
            <span className="text-2xl font-mono text-white">
              {seaweedCount}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onRemoveSeaweed}
              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/20 active:scale-95 border border-white/10 rounded-xl transition-all duration-200 group"
              title="Remove Seaweed"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M20 12H4"
                />
              </svg>
            </button>

            <button
              onClick={onAddSeaweed}
              className="w-12 h-12 flex items-center justify-center bg-green-600 hover:bg-green-500 active:scale-95 border border-green-400/30 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-200 group"
              title="Add Seaweed"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
