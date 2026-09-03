import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  PackageSearch,
  Shield,
  BadgeCheck,
  UserPlus,
  UserMinus,
  Check,
  X,
  Clock,
} from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";
import { useReviewStore } from "../stores/reviewStore";
import { useFriendStore } from "../stores/friendStore";
import { Button } from "../components/UI/Button";
import { StarRating } from "../components/UI/StarRating";
import { ReviewCard } from "../components/reviews/ReviewCard";
import { ReviewForm } from "../components/reviews/ReviewForm";
import ProductCard from "../components/products/ProductCard";
import Avatar from "../components/UI/Avatar";
import { TabButton } from "../components/UI/TabButton";
import { EmptyState } from "../components/UI/EmptyState";
import { formatMonthYear } from "../utils/date";

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

function SellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { updateReview, deleteReview } = useReviewStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const viewedUser = useUserStore((state) => state.viewedUser);
  const viewedUserLoading = useUserStore((state) => state.viewedUserLoading);
  const viewedUserError = useUserStore((state) => state.viewedUserError);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const currentUser = useUserStore((state) => state.user);

  const friends = useFriendStore((state) => state.friends);
  const friendRequests = useFriendStore((state) => state.friendRequests);
  const sentFriendRequests = useFriendStore((state) => state.sentFriendRequests);

  const acceptFriendRequest = useFriendStore((state) => state.acceptFriendRequest)
  const rejectFriendRequest = useFriendStore((state) => state.rejectFriendRequest)
  const sendFriendRequest = useFriendStore((state) => state.sendFriendRequest)
  const deleteFriendRequest = useFriendStore((state) => state.deleteFriendRequest)
  const { submitting: friendSubmitting } = useFriendStore();

  const [activeTab, setActiveTab] = useState("listings");
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (currentUser && String(currentUser.id) === String(id)) {
      navigate("/profile", { replace: true });
    }
  }, [currentUser, id, navigate]);

  useEffect(() => {
    if (!id) return;
    fetchUser(id);
    setActiveTab("listings");
    setShowAllReviews(false);
  }, [id, fetchUser]);

  // Nécessaire pour savoir dans quel état est la relation avec CE vendeur
  // (aucune / envoyée / reçue / amis) — voir friendStatus plus bas.
  useEffect(() => {
    if (isAuthenticated) {
    }
  }, [isAuthenticated, id]);

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(id, reviewId);
    await fetchUser(id);
  };
  const handleUpdateReview = async (reviewId, updates) => {
    await updateReview(id, reviewId, updates);
    await fetchUser(id);
  };
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

  const displayName = viewedUser.name || viewedUser.username || "Utilisateur";
  const userRating = viewedUser.sellerRating || 0;
  const listings = (viewedUser.product || []).map((product) => ({ ...product, author: viewedUser }));
  const memberSince = formatMonthYear(viewedUser.createdAt);

  // Relation d'amitié avec ce vendeur, déduite des listes déjà en store
  // (alimentées par le useEffect juste au-dessus) — pas de requête dédiée
  // par profil visité.
  const existingFriend = friends.find((f) => String(f.id) === String(viewedUser.id));
  const receivedRequestFromViewedUser = friendRequests.find(
    (r) => String(r.sender?.id) === String(viewedUser.id)
  );
  const sentRequestToViewedUser = sentFriendRequests.find(
    (r) => String(r.receiver?.id) === String(viewedUser.id)
  );
  const friendStatus = existingFriend
    ? "friends"
    : receivedRequestFromViewedUser
    ? "received"
    : sentRequestToViewedUser
    ? "sent"
    : "none";

  const activeReviews = (viewedUser.receivedReviews || []).filter((r) => !r.deletedAt);
  const alreadyReviewed = Boolean(currentUser && activeReviews.some((r) => r.authorId === currentUser.id));
  const canReview =
    isAuthenticated && currentUser?.id && String(currentUser.id) !== String(id) && !alreadyReviewed;

  const reviewsToDisplay = showAllReviews ? activeReviews : activeReviews.slice(0, 3);

  return (
    <div className="bg-[var(--color-bg)]">
      <div className="container py-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6">
          <ArrowLeft size={16} strokeWidth={2.75} />
          Retour aux produits
        </Link>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-5 flex-1 min-w-0">
              <Avatar
                src={viewedUser.avatar}
                alt={displayName}
                name={displayName}
                size="xl"
                shape="square"
                variant="gradient"
                className="flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{displayName}</h1>
                  <Shield size={20} className="text-[var(--color-primary)] flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={userRating} size={18} />
                  <span className="text-xs text-[var(--color-text-muted)] font-medium">
                    {userRating > 0 ? `${userRating.toFixed(1)} (${activeReviews.length} avis)` : "Aucune note"}
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

            {/* Bouton d'amitié — masqué si pas connecté (idem section avis
                un peu plus bas, pas de doublon de message de login ici). */}
            {currentUser && (
              <div className="flex-shrink-0">
                {friendStatus === "friends" && (
                  <Button
                    icon={UserMinus}
                    variant="outline"
                    loading={friendSubmitting}
                    onClick={() => deleteFriendRequest(existingFriend.friendRequestId)}
                    disabled={!existingFriend.friendRequestId}
                  >
                    Amis · Retirer
                  </Button>
                )}

                {friendStatus === "sent" && (
                  <Button
                    icon={Clock}
                    variant="outline"
                    loading={friendSubmitting}
                    onClick={() => deleteFriendRequest(sentRequestToViewedUser.id)}
                  >
                    Demande envoyée · Annuler
                  </Button>
                )}

                {friendStatus === "received" && (
                  <div className="flex items-center gap-2">
                    <Button
                      icon={Check}
                      variant="primary"
                      loading={friendSubmitting}
                      onClick={() => acceptFriendRequest(receivedRequestFromViewedUser.id)}
                    >
                      Accepter
                    </Button>
                    <Button
                      icon={X}
                      variant="outline"
                      loading={friendSubmitting}
                      onClick={() => rejectFriendRequest(receivedRequestFromViewedUser.id)}
                      aria-label="Refuser la demande"
                      title="Refuser la demande"
                    />
                  </div>
                )}

                {friendStatus === "none" && (
                  <Button
                    icon={UserPlus}
                    variant="primary"
                    loading={friendSubmitting}
                    onClick={() => sendFriendRequest(viewedUser.id)}
                  >
                    Ajouter en ami
                  </Button>
                )}
              </div>
            )}
          </div>

          {viewedUser.bio && (
            <p className="text-sm text-[var(--color-text)] leading-relaxed mt-6 pt-6 border-t border-[var(--color-border)]">
              {viewedUser.bio}
            </p>
          )}
        </div>

        <div className="border-b border-[var(--color-border)] flex gap-8 mb-8">
          <TabButton active={activeTab === "listings"} onClick={() => setActiveTab("listings")}>
            Annonces ({listings.length})
          </TabButton>
          <TabButton active={activeTab === "reviews"} onClick={() => setActiveTab("reviews")}>
            Avis ({activeReviews.length})
          </TabButton>
        </div>

        {activeTab === "listings" ? (
          listings.length > 0 ? (
            <div className="products-grid">
              {listings.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="Ce vendeur n'a pas d'annonce en ligne"
              description="Repasse plus tard pour voir ses prochains articles."
              className="py-16 bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)]"
            />
          )
        ) : (
          <div className="max-w-3xl">
            {!currentUser && (
              <div className="mb-6 p-4 bg-[var(--color-surface-hover)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-muted)]">
                <Link to="/authentication" className="text-[var(--color-primary)] font-medium hover:underline">
                  Connecte-toi
                </Link>{" "}
                pour laisser un avis à ce vendeur.
              </div>
            )}

            {canReview && (
              <ReviewForm targetUserId={viewedUser.id} onSuccess={() => fetchUser(id)} />
            )}

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
                    date={formatMonthYear(review.createdAt)}
                    content={review.reviews}
                    authorId={review.authorId}
                    currentUserId={currentUser?.id}
                    onSave={(updates) => handleUpdateReview(review.id, updates)}
                    onDelete={() => handleDeleteReview(review.id)}
                  />
                ))}

                {!showAllReviews && activeReviews.length > 3 && (
                  <button onClick={() => setShowAllReviews(true)} className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors text-left">
                    Voir tous les avis ({activeReviews.length})
                  </button>
                )}
                {showAllReviews && activeReviews.length > 3 && (
                  <button onClick={() => setShowAllReviews(false)} className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors text-left">
                    Voir moins d'avis
                  </button>
                )}
              </div>
            ) : (
              <EmptyState
                icon={MessageCircle}
                title="Aucun avis pour l'instant"
                description="Ce vendeur n'a pas encore reçu d'avis client."
                className="py-16 bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)]"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;