import React from 'react';
import { Button } from '../UI/Button';
import { UserRoundPen, Shield, Check, X } from 'lucide-react';
import { StarRating } from '../UI/StarRating';

export function ProfilHeader({
  user,
  displayName,
  userRating,
  reviewCount,
  formatDate,
  isEditing,
  submitting,
  onEdit,
  onCancel,
  onSave,
}) {
  return (
    <div className='flex items-start justify-between gap-6 mb-8'>
      <div className='flex gap-5 flex-1'>
        {/* Avatar */}
        <div className='w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-blue-600 shadow-lg flex items-center justify-center text-white font-bold text-2xl'>
          {displayName.charAt(0).toUpperCase()}
        </div>
        
        {/* Infos principales */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-3 mb-2'>
            <h1 className='text-2xl sm:text-3xl font-bold text-[var(--color-text)]'>
              {displayName}
            </h1>
            <Shield size={20} className='text-[var(--color-primary)] flex-shrink-0' />
          </div>
          
          <div className='flex items-center gap-2 mb-3'>
            <StarRating rating={userRating} size={18} maxStars={5}/>
            <span className='text-xs text-[var(--color-text-muted)] font-medium'>
              {userRating.toFixed(1)} ({reviewCount} avis)
            </span>
          </div>
          
          <p className='text-sm text-[var(--color-text-muted)]'>
            Vendeur depuis {formatDate(user?.createdAt)} • En ligne
          </p>
        </div>
      </div>

      {/* Bouton modifier, ou Annuler/Sauvegarder pendant l'édition */}
      {isEditing ? (
        <div className='flex items-center gap-2 flex-shrink-0'>
          <Button
            onClick={onCancel}
            variant='outline'
            icon={X}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button
            onClick={onSave}
            className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-5 py-2 rounded-lg transition-colors'
            variant='secondary'
            icon={Check}
            iconPosition='right'
            loading={submitting}
          >
            Sauvegarder
          </Button>
        </div>
      ) : (
        <Button 
          onClick={onEdit}
          className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-5 py-2 rounded-lg transition-colors flex-shrink-0'
          variant='secondary'
          icon={UserRoundPen}
          iconPosition='right'
        >  
          Modifier
        </Button>
      )}
    </div>
  );
}
