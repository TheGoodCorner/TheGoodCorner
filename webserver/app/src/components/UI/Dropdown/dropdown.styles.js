// src/components/UI/Dropdown/dropdown.styles.js

/**
 * Centralized style system for Dropdown components.
 * Uses Tailwind classes and a variants/sizes pattern.
 */

export const dropdownStyles = {
  // Base container
  container: 'relative',

  // Backdrop (click to close)
  backdrop: 'fixed inset-0 z-[999]',

  // Menu container and positioning
  menu: {
    base: 'absolute bg-white border border-gray-300 rounded-lg shadow-lg min-w-max z-[1000] overflow-hidden py-1',
    position: {
      'bottom-right': 'top-full right-0 mt-2',
      'bottom-left': 'top-full left-0 mt-2',
      'top-right': 'bottom-full right-0 mb-2',
      'top-left': 'bottom-full left-0 mb-2',
    },
  },

  // Trigger button
  trigger: {
    base: 'flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200',
    sizes: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    },
    variants: {
      default: 'hover:bg-gray-100 rounded',
      ghost: 'hover:bg-gray-50',
    },
  },

  // Menu item
  item: {
    base: 'px-4 py-2 text-sm cursor-pointer transition-colors duration-150 hover:bg-gray-100',
    variants: {
      default: 'text-gray-800',
      danger: 'text-red-600 hover:bg-red-50',
      disabled: 'text-gray-400 cursor-not-allowed hover:bg-transparent',
    },
  },

  // Divider
  divider: 'h-px bg-gray-200 my-1',

  // Header (non-clickable text)
  header: 'px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider',
};

/**
 * Utility function to merge Tailwind classes
 */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
