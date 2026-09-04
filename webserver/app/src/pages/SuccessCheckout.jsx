import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { useUserStore } from '../stores/userStore';

export default function SuccessCheckout() {
  const navigate = useNavigate();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser); // ou ta méthode de reload du profil/budget

  useEffect(() => {
    // Petit délai pour laisser au webhook le temps d'écrire en DB
    const timer = setTimeout(() => {
      if (fetchProducts) fetchProducts();
      if (fetchCurrentUser) fetchCurrentUser();
    }, 800);

    return () => clearTimeout(timer);
  }, [fetchProducts, fetchCurrentUser]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#1e232d] border border-gray-700/60 rounded-2xl p-8 text-center shadow-xl">
        {/* Icône de validation */}
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Titre & Message */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Paiement réussi !
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Merci pour votre commande. La transaction a été validée par Stripe et vos articles sont en cours de préparation.
        </p>

        {/* Encadré d'information */}
        <div className="bg-[#161a22] border border-gray-800 rounded-xl p-4 text-left mb-6 text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400">Statut</span>
            <span className="text-emerald-400 font-medium">Payé</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400">Délai estimé</span>
            <span className="text-gray-200">2 à 4 jours ouvrés</span>
          </div>
        </div>

        {/* Actions de navigation */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl transition duration-150 ease-in-out shadow-sm cursor-pointer"
          >
            Retourner sur mon profile
          </button>
          
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-[#272d38] hover:bg-[#323946] text-gray-300 font-medium py-3 px-4 rounded-xl transition duration-150 ease-in-out cursor-pointer"
          >
            Retourner sur les produits du site
          </button>
        </div>
      </div>
    </div>
  );
}