import React, { useEffect, useState } from "react";

export const LoadingScreen: React.FC = () => {
  const [showRefreshMessage, setShowRefreshMessage] = useState(false);
  const [dots, setDots] = useState("");
  const [barWidth, setBarWidth] = useState(0);

  // Show refresh message after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRefreshMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Animated loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Pixel loading bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBarWidth((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      {/* Pixel Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#1e3a8a 2px, transparent 2px),
            linear-gradient(90deg, #1e3a8a 2px, transparent 2px)
          `,
          backgroundSize: "20px 20px",
          imageRendering: "pixelated",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Title with pixel font style */}
        <div className="mb-6">
          <div
            className="text-center bg-blue-600 border-8 border-blue-400 px-8 py-6"
            style={{
              boxShadow: "8px 8px 0 rgba(0,0,0,0.8)",
              imageRendering: "pixelated",
            }}
          >
            <h1
              className="text-4xl md:text-6xl font-black text-white tracking-widest mb-2"
              style={{
                fontFamily: "monospace",
                textShadow: "4px 4px 0 rgba(0,0,0,0.5)",
              }}
            >
              PIXEL AQUARIUM
            </h1>
            <div
              className="text-2xl md:text-3xl font-black text-cyan-200 tracking-wider"
              style={{
                fontFamily: "monospace",
                textShadow: "3px 3px 0 rgba(0,0,0,0.5)",
                letterSpacing: "0.3em",
              }}
            >
              像素水族馆
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div
          className="text-center text-2xl font-black text-cyan-300 mb-6 tracking-widest"
          style={{
            fontFamily: "monospace",
            textShadow: "2px 2px 0 rgba(0,0,0,0.8)",
          }}
        >
          LOADING{dots}
        </div>

        {/* Chunky Pixel Loading Bar */}
        <div className="mb-8 flex justify-center">
          <div
            className="bg-slate-900 border-8 border-slate-700 p-2"
            style={{
              boxShadow: "8px 8px 0 rgba(0,0,0,0.8)",
              width: "320px",
            }}
          >
            <div className="h-8 bg-slate-800 relative overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-100"
                style={{
                  width: `${barWidth}%`,
                  imageRendering: "pixelated",
                }}
              >
                {/* Chunky pixel pattern overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        rgba(255,255,255,0.3) 0px,
                        rgba(255,255,255,0.3) 4px,
                        transparent 4px,
                        transparent 8px
                      ),
                      repeating-linear-gradient(
                        90deg,
                        rgba(255,255,255,0.2) 0px,
                        rgba(255,255,255,0.2) 4px,
                        transparent 4px,
                        transparent 8px
                      )
                    `,
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pixel Bubbles */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="grid grid-cols-3">
                <div className="w-3 h-3 md:w-4 md:h-4"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white/40"></div>
                <div className="w-3 h-3 md:w-4 md:h-4"></div>

                <div className="w-3 h-3 md:w-4 md:h-4 bg-white/40"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white/60"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white/40"></div>

                <div className="w-3 h-3 md:w-4 md:h-4"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white/40"></div>
                <div className="w-3 h-3 md:w-4 md:h-4"></div>
              </div>
              <div className="absolute inset-0 animate-pixel-bubble"></div>
            </div>
          ))}
        </div>

        {/* Refresh Message */}
        {showRefreshMessage && (
          <div
            className="bg-yellow-600 border-8 border-yellow-400 p-4 max-w-md mx-4 animate-shake"
            style={{ boxShadow: "8px 8px 0 rgba(0,0,0,0.8)" }}
          >
            <p
              className="text-black font-black text-lg text-center mb-2 tracking-wider"
              style={{ fontFamily: "monospace" }}
            >
              ⚠ WARNING ⚠
            </p>
            <p
              className="text-black font-bold text-sm text-center tracking-wide"
              style={{ fontFamily: "monospace" }}
            >
              TAKING TOO LONG!
            </p>
            <p
              className="text-black text-xs text-center mt-2 font-bold"
              style={{ fontFamily: "monospace" }}
            >
              PRESS F5 TO REFRESH
            </p>
          </div>
        )}

        {/* Loading Status */}
        <div
          className="text-center text-slate-500 text-sm mt-8 font-bold tracking-wide"
          style={{ fontFamily: "monospace" }}
        >
          [ LOADING ASSETS ]
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes pixel-bubble {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        .animate-pixel-bubble {
          animation: pixel-bubble 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
