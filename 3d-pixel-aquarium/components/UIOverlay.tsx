import React from "react";
import type { Environment } from "../constants";

interface UIOverlayProps {
  fishCount: number;
  onAddFish: () => void;
  onRemoveFish: () => void;
  onRefresh: () => void;
  seaweedCount: number;
  onAddSeaweed: () => void;
  onRemoveSeaweed: () => void;
  environment: Environment;
  onEnvironmentChange: (env: Environment) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  fishCount,
  onAddFish,
  onRemoveFish,
  onRefresh,
  seaweedCount,
  onAddSeaweed,
  onRemoveSeaweed,
  environment,
  onEnvironmentChange,
}) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between items-start pointer-events-none select-none">
      <div className="flex flex-col gap-2">
        <h1
          className="text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] pixelated"
          style={{ fontFamily: "monospace", imageRendering: "pixelated" }}
        >
          PIXEL TANK 3D
        </h1>
        <p
          className="text-cyan-300 font-bold text-xs tracking-widest"
          style={{ fontFamily: "monospace" }}
        >
          ▸ RELAX ▸ OBSERVE ▸ ZEN
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col gap-2 pointer-events-auto">
        {/* Environment Selector */}
        <div
          className="bg-slate-800 border-4 border-slate-600 p-3"
          style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          <div className="flex flex-col gap-2">
            <span
              className="text-[10px] font-black text-yellow-400 tracking-widest text-center"
              style={{ fontFamily: "monospace" }}
            >
              ENVIRONMENT
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onEnvironmentChange("ocean")}
                className={`h-10 border-4 ${
                  environment === "ocean"
                    ? "bg-blue-600 border-blue-400"
                    : "bg-slate-700 border-slate-500"
                } hover:brightness-110 active:translate-y-1 transition-all font-black text-xs text-white`}
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
              >
                OCEAN
              </button>
              <button
                onClick={() => onEnvironmentChange("river")}
                className={`h-10 border-4 ${
                  environment === "river"
                    ? "bg-teal-600 border-teal-400"
                    : "bg-slate-700 border-slate-500"
                } hover:brightness-110 active:translate-y-1 transition-all font-black text-xs text-white`}
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
              >
                RIVER
              </button>
              <button
                onClick={() => onEnvironmentChange("pond")}
                className={`h-10 border-4 ${
                  environment === "pond"
                    ? "bg-emerald-600 border-emerald-400"
                    : "bg-slate-700 border-slate-500"
                } hover:brightness-110 active:translate-y-1 transition-all font-black text-xs text-white`}
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
              >
                POND
              </button>
              <button
                onClick={() => onEnvironmentChange("all")}
                className={`h-10 border-4 ${
                  environment === "all"
                    ? "bg-purple-600 border-purple-400"
                    : "bg-slate-700 border-slate-500"
                } hover:brightness-110 active:translate-y-1 transition-all font-black text-xs text-white`}
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
              >
                ALL
              </button>
            </div>
          </div>
        </div>

        {/* Fish Controls */}
        <div
          className="bg-slate-800 border-4 border-slate-600 p-3"
          style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center pr-3 border-r-4 border-slate-600">
              <span
                className="text-[10px] font-black text-cyan-400 tracking-widest"
                style={{ fontFamily: "monospace" }}
              >
                FISH
              </span>
              <span
                className="text-3xl font-black text-white"
                style={{ fontFamily: "monospace" }}
              >
                {fishCount}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onRemoveFish}
                className="w-12 h-12 bg-slate-700 border-4 border-slate-500 hover:bg-slate-600 active:translate-y-1 transition-transform font-black text-2xl text-white"
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
                title="Remove Fish"
              >
                −
              </button>

              <button
                onClick={onAddFish}
                className="w-12 h-12 bg-blue-600 border-4 border-blue-400 hover:bg-blue-500 active:translate-y-1 transition-transform font-black text-2xl text-white"
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
                title="Add Fish"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Seaweed Controls */}
        <div
          className="bg-slate-800 border-4 border-slate-600 p-3"
          style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center pr-3 border-r-4 border-slate-600">
              <span
                className="text-[10px] font-black text-green-400 tracking-widest"
                style={{ fontFamily: "monospace" }}
              >
                WEED
              </span>
              <span
                className="text-3xl font-black text-white"
                style={{ fontFamily: "monospace" }}
              >
                {seaweedCount}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onRemoveSeaweed}
                className="w-12 h-12 bg-slate-700 border-4 border-slate-500 hover:bg-slate-600 active:translate-y-1 transition-transform font-black text-2xl text-white"
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
                title="Remove Seaweed"
              >
                −
              </button>

              <button
                onClick={onAddSeaweed}
                className="w-12 h-12 bg-green-600 border-4 border-green-400 hover:bg-green-500 active:translate-y-1 transition-transform font-black text-2xl text-white"
                style={{
                  boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                }}
                title="Add Seaweed"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="w-full h-12 bg-cyan-600 border-4 border-cyan-400 hover:bg-cyan-500 active:translate-y-1 transition-transform font-black text-sm text-white tracking-widest"
          style={{
            boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
            fontFamily: "monospace",
          }}
          title="Refresh Tank"
        >
          ⟲ REFRESH
        </button>
      </div>
    </div>
  );
};
