import { Trash2, CreditCard, Store, Minus, Plus } from 'lucide-react';
import { Popover } from '../components/UI/Popover';
import { useCartStore } from '../stores/cartStore';
import { Button } from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';

export function CartPopover() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCartStore();
  const closeUi = useUIStore((state) => state.closeUi);
  const navigate = useNavigate();

  const handleGotoCheckout = () =>
  {
    closeUi('cart-popover')
    navigate("/checkout")
  }

  return (
      <Popover id="cart-popover" position="right" showCloseButton={true} width="w-[700px]">
      <div className="flex flex-col h-full bg-[var(--color-surface)]">
        {/* Header */}
        <h3 className="font-semibold text-xl mb-6 text-[var(--color-text)]">Votre Panier</h3>

        {/* Contenu */}
        <div className="flex-1 overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 bg-[var(--color-surface-hover)] rounded-lg">
              <div className="text-center text-gray-500 text-[var(--color-text-muted)] mb-6">Panier vide</div>
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
                    <p className="text-sm text-gray-600 text-[var(--color-text-muted)] mt-1">
                      {item.quantity} × {item.price.toFixed(2)} €
                    </p>
                    <span className="text-[10px] text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                      ({item.stock} disponible)
                    </span>
                  </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 g-[var(--color-surface-hover)] rounded px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Minus}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className='text-[var(--color-text)] hover:text-[var(--color-primary)]'
                          aria-label="Diminuer la quantité"
                        />
                        <span className="w-8 text-center text-sm text-[var(--color-text)]">{item.quantity}</span>
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
                        variant='danger'
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

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[var(--color-border)] pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-base text-[var(--color-text)]">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {cartTotal.toFixed(2)} €
              </span>
            </div>
            <Button
              onClick={handleGotoCheckout}
              icon={CreditCard}
              className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition font-medium text-base"
              title="Aller au paiment"
              aria-label="Aller au paiment"
            >
             Procéder au paiement
            </Button>
          </div>
        )}
      </div>
      </Popover>
  );
}
