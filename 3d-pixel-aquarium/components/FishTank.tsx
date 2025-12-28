import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { Fish } from "./Fish";
import { FISH_SPRITES, TANK_SIZE } from "../constants";

interface FishTankProps {
  count: number;
}

export const FishTank: React.FC<FishTankProps> = ({ count }) => {
  // Generate random fish configurations
  const fishes = useMemo(() => {
    const safeMargin = 1.2; // Keep fish at least this far from walls
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      sprite: FISH_SPRITES[Math.floor(Math.random() * FISH_SPRITES.length)],
      position: new THREE.Vector3(
        (Math.random() - 0.5) * (TANK_SIZE.width - safeMargin * 2),
        (Math.random() - 0.5) * (TANK_SIZE.height - safeMargin * 2),
        (Math.random() - 0.5) * (TANK_SIZE.depth - safeMargin * 2)
      ),
      speed: 0.01 + Math.random() * 0.03,
      scale: 0.3 + Math.random() * 0.4,
      verticalFrequency: 0.5 + Math.random() * 2,
      verticalAmplitude: 0.05 + Math.random() * 0.1,
    }));
  }, []);

  return (
    <group>
      {/* Tank Glass Box - Enhanced realistic glass */}
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[TANK_SIZE.width, TANK_SIZE.height, TANK_SIZE.depth]}
        />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.15}
          samples={16}
          resolution={1024}
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
      </mesh>

      {/* Tank Frame - More detailed */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry
          args={[
            TANK_SIZE.width + 0.12,
            TANK_SIZE.height + 0.12,
            TANK_SIZE.depth + 0.12,
          ]}
        />
        <meshStandardMaterial
          color="#1e293b"
          wireframe
          opacity={0.8}
          transparent
        />
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

      {/* Bubbles / Particles */}
      <Bubbles count={40} />

      {/* Render selected number of fish */}
      {fishes.slice(0, count).map((fish) => (
        <Fish key={fish.id} {...fish} />
      ))}
    </group>
  );
};

const Bubbles: React.FC<{ count: number }> = ({ count }) => {
  const bubblePositions = useMemo(() => {
    return Array.from({ length: count }).map(
      () =>
        [
          (Math.random() - 0.5) * TANK_SIZE.width,
          (Math.random() - 0.5) * TANK_SIZE.height,
          (Math.random() - 0.5) * TANK_SIZE.depth,
        ] as [number, number, number]
    );
  }, [count]);

  return (
    <group>
      {bubblePositions.map((pos, i) => (
        <Bubble key={i} startPos={pos} />
      ))}
    </group>
  );
};

const Bubble: React.FC<{ startPos: [number, number, number] }> = ({
  startPos,
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const speed = useMemo(() => 0.5 + Math.random() * 1.5, []);

  React.useLayoutEffect(() => {
    if (ref.current) {
      ref.current.position.set(...startPos);
    }
  }, [startPos]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += speed * 0.01;
      ref.current.position.x += Math.sin(ref.current.position.y * 5) * 0.005;
      if (ref.current.position.y > TANK_SIZE.height / 2) {
        ref.current.position.y = -TANK_SIZE.height / 2;
      }
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="white" transparent opacity={0.4} />
    </mesh>
  );
};
