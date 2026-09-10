import { UserPlus, UserCheck, Check, X, Clock } from 'lucide-react';
import { Button } from '../UI/Button';
import { useFriendStore } from '../../stores/friendStore';
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

  const friends = useFriendStore((state) => state.friends);
  const friendRequests = useFriendStore((state) => state.friendRequests);
  const sentFriendRequests = useFriendStore((state) => state.sentFriendRequests);

  const actionLoadingId = useFriendStore((state) => state.actionLoadingId);
  const sendFriendRequest = useFriendStore((state) => state.sendFriendRequest);
  const acceptRequest = useFriendStore((state) => state.acceptFriendRequest);
  const rejectFriendRequest = useFriendStore((state) => state.rejectFriendRequest)
  const deleteFriendRequest = useFriendStore((state) => state.deleteFriendRequest);

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

  const friend = friends.find((f) => String(f.id) === String(userId));
  const receivedRequest = friendRequests.find((r) => String(r.senderId) === String(userId));
  const sentRequest = sentFriendRequests.find((r) => String(r.receiverId) === String(userId));

  if (friend) {
    return (
      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold 
        bg-[var(--color-primary)] bg-opacity-20
        border border-[var(--color-primary)] border-opacity-40
        text-[var(--color-on-primary)]
        uppercase tracking-wide
        transition-all duration-150 
        hover:bg-opacity-30 hover:gap-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-on-primary)] animate-pulse"></div>
        <UserCheck size={14} />
        Amis
      </span>
    );
  }

  if (sentRequest) {
    return (
      <Button
        variant="outline"
        icon={Clock}
        loading={actionLoadingId === sentRequest.id}
        onClick={() => deleteFriendRequest(sentRequest.id)}
      >
        Demande envoyée · Annuler
      </Button>
    );
  }

  if (receivedRequest) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          icon={Check}
          loading={actionLoadingId === receivedRequest.id}
          onClick={() => acceptRequest(receivedRequest.id)}
        >
          Accepter
        </Button>
        <Button
          variant="outline"
          icon={X}
          loading={actionLoadingId === receivedRequest.id}
          onClick={() => rejectFriendRequest(receivedRequest.id)}
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
