import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { TANK_SIZE } from "../constants";

interface FishProps {
  sprite: string;
  position: THREE.Vector3;
  speed: number;
  scale: number;
  verticalFrequency: number;
  verticalAmplitude: number;
}

export const Fish: React.FC<FishProps> = ({
  sprite,
  position,
  speed,
  scale,
  verticalFrequency,
  verticalAmplitude,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, sprite);

  // Set texture filtering to Nearest for sharp pixel art
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  // Movement state
  const [direction, setDirection] = useState(
    new THREE.Vector3(
      Math.random() > 0.5 ? 1 : -1,
      0,
      (Math.random() - 0.5) * 0.4
    )
  );
  const [facing, setFacing] = useState(direction.x > 0 ? 1 : -1);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const fish = meshRef.current;
    if (!fish) return;

    // Movement in the current direction
    fish.position.addScaledVector(direction, speed);

    // Bouncing off walls
    const boundaryX = TANK_SIZE.width / 2 - 0.5;
    const boundaryY = TANK_SIZE.height / 2 - 0.5;
    const boundaryZ = TANK_SIZE.depth / 2 - 0.5;

    if (Math.abs(fish.position.x) > boundaryX) {
      direction.x *= -1;
      setFacing(direction.x > 0 ? 1 : -1);
    }

    if (Math.abs(fish.position.z) > boundaryZ) {
      direction.z *= -1;
    }

    // Gentle floating up and down
    fish.position.y +=
      Math.sin(time * verticalFrequency) * verticalAmplitude * 0.1;

    // Bounds check for Y
    if (Math.abs(fish.position.y) > boundaryY) {
      fish.position.y = Math.sign(fish.position.y) * boundaryY;
    }

    // Swimming "wobble" rotation
    fish.rotation.z = Math.sin(time * 10) * 0.1;

    // Orientation flip
    fish.scale.x = facing * scale;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[scale, scale, 1]}
      castShadow
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        alphaTest={0.5}
        roughness={1}
      />
    </mesh>
  );
};
