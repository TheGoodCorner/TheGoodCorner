import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../UI/Button';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { PlusCircle, Star } from 'lucide-react';
import Avatar from '../UI/Avatar';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const openUi = useUIStore((state) => state.openUi);

  // Déclaration de l'état local pour le message d'erreur
  const [localError, setLocalError] = useState(null);

  const author = product?.author || {};

  const handleAddToCart = () => {
    // On capture la valeur de retour (true ou false) dans 'success'
    const success = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      authorId: product.author?.id,
      stock: product.quantity,
    });

    if (success) {
      setLocalError(null);
      openUi('cart-popover'); // S'ouvre uniquement en cas de succès
    } else {
      // On récupère le message exact renvoyé par cartStore (stock ou propre article)
      const lastError = useCartStore.getState().error;
      const message = typeof lastError === 'object' ? lastError?.message : lastError;

      setLocalError(message || "Impossible d'ajouter cet article au panier.");
    }
  };

  useEffect(() => {
    if (!localError) return;
    const timer = setTimeout(() => setLocalError(null), 3000);
    return () => clearTimeout(timer);
  }, [localError]);

  const sellerInfo = (
    <>
      <Avatar src={author.avatar} name={author.username} size="xs" />
      <span className="text-xs font-medium text-[var(--color-text)]">
        {author.username || 'Vendeur inconnu'}
      </span>
    </>
  );

  const isInStock = product.quantity > 0;

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          {author.id ? (
            <Link
              to={`/profile/${author.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {sellerInfo}
            </Link>
          ) : (
            <div className="flex items-center gap-2">{sellerInfo}</div>
          )}
          <div className="flex items-center gap-1 ml-3">
            <Star
              size={15}
              className="text-[var(--color-primary)]"
              fill="var(--color-primary)"
            />
            <span className="text-xs font-medium text-gray-700">
              {author?.sellerRating ?? '—'}
            </span>
            <span className="text-xs text-gray-500">
              ({author?.sellerReviewCount ?? 0})
            </span>
          </div>
        </div>
      </div>

      <Link to={`/products/${product.id}`}>
        <div className="flex items-center justify-center w-fit h-auto bg-[var(--color-surface-hover)]">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="max-w-full h-auto"
          />
        </div>
      </Link>

      {/* Affichage de l'erreur locale */}
      {localError && (
        <div className="p-4 bg-[var(--color-danger-surface)] border border-[var(--color-danger)] rounded-[var(--radius-md)]">
          <p className="text-sm text-[var(--color-danger)] font-medium" role="alert">
            {localError}
          </p>
        </div>
      )}

      <div className="card-body card-footer-compact">
        <Link
          to={`/products/${product.id}`}
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          <h3 className="card-title line-clamp-2">{product.name}</h3>
        </Link>
        <p className="card-price">{product.price?.toFixed(2) ?? '—'}€</p>
        <Button
          icon={PlusCircle}
          onClick={handleAddToCart}
          title="Ajouter au panier"
          aria-label="Ajouter au panier"
          className="w-full"
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}