import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set) => ({
      gold: 50,
      diamond: 0,
      collection: [],

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      removeGold: (amount) => set((state) => ({ gold: Math.max(0, state.gold - amount) })),
      addDiamond: (amount) => set((state) => ({ diamond: state.diamond + amount })),
      removeDiamond: (amount) => set((state) => ({ diamond: Math.max(0, state.diamond - amount) })),
      addCard: (card) => set((state) => ({ collection: [...state.collection, { ...card, id: Date.now() + Math.random() }] })),
      removeCard: (cardId) => set((state) => ({ collection: state.collection.filter((c) => c.id !== cardId) })),
    }),
    { name: 'pokemon-game-storage' }
  )
);

export default useGameStore;
