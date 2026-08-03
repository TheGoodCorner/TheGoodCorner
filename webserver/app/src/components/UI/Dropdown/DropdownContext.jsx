import React from 'react'

export const DropdownContext = React.createContext({
  dropdownId: null,
  isOpen: false,
  closeDropdown: () => {}
});