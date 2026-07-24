import { useEffect, useRef, useState } from 'react';
import { database, auth } from '../firebase';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';

const COLORS = ['#e63946', '#457b9d', '#2a9d8f', '#f4a261', '#e76f51', '#8338ec', '#ff006e'];

export default function Spawn() {
  const [players, setPlayers] = useState({});
  const [myPos, setMyPos] = useState({ x: 200, y: 300 });
  const [color, setColor] = useState(COLORS[0]);
  const [name, setName] = useState('Trainer');
  const canvasRef = useRef(null);
  const userId = auth.currentUser?.uid;

  // Sinkron posisi ke Firebase pas tap
  useEffect(() => {
    if (!userId) return;
    const userRef = ref(database, `players/${userId}`);

    const handleMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
      const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        setMyPos({ x, y });
        set(userRef, { x, y, color, name, timestamp: serverTimestamp() });
      }
    };

    const canvasEl = canvasRef.current;
    canvasEl?.addEventListener('click', handleMove);
    canvasEl?.addEventListener('touchstart', handleMove);
    onDisconnect(userRef).remove();

    return () => {
      canvasEl?.removeEventListener('click', handleMove);
      canvasEl?.removeEventListener('touchstart', handleMove);
    };
  }, [userId, color, name]);

  // Ambil data semua pemain
  useEffect(() => {
    const playersRef = ref(database, 'players');
    const unsub = onValue(playersRef, (snap) => {
      setPlayers(snap.exists() ? snap.val() : {});
    });
    return () => unsub();
  }, []);

  // Gambar semua pemain di canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let anim;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Object.entries(players).forEach(([id, data]) => {
        if (!data) return;
        ctx.fillStyle = data.color || '#ccc';
        ctx.beginPath();
        ctx.arc(data.x, data.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(data.name || '?', data.x, data.y - 22);
        // Badge "Kamu" kalo id sendiri
        if (id === userId) {
          ctx.fillStyle = '#ffd166';
          ctx.font = '10px Segoe UI';
          ctx.fillText('⭐ Kamu', data.x, data.y + 30);
        }
      });
      anim = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(anim);
  }, [players, userId]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Panel kustomisasi kecil */}
      <div style={{ background: 'rgba(0,0,0,0.6)', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
          style={{ width: 100 }}
        />
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          {COLORS.map((c) => (
            <option key={c} value={c} style={{ background: c }}>
              ● {c}
            </option>
          ))}
        </select>
        <span style={{ color: '#aaa', fontSize: 12 }}>Tap di layar buat gerak</span>
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 100}
        style={{ background: '#2d6a4f', flex: 1, display: 'block' }}
      />
    </div>
  );
COLORSS
