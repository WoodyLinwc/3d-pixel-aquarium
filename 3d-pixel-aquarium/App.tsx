import React, { Suspense, useState, useRef, useCallback } from "react";
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
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768 || window.innerHeight > window.innerWidth,
  );
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth,
  );
  const [isLoading, setIsLoading] = useState(true);

  const [fishCount, setFishCount] = useState(isMobile ? 3 : 6);
  const [seaweedCount, setSeaweedCount] = useState(isMobile ? 2 : 3);
  const [refreshKey, setRefreshKey] = useState(0);
  const [environment, setEnvironment] = useState<EnvironmentType>("all");
  const [currentFishList, setCurrentFishList] = useState<string[]>([]);
  const [useCustomFish, setUseCustomFish] = useState(false);
  const [isMyAquarium, setIsMyAquarium] = useState(false);
  const [notification, setNotification] = useState<{
    message: string | null;
    fishName?: string;
    fishImage?: string;
    type: "added" | "removed" | "custom" | "saved" | "loaded" | null;
    key?: number;
  }>({ message: null, type: null });

  // FIX: these were React state before, which made handleFishUpdate a new
  // function on every render. That new function identity re-triggered
  // FishTank's effect, which called setState here, which re-rendered App,
  // which created another new function... an infinite render loop that kept
  // the CPU busy 100% of the time. Refs + useCallback make the callback
  // identity stable and break the cycle.
  const previousFishListRef = useRef<string[]>([]);
  const suppressNotificationsRef = useRef(false);

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
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleAddFish = () => {
    setFishCount((prev) => Math.min(prev + 1, 30));
  };

  const handleRemoveFish = () => {
    setFishCount((prev) => Math.max(prev - 1, 0));
  };

  const handleEasterEgg = () => {
    const newCustomMode = !useCustomFish;
    setUseCustomFish(newCustomMode);
    setRefreshKey((prev) => prev + 1);

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
    setRefreshKey((prev) => prev + 1);
  };

  // FIX: stable identity via useCallback, early-exit when nothing changed.
  const handleFishUpdate = useCallback((fishSprites: string[]) => {
    const prev = previousFishListRef.current;
    const unchanged =
      prev.length === fishSprites.length &&
      prev.every((s, i) => s === fishSprites[i]);
    if (unchanged) return;

    const previousCount = prev.length;
    const currentCount = fishSprites.length;

    previousFishListRef.current = fishSprites;
    setCurrentFishList(fishSprites);

    if (suppressNotificationsRef.current) return;
    if (previousCount === 0 && currentCount === 0) return;

    // Fish was added
    if (currentCount > previousCount && previousCount > 0) {
      const addedFish = fishSprites.filter(
        (fish, index) => !prev.includes(fish) || index >= previousCount,
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
      const removedFish = prev.filter((fish) => !fishSprites.includes(fish));
      const fishPath =
        removedFish.length > 0 ? removedFish[0] : prev[prev.length - 1];
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
  }, []);

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
      suppressNotificationsRef.current = true;

      const savedData = localStorage.getItem(AQUARIUM_STORAGE_KEY);

      if (savedData) {
        const state: SavedAquariumState = JSON.parse(savedData);

        setFishCount(state.fishCount);
        setSeaweedCount(state.seaweedCount);
        setEnvironment(state.environment);
        setUseCustomFish(state.useCustomFish);
        setCurrentFishList(state.currentFishList || []);
        previousFishListRef.current = state.currentFishList || [];
        setRefreshKey((prev) => prev + 1);

        setNotification({
          message: "Your Aquarium Loaded!",
          type: "loaded",
          key: Date.now(),
        });
      } else {
        setFishCount(0);
        setSeaweedCount(0);
        setCurrentFishList([]);
        previousFishListRef.current = [];
        setRefreshKey((prev) => prev + 1);

        setNotification({
          message: "Empty Tank Created!",
          type: "loaded",
          key: Date.now(),
        });
      }
      setIsMyAquarium(true);

      setTimeout(() => {
        suppressNotificationsRef.current = false;
      }, 500);
    } catch (error) {
      console.error("Failed to load aquarium:", error);
      suppressNotificationsRef.current = false;
    }
  };

  const handleMyAquarium = () => {
    if (isMyAquarium) {
      saveMyAquarium();
    } else {
      loadMyAquarium();
    }
  };

  const handleExitMyAquarium = () => {
    suppressNotificationsRef.current = true;

    setIsMyAquarium(false);
    setFishCount(isMobile ? 3 : 6);
    setSeaweedCount(isMobile ? 2 : 3);
    setEnvironment("all");
    setUseCustomFish(false);
    setCurrentFishList([]);
    previousFishListRef.current = [];
    setRefreshKey((prev) => prev + 1);

    setNotification({
      message: "Returned to Original Tank",
      type: "loaded",
      key: Date.now(),
    });

    setTimeout(() => {
      suppressNotificationsRef.current = false;
    }, 500);
  };

  return (
    <>
      {isLoading && <LoadingScreen />}

      <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-black">
        <Canvas
          shadows
          // FIX: cap the device pixel ratio. Retina MacBooks report dpr 2+,
          // which quadruples the number of pixels shaded every frame. 1.5
          // still looks crisp and cuts GPU work almost in half.
          dpr={[1, 1.5]}
          camera={{
            // FIX: was [0, 2, 50] on mobile, but OrbitControls clamps
            // maxDistance to 15, so the camera snapped on first touch.
            position: isMobile ? [0, 2, 12] : [0, 2, 8],
            fov: 45,
          }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        >
          <Suspense fallback={null}>
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
              // FIX: 2048x2048 shadow map was overkill for this scene.
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
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

            {/* FIX: 5000 stars -> 2000. Visually nearly identical. */}
            <Stars
              radius={100}
              depth={50}
              count={2000}
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
              // FIX: ContactShadows re-renders its depth pass every frame by
              // default; nothing outside the tank moves, so bake it once.
              frames={1}
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
