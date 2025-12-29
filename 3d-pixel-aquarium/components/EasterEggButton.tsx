import React from "react";

interface EasterEggButtonProps {
  onActivate: () => void;
  isActive: boolean;
}

export const EasterEggButton: React.FC<EasterEggButtonProps> = ({
  onActivate,
  isActive,
}) => {
  return (
    <button
      onClick={onActivate}
      className={`w-full h-12 border-4 transition-all duration-300 pointer-events-auto ${
        isActive
          ? "bg-pink-600 border-pink-400 animate-pulse"
          : "bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-cyan-400"
      }`}
      style={{
        boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
        fontFamily: "monospace",
      }}
      title={
        isActive ? "Custom Fish Mode Active!" : "Secret Easter Egg - Click Me!"
      }
    >
      <span className="text-2xl">{isActive ? "✨" : "🥚"}</span>
    </button>
  );
};
