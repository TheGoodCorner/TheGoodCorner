import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4443/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attache automatiquement le token d'auth (s'il existe) à CHAQUE requête —
// plus besoin d'y penser manuellement dans chaque fichier api/*.
//
// useAuthStore.getState() lit l'état du store en dehors de tout composant
// React (un intercepteur n'est pas un composant, donc pas de hook ici).
// C'est le mécanisme prévu par Zustand pour lire un store depuis du code
// "hors React" — toujours à jour, y compris après une réhydratation
// (rechargement de page) puisqu'on lit l'état au moment de la requête,
// pas une seule fois au chargement du fichier.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Deux choses centralisées ici pour TOUTE l'app :
//  1. Une session expirée (401, peu importe quelle requête) déconnecte
//     proprement l'utilisateur, sans avoir à vérifier ça à chaque appel.
//  2. Les erreurs axios (forme différente de fetch) sont normalisées en
//     Error classique avec .message — les stores font toujours un simple
//     try/catch, sans savoir qu'axios existe en dessous.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    const message = error.response?.data?.message || error.message || 'Erreur réseau';
    return Promise.reject(new Error(message));
  }
);
