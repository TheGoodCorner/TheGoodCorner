
export function formatMessageTime(dateString) {
  if (!dateString)
    return '';
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function formatConversationTime(dateString) {
  if (!dateString)
    return '';
  const date = new Date(dateString);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}