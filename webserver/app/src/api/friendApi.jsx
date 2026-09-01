import { apiClient } from './client';

// POST /api/friend-requests — envoyer une demande d'amitié
export async function sendFriendRequestRequest(receiverId) {
  const { data } = await apiClient.post('/api/friend-requests', { receiverId });
  return data;
}

// GET /api/friend-requests?status=PENDING|ACCEPTED&type=received|sent
export async function fetchFriendRequestsRequest(filters = {}) {
  const { data } = await apiClient.get('/api/friend-requests', { params: filters });
  return data;
}

// PATCH /api/friend-requests/:id/accept — accepter une demande
export async function acceptFriendRequestRequest(id) {
  const { data } = await apiClient.patch(`/api/friend-requests/${id}/accept`);
  return data;
}

// PATCH /api/friend-requests/:id/reject — rejeter une demande
export async function rejectFriendRequestRequest(id) {
  const { data } = await apiClient.patch(`/api/friend-requests/${id}/reject`);
  return data;
}

// DELETE /api/friend-requests/:id — retirer un ami / annuler une demande
export async function deleteFriendRequestRequest(id) {
  await apiClient.delete(`/api/friend-requests/${id}`);
  return null; // 204 No Content
}

// GET /api/friends — récupérer tous les amis acceptés
export async function fetchFriendsRequest() {
  const { data } = await apiClient.get('/api/friends');
  return data;
}

// GET /api/friend-requests/pending — récupérer les demandes en attente
export async function fetchPendingFriendRequestsRequest() {
  const { data } = await apiClient.get('/api/friend-requests/pending');
  return data;
}
