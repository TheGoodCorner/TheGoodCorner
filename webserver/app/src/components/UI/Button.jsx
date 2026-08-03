import { Loader2, ShoppingCart, Heart, Trash2, ArrowRight } from 'lucide-react';
import Avatar from './Avatar';

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg ' +
  'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400',
  outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400',
  ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
};

const sizeStyles = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

// Padding carré pour les boutons icône seule (sans texte à côté)
const iconOnlySizeStyles = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
};

const iconDimensions = { sm: 14, md: 16, lg: 18 };

// Petit helper pour combiner les classes sans dépendance externe (clsx-like)
function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconOnly: iconOnlyProp = false,
  iconPosition = 'left',
  className = '',
  children,
  ...props
}) {
  const iconOnly = iconOnlyProp || (Boolean(Icon) && !children);
  const dim = iconDimensions[size];

  if (
    typeof process !== 'undefined' &&
    process.env?.NODE_ENV !== 'production' &&
    iconOnly &&
    !props['aria-label']
  ) {
    console.warn("Button: ajoute un aria-label quand le bouton n'a qu'une icône, sans texte.");
  }

  return (
    <button
      className={cx(
        baseStyles,
        variantStyles[variant],
        iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 size={dim} className="animate-spin" aria-hidden="true" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={dim} aria-hidden="true" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={dim} aria-hidden="true" />}
    </button>
  );
}