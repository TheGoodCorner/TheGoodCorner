import React, { useContext } from 'react';
import { useUIStore } from '../../../stores/uiStore';
import { DropdownContext } from './DropdownContext';
import { dropdownStyles, cx } from './dropdown.styles';
import { Button } from '../Button';

export function DropdownTrigger({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...buttonProps
}) {
  // On récupère l'ID du dropdown depuis le contexte
  const { dropdownId } = useContext(DropdownContext);  
  const { toggleDropdown } = useUIStore();

  return (
    <Button 
      onClick={() => toggleDropdown(dropdownId)} 
      variant='ghost'
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

export default DropdownTrigger;
