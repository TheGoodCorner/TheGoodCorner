import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  openDropdowns: {},

  isDropdownOpen: (id) => get().openDropdowns[id] ?? false,

  toggleDropdown: (id) => 
    set((state) => ({
      openDropdowns: {...state.openDropdowns, [id]: !state.openDropdowns[id]}
    })),

  closeDropdown: (id) => 
    set((state) => ({
      openDropdowns: {...state.openDropdowns, [id]: false}
    })),

  openDropdown: (id) => 
    set((state) => ({
      openDropdowns: { ...state.openDropdowns, [id]: true }
    })),

  closeAllDropdowns: () => 
    set({ openDropdowns: {} })
}));
