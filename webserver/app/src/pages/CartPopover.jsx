import { ShoppingCart, Trash2, CreditCard, Store } from 'lucide-react';
import { Popover } from '../components/UI/Popover';
import { useCartStore } from '../stores/cartStore';
import { Button } from '../components/UI/Button';

export function CartPopover() {
  const { cartItems, cartCount, cartTotal, removeFromCart } = useCartStore();

  return (
      <Popover id="cart-popover" position="right" showCloseButton={true} width="w-[500px]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <h3 className="font-semibold text-xl mb-6">Votre Panier</h3>

        {/* Contenu */}
        <div className="flex-1 overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-center text-gray-500 py-12">Panier vide</div>
              <Button
                icon={Store}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                title="Continuer vos achats"
                aria-label="Continuer vos achats"
                to="/products"
              >
                Decouvrez nos produits
              </Button>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto space-y-5 bg-gradient-to-b from-gray-50 to-gray-200 p-2 rounded-lg">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 bg-white rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-base">{item.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.quantity} × {item.price.toFixed(2)} €
                    </p>
                  </div>
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    variant='danger'
                    icon={Trash2}
                    className="rounded transition"
                    title="Retirer article du panier"
                    aria-label="Retirer article du panier"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-base">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {cartTotal.toFixed(2)} €
              </span>
            </div>
            <Button
              icon={CreditCard}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base"
              title="Aller au paiment"
              aria-label="Aller au paiment"
            >
              Faut payer maintenant
            </Button>
          </div>
        )}
      </div>
      </Popover>
  );
}
