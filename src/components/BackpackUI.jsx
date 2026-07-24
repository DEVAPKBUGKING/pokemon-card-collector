import useGameStore from '../store/useGameStore';

export default function BackpackUI({ onClose }) {
  const collection = useGameStore((s) => s.collection);
  const removeCard = useGameStore((s) => s.removeCard);
  const addGold = useGameStore((s) => s.addGold);

  const sell = (card) => {
    const price = card.sellPrice || 10;
    addGold(price);
    removeCard(card.id);
    alert(`${card.name} dijual seharga ${price} emas`);
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2>🎒 Backpack</h2>
        {collection.length === 0 ? <p>Belum ada kartu.</p> : (
          collection.map((card) => (
            <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', padding: 5 }}>
              <span>{card.name} ({card.rarity})</span>
              <button onClick={() => sell(card)}>Jual 🪙{card.sellPrice || 10}</button>
            </div>
          ))
        )}
        <button onClick={onClose} style={{ marginTop: 10 }}>Tutup</button>
      </div>
    </div>
  );
}
// Gunakan overlayStyle dan panelStyle yang sama, bisa diexport terpisah atau didefinisikan di sini.
const overlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const panelStyle = { background: 'white', color: 'black', padding: 20, borderRadius: 15, width: '90%', maxWidth: 400, maxHeight: '80%', overflowY: 'auto' };
