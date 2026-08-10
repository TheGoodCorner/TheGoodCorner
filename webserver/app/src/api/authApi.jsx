import { apiClient } from './client';

// Tant que true (ou REACT_APP_USE_MOCKS non défini), toutes ces fonctions
// renvoient des données simulées — l'app reste 100% fonctionnelle sans
// backend. REACT_APP_USE_MOCKS=false dans .env une fois l'API
// prête : authStore, useLoginForm et Login.jsx n'ont besoin d'aucun changement.
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS !== 'false';

// Sert UNIQUEMENT à simuler une session persistante en mode mock, en
// l'absence d'un vrai cookie httpOnly
// Aucune donnée sensible dedans, juste "qui était connecté"
const MOCK_SESSION_KEY = 'mock_session';


function mockAuthResponse(email, username = 'user') {
  const response = {
    user: { id: 1, email, username, avatar: '👤' },
    token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
  };
  sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(response.user));
  return response;
}

export async function loginRequest(email, password) {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAuthResponse(email);
  }

  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}

export async function registerRequest(email, password, username) {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAuthResponse(email, username);
  }

  const { data } = await apiClient.post('/auth/register', { email, password, username });
  return data;
}

// Appelé au chargement de l'app (voir authStore.initAuth) et par l'intercepteur
// de client.jsx quand un access token expire. Le cookie refresh httpOnly part
// automatiquement avec la requête (withCredentials) — rien à lui passer ici.
export async function refreshRequest() {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const saved = sessionStorage.getItem(MOCK_SESSION_KEY);
    if (!saved) throw new Error('Aucune session à restaurer.');
    return {
      user: JSON.parse(saved),
      token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
    };
  }

  const { data } = await apiClient.post('/auth/refresh');
  return data;
}

export async function logoutRequest() {
  if (USE_MOCKS) {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
    return;
  }

  await apiClient.post('/auth/logout');
}