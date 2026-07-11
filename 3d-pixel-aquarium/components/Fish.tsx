import React, { useRef, useMemo } from "react";
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

  // FIX: configure the texture once per texture, not on every render.
  // (Previously this ran on every React render of every fish.)
  useMemo(() => {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
  }, [texture]);

  // FIX: direction/facing were React state that got mutated directly
  // (an anti-pattern) and setFacing caused avoidable re-renders.
  // Plain refs are the right tool for per-frame mutable data.
  const directionRef = useRef(
    new THREE.Vector3(
      Math.random() > 0.5 ? 1 : -1,
      0,
      (Math.random() - 0.5) * 0.4,
    ),
  );
  const facingRef = useRef(directionRef.current.x > 0 ? 1 : -1);

  useFrame((state, delta) => {
    const fish = meshRef.current;
    if (!fish) return;

    const time = state.clock.getElapsedTime();
    const direction = directionRef.current;

    // FIX: movement is now frame-rate independent. Before, position moved
    // a fixed amount *per frame*, so on a 120Hz ProMotion MacBook the fish
    // swam twice as fast (and the GPU worked twice as hard to keep up).
    // Clamp delta so a background-tab pause doesn't teleport fish.
    const step = Math.min(delta, 0.1) * 60;

    fish.position.addScaledVector(direction, speed * step);

    // Bouncing off walls
    const boundaryX = TANK_SIZE.width / 2 - 0.5;
    const boundaryY = TANK_SIZE.height / 2 - 0.5;
    const boundaryZ = TANK_SIZE.depth / 2 - 0.5;

    if (Math.abs(fish.position.x) > boundaryX) {
      // FIX: clamp position back inside the wall. Previously a fish that
      // overshot the boundary could get stuck outside it, flipping
      // direction (and jittering) every single frame.
      fish.position.x = Math.sign(fish.position.x) * boundaryX;
      direction.x *= -1;
      facingRef.current = direction.x > 0 ? 1 : -1;
    }

    if (Math.abs(fish.position.z) > boundaryZ) {
      fish.position.z = Math.sign(fish.position.z) * boundaryZ;
      direction.z *= -1;
    }

    // Gentle floating up and down (also delta-scaled now)
    fish.position.y +=
      Math.sin(time * verticalFrequency) * verticalAmplitude * 0.1 * step;

    if (Math.abs(fish.position.y) > boundaryY) {
      fish.position.y = Math.sign(fish.position.y) * boundaryY;
    }

    // Swimming "wobble" rotation
    fish.rotation.z = Math.sin(time * 10) * 0.1;

    // Orientation flip
    fish.scale.x = facingRef.current * scale;
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
