import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart, Calendar, MessageCircle } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { Button } from '../components/UI/Button';
import ProductCard from '../components/products/ProductCard';

// Squelette qui reprend la même grille que la vraie page, pour éviter
// tout saut de mise en page quand la vraie donnée arrive.
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

  // Toujours refetch au changement d'id : c'est la seule source qui a les
  // champs complets, même si une version light traîne déjà dans le cache.
  useEffect(() => {
      fetchProductById(id);
    }, [id, fetchProductById]);

  // Priorité au produit "frais" du serveur — mais seulement s'il correspond
  // bien à l'id de la page actuelle (sinon, en navigant vers une autre
  // fiche, on afficherait un instant l'ancien produit). À défaut, on
  // retombe sur le cache local pour un affichage instantané pendant que
  // le fetch est en vol.
  const isCurrentFresh = currentProduct && String(currentProduct.id) === String(id);
  const product = isCurrentFresh ? currentProduct : cachedProduct;

  // Rien à montrer et pas encore d'erreur confirmée : on est en train de
  // charger (que le flag loading ait déjà eu le temps de passer à true ou non).
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
    addToCart({ ...product, quantity });
    openUi('cart-popover');
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

    const mock = false;
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
        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-6">Vendu par</h3>
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden">
                {mock ? (
                <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover"
                />
                ) : (
                <div className={`w-full h-full flex items-center justify-center bg-[var(--color-primary)]`}>
                    <span className="text-xl font-bold text-white">A</span>
                </div>
                )}
            </div>
            {/* Infos vendeur */}
            <div>
                <h4 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {product.owner}
                </h4>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Calendar size={16} />
                <span>Membre depuis janvier 2026</span>
                </div>
            </div>
            </div>
            <Button
            variant="outline"
            size="md"
            icon={MessageCircle}
            onClick={() => {}}
            >
            Contacter le vendeur
            </Button>
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