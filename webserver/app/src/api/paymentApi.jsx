import { apiClient } from './client';

export const createPayment = async (cartData) => {
  // Envoie les infos nécessaires (panier, items, ou montant selon ce qu'attend createTransaction)
  const response = await apiClient.post('/newPayment', cartData);
  console.log(`response : ${response}`);
  console.log(`response.data : ${response.data}`);
  return response.data; 
};

export const getTransactions = async () => {
  const response = await apiClient.get('/transactions');
  console.log(`response : ${response}`);
  console.log(`response.data : ${response.data}`);
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await apiClient.get(`/transactions/${id}`);
  console.log(`response : ${response}`);
  console.log(`response.data : ${response.data}`);
  return response.data;
};