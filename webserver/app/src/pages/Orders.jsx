import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/transactions');

        // Gère le retour que data soit un objet direct ou un tableau contenant l'utilisateur
        const resData = response.data?.data;
        const paymentList = Array.isArray(resData)
          ? resData[0]?.payment || []
          : resData?.payment || [];

        setOrders(paymentList);
      } catch (err) {
        console.error('Erreur récupération commandes:', err);
        setError(err.message || 'Impossible de charger vos commandes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'SUCCEEDED' || s === 'SUCCESS' || s === 'PAID') {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
          Payée
        </span>
      );
    }
    if (s === 'PENDING') {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-950 text-amber-300 border border-amber-800">
          En attente
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
        {status || 'Statut inconnu'}
      </span>
    );
  };

  // Résolution robuste de l'image (tableau, string, absolue ou relative)
  const getProductImageUrl = (product) => {
    let rawSrc =
      (Array.isArray(product.images) ? product.images[0] : null) ||
      product.image ||
      product.imageUrl ||
      product.thumbnail ||
      null;

    if (!rawSrc) return null;

    if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://')) {
      return rawSrc;
    }

    if (!rawSrc.startsWith('/')) {
      rawSrc = `/${rawSrc}`;
    }

    if (!rawSrc.startsWith('/uploads') && !rawSrc.startsWith('/api')) {
      rawSrc = `/uploads${rawSrc}`;
    }

    return rawSrc;
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-950 text-slate-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Mes Commandes</h1>
            <p className="text-sm text-slate-400 mt-1">
              Consultez l'historique et le détail de vos achats passés.
            </p>
          </div>
          <Link
            to="/produits"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
          >
            Continuer mes achats
          </Link>
        </div>

        {loading && (
          <div className="py-16 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3" />
            <p className="text-sm">Chargement des commandes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 text-sm rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-base mb-4">Vous n'avez passé aucune commande pour le moment.</p>
            <Link
              to="/produits"
              className="text-sm text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Découvrir les produits
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = order.products || [];

              return (
                <div
                  key={order.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-lg p-5 transition hover:border-slate-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div>
                      <span className="text-xs font-mono text-slate-400">Commande #{order.id}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span className="text-base font-bold text-white">
                        {Number(order.amount).toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {/* Liste des produits associés */}
                  {items.length > 0 ? (
                    <div className="mt-4 pt-1">
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                        Articles commandés ({items.length})
                      </p>
                      <ul className="divide-y divide-slate-800/50">
                        {items.map((item, idx) => {
                          const imageUrl = getProductImageUrl(item);

                          return (
                            <li key={item.id || idx} className="py-2.5 flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={item.title || item.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement.innerHTML = '📦';
                                      }}
                                    />
                                  ) : (
                                    <span className="text-xl">📦</span>
                                  )}
                                </div>

                                <div>
                                  <span className="text-slate-200 font-medium block">
                                    {item.title || item.name || 'Produit'}
                                  </span>
                                  {item.quantity && (
                                    <span className="text-xs text-slate-400">
                                      Quantité : {item.quantity}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="text-slate-300 font-mono font-medium">
                                {item.price ? `${Number(item.price).toFixed(2)} €` : ''}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-slate-500 italic">
                      Aucun détail d'article disponible pour cette transaction.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}