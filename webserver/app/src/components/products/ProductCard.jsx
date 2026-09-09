import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button } from '../UI/Button';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { PlusCircle, Star } from 'lucide-react';
import Avatar from '../UI/Avatar';

export default function ProductCard({ product, allowOutOfStock = false }) {
    const { t } = useLingui();
    const addToCart = useCartStore((state) => state.addToCart);
    const openUi = useUIStore((state) => state.openUi);
    const [localError, setLocalError] = useState(null);
    const author = product?.author || {};

    const handleAddToCart = () => {
        const succèss = addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
            authorId: product.author?.id,
            stock: product.quantity,
        });

        if (succèss) {
            setLocalError(null);
            openUi('cart-popover');
        } else {
            const lastError = useCartStore.getState().error;
            const message = typeof lastError === 'object' ? lastError?.message : lastError;

            setLocalError(message || t`Impossible d'ajouter cet article au panier.`);
        }
    };

    useEffect(() => {
        if (!localError) return;
        const timer = setTimeout(() => setLocalError(null), 3000);
        return () => clearTimeout(timer);
    }, [localError]);

    if (!product || (!allowOutOfStock && Number(product.quantity) <= 0))
        return null;

    const sellerInfo = (
        <>
            <Avatar src={author.avatar} name={author.username} size="xs" />
            <span className="text-xs font-medium text-[var(--color-text)]">
                {author.username || <Trans>Vendeur inconnu</Trans>}
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
                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[var(--color-surface-hover)]">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        width="340"
                        height="340"
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover"
                    />
                </div>
            </Link>

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
                    disabled={!isInStock}
                    title={!isInStock ? t`Victime de son succès` : t`Ajouter au panier`}
                    aria-label={!isInStock ? t`Victime de son succès` : t`Ajouter au panier`}
                    className="w-full"
                >
                    {isInStock ? (
                        <Trans>Ajouter au panier</Trans>
                    ) : (
                        <Trans>Victime de son succès</Trans>
                    )}
                </Button>
            </div>
        </div>
    );
}