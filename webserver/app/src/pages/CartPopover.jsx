import React, { useEffect, useState } from 'react';
import { Trash2, CreditCard, Store, Minus, Plus, Wallet } from 'lucide-react';
import { Popover } from '../components/UI/Popover';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../api/client';
import { Button } from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';

export function CartPopover() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user ?? state.currentUser);
  const closeUi = useUIStore((state) => state.closeUi);
  const navigate = useNavigate();

  const [walletBudget, setWalletBudget] = useState(user?.budget ?? 0);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchBudget = async () => {
      try {
        const response = await apiClient.get('/transactions');
        const resData = response.data?.data;
        const currentBudget = Array.isArray(resData) ? resData[0]?.budget : resData?.budget;
        if (currentBudget !== undefined && currentBudget !== null) {
          setWalletBudget(Number(currentBudget));
        }
      } catch (err) {}
    };
    fetchBudget();
  }, [isAuthenticated]);

  const handleGotoCheckout = () => {
    closeUi('cart-popover');
    navigate('/checkout');
  };

  return (
    <Popover id="cart-popover" position="right" showCloseButton={true} width="w-[700px]">
      <div className="flex flex-col h-full bg-[var(--color-surface)]">
        <h3 className="font-semibold text-xl mb-6 text-[var(--color-text)]">Votre Panier</h3>

        <div className="flex-1 overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 bg-[var(--color-surface-hover)] rounded-lg">
              <div className="text-center text-[var(--color-text-muted)] mb-6">Panier vide</div>
              <Button
                icon={Store}
                className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition font-medium"
                title="Continuer vos achats"
                aria-label="Continuer vos achats"
                to="/products"
              >
                Decouvrez nos produits
              </Button>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto space-y-5 bg-[var(--color-surface-hover)] p-2 rounded-lg">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-base text-[var(--color-text)]">{item.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      {item.quantity} × {item.price.toFixed(2)} €
                    </p>
                    <span className="text-[10px] text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                      ({item.stock} disponible)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Minus}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
                        aria-label="Diminuer la quantité"
                      />
                      <span className="w-8 text-center text-sm text-[var(--color-text)]">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Plus}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
                        aria-label="Augmenter la quantité"
                      />
                    </div>

                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="danger"
                      icon={Trash2}
                      className="text-[var(--color-danger)] hover:bg-[var(--color-danger-surface)] rounded transition"
                      title="Retirer article du panier"
                      aria-label="Retirer article du panier"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec solde portefeuille et total */}
        {cartItems.length > 0 && (
          <div className="border-t border-[var(--color-border)] pt-6 mt-6 space-y-4">
            {isAuthenticated && (
              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <Wallet size={16} className="text-blue-400" />
                  Solde portefeuille :
                </span>
                <span className="font-mono font-semibold text-[var(--color-text)]">
                  {Number(walletBudget).toFixed(2)} €
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-semibold text-base text-[var(--color-text)]">Total :</span>
              <span className="text-2xl font-bold text-green-500">
                {cartTotal.toFixed(2)} €
              </span>
            </div>

            <Button
              onClick={handleGotoCheckout}
              icon={CreditCard}
              className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition font-medium text-base"
              title="Aller au paiement"
              aria-label="Aller au paiement"
            >
              Procéder au paiement
            </Button>
          </div>
        )}
      </div>
    </Popover>
  );
}