import React, { useState } from 'react';
import { Button } from '../components/UI/Button';
import { UserRoundPen, Star, MapPin, Phone, Shield, Award, TrendingUp, MessageCircle, Mail } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { ProductForm } from '../components/products/ProductForm';
import { useUserStore } from '../stores/userStore';

const StarRating = ({ rating = 0, size = 18, maxStars = 5 }) => (
  <div className='flex gap-1'>
    {Array.from({ length: maxStars }).map((_, i) => (
      <Star 
        key={i} 
        size={size} 
        className={i < Math.ceil(rating) ? 'fill-yellow-400 text-green-500' : 'fill-gray-300 text-gray-300'}
      />
    ))}
  </div>
);


const InfoCard = ({ icon: Icon, label, value }) => (
  <div className='flex items-start gap-3'>
    <Icon size={20} className='text-[var(--color-primary)] flex-shrink-0 mt-0.5' />
    <div className='min-w-0'>
      <p className='text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide'>
        {label}
      </p>
      <p className='text-sm font-medium text-[var(--color-text)] mt-0.5'>
        {value || 'Non renseigné'}
      </p>
    </div>
  </div>
);

const ReviewCard = ({ author, avatar, rating, date, content, product }) => (
  <div className='bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 sm:p-5'>
    {/* Header review */}
    <div className='flex items-start justify-between mb-3'>
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        <div className='w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex-shrink-0' />
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

function Profile() {
  const { user } = useUserStore();
  const { createProduct } = useProductStore();
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Formater la date de création
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  const displayName = user?.name || user?.username || 'Utilisateur';
  const userRating = user?.sellerRating || 0;
  const reviewCount = user?.sellerReviewCount || 0;

  const formatReviews = (reviews) => {
    if (!Array.isArray(reviews)) return [];
    
    return reviews.map((content, index) => ({
      id: index,
      author: 'Client vérifié',
      rating: userRating,
      date: formatDate(user?.updatedAt || new Date().toISOString()),
      content: typeof content === 'string' ? content : '',
      product: null
    }));
  };

  const sellerReviews = formatReviews(user?.sellerReviews || []);
  const reviewsToDisplay = showAllReviews ? sellerReviews : sellerReviews.slice(0, 3);
  
  return (
    <div className='min-h-screen bg-[var(--color-bg)]'>
      {/* SECTION PROFIL */}
      <section className='border-b border-[var(--color-border)] bg-[var(--color-surface)]'>
        <div className='px-6 sm:px-8 lg:px-12 py-8 sm:py-10'>
          {/* Header: Avatar + Bouton */}
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

            {/* Bouton modifier */}
            <Button 
              className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-5 py-2 rounded-lg transition-colors flex-shrink-0'
              variant='secondary'
              icon={UserRoundPen}
              iconPosition='right'
            >  
              Modifier
            </Button>
          </div>

          {/* Grille d'infos */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 pb-8 border-b border-[var(--color-border)]'>
            <InfoCard 
              icon={Mail}
              label='Email'
              value={user?.email}
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
              value={user?.location?.name || 'Non renseigné'}
            />
            <InfoCard 
              icon={Star}
              label='Note moyenne'
              value={userRating > 0 ? `${userRating.toFixed(1)}/5.0` : 'Aucune note'}
            />
            <InfoCard 
              icon={Shield}
              label='Paiements'
              value='Sécurisés  (fausse donee)'
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
            <p className='text-sm text-[var(--color-text)] leading-relaxed max-w-2xl'>
              {user?.bio || 'Aucune description fournie'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION MES AVIS */}
      {reviewCount > 0 && (
        <section className='border-b border-[var(--color-border)] bg-[var(--color-bg)]'>
          <div className='px-6 sm:px-8 lg:px-12 py-16'>
            <div className='max-w-4xl'>
              <div className='flex items-center gap-3 mb-8'>
                <MessageCircle size={28} className='text-[var(--color-primary)]' />
                <div>
                  <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-text)]'>
                    Mes avis
                  </h2>
                  <p className='text-sm text-[var(--color-text-muted)] mt-1'>
                    {reviewCount} avis des clients
                  </p>
                </div>
              </div>

              <div className='grid gap-4'>
                {reviewsToDisplay.map(review => (
                  <ReviewCard
                    key={review.id}
                    author={review.author}
                    rating={review.rating}
                    date={review.date}
                    content={review.content}
                    product={review.product}
                  />
                ))}
              </div>

              {!showAllReviews && reviewCount > 3 && (
                <button 
                  onClick={() => setShowAllReviews(true)}
                  className='mt-6 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors'
                >
                  Voir tous les avis ({reviewCount})
                </button>
              )}

              {showAllReviews && reviewCount > 3 && (
                <button 
                  onClick={() => setShowAllReviews(false)}
                  className='mt-6 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors'
                >
                  Voir moins d'avis
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION FORMULAIRE PRODUIT */}
      <section className='bg-[var(--color-surface)]'>
        <div className='px-6 sm:px-8 lg:px-12 py-16'>
          <div className='max-w-2xl'>
            <div className='mb-10'>
              <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2'>
                Ajouter un produit
              </h2>
              <p className='text-[var(--color-text-muted)]'>
                Remplire les informations pour créer un nouveau produit
              </p>
            </div>
            <ProductForm />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
