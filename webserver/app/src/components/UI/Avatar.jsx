import { useState, useEffect } from 'react';
import { CircleUserRound } from 'lucide-react';
import { getInitials, getAvatarColor } from '../../utils/avatar';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Préréglages "design system" (classes Tailwind statiques, donc compatibles
// responsive comme xl ci-dessous, contrairement à des classes générées
// dynamiquement). Pour une taille ponctuelle non couverte par un
// préréglage, passe directement un nombre en px à `size` (ex: size={44}).
const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 sm:w-24 sm:h-24 text-2xl',
};
const ICON_PX = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 };

/**
 * Avatar unifié : image si dispo (avec fallback propre si elle casse),
 * sinon un badge de repli.
 *
 * - variant='initials' (défaut) : initiales + couleur dérivée de `name`
 *   (mêmes helpers que partout : utils/avatar.jsx). Sans `name`, retombe
 *   sur une icône générique (ex: pas encore connecté).
 * - variant='gradient' : dégradé marque + première lettre du nom — réservé
 *   aux avatars "hero" (ProfilHeader, SellerProfile).
 *
 * `size` : préréglage ('xs'|'sm'|'md'|'lg'|'xl') ou nombre de px pour un
 * besoin ponctuel non couvert par les préréglages.
 */
function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  shape = 'circle',
  variant = 'initials',
  className = '',
}) {
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => setImgFailed(false), [src]);

  const showImage = Boolean(src) && !imgFailed;
  const isPreset = typeof size === 'string' && SIZE_CLASSES[size];

  const bgClass =
    variant === 'gradient'
      ? 'bg-gradient-to-br from-[var(--color-primary)] to-blue-600 shadow-lg'
      : name
      ? getAvatarColor(name)
      : 'bg-[var(--color-surface-hover)]';

  const iconPx = isPreset ? ICON_PX[size] : Math.round(Number(size) * 0.55);

  return (
    <span
      style={isPreset ? undefined : { width: size, height: size, fontSize: Math.round(Number(size) * 0.4) }}
      className={cx(
        'inline-flex items-center justify-center overflow-hidden shrink-0 font-bold text-white',
        isPreset && SIZE_CLASSES[size],
        shape === 'square' ? 'rounded-2xl' : 'rounded-full',
        bgClass,
        className
      )}
    >
      {showImage ? (
        <img src={src} alt={alt} onError={() => setImgFailed(true)} className="w-full h-full object-cover" />
      ) : name ? (
        variant === 'gradient' ? name.charAt(0).toUpperCase() : getInitials(name)
      ) : (
        <CircleUserRound size={iconPx} className="text-[var(--color-text-muted)]" aria-hidden="true" />
      )}
    </span>
  );
}

export default Avatar;