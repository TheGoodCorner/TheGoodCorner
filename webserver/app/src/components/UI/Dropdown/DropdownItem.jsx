import React, { useContext } from 'react';
import { useUIStore } from '../../../stores/uiStore';
import { DropdownContext } from './DropdownContext';
import { dropdownStyles, cx } from './dropdown.styles';

export function DropdownItem({
  children,
  onClick,
  as: Component = 'button',
  variant = 'default',
  className,
  ...props
}) {

  const { dropdownId } = useContext(DropdownContext);
  const { closeDropdown } = useUIStore();

  const handleClick = (e) => {
    // On appelle le onClick custom (si fourni)
    if (onClick) onClick(e);
    closeDropdown(dropdownId);
  };

  const classes = cx(
    dropdownStyles.item.base,
    className
  );
  
  return (
    <Component // Permet d'utiliser des Link ou des button
      className={classes}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Component>
  );
}

export default DropdownItem;
