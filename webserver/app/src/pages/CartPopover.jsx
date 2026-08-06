import { ShoppingCart, Trash2 } from 'lucide-react';
import { Popover } from '../components/UI/Popover';
import { useCartStore } from '../stores/cartStore';
import { Button } from '../components/UI/Button';

export function CartPopover() {
  const { cartItems, cartCount, cartTotal, removeFromCart } = useCartStore();

  return (
      <Popover id="cart-popover" position="right" showCloseButton={true}>
      {/* Header */}
      <h3 className="font-semibold text-xl mb-6">Panier</h3>

      {/* Contenu */}
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-12">Panier vide</div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto space-y-5 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-base">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={() => removeFromCart(item.id)}
                  variant='danger'
                  icon={Trash2}
                  className="rounded transition"
                  title="Votre panier"
                  aria-label="Votre panier"
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-base">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base">
              Aller au panier
            </button>
          </div>
        </>
      )}
      </Popover>
  );
}