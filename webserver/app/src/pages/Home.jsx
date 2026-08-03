import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
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

      {/* FEATURED PRODUCTS SECTION */}
      <section className="featured-section">
        <div className="container">
          <h2 className="featured-title">
            Nos produits en ventes
          </h2>
          
          <div className="featured-grid">
            <div className="card">
              <div className="card-image bg-gradient-to-r from-blue-400 to-blue-500">
                <span className="text-6xl">📱</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">Produit 1</h3>
                <p className="card-text">Description du produit numéro 1</p>
                <p className="card-price">29.99€</p>
                <button className="btn-full bg-blue-500 text-white hover:bg-blue-600">
                  Ajouter au panier
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-image bg-gradient-to-r from-purple-400 to-purple-500">
                <span className="text-6xl">🎧</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">Produit 2</h3>
                <p className="card-text">Description du produit numéro 2</p>
                <p className="card-price">49.99€</p>
                <button className="btn-full bg-blue-500 text-white hover:bg-blue-600">
                  Ajouter au panier
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-image bg-gradient-to-r from-pink-400 to-pink-500">
                <span className="text-6xl">⌚</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">Produit 3</h3>
                <p className="card-text">Description du produit numéro 3</p>
                <p className="card-price">79.99€</p>
                <button className="btn-full bg-blue-500 text-white hover:bg-blue-600">
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <div className="container text-center-flex flex-col">
          <h2 className="cta-title">Prêt à magasiner?</h2>
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
