import React from 'react';
import { InfoCard } from '../UI/InfoCard';
import { FormField } from '../UI/FormField';
import { Dropdown } from '../UI/Dropdown';
import {
  Mail, Phone, Award, TrendingUp, MapPin, Star, Shield,
  Globe, Map, Building2, Route, Hash, FileText, ChevronDown,
} from 'lucide-react';

// Compose une adresse lisible à partir des champs Location (résumé une
// ligne pour la grille). additionnal_infos volontairement absent ici —
// visible dans le détail via LocationInfoCard.
function formatAddress(location) {
  if (!location) return null;
  const line1 = [location.houseNumber, location.street].filter(Boolean).join(' ');
  const line2 = [location.city, location.region, location.country].filter(Boolean).join(', ');
  return [line1, line2].filter(Boolean).join(', ') || null;
}

// "06 12 34 56 78" — purement pour l'affichage en lecture ; l'input en
// édition reste en chiffres bruts, plus simple à taper/corriger.
function formatPhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return phone;
  return digits.match(/.{1,2}/g).join(' ');
}

function LocationDetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className='flex items-baseline justify-between gap-4 text-sm py-0.5'>
      <span className='text-[var(--color-text-muted)] flex-shrink-0'>{label}</span>
      <span className='text-[var(--color-text)] font-medium text-right'>{value}</span>
    </div>
  );
}

// Carte "Localisation" de la grille : résumé + petit dropdown pour voir le
// détail complet (y compris additionnal_infos, jamais affiché ailleurs).
function LocationInfoCard({ location }) {
  const address = formatAddress(location);
  const streetLine = location ? [location.houseNumber, location.street].filter(Boolean).join(' ') : '';

  return (
    <div className='flex items-start gap-3'>
      <MapPin size={20} className='text-[var(--color-primary)] flex-shrink-0 mt-0.5' />
      <div className='min-w-0 flex-1'>
        <p className='text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide'>
          Localisation
        </p>
        <div className='flex items-center gap-1 mt-0.5'>
          <p className='text-sm font-medium text-[var(--color-text)] truncate'>
            {address || 'Non renseigné'}
          </p>
          {location && (
            <Dropdown>
              <Dropdown.Trigger
                className='p-0.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors flex-shrink-0'
                aria-label="Voir le détail de l'adresse"
              >
                <ChevronDown size={14} />
              </Dropdown.Trigger>
              <Dropdown.Menu align='left'>
                <Dropdown.Label>
                  <p className='text-sm font-semibold text-[var(--color-text)]'>Adresse complète</p>
                </Dropdown.Label>
                <Dropdown.Separator />
                <div className='px-4 py-2'>
                  <LocationDetailRow label='Adresse' value={streetLine} />
                  <LocationDetailRow label='Ville' value={location.city} />
                  <LocationDetailRow label='Région' value={location.region} />
                  <LocationDetailRow label='Pays' value={location.country} />
                  <LocationDetailRow label='Complément' value={location.additionnal_infos} />
                </div>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfilInfos({ user, userRating, reviewCount, isEditing, form, onFieldChange, onLocationFieldChange }) {
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
          value={isEditing ? form.phoneNumber : formatPhone(user?.phoneNumber)}
          editable
          isEditing={isEditing}
          onChange={onFieldChange('phoneNumber')}
          type='tel'
          placeholder='0612345678'
        />
        <InfoCard 
          icon={Award}
          label='Produits publiés'
          value={user?.product?.length || '0'}
        />
        <InfoCard 
          icon={TrendingUp}
          label='Taux de vente'
          value='89%  (fausse donee)'
        />
        <LocationInfoCard location={user?.location} />
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

      {/* Adresse — édition uniquement. 5 champs obligatoires côté backend
          (voir schema Prisma Location), ça ne tenait pas dans une seule
          InfoCard, d'où ce bloc dédié qui n'apparaît qu'en editing. */}
      {isEditing && (
        <div className='mb-8 pb-8 border-b border-[var(--color-border)]'>
          <h3 className='text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-4'>
            Adresse
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl'>
            <FormField
              id='loc-country'
              label='Pays'
              icon={Globe}
              value={form.location.country}
              onChange={onLocationFieldChange('country')}
              placeholder='France'
            />
            <FormField
              id='loc-region'
              label='Région'
              icon={Map}
              value={form.location.region}
              onChange={onLocationFieldChange('region')}
              placeholder='Île-de-France'
            />
            <FormField
              id='loc-city'
              label='Ville'
              icon={Building2}
              value={form.location.city}
              onChange={onLocationFieldChange('city')}
              placeholder='Paris'
            />
            <FormField
              id='loc-street'
              label='Rue'
              icon={Route}
              value={form.location.street}
              onChange={onLocationFieldChange('street')}
              placeholder='Rue de Rivoli'
            />
            <FormField
              id='loc-house-number'
              label='Numéro'
              icon={Hash}
              type='number'
              value={form.location.house_number}
              onChange={onLocationFieldChange('house_number')}
              placeholder='12'
            />
            <FormField
              id='loc-additional'
              label='Complément (optionnel)'
              icon={FileText}
              value={form.location.additionnal_infos}
              onChange={onLocationFieldChange('additionnal_infos')}
              placeholder='Bâtiment B, 3e étage...'
            />
          </div>
          <p className='text-xs text-[var(--color-text-muted)] mt-3'>
            Laisse tous les champs vides si tu ne veux pas renseigner d'adresse pour l'instant.
          </p>
        </div>
      )}

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
