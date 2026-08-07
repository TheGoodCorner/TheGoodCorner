import { apiClient } from './client';

// Tant que true (ou REACT_APP_USE_MOCKS non défini), login/register
// renvoient des données simulées avec un léger délai — l'app reste 100%
// fonctionnelle sans backend. Passe REACT_APP_USE_MOCKS=false dans ton .env
// une fois l'API prête : authStore, useLoginForm et Login.jsx n'ont besoin
// d'aucun changement.
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS !== 'false';

function mockAuthResponse(email, username = 'user') {
  return {
    user: { id: 1, email, username, avatar: '👤' },
    token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9),
  };
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


export async function validateTokenRequest(token) {
  if (USE_MOCKS) {
    // En mock : si le token commence par "mock_jwt_token_" → il est valide
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (token.startsWith('mock_jwt_token_')) {
      return {
        user: { id: 1, email: 'user@mock.com', username: 'user', avatar: '👤' },
      };
    }
    throw new Error('Invalid token');
  }

  const { data } = await apiClient.get('/auth/validate', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}