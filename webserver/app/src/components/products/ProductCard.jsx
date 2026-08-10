import { Link } from 'react-router-dom';
import { Button } from '../UI/Button';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { PlusCircle } from 'lucide-react'

export default function ProductCard({ product }) {

  const { addToCart } = useCartStore()
  const { openUi  } = useUIStore()

  const handleAddToCart = () => {
    addToCart(product)
    openUi('cart-popover')
  }

  return (
      <div className="card">
        <div className='flex items-center justify-center w-fit h-auto bg-[var(--color-surface-hover)]'>
          <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="max-w-full h-auto"
          />
        </div>
        <div className="card-body">
          <h3 className="card-title">{product.name}</h3>
          <p className="card-text">{product.category}</p>
          <p className="card-price">{product.price.toFixed(2)}€</p>
          <Button icon={PlusCircle} onClick={handleAddToCart} title="add to cart" aria-label="add to cart">
            Ajouter au panier
          </Button>
        </div>
      </div>
  );
}
