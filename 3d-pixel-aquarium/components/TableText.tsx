import React from "react";
import { Text } from "@react-three/drei";
import { TANK_SIZE } from "../constants";

export const TableText: React.FC = () => {
  const tableY = -TANK_SIZE.height / 2 - 0.15;
  const tableHeight = 0.2;
  const tableDepth = TANK_SIZE.depth + 0.5;
  const textY = tableY - tableHeight / 2 - 0.01; // Just below the table surface
  const textZ = tableDepth / 2 - 0.8; // Move towards the front edge

  return (
    <group position={[0, textY, textZ]} rotation={[Math.PI / 2, 0, 0]}>
      {/* First line - English */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        What's so interesting down there?
      </Text>

      {/* Second line - Chinese */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        这底下有什么好看的🌚？
      </Text>

      {/* Third line - Attribution */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.15}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        --Woody Lin
      </Text>
    </group>
  );
};
