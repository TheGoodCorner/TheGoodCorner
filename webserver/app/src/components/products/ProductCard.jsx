import { Link } from 'react-router-dom';
import { Button } from '../UI/Button';
import { useCartStore } from '../../stores/cartStore';
import { useUserStore } from '../../stores/userStore';
import { useUIStore } from '../../stores/uiStore';
import { getInitials, getAvatarColor } from '../../utils/avatar';
import { PlusCircle, Star } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore()
  const { openUi } = useUIStore()
  const { user } = useUserStore()


  const handleAddToCart = () => {
    // Item panier volontairement "plat" : pas besoin de category/author
    // imbriqués une fois dans le panier, et ça évite toute collision avec
    // product.stock (le stock disponible n'est pas la quantité voulue).
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    })
    openUi('cart-popover')
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold ${getAvatarColor(author.name)}`}>
            {getInitials(author.name)}
          </div>
          <span className="text-xs font-medium text-gray-600">{author.name || 'Vendeur inconnu'}</span>
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

      <div className="card-body card-footer-compact">
        <Link to={`/products/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">
          <h3 className="card-title line-clamp-2">{product.name}</h3>
        </Link>
        <p className="card-price">{product.price?.toFixed(2) ?? '—'}€</p>
        <Button icon={PlusCircle} onClick={handleAddToCart} title="add to cart" aria-label="add to cart" className="w-full">
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}