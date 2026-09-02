import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../UI/Button';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { PlusCircle, Star } from 'lucide-react'
import Avatar from '../UI/Avatar';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart)
  const error = useCartStore((state) => state.error)
  const clearError = useCartStore((state) => state.clearError)
  const openUi = useUIStore((state) => state.openUi)

  // Défensif : certains contextes
  const author = product.author || {};
  
  const handleAddToCart = () => {
    const success = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      authorId: product.author.id,
      stock: product.quantity,
    })
    if (!success) { return; }
    openUi('cart-popover')
  }

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      clearError();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup si composant unmount ou error change
  }, [error, clearError]);

  const sellerInfo = (
    <>
      <Avatar src={author.avatar} name={author.username} size="xs" />
      <span className="text-xs font-medium text-[var(--color-text)]">{author.username || 'Vendeur inconnu'}</span>
    </>
  );

  const isInStock = product.quantity > 0;

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          {author.id ? (
            <Link to={`/profile/${author.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {sellerInfo}
            </Link>
          ) : (
            <div className="flex items-center gap-2">{sellerInfo}</div>
          )}
          <div className="flex items-center gap-1 ml-3">
            <Star size={15} className='text-[var(--color-primary)]' fill='var(--color-primary)'/>
            <span className="text-xs font-medium text-gray-700">{author?.sellerRating ?? '—'}</span>
            <span className="text-xs text-gray-500">({author?.sellerReviewCount ?? 0})</span>
          </div>
        </div>
      </div>

      <Link to={`/products/${product.id}`}>
        <div className='flex items-center justify-center w-fit h-auto bg-[var(--color-surface-hover)]'>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="max-w-full h-auto"
          />
        </div>
      </Link>

      {error && (
        <div className='p-4 bg-[var(--color-danger-surface)] border border-[var(--color-danger)] rounded-[var(--radius-md)]'>
          <p className='text-sm text-[var(--color-danger)] font-medium' role='alert'>
            {error}
          </p>
        </div>
      )}

      <div className="card-body card-footer-compact">
        <Link to={`/products/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">
          <h3 className="card-title line-clamp-2">{product.name}</h3>
        </Link>
        <p className="card-price">{product.price?.toFixed(2) ?? '—'}€</p>
        <Button icon={PlusCircle} onClick={handleAddToCart} disabled={!isInStock} title="add to cart" aria-label="add to cart" className="w-full">
          {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
        </Button>
      </div>
    </div>
  );
}