import React, { useContext } from 'react';
import { DropdownContext } from './DropdownContext';
import { dropdownStyles, cx } from './dropdown.styles';

export function DropdownMenu({ children, className }) {

  const { isOpen, menuPosition } = useContext(DropdownContext);
  // Si le dropdown n'est pas ouvert, on ne rend rien
  if (!isOpen) return null;

  const classes = cx(
    dropdownStyles.menu.base,
    dropdownStyles.menu.position[menuPosition],
    className
  );

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export default DropdownMenu;
