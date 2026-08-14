import React from 'react';
import { InfoCard } from '../UI/InfoCard';
import { Mail, Phone, Award, TrendingUp, MapPin, Star, Shield } from 'lucide-react';

export function ProfilInfos({ user, userRating, reviewCount, isEditing, form, onFieldChange }) {
  return (
    <>
      {/* Grille d'infos */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 pb-8 border-b border-[var(--color-border)]'>
        <InfoCard 
          icon={Mail}
          label='Email'
          value={isEditing ? form.email : user?.email}
          editable
          isEditing={isEditing}
          onChange={onFieldChange('email')}
          type='email'
        />
        <InfoCard 
          icon={Phone}
          label='Téléphone'
          value='+33 6 12 34 56 78  (fausse donee)'
        />
        <InfoCard 
          icon={Award}
          label='Produits publiés'
          value={user?.product?.length || 0}
        />
        <InfoCard 
          icon={TrendingUp}
          label='Taux de vente'
          value='89%  (fausse donee)'
        />
        <InfoCard 
          icon={MapPin}
          label='Localisation'
          value={isEditing ? form.location : (user?.location?.name || 'Non renseigné')}
          editable
          isEditing={isEditing}
          onChange={onFieldChange('location')}
        />
        <InfoCard 
          icon={Star}
          label='Note moyenne'
          value={userRating > 0 ? `${userRating.toFixed(1)}/5.0` : 'Aucune note'}
        />
        <InfoCard 
          icon={Shield}
          label='Paiements'
          value='Sécurisés  (fausse donnee)'
        />
        <InfoCard 
          icon={Award}
          label='Statut'
          value={reviewCount > 20 ? 'Vendeur Elite' : 'Vendeur'}
        />
      </div>

      {/* Bio / Description */}
      <div>
        <h3 className='text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3'>
          À propos
        </h3>
        {isEditing ? (
          <textarea
            value={form.bio}
            onChange={onFieldChange('bio')}
            rows={4}
            placeholder='Parle un peu de toi...'
            className='w-full max-w-2xl text-sm text-[var(--color-text)] leading-relaxed bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none transition-colors'
          />
        ) : (
          <p className='text-sm text-[var(--color-text)] leading-relaxed max-w-2xl'>
            {user?.bio || 'Aucune description fournie'}
          </p>
        )}
      </div>
    </>
  );
}
