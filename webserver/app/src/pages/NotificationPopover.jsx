import { useUIStore } from '../stores/uiStore';
import { useMessageStore } from '../stores/messageStore';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function NotificationPopover() {
  const isOpen = useUIStore((state) => state.UserInterfaces['notification-popover']) || false;
  const closeUi = useUIStore((state) => state.closeUi);
  const conversations = useMessageStore((state) => state.conversations);
  const unreadCounts = useMessageStore((state) => state.unreadCounts);
  const setActiveConversation = useMessageStore((state) => state.setActiveConversation);
  const navigate = useNavigate();

  const unreadConversations = conversations.filter(
    (c) => (unreadCounts[c.interlocutor.id] || 0) > 0
  );

  const handleClick = (conversationId) => {
    setActiveConversation(conversationId);
    closeUi('notification-popover');
    navigate('/messagerie');
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
              {unreadConversations.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">Aucune notification</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {unreadConversations.map((c) => (
                    <li
                      key={c.interlocutor.id}
                      onClick={() => handleClick(c.interlocutor.id)}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[var(--color-text)] truncate">
                          {c.interlocutor.username}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] truncate">
                          {c.lastMessage?.content || '...'}
                        </span>
                      </div>
                      <div className="flex-shrink-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {unreadCounts[c.interlocutor.id]}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
