import { useState } from 'react';
import ShopUI from './ShopUI';
import BackpackUI from './BackpackUI';
import OpenPackUI from './OpenPackUI';
import QuestUI from './QuestUI';
import CharacterCustomUI from './CharacterCustomUI';
import useGameStore from '../store/useGameStore';

export default function UIOverlay() {
  const [activePanel, setActivePanel] = useState(null);
  const gold = useGameStore((s) => s.gold);
  const diamond = useGameStore((s) => s.diamond);

  const close = () => setActivePanel(null);

  return (
    <>
      {/* Panel Utama */}
      {activePanel === 'shop' && <ShopUI onClose={close} />}
      {activePanel === 'backpack' && <BackpackUI onClose={close} />}
      {activePanel === 'open' && <OpenPackUI onClose={close} />}
      {activePanel === 'quest' && <QuestUI onClose={close} />}
      {activePanel === 'character' && <CharacterCustomUI onClose={close} />}

      {/* Resource Bar */}
      <div style={{
        position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white',
        padding: '8px 15px', borderRadius: 20, zIndex: 500, display: 'flex', gap: 15
      }}>
        <span>🪙 {gold}</span>
        <span>💎 {diamond}</span>
      </div>

      {/* Tombol Menu */}
      <div style={{
        position: 'absolute', bottom: 30, right: 20, display: 'flex',
        flexDirection: 'column', gap: 10, zIndex: 500
      }}>
        <button onClick={() => setActivePanel('shop')} style={btnStyle}>🛒 Toko</button>
        <button onClick={() => setActivePanel('open')} style={btnStyle}>🎴 Buka Pack</button>
        <button onClick={() => setActivePanel('backpack')} style={btnStyle}>🎒 Backpack</button>
        <button onClick={() => setActivePanel('quest')} style={btnStyle}>📜 Quest</button>
        <button onClick={() => setActivePanel('character')} style={btnStyle}>👤 Karakter</button>
      </div>
    </>
  );
}

const btnStyle = {
  background: '#e63946', color: 'white', border: 'none', padding: '10px 15px',
  borderRadius: 10, fontSize: 14, fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
};
