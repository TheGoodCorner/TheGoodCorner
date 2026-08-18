import { StarRating } from '../UI/StarRating';
import { getInitials, getAvatarColor } from '../../utils/avatar';

export const  ReviewCard = ({ author, avatar, rating, date, content, product }) => (
  <div className='bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 sm:p-5'>
    {/* Header review */}
    <div className='flex items-start justify-between mb-3'>
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className='w-10 h-10 rounded-full flex-shrink-0 object-cover'
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(author)}`}>
            {getInitials(author)}
          </div>
        )}
        <div className='min-w-0'>
          <p className='text-sm font-semibold text-[var(--color-text)] truncate'>
            {author}
          </p>
          <p className='text-xs text-[var(--color-text-muted)]'>
            {date}
          </p>
        </div>
      </div>
      <StarRating rating={rating} size={16} />
    </div>

    {/* Contenu avis */}
    <p className='text-sm text-[var(--color-text)] mb-3 leading-relaxed'>
      {content}
    </p>

    {/* Produit (optionnel) */}
    {product && (
      <p className='text-xs text-[var(--color-text-muted)] italic'>
        Produit : <span className='font-medium'>{product}</span>
      </p>
    )}
  </div>
);