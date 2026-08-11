import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { Button } from '../components/UI/Button';
import ProductCard from '../components/products/ProductCard';

function ProductDetail() {
  const { id } = useParams();
  const product = useProductStore((state) => state.getProductById(id));
  const allProducts = useProductStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);
  const openUi = useUIStore((state) => state.openUi);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Produit introuvable</h1>
        <p className="text-[var(--color-text-muted)] mb-6">Ce produit n'existe pas ou n'est plus disponible.</p>
        <Button to="/products" variant="primary">Retour aux produits</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    openUi('cart-popover');
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[var(--color-bg)]">
      <div className="container py-10">
        {/* Fil d'ariane */}
        <nav className="text-sm text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[var(--color-primary)] transition-colors">Produits</Link>
          <span>/</span>
          <span className="text-[var(--color-text)]">{product.name}</span>
        </nav>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={16} strokeWidth={2.75} />
          Retour aux produits
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="flex items-center justify-center bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)] p-8">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full h-auto rounded-[var(--radius-md)]"
            />
          </div>

          {/* Infos */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wide mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-[var(--color-primary)] mb-6">
              {product.price.toFixed(2)} €
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
              {product.description || "Description à venir."}
            </p>

            {/* Sélecteur de quantité */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-[var(--color-text)]">Quantité</span>
              <div className="flex items-center gap-1 bg-[var(--color-surface-hover)] rounded-[var(--radius-md)] px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Minus}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité"
                />
                <span className="w-8 text-center text-[var(--color-text)]">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Augmenter la quantité"
                />
              </div>
            </div>

            <Button
              icon={ShoppingCart}
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              Ajouter au panier
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 border-t border-[var(--color-border)]"></div>

        {/* Section Informations */}
         <section className="mb-16">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">Vendu par</h3>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full ${mockAvatarColor} flex items-center justify-center`}>
                  <span className="text-xl font-bold text-white">{userInitial}</span>
                </div>
              )}
            </div>

            {/* Infos vendeur */}
            <div>
              <h4 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {userName}
              </h4>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Calendar size={16} />
                <span>Membre depuis {user?.memberSince || 'janvier 2026'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Produits similaires</h2>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;