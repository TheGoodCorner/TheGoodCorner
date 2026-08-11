import { apiClient } from './client';


export async function fetchUserRequest() {
  const { data } = await apiClient.get('/user/profile');
  return data;
}

export async function updateUserRequest(updates) {
  const { data } = await apiClient.put('/user/profile', updates);
  return data;
}
