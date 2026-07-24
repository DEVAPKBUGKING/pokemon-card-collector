import { useState } from 'react';
import useGameStore from '../store/useGameStore';

const POKEMON_DB = [
  { name: 'Pikachu', rarity: 'Common', sellPrice: 5, image: '⚡' },
  { name: 'Charizard', rarity: 'Rare', sellPrice: 100, image: '🔥' },
  { name: 'Mewtwo', rarity: 'Ultra Rare', sellPrice: 500, image: '🧬' },
  { name: 'Secret Mew', rarity: 'Secret', sellPrice: 10000, image: '✨' },
  // tambahkan lebih banyak
];

function generateCard() {
  const r = Math.random() * 100;
  if (r < 0.0001) return { ...POKEMON_DB.find(c => c.rarity === 'Secret'), id: Date.now() };
  if (r < 5) return { ...POKEMON_DB.find(c => c.rarity === 'Ultra Rare'), id: Date.now() };
  if (r < 20) return { ...POKEMON_DB.find(c => c.rarity === 'Rare'), id: Date.now() };
  return { ...POKEMON_DB.find(c => c.rarity === 'Common'), id: Date.now() };
}

export default function OpenPackUI({ onClose }) {
  const { gold, removeGold, addCard, addGold } = useGameStore();
  const [cards, setCards] = useState([]);
  const [opened, setOpened] = useState(false);

  const openPack = () => {
    if (gold < 50) return alert('Emas kurang! Butuh 50 emas.');
    removeGold(50);
    const newCards = Array(5).fill().map(() => generateCard());
    setCards(newCards);
    setOpened(true);
    newCards.forEach((card) => addCard(card));
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2>🎴 Buka Booster Pack</h2>
        {!opened ? (
          <button onClick={openPack}>Buka (50 🪙)</button>
        ) : (
          <div>
            {cards.map((card, i) => (
              <div key={i} style={{ margin: 5, padding: 10, background: '#f0f0f0', borderRadius: 8 }}>
                {card.image} {card.name} - {card.rarity} (Jual: {card.sellPrice}🪙)
              </div>
            ))}
            <button onClick={onClose}>Tutup</button>
          </div>
        )}
      </div>
    </div>
  );
}
const overlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const panelStyle = { background: 'white', color: 'black', padding: 20, borderRadius: 15, width: '90%', maxWidth: 400, maxHeight: '80%', overflowY: 'auto' };
