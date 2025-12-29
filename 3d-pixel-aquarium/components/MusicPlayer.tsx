import React, { useEffect, useRef, useState } from "react";

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Default volume at 30%
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.log("Audio play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 pointer-events-auto z-50">
      {/* Music Control Button */}
      <div className="flex flex-col items-end gap-2">
        {/* Volume Slider (only shown when music is playing) */}
        {isPlaying && (
          <div
            className="bg-slate-800 border-4 border-slate-600 p-2 flex items-center gap-2"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
          >
            <span
              className="text-white text-xs font-black"
              style={{ fontFamily: "monospace" }}
            >
              VOL
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 accent-cyan-500"
            />
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleMusic}
          className={`border-4 px-4 py-3 hover:brightness-110 active:translate-y-1 transition-transform font-black text-sm text-white tracking-widest ${
            isPlaying
              ? "bg-cyan-600 border-cyan-400"
              : "bg-slate-800 border-slate-600"
          }`}
          style={{
            boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
            fontFamily: "monospace",
          }}
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? "🔊 MUSIC ON" : "🔇 MUSIC OFF"}
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="/XtremeFreddy.mp3" type="audio/mpeg" />
        <source src="/XtremeFreddy.ogg" type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
