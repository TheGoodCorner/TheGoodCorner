import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ProductForm } from '../components/products/ProductForm';
import { useProfileEditForm } from '../hooks/useProfileEditForm';
import { ProfilHeader } from '../components/profile/ProfilHeader';
import { ProfilInfos } from '../components/profile/ProfilInfos';
import { ReviewCard } from '../components/reviews/ReviewCard';

function Profile() {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const {
    user,
    isEditing,
    form,
    submitting,
    error,
    avatarSrc,
    startEditing,
    cancelEditing,
    handleChange,
    handleLocationChange,
    handleAvatarChange,
    save,
  } = useProfileEditForm();

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
         <ProfilHeader 
            user={user}
            displayName={displayName}
            userRating={userRating}
            reviewCount={reviewCount}
            formatDate={formatDate}
            isEditing={isEditing}
            submitting={submitting}
            avatarSrc={avatarSrc}
            onAvatarChange={handleAvatarChange}
            onEdit={startEditing}
            onCancel={cancelEditing}
            onSave={save}
          />

          {isEditing && error && (
            <div className='mb-6 p-4 bg-[var(--color-danger-surface)] border border-[var(--color-danger)] rounded-[var(--radius-md)]'>
              <p className='text-sm text-[var(--color-danger)] font-medium' role='alert'>
                {error}
              </p>
            </div>
          )}

          <ProfilInfos 
            user={user}
            userRating={userRating}
            reviewCount={reviewCount}
            isEditing={isEditing}
            form={form}
            onFieldChange={handleChange}
            onLocationFieldChange={handleLocationChange}
          />
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
