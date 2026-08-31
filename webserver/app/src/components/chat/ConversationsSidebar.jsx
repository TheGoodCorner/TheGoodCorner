import { Search, Plus } from 'lucide-react';
import { Button } from '../UI/Button';
import { EmptyState } from '../UI/EmptyState';
import ConversationListItem from './ConversationListItem';

function ConversationsSidebar({
  conversations,
  hiddenConversationIds,
  loading,
  activeConversationId,
  search,
  onSearchChange,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  className = '',
}) {
  const visibleConversations = conversations.filter(
    (c) => !hiddenConversationIds.includes(String(c.interlocutor.id))
  );

  const filteredConversations = search.trim()
    ? visibleConversations.filter((c) => c.interlocutor.username?.toLowerCase().includes(search.trim().toLowerCase()))
    : visibleConversations;

  return (
    <aside className={`w-full sm:w-80 flex-shrink-0 border-r border-[var(--color-border)] flex-col ${className}`}>
      <div className="p-3 border-b border-[var(--color-border)]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-[var(--radius-md)] bg-[var(--color-surface-hover)] animate-pulse" />
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <EmptyState
            description="Aucune conversation pour l'instant."
            action={
              <Button variant="outline" size="sm" icon={Plus} onClick={onNewConversation}>
                Démarrer une discussion
              </Button>
            }
            className="h-full px-6 py-16"
          />
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.interlocutor.id}
              interlocutor={conversation.interlocutor}
              lastMessage={conversation.lastMessage}
              isActive={String(conversation.interlocutor.id) === String(activeConversationId)}
              onClick={() => onSelectConversation(conversation.interlocutor.id)}
              onDelete={() => onDeleteConversation(conversation.interlocutor.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default ConversationsSidebar;