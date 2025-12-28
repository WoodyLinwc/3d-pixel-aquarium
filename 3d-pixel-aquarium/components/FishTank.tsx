
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { Fish } from './Fish';
import { FISH_SPRITES, TANK_SIZE } from '../constants';

interface FishTankProps {
  count: number;
}

export const FishTank: React.FC<FishTankProps> = ({ count }) => {
  // Generate random fish configurations
  const fishes = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      sprite: FISH_SPRITES[Math.floor(Math.random() * FISH_SPRITES.length)],
      position: new THREE.Vector3(
        (Math.random() - 0.5) * (TANK_SIZE.width - 0.5),
        (Math.random() - 0.5) * (TANK_SIZE.height - 0.5),
        (Math.random() - 0.5) * (TANK_SIZE.depth - 0.5)
      ),
      speed: 0.01 + Math.random() * 0.03,
      scale: 0.3 + Math.random() * 0.4,
      verticalFrequency: 0.5 + Math.random() * 2,
      verticalAmplitude: 0.05 + Math.random() * 0.1,
    }));
  }, []);

  return (
    <group>
      {/* Tank Glass Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[TANK_SIZE.width, TANK_SIZE.height, TANK_SIZE.depth]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.2}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.1}
          transmission={0.95}
          opacity={0.3}
          transparent
          color="#a5f3fc"
        />
      </mesh>

      {/* Tank Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[TANK_SIZE.width + 0.1, TANK_SIZE.height + 0.1, TANK_SIZE.depth + 0.1]} />
        {/* Fix: removed linewidth as it is not a property of MeshStandardMaterial and is widely unsupported in WebGL */}
        <meshStandardMaterial color="#334155" wireframe />
      </mesh>

      {/* Tank Floor (Sand) */}
      <mesh position={[0, -TANK_SIZE.height / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
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
    return Array.from({ length: count }).map(() => [
      (Math.random() - 0.5) * TANK_SIZE.width,
      (Math.random() - 0.5) * TANK_SIZE.height,
      (Math.random() - 0.5) * TANK_SIZE.depth,
    ] as [number, number, number]);
  }, [count]);

  return (
    <group>
      {bubblePositions.map((pos, i) => (
        <Bubble key={i} startPos={pos} />
      ))}
    </group>
  );
};

const Bubble: React.FC<{ startPos: [number, number, number] }> = ({ startPos }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const speed = useMemo(() => 0.5 + Math.random() * 1.5, []);

  React.useLayoutEffect(() => {
    if (ref.current) {
      ref.current.position.set(...startPos);
    }
  }, [startPos]);

  // Fix: replaced requestAnimationFrame with useFrame for standard R3F animation
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
