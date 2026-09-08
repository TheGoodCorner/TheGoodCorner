import React from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import ProductCard from '../components/products/ProductCard';

function Home() {
    const products = useProductStore((state) => state.products) || [];
    const loading = useProductStore((state) => state.loading);
    const featuredProducts = products.slice(0, 3);

    return (
        <div className="w-full min-h-screen flex flex-col justify-between">
            {/* Hero Section */}
            <section className="hero-section py-16 sm:py-24 2xl:py-32 px-4 sm:px-6">
                <div className="w-full max-w-[1700px] mx-auto flex flex-col items-center text-center">
                    <h1 className="hero-title text-3xl sm:text-5xl 2xl:text-6xl font-black tracking-tight max-w-4xl">
                        Bienvenue sur TheGoodCorner
                    </h1>
                    <p className="hero-subtitle mt-4 sm:mt-6 text-base sm:text-xl 2xl:text-2xl text-[var(--color-text-muted)] max-w-2xl">
                        Découvrez nos meilleurs produits ou pas pour vous
                    </p>
                    <Link 
                        to="/products" 
                        className="btn-white mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl transition-transform hover:scale-105"
                    >
                        Voir nos produits
                    </Link>
                </div>
            </section>

            {/* Featured Section */}
            <section className="featured-section py-12 sm:py-16 2xl:py-20 px-4 sm:px-6 lg:px-12">
                <div className="w-full max-w-[1700px] mx-auto">
                    <h2 className="featured-title text-2xl sm:text-3xl 2xl:text-4xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-text)]">
                        Nos produits en vente
                    </h2>

                    {/* Grille : 1 col (mobile) -> 2 col (sm/md) -> 3 col (lg+) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className="aspect-[3/4] bg-[var(--color-surface-hover)] rounded-xl animate-pulse" 
                                />
                            ))
                        ) : featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <div key={product.id} className="flex justify-center">
                                    <div className="w-full max-w-[340px] sm:max-w-none">
                                        <ProductCard product={product} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center py-10 text-[var(--color-text-muted)]">
                                Les premiers produits arrivent bientôt.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-16 sm:py-20 2xl:py-28 px-4 sm:px-6">
                <div className="w-full max-w-[1700px] mx-auto flex flex-col items-center text-center">
                    <h2 className="cta-title text-2xl sm:text-4xl 2xl:text-5xl font-bold tracking-tight text-[var(--color-text)]">
                        Prêt à acheter un max de produit ?
                    </h2>
                    <p className="cta-subtitle mt-3 sm:mt-4 text-sm sm:text-lg 2xl:text-xl text-[var(--color-text-muted)] max-w-xl">
                        Retrouvez tous nos produits avec les meilleurs prix
                    </p>
                    <Link 
                        to="/products" 
                        className="btn-white mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl transition-transform hover:scale-105"
                    >
                        Parcourir la boutique
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;