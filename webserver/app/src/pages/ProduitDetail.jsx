import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Calendar, MessageCircle } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { Button } from '../components/UI/Button';
import { getInitials, getAvatarColor } from '../utils/avatar';
import ProductCard from '../components/products/ProductCard';

function ProductDetailSkeleton() {
  return (
    <div className="container py-10 animate-pulse">
      <div className="h-4 w-64 bg-[var(--color-surface-hover)] rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)]" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 bg-[var(--color-surface-hover)] rounded" />
          <div className="h-8 w-3/4 bg-[var(--color-surface-hover)] rounded" />
          <div className="h-8 w-32 bg-[var(--color-surface-hover)] rounded" />
          <div className="h-24 w-full bg-[var(--color-surface-hover)] rounded" />
          <div className="h-11 w-48 bg-[var(--color-surface-hover)] rounded-[var(--radius-md)] mt-4" />
        </div>
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();

  const cachedProduct = useProductStore((state) => state.getProductById(id));
  const currentProduct = useProductStore((state) => state.currentProduct);
  const currentProductLoading = useProductStore((state) => state.currentProductLoading);
  const currentProductError = useProductStore((state) => state.currentProductError);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const allProducts = useProductStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);
  const openUi = useUIStore((state) => state.openUi);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  const isCurrentFresh = currentProduct && String(currentProduct.id) === String(id);
  const product = isCurrentFresh ? currentProduct : cachedProduct;

  if (!product && !currentProductError) {
    return <ProductDetailSkeleton />;
  }

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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    });
    openUi('cart-popover');
  };

  const relatedProducts = allProducts
    .filter((p) => p.category?.id === product.category?.id && p.id !== product.id)
    .slice(0, 4);

  const authorName = product.author?.username;
  const memberSince = product.author?.createdAt
    ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(product.author.createdAt))
    : null;

  return (
    <div className="bg-[var(--color-bg)]">
      <div className="container py-10">
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
          <div className="flex items-center justify-center bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)] p-8">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full h-auto rounded-[var(--radius-md)]"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wide mb-2">
              {product.category?.name || 'Non catégorisé'}
            </span>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-[var(--color-primary)] mb-6">
              {product.price?.toFixed(2) ?? '—'} €
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
              {product.description || "Description à venir."}
            </p>

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
                  onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                  disabled={quantity >= product.quantity}
                  aria-label="Augmenter la quantité"
                />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">({product.quantity} En stock)</span>
            </div>

            <Button
              icon={ShoppingCart}
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              title={product.quantity === 0 ? "Produit en rupture de stock" : "Ajouter au panier"}
              aria-label="Ajouter au panier"
            >
              {product.quantity === 0 ? "Produit en rupture de stock" : "Ajouter au panier"}
            </Button>
          </div>
        </div>

        <div className="my-16 border-t border-[var(--color-border)]"></div>

        <section className="mb-16">
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-6">Vendu par</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-white ${getAvatarColor(authorName)}`}>
                {getInitials(authorName)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  {authorName || 'Vendeur inconnu'}
                </h4>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Calendar size={16} />
                  <span>{memberSince ? `Membre depuis ${memberSince}` : 'Nouveau membre'}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="md" icon={MessageCircle} onClick={() => {}}>
              Contacter le vendeur
            </Button>
          </div>
        </section>

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