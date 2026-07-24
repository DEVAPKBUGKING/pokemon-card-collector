import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loginAnonymously, auth } from './firebase';
import Spawn from './pages/Spawn';
import Shop from './pages/Shop';
import OpenPack from './pages/OpenPack';
import Backpack from './pages/Backpack';
import useGameStore from './store/useGameStore';

function App() {
  const [user, setUser] = useState(null);
  const gold = useGameStore((s) => s.gold);
  const diamond = useGameStore((s) => s.diamond);

  useEffect(() => {
    loginAnonymously().catch(console.error);
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e', color: '#eee' }}>
        <h2>Menghubungkan ke server...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar info uang */}
        <div style={{ background: '#0f3460', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <span>🪙 {gold}  |  💎 {diamond}</span>
          <div>
            <Link to="/" style={{ color: 'white', marginRight: 10, textDecoration: 'none' }}>🌍</Link>
            <Link to="/shop" style={{ color: 'white', marginRight: 10, textDecoration: 'none' }}>🛒</Link>
            <Link to="/open-pack" style={{ color: 'white', marginRight: 10, textDecoration: 'none' }}>🎴</Link>
            <Link to="/backpack" style={{ color: 'white', textDecoration: 'none' }}>🎒</Link>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Spawn />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/open-pack" element={<OpenPack />} />
          <Route path="/backpack" element={<Backpack />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
