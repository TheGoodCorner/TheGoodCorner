import { UserPlus, UserMinus, Check, X, Clock } from 'lucide-react';
import { Button } from '../UI/Button';
import { useFriendStore, useFriendshipStatus } from '../../stores/friendStore';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

/**
 * Bouton d'action amitié pour un profil vendeur donné (userId = id du
 * profil consulté, jamais le tien — SellerProfile.jsx redirige déjà vers
 * /profile si c'est le cas, mais on se protège quand même ici au cas où
 * ce composant serait réutilisé ailleurs plus tard).
 */
export function FriendActionButton({ userId }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useUserStore((state) => state.user);
  const { status, request, friend } = useFriendshipStatus(userId);
  const actionLoadingId = useFriendStore((state) => state.actionLoadingId);
  const sendFriendRequest = useFriendStore((state) => state.sendFriendRequest);
  const acceptRequest = useFriendStore((state) => state.acceptRequest);
  const rejectRequest = useFriendStore((state) => state.rejectRequest);
  const cancelOrRemove = useFriendStore((state) => state.cancelOrRemove);

  if (currentUser && String(currentUser.id) === String(userId)) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Button to="/authentication" variant="outline" icon={UserPlus}>
        Se connecter pour ajouter en ami
      </Button>
    );
  }

  if (status === 'friends') {
    return (
      <Button
        variant="outline"
        icon={UserMinus}
        loading={actionLoadingId === friend.friendRequestId}
        disabled={!friend.friendRequestId}
        onClick={() => cancelOrRemove(friend.friendRequestId, { isFriend: true })}
      >
        Amis · Retirer
      </Button>
    );
  }

  if (status === 'sent') {
    return (
      <Button
        variant="outline"
        icon={Clock}
        loading={actionLoadingId === request.id}
        onClick={() => cancelOrRemove(request.id)}
      >
        Demande envoyée · Annuler
      </Button>
    );
  }

  if (status === 'received') {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          icon={Check}
          loading={actionLoadingId === request.id}
          onClick={() => acceptRequest(request.id)}
        >
          Accepter
        </Button>
        <Button
          variant="outline"
          icon={X}
          loading={actionLoadingId === request.id}
          onClick={() => rejectRequest(request.id)}
          aria-label="Refuser la demande"
          title="Refuser la demande"
        />
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      icon={UserPlus}
      loading={actionLoadingId === `send-${userId}`}
      onClick={() => sendFriendRequest(userId)}
    >
      Ajouter en ami
    </Button>
  );
}
