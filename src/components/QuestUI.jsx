import { useEffect } from 'react';
import useGameStore from '../store/useGameStore';

export default function QuestUI({ onClose }) {
  const { dailyQuests, gold, addGold, resetDailyQuests, lastQuestReset } = useGameStore();

  // Reset quest jika hari berganti
  useEffect(() => {
    const now = Date.now();
    if (now - lastQuestReset > 86400000) {
      resetDailyQuests();
    }
  }, []);

  const claimReward = (quest) => {
    if (quest.progress >= quest.goal) {
      addGold(quest.reward);
      alert(`Dapat ${quest.reward} emas!`);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2>📜 Quest Harian</h2>
        {dailyQuests.map((q) => (
          <div key={q.id} style={{ margin: 10, padding: 10, background: '#eee', borderRadius: 8 }}>
            <p>{q.desc} ({q.progress}/{q.goal})</p>
            <button disabled={q.progress < q.goal} onClick={() => claimReward(q)}>
              Klaim {q.reward}🪙
            </button>
          </div>
        ))}
        <button onClick={onClose} style={{ marginTop: 10 }}>Tutup</button>
      </div>
    </div>
  );
}
const overlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const panelStyle = { background: 'white', color: 'black', padding: 20, borderRadius: 15, width: '90%', maxWidth: 400, maxHeight: '80%', overflowY: 'auto' };
