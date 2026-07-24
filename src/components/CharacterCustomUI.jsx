import { useState } from 'react';
import useGameStore from '../store/useGameStore';

const COLORS = ['#e63946', '#457b9d', '#2a9d8f', '#f4a261', '#e76f51', '#8338ec', '#ff006e'];

export default function CharacterCustomUI({ onClose }) {
  const { character, setCharacter, gold, removeGold } = useGameStore();
  const [selectedColor, setSelectedColor] = useState(character.color);

  const save = () => {
    setCharacter({ ...character, color: selectedColor });
    alert('Karakter diperbarui!');
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2>👤 Kustomisasi Karakter</h2>
        <div>
          <p>Warna Karakter</p>
          <div style={{ display: 'flex', gap: 5 }}>
            {COLORS.map((c) => (
              <div key={c} onClick={() => setSelectedColor(c)} style={{
                width: 30, height: 30, background: c, borderRadius: '50%',
                border: selectedColor === c ? '3px solid black' : 'none'
              }} />
            ))}
          </div>
        </div>
        <button onClick={save} style={{ marginTop: 10 }}>Simpan</button>
        <button onClick={onClose} style={{ marginLeft: 10 }}>Tutup</button>
      </div>
    </div>
  );
}
const overlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const panelStyle = { background: 'white', color: 'black', padding: 20, borderRadius: 15, width: '90%', maxWidth: 400, maxHeight: '80%', overflowY: 'auto' };
