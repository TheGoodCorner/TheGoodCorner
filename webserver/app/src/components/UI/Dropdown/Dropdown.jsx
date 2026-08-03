import React from 'react';
import { useUIStore } from '../../../stores/uiStore';
import { DropdownContext } from './DropdownContext'
import { dropdownStyles, cx } from './dropdown.styles'



export function Dropdown({ id, trigger, children}) {

const { openDropdowns, toggleDropdown, closeDropdown } = useUIStore();
const isOpen = openDropdowns[id] || false;

  return (
    <div className="w-fit relative" onClick={openDropdowns(id)}>
      <div>{trigger}</div>
      {isOpen && (
        <ul 
          className='
            min-w-max absolute right-0 mt-2
            bg-white divide-y divide-gray-100
            rounded-lg shadow overflow-hidden
            '>
              {children}
          </ul>
        )}
    </div>
  );
}


export function DropdownItem({children}) {

  return <li className={'flex gap-3 items-center  px-4 py-2 text-gray-800 hover:bg-gray-50 cursor-pointer'}>{children}</li>
}

