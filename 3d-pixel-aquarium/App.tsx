import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { FishTank } from "./components/FishTank";
import { UIOverlay } from "./components/UIOverlay";
import { FishIdentifier } from "./components/FishIdentifier";
import { FishNotification } from "./components/FishNotification";
import { LoadingScreen } from "./components/LoadingScreen";
import { MusicPlayer } from "./components/MusicPlayer";
import { EasterEggButton } from "./components/EasterEggButton";
import type { Environment as EnvironmentType } from "./constants";

// LocalStorage key
const AQUARIUM_STORAGE_KEY = "myPixelAquarium";

// Type for saved aquarium state
interface SavedAquariumState {
  fishCount: number;
  seaweedCount: number;
  environment: EnvironmentType;
  currentFishList: string[];
  useCustomFish: boolean;
}

const App: React.FC = () => {
  // Detect if mobile (portrait orientation or small screen)
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768 || window.innerHeight > window.innerWidth
  );
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const [isLoading, setIsLoading] = useState(true);

  const [fishCount, setFishCount] = useState(isMobile ? 3 : 6);
  const [seaweedCount, setSeaweedCount] = useState(isMobile ? 2 : 3);
  const [refreshKey, setRefreshKey] = useState(0);
  const [environment, setEnvironment] = useState<EnvironmentType>("all");
  const [currentFishList, setCurrentFishList] = useState<string[]>([]);
  const [previousFishList, setPreviousFishList] = useState<string[]>([]);
  const [useCustomFish, setUseCustomFish] = useState(false);
  const [isMyAquarium, setIsMyAquarium] = useState(false);
  const [suppressNotifications, setSuppressNotifications] = useState(false);
  const [notification, setNotification] = useState<{
    message: string | null;
    fishName?: string;
    fishImage?: string;
    type: "added" | "removed" | "custom" | "saved" | "loaded" | null;
    key?: number;
  }>({ message: null, type: null });

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth < 768 || window.innerHeight > window.innerWidth;
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Hide loading screen after initial load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading screen for at least 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleAddFish = () => {
    setFishCount((prev) => Math.min(prev + 1, 30));
    // REMOVED: setRefreshKey - no longer forcing regeneration!
  };

  const handleRemoveFish = () => {
    setFishCount((prev) => Math.max(prev - 1, 0));
    // REMOVED: setRefreshKey - no longer forcing regeneration!
  };

  const handleEasterEgg = () => {
    const newCustomMode = !useCustomFish;
    setUseCustomFish(newCustomMode);
    setRefreshKey((prev) => prev + 1); // Still refresh for mode change

    // Show notification
    setNotification({
      message: newCustomMode
        ? "Custom Fish Mode Activated!"
        : "Normal Mode Restored",
      type: "custom",
      key: Date.now(),
    });
  };

  const handleEnvironmentChange = (env: EnvironmentType) => {
    setEnvironment(env);
    setRefreshKey((prev) => prev + 1); // Refresh when environment changes
  };

  const handleFishUpdate = (fishSprites: string[]) => {
    const previousCount = previousFishList.length;
    const currentCount = fishSprites.length;

    // Always update the lists
    setPreviousFishList(fishSprites);
    setCurrentFishList(fishSprites);

    // Skip all notifications if suppressed (during mode transitions)
    if (suppressNotifications) {
      return;
    }

    // Skip notifications if both lists are empty
    if (previousCount === 0 && currentCount === 0) {
      return;
    }

    // Fish was added
    if (currentCount > previousCount && previousCount > 0) {
      const addedFish = fishSprites.filter(
        (fish, index) =>
          !previousFishList.includes(fish) || index >= previousCount
      );
      const fishPath =
        addedFish.length > 0
          ? addedFish[0]
          : fishSprites[fishSprites.length - 1];
      const fishName =
        fishPath.split("/").pop()?.replace(".png", "").replace(/_/g, " ") ||
        "Unknown Fish";

      setNotification({
        message: "Fish Added",
        fishName,
        fishImage: fishPath,
        type: "added",
        key: Date.now(),
      });
    }
    // Fish was removed
    else if (currentCount < previousCount && previousCount > 0) {
      const removedFish = previousFishList.filter(
        (fish) => !fishSprites.includes(fish)
      );
      const fishPath =
        removedFish.length > 0
          ? removedFish[0]
          : previousFishList[previousFishList.length - 1];
      const fishName =
        fishPath.split("/").pop()?.replace(".png", "").replace(/_/g, " ") ||
        "Unknown Fish";

      setNotification({
        message: "Fish Removed",
        fishName,
        fishImage: fishPath,
        type: "removed",
        key: Date.now(),
      });
    }
  };

  // Save current aquarium state to localStorage
  const saveMyAquarium = () => {
    try {
      const state: SavedAquariumState = {
        fishCount,
        seaweedCount,
        environment,
        currentFishList,
        useCustomFish,
      };
      localStorage.setItem(AQUARIUM_STORAGE_KEY, JSON.stringify(state));
      console.log("Saved aquarium:", state);

      setNotification({
        message: "Aquarium Saved!",
        type: "saved",
        key: Date.now(),
      });
    } catch (error) {
      console.error("Failed to save aquarium:", error);
      setNotification({
        message: "Failed to save aquarium",
        type: "removed",
        key: Date.now(),
      });
    }
  };

  // Load saved aquarium state from localStorage
  const loadMyAquarium = () => {
    try {
      // Suppress fish add/remove notifications during mode transition
      setSuppressNotifications(true);

      const savedData = localStorage.getItem(AQUARIUM_STORAGE_KEY);
      console.log("Loading aquarium, savedData:", savedData);

      if (savedData) {
        const state: SavedAquariumState = JSON.parse(savedData);
        console.log("Loaded aquarium:", state);

        setFishCount(state.fishCount);
        setSeaweedCount(state.seaweedCount);
        setEnvironment(state.environment);
        setUseCustomFish(state.useCustomFish);
        // Set the saved fish list so it can be restored
        setCurrentFishList(state.currentFishList || []);
        setPreviousFishList(state.currentFishList || []);
        setRefreshKey((prev) => prev + 1);

        setNotification({
          message: "Your Aquarium Loaded!",
          type: "loaded",
          key: Date.now(),
        });
      } else {
        console.log("No saved data found, creating empty tank");
        // No saved aquarium, start with empty tank
        setFishCount(0);
        setSeaweedCount(0);
        setCurrentFishList([]);
        setPreviousFishList([]);
        setRefreshKey((prev) => prev + 1);

        setNotification({
          message: "Empty Tank Created!",
          type: "loaded",
          key: Date.now(),
        });
      }
      setIsMyAquarium(true);

      // Re-enable notifications after a short delay
      setTimeout(() => {
        setSuppressNotifications(false);
      }, 500);
    } catch (error) {
      console.error("Failed to load aquarium:", error);
      setSuppressNotifications(false);
    }
  };

  // Toggle My Aquarium - save current state or load saved state
  const handleMyAquarium = () => {
    if (isMyAquarium) {
      // Already viewing "My Aquarium", save any changes
      saveMyAquarium();
    } else {
      // Load saved aquarium or create empty tank
      loadMyAquarium();
    }
  };

  // Exit My Aquarium mode and return to original tank
  const handleExitMyAquarium = () => {
    // Suppress fish add/remove notifications during mode transition
    setSuppressNotifications(true);

    setIsMyAquarium(false);
    setFishCount(isMobile ? 3 : 6);
    setSeaweedCount(isMobile ? 2 : 3);
    setEnvironment("all");
    setUseCustomFish(false);
    setCurrentFishList([]);
    setPreviousFishList([]);
    setRefreshKey((prev) => prev + 1);

    setNotification({
      message: "Returned to Original Tank",
      type: "loaded",
      key: Date.now(),
    });

    // Re-enable notifications after a short delay
    setTimeout(() => {
      setSuppressNotifications(false);
    }, 500);
  };

  return (
    <>
      {isLoading && <LoadingScreen />}

      <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-black">
        <Canvas
          shadows
          camera={{
            position: isMobile ? [0, 2, 50] : [0, 2, 8],
            fov: 45,
          }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            {/* Enhanced lighting for realistic glass reflections */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} castShadow />
            <pointLight
              position={[-10, 5, -10]}
              intensity={1}
              color="#a5f3fc"
            />
            <spotLight
              position={[0, 10, 0]}
              angle={0.2}
              penumbra={1}
              intensity={2.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            <FishTank
              count={fishCount}
              seaweedCount={seaweedCount}
              environment={environment}
              onFishUpdate={handleFishUpdate}
              useCustomFish={useCustomFish}
              savedFishList={
                isMyAquarium && currentFishList.length > 0
                  ? currentFishList
                  : undefined
              }
              key={refreshKey}
            />

            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.5}
              scale={20}
              blur={2.5}
              far={4.5}
            />
            <Environment preset="dawn" background={false} />

            <OrbitControls
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
              enablePan={false}
              minDistance={4}
              maxDistance={15}
            />
          </Suspense>
        </Canvas>

        <UIOverlay
          fishCount={fishCount}
          onAddFish={handleAddFish}
          onRemoveFish={handleRemoveFish}
          onRefresh={handleRefresh}
          seaweedCount={seaweedCount}
          onAddSeaweed={() => setSeaweedCount((prev) => Math.min(prev + 1, 6))}
          onRemoveSeaweed={() =>
            setSeaweedCount((prev) => Math.max(prev - 1, 0))
          }
          environment={environment}
          onEnvironmentChange={handleEnvironmentChange}
          isMobile={isMobile}
          isPortrait={isPortrait}
          useCustomFish={useCustomFish}
          onEasterEgg={handleEasterEgg}
          onMyAquarium={handleMyAquarium}
          onExitMyAquarium={handleExitMyAquarium}
          isMyAquarium={isMyAquarium}
        />

        <FishIdentifier fishList={currentFishList} isMobile={isMobile} />

        {/* Empty Tank Message */}
        {fishCount === 0 && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
            <div
              className="bg-slate-900/95 border-4 border-cyan-500 p-6 text-center"
              style={{ boxShadow: "8px 8px 0 rgba(0,0,0,0.8)" }}
            >
              <div className="text-6xl mb-4">🐠</div>
              <h3
                className="text-cyan-400 font-black text-2xl tracking-widest mb-2"
                style={{ fontFamily: "monospace" }}
              >
                EMPTY TANK
              </h3>
              <p
                className="text-white font-bold text-sm tracking-wide"
                style={{ fontFamily: "monospace" }}
              >
                Click + to add fish!
              </p>
            </div>
          </div>
        )}

        <FishNotification
          message={notification.message}
          fishName={notification.fishName}
          fishImage={notification.fishImage}
          type={notification.type}
          notificationKey={notification.key}
        />

        <MusicPlayer />
      </div>
    </>
  );
};

export default App;
