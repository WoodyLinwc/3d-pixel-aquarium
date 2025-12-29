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
import type { Environment as EnvironmentType } from "./constants";

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
  const [notification, setNotification] = useState<{
    message: string | null;
    fishName?: string;
    fishImage?: string;
    type: "added" | "removed" | null;
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

  const handleFishUpdate = (fishSprites: string[]) => {
    const previousCount = previousFishList.length;
    const currentCount = fishSprites.length;

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
        key: Date.now(), // Unique key to force re-render
      });
    }
    // Fish was removed
    else if (currentCount < previousCount) {
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
        key: Date.now(), // Unique key to force re-render
      });
    }

    setPreviousFishList(fishSprites);
    setCurrentFishList(fishSprites);
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
          onAddFish={() => setFishCount((prev) => Math.min(prev + 1, 30))}
          onRemoveFish={() => setFishCount((prev) => Math.max(prev - 1, 1))}
          onRefresh={handleRefresh}
          seaweedCount={seaweedCount}
          onAddSeaweed={() => setSeaweedCount((prev) => Math.min(prev + 1, 6))}
          onRemoveSeaweed={() =>
            setSeaweedCount((prev) => Math.max(prev - 1, 0))
          }
          environment={environment}
          onEnvironmentChange={setEnvironment}
          isMobile={isMobile}
          isPortrait={isPortrait}
        />

        <FishIdentifier fishList={currentFishList} isMobile={isMobile} />

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
