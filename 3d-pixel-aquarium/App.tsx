
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, ContactShadows } from '@react-three/drei';
import { FishTank } from './components/FishTank';
import { UIOverlay } from './components/UIOverlay';

const App: React.FC = () => {
  const [fishCount, setFishCount] = useState(12);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-black">
      <Canvas
        shadows
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <spotLight
            position={[0, 10, 0]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
          />
          
          <FishTank count={fishCount} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          <Environment preset="city" />
          
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
        onAddFish={() => setFishCount(prev => Math.min(prev + 1, 30))} 
        onRemoveFish={() => setFishCount(prev => Math.max(prev - 1, 1))}
      />
      
      <div className="absolute bottom-4 right-4 text-white/30 text-xs pointer-events-none">
        Drag to Orbit • Scroll to Zoom
      </div>
    </div>
  );
};

export default App;
