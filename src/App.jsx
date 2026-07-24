import { useEffect, useState } from 'react';
import { loginAnonymously, auth } from './firebase';
import World from './components/World';
import UIOverlay from './components/UIOverlay';
import useGameStore from './store/useGameStore';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loginAnonymously().catch(console.error);
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e', color: 'white' }}>
        <h2>Menghubungkan...</h2>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <World />
      <UIOverlay />
    </div>
  );
}
