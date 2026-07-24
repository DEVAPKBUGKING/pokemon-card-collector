import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function Player({ position, color, isLocal, name }) {
  const meshRef = useRef();
  
  return (
    <group position={position}>
      {/* Badan */}
      <Box args={[0.5, 1, 0.5]} position={[0, 1, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Kepala */}
      <Sphere args={[0.3, 16, 16]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color={color} />
      </Sphere>
      {/* Mata (kalau pemain lokal) */}
      {isLocal && (
        <>
          <Sphere args={[0.08, 8, 8]} position={[-0.1, 1.85, 0.25]}>
            <meshBasicMaterial color="white" />
          </Sphere>
          <Sphere args={[0.08, 8, 8]} position={[0.1, 1.85, 0.25]}>
            <meshBasicMaterial color="white" />
          </Sphere>
        </>
      )}
    </group>
  );
}
