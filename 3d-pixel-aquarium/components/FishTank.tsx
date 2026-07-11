import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { Fish } from "./Fish";
import { TableText } from "./TableText";
import {
  TANK_SIZE,
  getFishForEnvironment,
  type Environment,
} from "../constants";

// Set to true only if you want the fancy (expensive) refractive glass.
// MeshTransmissionMaterial re-renders the whole scene into an offscreen
// buffer every frame — it was the single biggest GPU cost in the app.
const HIGH_QUALITY_GLASS = false;

interface FishTankProps {
  count: number;
  seaweedCount: number;
  environment: Environment;
  onFishUpdate?: (fishSprites: string[]) => void;
  useCustomFish?: boolean;
  savedFishList?: string[];
}

export const FishTank: React.FC<FishTankProps> = ({
  count,
  seaweedCount,
  environment,
  onFishUpdate,
  useCustomFish = false,
  savedFishList,
}) => {
  // Store the generated fish list persistently
  const fishPoolRef = useRef<
    Array<{
      id: number;
      sprite: string;
      position: THREE.Vector3;
      speed: number;
      scale: number;
      verticalFrequency: number;
      verticalAmplitude: number;
    }>
  >([]);

  const prevEnvironmentRef = useRef(environment);
  const prevCustomFishRef = useRef(useCustomFish);
  const hasRestoredRef = useRef(false);

  const fishes = useMemo(() => {
    const safeMargin = 1.2;
    const fishSprites = getFishForEnvironment(environment, useCustomFish);

    const hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };

    const seededRandom = (seed: number): number => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    if (
      prevEnvironmentRef.current !== environment ||
      prevCustomFishRef.current !== useCustomFish
    ) {
      fishPoolRef.current = [];
      hasRestoredRef.current = false;
      prevEnvironmentRef.current = environment;
      prevCustomFishRef.current = useCustomFish;
    }

    if (savedFishList && savedFishList.length > 0 && !hasRestoredRef.current) {
      const restoredFish = savedFishList.map((sprite, i) => {
        const spriteHash = hashString(sprite);
        const speedSeed = seededRandom(spriteHash + 1);
        const scaleSeed = seededRandom(spriteHash + 2);
        const vFreqSeed = seededRandom(spriteHash + 3);
        const vAmpSeed = seededRandom(spriteHash + 4);

        return {
          id: i,
          sprite,
          position: new THREE.Vector3(
            (Math.random() - 0.5) * (TANK_SIZE.width - safeMargin * 2),
            (Math.random() - 0.5) * (TANK_SIZE.height - safeMargin * 2),
            (Math.random() - 0.5) * (TANK_SIZE.depth - safeMargin * 2),
          ),
          speed: 0.008 + speedSeed * 0.03,
          scale: 0.3 + scaleSeed * 0.4,
          verticalFrequency: 0.5 + vFreqSeed * 2,
          verticalAmplitude: 0.05 + vAmpSeed * 0.1,
        };
      });

      fishPoolRef.current = restoredFish;
      hasRestoredRef.current = true;
      return restoredFish;
    }

    const currentPoolSize = fishPoolRef.current.length;

    if (currentPoolSize < count) {
      const fishToAdd = count - currentPoolSize;

      for (let i = 0; i < fishToAdd; i++) {
        const sprite =
          fishSprites[Math.floor(Math.random() * fishSprites.length)];
        const spriteHash = hashString(sprite);
        const speedSeed = seededRandom(spriteHash + 1);
        const scaleSeed = seededRandom(spriteHash + 2);
        const vFreqSeed = seededRandom(spriteHash + 3);
        const vAmpSeed = seededRandom(spriteHash + 4);

        fishPoolRef.current.push({
          id: currentPoolSize + i,
          sprite,
          position: new THREE.Vector3(
            (Math.random() - 0.5) * (TANK_SIZE.width - safeMargin * 2),
            (Math.random() - 0.5) * (TANK_SIZE.height - safeMargin * 2),
            (Math.random() - 0.5) * (TANK_SIZE.depth - safeMargin * 2),
          ),
          speed: 0.008 + speedSeed * 0.03,
          scale: 0.3 + scaleSeed * 0.4,
          verticalFrequency: 0.5 + vFreqSeed * 2,
          verticalAmplitude: 0.05 + vAmpSeed * 0.1,
        });
      }
    } else if (currentPoolSize > count) {
      fishPoolRef.current = fishPoolRef.current.slice(0, count);
    }

    return fishPoolRef.current;
  }, [count, environment, useCustomFish, savedFishList]);

  // FIX: only report upward when the displayed list actually changed.
  // Before, this effect fired on every parent re-render (because
  // onFishUpdate was a new function each time) and always created a brand
  // new array, which triggered setState in App, which re-rendered App,
  // which re-triggered this effect... an infinite render loop that pinned
  // one CPU core forever. This guard breaks the cycle.
  const lastReportedRef = useRef<string[]>([]);
  React.useEffect(() => {
    if (!onFishUpdate) return;
    const displayedFish = fishes.slice(0, count).map((f) => f.sprite);
    const last = lastReportedRef.current;
    const unchanged =
      last.length === displayedFish.length &&
      last.every((s, i) => s === displayedFish[i]);
    if (unchanged) return;
    lastReportedRef.current = displayedFish;
    onFishUpdate(displayedFish);
  }, [fishes, count, onFishUpdate]);

  return (
    <group>
      {/* Tank Glass Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[TANK_SIZE.width, TANK_SIZE.height, TANK_SIZE.depth]}
        />
        {HIGH_QUALITY_GLASS ? (
          // Toned-down transmission material: samples 16→4, resolution
          // 1024→256, backside pass removed (it doubles the cost).
          <MeshTransmissionMaterial
            samples={4}
            resolution={256}
            thickness={0.15}
            roughness={0.05}
            chromaticAberration={0.025}
            anisotropy={0.3}
            distortion={0.05}
            distortionScale={0.2}
            temporalDistortion={0.05}
            transmission={0.98}
            ior={1.52}
            color="#e0f7fa"
            transparent
            opacity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.05}
            reflectivity={0.5}
          />
        ) : (
          // Cheap physically-based glass: no offscreen scene render at all.
          // Looks very close for a simple box tank, costs a tiny fraction.
          <meshPhysicalMaterial
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0}
            transmission={0}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color="#e0f7fa"
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        )}
      </mesh>

      {/* Tank Floor (Sand) */}
      <mesh
        position={[0, -TANK_SIZE.height / 2 + 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[TANK_SIZE.width - 0.1, TANK_SIZE.depth - 0.1]} />
        <meshStandardMaterial color="#fef08a" roughness={1} />
      </mesh>

      <Seaweed count={seaweedCount} />

      <Bubbles count={40} />

      {fishes.slice(0, count).map((fish) => (
        <Fish key={fish.id} {...fish} />
      ))}

      <Table />

      <TableText />
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// WHITE-FRAME FIX for the seaweed animation.
//
// Replace the entire `const Seaweed: React.FC<{ count: number }> = ...`
// component inside your FishTank.tsx with the version below.
//
// Requirements (both already present in your FishTank.tsx imports):
//   import { useFrame, useLoader } from "@react-three/fiber";
//   import * as THREE from "three";
//
// Why this fixes it:
// - OLD: `new THREE.TextureLoader().load(url)` returns an EMPTY texture
//   immediately and fills it in whenever the download finishes. Until then,
//   the plane renders with meshStandardMaterial's default color — white.
//   Since the animation cycles through 4 separately-downloaded files, any
//   frame that hadn't loaded yet flashed as a solid white square.
// - NEW: `useLoader` suspends the component (via your <Suspense> in App)
//   until ALL four frames are fully downloaded, so nothing ever renders
//   half-loaded.
//
// Bonus: the frame swap now happens inside useFrame by mutating the
// material's map directly — no setState, no React re-render every 300ms.
// ─────────────────────────────────────────────────────────────────────────

const Seaweed: React.FC<{ count: number }> = ({ count }) => {
  // Loads once, cached globally, suspends until all 4 frames are ready.
  const textures = useLoader(THREE.TextureLoader, [
    "/decorations/seaweed_1.png",
    "/decorations/seaweed_2.png",
    "/decorations/seaweed_3.png",
    "/decorations/seaweed_4.png",
  ]);

  // Configure pixel-art filtering once per texture (not on every render).
  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace; // ← the fix
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
    });
  }, [textures]);

  // Animate by swapping the material map directly — zero React re-renders.
  const materialRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const frameRef = useRef(0);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (elapsedRef.current >= 0.3) {
      elapsedRef.current = 0;
      frameRef.current = (frameRef.current + 1) % 4;
      const tex = textures[frameRef.current];
      materialRefs.current.forEach((mat) => {
        if (mat) mat.map = tex;
      });
    }
  });

  // Random seaweed positions and sizes (unchanged from your original)
  const seaweeds = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const scale = 1.5 + Math.random() * 2;
      const baseY = -TANK_SIZE.height / 2;
      const yOffset = 0.5 + (scale - 1.5) * 0.8;

      return {
        id: i,
        position: [
          (Math.random() - 0.5) * (TANK_SIZE.width - 1),
          baseY + yOffset,
          (Math.random() - 0.5) * (TANK_SIZE.depth - 1),
        ] as [number, number, number],
        scale: scale,
      };
    });
  }, []);

  return (
    <group>
      {seaweeds.slice(0, count).map((seaweed, i) => (
        <mesh
          key={seaweed.id}
          position={seaweed.position}
          scale={[seaweed.scale, seaweed.scale, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            ref={(mat) => (materialRefs.current[i] = mat)}
            map={textures[0]}
            transparent
            side={THREE.DoubleSide}
            alphaTest={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// Table/Desk Component (unchanged)
const Table: React.FC = () => {
  const tableY = -TANK_SIZE.height / 2 - 0.15;
  const tableHeight = 0.2;
  const tableWidth = TANK_SIZE.width + 1;
  const tableDepth = TANK_SIZE.depth + 0.5;
  const legHeight = 1.5;
  const legThickness = 0.15;

  const legPositions: [number, number, number][] = [
    [
      -tableWidth / 2 + 0.3,
      tableY - legHeight / 2 - tableHeight / 2,
      tableDepth / 2 - 0.3,
    ],
    [
      tableWidth / 2 - 0.3,
      tableY - legHeight / 2 - tableHeight / 2,
      tableDepth / 2 - 0.3,
    ],
    [
      -tableWidth / 2 + 0.3,
      tableY - legHeight / 2 - tableHeight / 2,
      -tableDepth / 2 + 0.3,
    ],
    [
      tableWidth / 2 - 0.3,
      tableY - legHeight / 2 - tableHeight / 2,
      -tableDepth / 2 + 0.3,
    ],
  ];

  return (
    <group>
      <mesh position={[0, tableY, 0]} receiveShadow castShadow>
        <boxGeometry args={[tableWidth, tableHeight, tableDepth]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} metalness={0.1} />
      </mesh>

      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
          <meshStandardMaterial color="#654321" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// FIX: bubbles are now a single InstancedMesh — 1 draw call and 1 useFrame
// instead of 40 separate meshes each with their own useFrame subscription.
// Also uses meshBasicMaterial (bubbles don't need lighting) and is
// frame-rate independent.
const Bubbles: React.FC<{ count: number }> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bubbles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * TANK_SIZE.width,
        y: (Math.random() - 0.5) * TANK_SIZE.height,
        z: (Math.random() - 0.5) * TANK_SIZE.depth,
        speed: 0.5 + Math.random() * 1.5,
      })),
    [count],
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const step = Math.min(delta, 0.1);

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.y += b.speed * 0.6 * step;
      if (b.y > TANK_SIZE.height / 2) {
        b.y = -TANK_SIZE.height / 2;
      }
      dummy.position.set(b.x + Math.sin(b.y * 5) * 0.05, b.y, b.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshBasicMaterial
        color="white"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </instancedMesh>
  );
};
