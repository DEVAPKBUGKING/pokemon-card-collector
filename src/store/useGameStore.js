import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Mata uang
      gold: 50,
      diamond: 0,
      // Koleksi kartu
      collection: [],
      // Item toko (stok & harga)
      shopItems: [
        { id: 1, name: 'Booster Pack', type: 'pack', priceGold: 50, priceDiamond: 0, stock: 10 },
        { id: 2, name: 'Topi Trainer', type: 'cosmetic', priceGold: 100, priceDiamond: 5, stock: 5 },
        { id: 3, name: 'Sepatu Lari', type: 'cosmetic', priceGold: 80, priceDiamond: 3, stock: 8 },
        { id: 4, name: 'Baju Keren', type: 'cosmetic', priceGold: 200, priceDiamond: 10, stock: 3 },
        { id: 5, name: 'Kacamata Keren', type: 'cosmetic', priceGold: 150, priceDiamond: 8, stock: 4 },
      ],
      // Quest harian
      dailyQuests: [
        { id: 'q1', desc: 'Buka 1 Booster Pack', goal: 1, progress: 0, reward: 20 },
        { id: 'q2', desc: 'Jual 3 kartu', goal: 3, progress: 0, reward: 30 },
        { id: 'q3', desc: 'Beli item di toko', goal: 1, progress: 0, reward: 15 },
      ],
      lastQuestReset: Date.now(),
      // Karakter kustomisasi
      character: {
        color: '#e63946',
        hat: null,     // id item kosmetik
        shirt: null,
        glasses: null,
      },

      // Actions
      addGold: (amount) => set((s) => ({ gold: s.gold + amount })),
      removeGold: (amount) => set((s) => ({ gold: Math.max(0, s.gold - amount) })),
      addDiamond: (amount) => set((s) => ({ diamond: s.diamond + amount })),
      removeDiamond: (amount) => set((s) => ({ diamond: Math.max(0, s.diamond - amount) })),
      addCard: (card) => set((s) => ({ collection: [...s.collection, { ...card, id: Date.now() + Math.random() }] })),
      removeCard: (cardId) => set((s) => ({ collection: s.collection.filter((c) => c.id !== cardId) })),
      updateShopStock: (itemId, newStock) => set((s) => ({
        shopItems: s.shopItems.map((item) => item.id === itemId ? { ...item, stock: newStock } : item)
      })),
      resetDailyQuests: () => set((s) => ({
        dailyQuests: s.dailyQuests.map((q) => ({ ...q, progress: 0 })),
        lastQuestReset: Date.now(),
      })),
      incrementQuestProgress: (questId) => set((s) => ({
        dailyQuests: s.dailyQuests.map((q) => q.id === questId ? { ...q, progress: Math.min(q.progress + 1, q.goal) } : q)
      })),
      setCharacter: (newChar) => set({ character: newChar }),
    }),
    { name: 'pokemon-3d-storage' }
  )
);

export default useGameStore;
