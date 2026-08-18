import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MessageCircle, PackageSearch, Shield, BadgeCheck } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/UI/Button';
import { StarRating } from '../components/UI/StarRating';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { ReviewForm } from '../components/reviews/ReviewForm';
import ProductCard from '../components/products/ProductCard';

function SellerProfileSkeleton() {
  return (
    <div className="container py-10 animate-pulse">
      <div className="h-4 w-40 bg-[var(--color-surface-hover)] rounded mb-6" />
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--color-surface-hover)] flex-shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-7 w-48 bg-[var(--color-surface-hover)] rounded" />
            <div className="h-4 w-32 bg-[var(--color-surface-hover)] rounded" />
            <div className="h-4 w-40 bg-[var(--color-surface-hover)] rounded" />
          </div>
        </div>
      </div>
      <div className="h-10 w-64 bg-[var(--color-surface-hover)] rounded mb-8" />
      <div className="products-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-[var(--color-surface-hover)] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
        active
          ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
          : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </button>
  );
}

function SellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const viewedUser = useUserStore((state) => state.viewedUser);
  const viewedUserLoading = useUserStore((state) => state.viewedUserLoading);
  const viewedUserError = useUserStore((state) => state.viewedUserError);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const currentUser = useUserStore((state) => state.user);

  const [activeTab, setActiveTab] = useState('listings');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // C'est ton propre profil : direction la vue privée éditable plutôt que
  // la vue publique.
  useEffect(() => {
    if (currentUser && String(currentUser.id) === String(id)) {
      navigate('/profile', { replace: true });
    }
  }, [currentUser, id, navigate]);

  useEffect(() => {
    fetchUser(id);
    setActiveTab('listings');
    setShowAllReviews(false);
    setImgFailed(false);
  }, [id, fetchUser]);

  // Évite d'afficher un instant le profil du vendeur précédent quand on
  // navigue d'une page vendeur à une autre (même logique que ProduitDetail).
  const isFresh = viewedUser && String(viewedUser.id) === String(id);

  if (viewedUserLoading || !isFresh) {
    if (viewedUserError) {
      return (
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Vendeur introuvable</h1>
          <p className="text-[var(--color-text-muted)] mb-6">Ce profil n'existe pas ou n'est plus disponible.</p>
          <Button to="/products" variant="primary">Retour aux produits</Button>
        </div>
      );
    }
    return <SellerProfileSkeleton />;
  }

  const displayName = viewedUser.name || viewedUser.username || 'Utilisateur';
  const userRating = viewedUser.sellerRating || 0;
  // Les produits embarqués dans GET /user/:id n'ont pas de champ `author`
  // imbriqué (redondant, on est déjà sur la page de cet auteur) — on le
  // reconstruit ici à partir de viewedUser pour que ProductCard (qui
  // affiche vendeur + note) fonctionne sans changement côté back.
  const listings = (viewedUser.product || []).map((product) => ({ ...product, author: viewedUser }));
  const memberSince = formatDate(viewedUser.createdAt);
  const showImage = Boolean(viewedUser.avatar) && !imgFailed;

  // Les avis sont déjà inclus dans viewedUser (receivedReviews) — pas
  // besoin d'un fetch séparé. Filtre défensif sur les soft-deleted.
  // NB: pas de reviewAuthor imbriqué ici (juste authorId), donc pas de
  // vrai pseudo/avatar affichable pour l'instant — voir ReviewCard plus bas.
  const activeReviews = (viewedUser.receivedReviews || []).filter((r) => !r.deletedAt);
  const alreadyReviewed = Boolean(currentUser && activeReviews.some((r) => r.authorId === currentUser.id));
  const canReview = isAuthenticated && currentUser?.id && String(currentUser.id) !== String(id) && !alreadyReviewed;

  const reviewsToDisplay = showAllReviews ? activeReviews : activeReviews.slice(0, 3);

  return (
    <div className="bg-[var(--color-bg)]">
      <div className="container py-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={16} strokeWidth={2.75} />
          Retour aux produits
        </Link>

        {/* Carte vendeur */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-blue-600 shadow-lg flex items-center justify-center text-white font-bold text-2xl">
              {showImage ? (
                <img
                  src={viewedUser.avatar}
                  alt={displayName}
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{displayName}</h1>
                <Shield size={20} className="text-[var(--color-primary)] flex-shrink-0" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={userRating} size={18} />
                <span className="text-xs text-[var(--color-text-muted)] font-medium">
                  {userRating > 0 ? `${userRating.toFixed(1)} (${activeReviews.length} avis)` : 'Aucune note'}
                </span>
              </div>

              {memberSince && (
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-1">
                  <Calendar size={14} />
                  Membre depuis {memberSince}
                </p>
              )}

              {viewedUser.phoneNumber && (
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <BadgeCheck size={14} className="text-[var(--color-primary)]" />
                  Téléphone renseigné
                </p>
              )}
            </div>
          </div>

          {viewedUser.bio && (
            <p className="text-sm text-[var(--color-text)] leading-relaxed mt-6 pt-6 border-t border-[var(--color-border)]">
              {viewedUser.bio}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--color-border)] flex gap-8 mb-8">
          <TabButton active={activeTab === 'listings'} onClick={() => setActiveTab('listings')}>
            Annonces ({listings.length})
          </TabButton>
          <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
            Avis ({activeReviews.length})
          </TabButton>
        </div>

        {activeTab === 'listings' ? (
          listings.length > 0 ? (
            <div className="products-grid">
              {listings.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)]">
              <PackageSearch size={40} className="text-[var(--color-text-muted)] mb-4" />
              <p className="font-semibold text-[var(--color-text)] mb-1">Ce vendeur n'a pas d'annonce en ligne</p>
              <p className="text-sm text-[var(--color-text-muted)]">Repasse plus tard pour voir ses prochains articles.</p>
            </div>
          )
        ) : (
          <div className="max-w-3xl">
            {!currentUser && (
              <div className="mb-6 p-4 bg-[var(--color-surface-hover)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-muted)]">
                <Link to="/authentication" className="text-[var(--color-primary)] font-medium hover:underline">
                  Connecte-toi
                </Link>{' '}
                pour laisser un avis à ce vendeur.
              </div>
            )}

            {canReview && <ReviewForm targetUserId={viewedUser.id} onSuccess={() => fetchUser(id)} />}

            {currentUser && alreadyReviewed && (
              <p className="text-sm text-[var(--color-text-muted)] mb-6">
                Tu as déjà laissé un avis pour ce vendeur.
              </p>
            )}

            {activeReviews.length > 0 ? (
              <div className="grid gap-4">
                {reviewsToDisplay.map((review) => (
                  <ReviewCard
                    key={review.id}
                    avatar={review.reviewAuthor.avatar}
                    author={review.reviewAuthor.username}
                    rating={review.reviewRating}
                    date={formatDate(review.createdAt)}
                    content={review.reviews}
                  />
                ))}

                {!showAllReviews && activeReviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors text-left"
                  >
                    Voir tous les avis ({activeReviews.length})
                  </button>
                )}
                {showAllReviews && activeReviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(false)}
                    className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors text-left"
                  >
                    Voir moins d'avis
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)]">
                <MessageCircle size={40} className="text-[var(--color-text-muted)] mb-4" />
                <p className="font-semibold text-[var(--color-text)] mb-1">Aucun avis pour l'instant</p>
                <p className="text-sm text-[var(--color-text-muted)]">Ce vendeur n'a pas encore reçu d'avis client.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;
