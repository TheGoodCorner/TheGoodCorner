import Link from 'react-router-dom';
import { Button } from '../UI/Button';
import { useCartStore } from '../../stores/cartStore';
import { PlusCircle } from 'lucide-react'

export default function ProductCard({ product }) {

  const { addToCart } = useCartStore()

  return (
      <div className="card">
        <div>
          <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-[300px] h-64 object-cover bg-gray-100"
          />
        </div>
        <div className="card-body">
          <h3 className="card-title">{product.name}</h3>
          <p className="card-text">{product.category}</p>
          <p className="card-price">{product.price.toFixed(2)}€</p>
          <Button icon={PlusCircle} onClick={() => {addToCart(product)}} title="add to cart" aria-label="add to cart">
            Ajouter au panier
          </Button>
        </div>
      </div>
  );
}
