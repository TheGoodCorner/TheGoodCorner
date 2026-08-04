import { useState } from "react"
import { CircleUserRound } from 'lucide-react'

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconDimensions = { sm: 16, md: 20, lg: 24 };

function Avatar({ src, alt = '', size = 'md', className = '' }) {
  // Si l'image casse (404, url invalide...), on retombe sur l'icône
  const [imgFailed, setImgFailed] = useState(false);
  const showFallback = !src || imgFailed;

  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full bg-[var(--color-surface-hover)] overflow-hidden shrink-0',
        sizeStyles[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {showFallback ? (
        <CircleUserRound size={iconDimensions[size]} className="text-[var(--color-text-muted)]" aria-hidden="true" />
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      )}
    </span>
  );
}

export default Avatar;
