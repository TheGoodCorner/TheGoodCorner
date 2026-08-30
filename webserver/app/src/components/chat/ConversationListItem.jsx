import Avatar from '../UI/Avatar';
import { formatConversationTime } from '../../utils/date';

function ConversationListItem({ interlocutor, lastMessage, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 text-left border-b border-[var(--color-border)] transition-colors ${
        isActive ? 'bg-[var(--color-surface-hover)]' : 'hover:bg-[var(--color-surface-hover)]'
      }`}
    >
      <Avatar src={interlocutor.avatar} alt={interlocutor.username} name={interlocutor.username} size={44} className="flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--color-text)] truncate">
            {interlocutor.username}
          </span>
          {lastMessage?.createdAt && (
            <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">
              {formatConversationTime(lastMessage.createdAt)}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
          {lastMessage?.content || 'Nouvelle conversation'}
        </p>
      </div>
    </button>
  );
}

export default ConversationListItem;