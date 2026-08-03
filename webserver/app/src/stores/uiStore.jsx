import { create } from 'zustand';

export const useUIStore = create((set) => ({
  openDropdowns: {},

  toggleDropdown: (id) => 
    set((state) => ({
      openDropdowns: {
        ...state.openDropdowns,
        [id]: !state.openDropdowns[id]
      }
    })),

  closeDropdown: (id) => 
    set((state) => ({
      openDropdowns: {
        ...state.openDropdowns,
        [id]: false
      }
    })),

  closeAllDropdowns: () => 
    set({ openDropdowns: {} })
}));
