import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Sky, Plane } from '@react-three/drei';
import { database, auth } from '../firebase';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import Player from './Player';
import Joystick from './Joystick';
import useGameStore from '../store/useGameStore';
import * as THREE from 'three';

// Komponen untuk menggerakkan pemain lokal
function LocalPlayerController({ onPositionChange }) {
  const { camera } = useThree();
  const [move, setMove] = useState({ x: 0, y: 0 });
  const position = useRef(new THREE.Vector3(0, 0, 0));
  const speed = 0.1;

  useEffect(() => {
    const interval = setInterval(() => {
      if (move.x !== 0 || move.y !== 0) {
        const newPos = position.current.clone();
        newPos.x += move.x * speed;
        newPos.z += move.y * speed;
        position.current.copy(newPos);
        onPositionChange(newPos);
        // Update kamera mengikuti pemain (third person)
        camera.position.set(newPos.x + 5, 8, newPos.z + 5);
        camera.lookAt(newPos.x, 0, newPos.z);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [move, onPositionChange, camera]);

  return <Joystick onMove={setMove} />;
}

// Objek pohon sederhana
function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
}

function WorldContent() {
  const userId = auth.currentUser?.uid;
  const [players, setPlayers] = useState({});
  const [myPos, setMyPos] = useState(new THREE.Vector3(0, 0, 0));
  const character = useGameStore((s) => s.character);

  // Sinkron multiplayer
  useEffect(() => {
    const playersRef = ref(database, 'players');
    const unsub = onValue(playersRef, (snap) => {
      setPlayers(snap.exists() ? snap.val() : {});
    });
    return () => unsub();
  }, []);

  // Kirim posisi lokal ke Firebase
  useEffect(() => {
    if (!userId) return;
    const userRef = ref(database, `players/${userId}`);
    const interval = setInterval(() => {
      set(userRef, {
        x: myPos.x,
        y: myPos.y,
        z: myPos.z,
        color: character.color,
        name: character.name || 'Trainer',
        timestamp: serverTimestamp(),
      });
    }, 100);
    onDisconnect(userRef).remove();
    return () => clearInterval(interval);
  }, [userId, myPos, character]);

  const trees = [
    [-3, 0, -4], [2, 0, -3], [-1, 0, 5], [4, 0, 2], [-5, 0, -1]
  ];

  return (
    <>
      <Sky sunPosition={[100, 100, 20]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <meshStandardMaterial color="#4a8c4a" />
      </Plane>
      {/* Pohon-pohon */}
      {trees.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}
      {/* Pemain lain */}
      {Object.entries(players).map(([id, data]) => {
        if (id === userId) return null;
        return (
          <Player
            key={id}
            position={[data.x, data.y || 0, data.z]}
            color={data.color}
            isLocal={false}
            name={data.name}
          />
        );
      })}
      {/* Pemain lokal */}
      <Player position={[myPos.x, myPos.y, myPos.z]} color={character.color} isLocal={true} name="Kamu" />
      <LocalPlayerController onPositionChange={setMyPos} />
    </>
  );
}

export default function World() {
  return (
    <Canvas shadows style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <WorldContent />
    </Canvas>
  );
          }
