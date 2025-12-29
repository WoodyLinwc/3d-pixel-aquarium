import React, { useEffect, useState } from "react";

interface FishNotificationProps {
  message: string | null;
  fishName?: string;
  fishImage?: string;
  type: "added" | "removed" | null;
  notificationKey?: number;
}

export const FishNotification: React.FC<FishNotificationProps> = ({
  message,
  fishName,
  fishImage,
  type,
  notificationKey,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message && type) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, type, notificationKey]); // Added notificationKey to dependencies

  if (!isVisible || !type) return null;

  return (
    <div
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div
        className={`border-4 p-3 flex items-center gap-3 ${
          type === "added"
            ? "bg-green-900/95 border-green-500"
            : "bg-red-900/95 border-red-500"
        }`}
        style={{
          boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
          minWidth: "250px",
        }}
      >
        {fishImage && (
          <img
            src={fishImage}
            alt={fishName}
            className="w-12 h-12 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        )}
        <div className="flex flex-col">
          <span
            className={`font-black text-xs tracking-widest ${
              type === "added" ? "text-green-300" : "text-red-300"
            }`}
            style={{ fontFamily: "monospace" }}
          >
            {type === "added" ? "🐠 FISH ADDED" : "❌ FISH REMOVED"}
          </span>
          {fishName && (
            <span
              className="text-white text-sm font-bold mt-1"
              style={{ fontFamily: "monospace" }}
            >
              {fishName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
