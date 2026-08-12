import { Link } from 'react-router-dom';
import { Button } from '../UI/Button';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { PlusCircle, Star } from 'lucide-react'

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore()
  const { openUi } = useUIStore()

  const handleAddToCart = () => {
    addToCart(product)
    openUi('cart-popover')
  }

  // Générer un avatar avec les initiales
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  }

  // Générer une couleur cohérente basée sur le nom du vendeur
  const getAvatarColor = (name) => {
    const colors = [
    'bg-slate-400',
    'bg-stone-400',
    'bg-zinc-400',
    'bg-gray-400',
    'bg-slate-300',
    'bg-stone-300',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="card">
      {/* Header vendeur */}
      <div className="card-header">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold ${getAvatarColor(product.owner)}`}>
            {getInitials(product.owner)}
          </div>
          <span className="text-xs font-medium text-gray-600">{product.owner}</span>
          <div className="flex items-center gap-1 ml-3">
            <Star size={15} className='text-[var(--color-primary)]' fill='var(--color-primary)'/>
            <span className="text-xs font-medium text-gray-700">{product.ownerRating}</span>
            <span className="text-xs text-gray-500">({product.ownerReviewCount})</span>
          </div>        
        </div>
      </div>
      {/* Image produit */}
      <Link to={`/products/${product.id}`}>
        <div className='flex items-center justify-center w-fit h-auto bg-[var(--color-surface-hover)]'>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-w-full h-auto"
          />
        </div>
      </Link>

      {/* Footer compact */}
      <div className="card-body card-footer-compact">
        <Link to={`/products/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">
          <h3 className="card-title line-clamp-2">{product.name}</h3>
        </Link>
        <p className="card-price">{product.price.toFixed(2)}€</p>
        <Button icon={PlusCircle} onClick={handleAddToCart} title="add to cart" aria-label="add to cart" className="w-full">
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
