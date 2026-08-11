import React from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import ProductCard from '../components/products/ProductCard';

function Home() {

  const featuredProducts = useProductStore((state) => state.products).slice(0, 3);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container text-center-flex flex-col">
          <h1 className="hero-title">
            Bienvenue sur TheGoodCorner
          </h1>
          <p className="hero-subtitle">
            Découvrez nos meilleurs produits ou pas pour vous
          </p>
          <Link to="/products" className="btn-white">
            Voir nos produits
          </Link>
        </div>
      </section>

      {/*PRODUCTS SECTION */}
      <section className="featured-section">
        <div className="container">
          <h2 className="featured-title">
            Nos produits en ventes
          </h2>
          
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <div className="container text-center-flex flex-col">
          <h2 className="cta-title">Prêt à acheter un max de produit ?</h2>
          <p className="cta-subtitle">Retrouvez tous nos produits avec les meilleurs prix</p>
          <Link to="/products" className="btn-white">
            Parcourir la boutique
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
