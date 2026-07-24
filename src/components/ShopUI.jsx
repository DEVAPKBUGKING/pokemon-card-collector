import { useState } from 'react';
import useGameStore from '../store/useGameStore';

export default function ShopUI({ onClose }) {
  const { shopItems, gold, diamond, removeGold, removeDiamond, addDiamond, addGold, updateShopStock } = useGameStore();
  const [exchangeAmount, setExchangeAmount] = useState(1000);

  const buy = (item) => {
    if (item.stock <= 0) return alert('Stok habis!');
    if (item.priceGold > 0 && gold < item.priceGold) return alert('Emas kurang!');
    if (item.priceDiamond > 0 && diamond < item.priceDiamond) return alert('Berlian kurang!');
    if (item.priceGold > 0) removeGold(item.priceGold);
    if (item.priceDiamond > 0) removeDiamond(item.priceDiamond);
    updateShopStock(item.id, item.stock - 1);
    // Jika item adalah pack, kita bisa trigger buka pack? Nanti via OpenPackUI, cukup beri notif.
    alert(`Berhasil membeli ${item.name}!`);
  };

  const exchange = () => {
    if (gold < exchangeAmount) return alert('Emas tidak cukup!');
    removeGold(exchangeAmount);
    addDiamond(1);
    alert('1 Berlian berhasil ditukar!');
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2>🛒 Toko</h2>
        <div style={{ margin: '10px 0' }}>
          <p>Tukar Emas → Berlian (1000:1)</p>
          <button onClick={exchange} disabled={gold < 1000}>Tukar 1000 Emas</button>
        </div>
        <hr />
        <h3>Barang</h3>
        {shopItems.map((item) => (
          <div key={item.id} style={{ borderBottom: '1px solid #ccc', padding: 8 }}>
            <b>{item.name}</b> - Stok: {item.stock}<br />
            {item.priceGold > 0 && `🪙 ${item.priceGold} `}
            {item.priceDiamond > 0 && `💎 ${item.priceDiamond}`}
            <button onClick={() => buy(item)} style={{ float: 'right' }}>Beli</button>
          </div>
        ))}
        <button onClick={onClose} style={{ marginTop: 10 }}>Tutup</button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const panelStyle = {
  background: 'white', color: 'black', padding: 20, borderRadius: 15, width: '90%', maxWidth: 400, maxHeight: '80%', overflowY: 'auto'
};
