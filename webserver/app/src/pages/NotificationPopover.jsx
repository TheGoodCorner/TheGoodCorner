import { useUIStore } from '../stores/uiStore';
import { useMessageStore } from '../stores/messageStore';
import { useNotificationStore } from '../stores/notificationStore';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function NotificationPopover() {
  const isOpen = useUIStore((state) => state.UserInterfaces['notification-popover']) || false;
  const closeUi = useUIStore((state) => state.closeUi);
  const conversations = useMessageStore((state) => state.conversations);
  const unreadCounts = useMessageStore((state) => state.unreadCounts);
  const setActiveConversation = useMessageStore((state) => state.setActiveConversation);
  const reviewNotifications = useNotificationStore((state) => state.reviewNotifications);
  const friendNotifications = useNotificationStore((state) => state.friendNotifications);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const navigate = useNavigate();

  const unreadConversations = conversations.filter(
    (c) => (unreadCounts[c.interlocutor.id] || 0) > 0
  );
  const unreadReviews = reviewNotifications.filter((n) => !n.read);
  const unreadFriendNotifs = (friendNotifications || []).filter((n) => !n.read);
  const notificationsEnabled = useNotificationStore((state) => state.notificationsEnabled);

  if (!notificationsEnabled)
	return null;
  const allNotifications = [
    ...unreadConversations.map((c) => ({
      type: 'message',
      key: `msg-${c.interlocutor.id}`,
      date: c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).getTime() : 0,
      data: c,
    })),
    ...unreadReviews.map((n) => ({
      type: 'review',
      key: `review-${n.id}`,
      date: n.id,
      data: n,
    })),
    ...unreadFriendNotifs.map((n) => ({
      type: 'friend',
      key: `friend-${n.id}`,
      date: n.id,
      data: n,
    })),
  ].sort((a, b) => b.date - a.date);

  const hasNotifications = allNotifications.length > 0;

  const handleMessageClick = (conversationId) => {
    setActiveConversation(conversationId);
    closeUi('notification-popover');
    navigate('/messagerie');
  };

  const handleReviewClick = () => {
    markAllRead();
    closeUi('notification-popover');
    navigate('/profile?tab=reviews');
  };

  const handleFriendNotifClick = () => {
    markAllRead();
    closeUi('notification-popover');
    navigate('/profile?tab=friends');
  };

  return (
    <div className="absolute top-10 right-0 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4 text-[var(--color-text)]">Notifications</h3>
              {!hasNotifications ? (
                <p className="text-sm text-[var(--color-text-muted)]">Aucune notification</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {allNotifications.map((notif) =>
                    notif.type === 'message' ? (
                      <li
                        key={notif.key}
                        onClick={() => handleMessageClick(notif.data.interlocutor.id)}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-[var(--color-text)] truncate">
                            {notif.data.interlocutor.username}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)] truncate">
                            {notif.data.lastMessage?.content || '...'}
                          </span>
                        </div>
                        <div className="flex-shrink-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {unreadCounts[notif.data.interlocutor.id]}
                        </div>
                      </li>
                    ) : notif.type === 'review' ? (
                      <li
                        key={notif.key}
                        onClick={() => handleReviewClick()}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-[var(--color-text)] truncate">
                            Nouvel avis
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)] truncate">
                            {notif.data.authorUsername} a laissé un avis ({notif.data.rating}★)
                          </span>
                        </div>
                      </li>
                    ) : (
                      <li
                        key={notif.key}
                        onClick={() => handleFriendNotifClick()}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-[var(--color-text)] truncate">
                            {notif.data.type === 'request' && 'Demande d\'ami'}
                            {notif.data.type === 'accepted' && 'Demande acceptée'}
                            {notif.data.type === 'rejected' && 'Demande refusée'}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)] truncate">
                            {notif.data.type === 'request' && `${notif.data.sender?.username} veut vous ajouter`}
                            {notif.data.type === 'accepted' && `${notif.data.acceptedBy?.username} a accepté votre demande`}
                            {notif.data.type === 'rejected' && `${notif.data.rejectedBy?.username} a refusé votre demande`}
                          </span>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
