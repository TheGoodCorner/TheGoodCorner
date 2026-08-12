import React, { useState } from 'react';
import { Button } from '../components/UI/Button';
import { UserRoundPen, Star, MapPin, Phone, Shield, Award, TrendingUp, MessageCircle } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { ProductForm } from '../components/products/ProductForm';

const StarRating = ({ rating = 5, size = 18 }) => (
  <div className='flex gap-1'>
    {Array.from({ length: rating }).map((_, i) => (
      <Star key={i} size={size} className='fill-yellow-400 text-green-400' />
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
        {value}
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

const REVIEWS = [
  {
    id: 1,
    author: 'Marie Dubois',
    rating: 5,
    date: 'Il y a 2 semaines',
    content: 'Produit exactement comme décrit, super qualité. Emballage impeccable et livraison rapide. Je recommande vivement !',
    product: 'Chaise vintage années 70'
  },
  {
    id: 2,
    author: 'Thomas Lefevre',
    rating: 5,
    date: 'Il y a 1 mois',
    content: 'Vendeur très professionnel. Excellente communication et produit de très haute qualité. 10/10',
    product: 'Table basse marbre'
  },
  {
    id: 3,
    author: 'Sophie Martin',
    rating: 4,
    date: 'Il y a 3 semaines',
    content: 'Très beau meuble, légère différence de couleur par rapport aux photos mais conforme à la description.',
    product: 'Commode 4 tiroirs'
  },
  {
    id: 4,
    author: 'Pierre Gonzalez',
    rating: 5,
    date: 'Il y a 1 mois',
    content: 'Transaction parfaite. Le vendeur est à l\'écoute et répond rapidement aux questions. À bientôt !',
    product: 'Fauteuil club'
  },
  {
    id: 5,
    author: 'Céline Rousseau',
    rating: 4,
    date: 'Il y a 3 jours',
    content: 'Très satisfaite de mon achat. La qualité est au rendez-vous, même si le délai de livraison a été un peu plus long que prévu. Bon rapport qualité-prix.',
    product: 'Lampe de sol vintage'
  },
  {
    id: 6,
    author: 'Nicolas Bertrand',
    rating: 5,
    date: 'Il y a 1 semaine',
    content: 'Excellente expérience ! Produit impeccable, bien emballé et le vendeur a été très réactif. Je recommande sans hésiter pour tous vos achats de mobilier.',
    product: 'Étagère bois massif'
  },
  {
    id: 7,
    author: 'Amélie Lemoine',
    rating: 5,
    date: 'Il y a 5 jours',
    content: 'Superbe découverte ! Exactement ce que je cherchais. Le vendeur a pris le temps de répondre à toutes mes questions avant l\'achat. Top !',
    product: 'Miroir rond années 60'
  }
];

function Profile() {
  const { createProduct } = useProductStore();
  
  // Par défaut afficher 3 avis, puis tous après clique
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviewsToDisplay = showAllReviews ? REVIEWS : REVIEWS.slice(0, 3);

  return (
    <div className='min-h-screen bg-[var(--color-bg)]'>
      {/* SECTION PROFIL */}
      <section className='border-b border-[var(--color-border)] bg-[var(--color-surface)]'>
        <div className='px-6 sm:px-8 lg:px-12 py-8 sm:py-10'>
          {/* Header: Avatar + Bouton */}
          <div className='flex items-start justify-between gap-6 mb-8'>
            <div className='flex gap-5 flex-1'>
              {/* Avatar */}
              <div className='w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-blue-600 shadow-lg' />
              
              {/* Infos principales */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-3 mb-2'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-[var(--color-text)]'>
                    Jean Dupont
                  </h1>
                  <Shield size={20} className='text-[var(--color-primary)] flex-shrink-0' />
                </div>
                
                <div className='flex items-center gap-2 mb-3'>
                  <StarRating rating={5} size={18} />
                  <span className='text-xs text-[var(--color-text-muted)] font-medium'>4.8 (127 avis)</span>
                </div>
                
                <p className='text-sm text-[var(--color-text-muted)]'>
                  Vendeur professionnel depuis 2021 • En ligne
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
              icon={MapPin}
              label='Localisation'
              value='Paris, France'
            />
            <InfoCard 
              icon={Phone}
              label='Téléphone'
              value='+33 6 12 34 56 78'
            />
            <InfoCard 
              icon={Award}
              label='Produits publiés'
              value='47'
            />
            <InfoCard 
              icon={TrendingUp}
              label='Taux de vente'
              value='89%'
            />
            <InfoCard 
              icon={MapPin}
              label='Membre depuis'
              value='Janvier 2021'
            />
            <InfoCard 
              icon={Star}
              label='Note moyenne'
              value='4.8/5.0'
            />
            <InfoCard 
              icon={Shield}
              label='Paiements'
              value='Sécurisés'
            />
            <InfoCard 
              icon={Award}
              label='Statut'
              value='Vendeur Elite'
            />
          </div>

          {/* Bio / Description */}
          <div>
            <h3 className='text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3'>
              À propos
            </h3>
            <p className='text-sm text-[var(--color-text)] leading-relaxed max-w-2xl'>
              Spécialiste en mobilier vintage et contemporain depuis plus de 5 ans. 
              Je sélectionne chaque pièce avec soin pour vous offrir des produits de qualité. 
              Livraison rapide et service client réactif.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION MES AVIS */}
      <section className='border-b border-[var(--color-border)] bg-[var(--color-bg)]'>
        <div className='px-6 sm:px-8 lg:px-12 py-16'>
          <div className='max-w-4xl'>
            {/* Header section */}
            <div className='flex items-center gap-3 mb-8'>
              <MessageCircle size={28} className='text-[var(--color-primary)]' />
              <div>
                <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-text)]'>
                  Mes avis
                </h2>
                <p className='text-sm text-[var(--color-text-muted)] mt-1'>
                  {REVIEWS.length} avis des clients
                </p>
              </div>
            </div>

            {/* Grille des avis */}
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

            {/* Voir plus - Affiche seulement si avis cachés */}
            {!showAllReviews && REVIEWS.length > 3 && (
              <button 
                onClick={() => setShowAllReviews(true)}
                className='mt-6 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors'
              >
                Voir tous les avis ({REVIEWS.length})
              </button>
            )}

            {/* Voir moins - Affiche seulement si tous les avis affichés */}
            {showAllReviews && REVIEWS.length > 3 && (
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

      {/* SECTION FORMULAIRE PRODUIT */}
      <section className='bg-[var(--color-surface)]'>
        <div className='px-6 sm:px-8 lg:px-12 py-16'>
          <div className='max-w-2xl'>
            <div className='mb-10'>
              <h2 className='text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2'>
                Ajouter un produit
              </h2>
              <p className='text-[var(--color-text-muted)]'>
                Remplisse les informations pour créer un nouveau produit
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
