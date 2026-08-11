import { apiClient } from './client';

export async function loginRequest(email, password) {
  // axios retourne ce que le serveur renvoie (data) + des metadonnee
  // En destructurant '{ data }' on garde que ce qui nous interesse (les donnees renvoyer par le back)
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}

export async function registerRequest(email, password, username) {
  const { data } = await apiClient.post('/auth/register', { email, password, username });
  return data;
}

// Appelé au chargement de l'app (voir authStore.initAuth) et par l'intercepteur
// de client.jsx quand un access token expire. Le cookie refresh httpOnly part
// automatiquement avec la requête (withCredentials) — rien à lui passer ici.
export async function refreshRequest() {
  const { data } = await apiClient.post('/auth/refresh');
  return data;
}

export async function logoutRequest() {
  await apiClient.post('/auth/logout');
}