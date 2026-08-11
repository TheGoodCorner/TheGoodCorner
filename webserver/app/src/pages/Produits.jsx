import React from 'react';
import { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const testProducts = [
  { id: 0, imageUrl: "/Images_db_test/image_0.jpg", name: "Gants de Boxe Yokkao Elite", category: "Professional", price: 85 },
  { id: 1, imageUrl: "/Images_db_test/image_1.jpg", name: "Gants d'Entraînement Basic", category: "Training", price: 35 },
  { id: 2, imageUrl: "/Images_db_test/image_2.jpg", name: "Gants Muay Thai Premium", category: "Combat", price: 65 },
  { id: 3, imageUrl: "/Images_db_test/image_3.jpg", name: "Gants de Compétition Pro", category: "Professional", price: 120 },
  { id: 4, imageUrl: "/Images_db_test/image_4.jpg", name: "Gants pour Débutants", category: "Cardio", price: 25 },
  { id: 5, imageUrl: "/Images_db_test/image_5.jpg", name: "Gants d'Entraînement Intensif", category: "Training", price: 50 },
  { id: 6, imageUrl: "/Images_db_test/image_6.jpg", name: "Gants Loisir Confort", category: "Cardio", price: 30 },
  { id: 7, imageUrl: "/Images_db_test/image_7.jpg", name: "Gants Boxe Anglaise", category: "Professional", price: 95 },
  { id: 8, imageUrl: "/Images_db_test/image_8.jpg", name: "Gants d'Entraînement Légers", category: "Training", price: 40 },
  { id: 9, imageUrl: "/Images_db_test/image_9.jpg", name: "Gants Kickboxing", category: "Combat", price: 70 },
  { id: 10, imageUrl: "/Images_db_test/image_10.jpg", name: "Gants Sparring", category: "Training", price: 55 },
  { id: 11, imageUrl: "/Images_db_test/image_11.jpg", name: "Gants Ultra Premium", category: "Professional", price: 150 },
];

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 200]);

  // Extraire les catégories uniques
  const categories = ['All', ...new Set(testProducts.map(p => p.category))];

  // Filtrer les produits par catégorie ET par prix
  const filteredProducts = testProducts.filter(p => {
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  return (
    <div className='bg-[var(--color-bg)]'>
    <div className="products-container bg-[var(--color-bg)]">
      <div className="products-header text-[var(--color-text)]">
        <h1>Nos Produits</h1>
        <p className="text-[var(--color-text-muted)]">Retrouvez notre sélection de produits, de peer to peer</p>
      </div>

      <div className="products-content">
        {/* Barre de filtre à gauche */}
        <aside className="filters-sidebar bg-[var(--color-surface)] border-r border-[var(--color-border)]">
          {/* Filtres par catégorie */}
          <div className="filter-group">
            <div className="filter-title text-[var(--color-text)]">
              <Filter size={18} />
              <span>Catégorie</span>
            </div>
            <div className="filter-options">
              {categories.map(category => (
                <label key={category} className="filter-checkbox text-[var(--color-text)]">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtres par prix */}
          <div className="filter-group">
            <div className="filter-title text-[var(--color-text)]">
              <span>Prix</span>
            </div>
            <div className="price-filter">
              <div className="price-inputs">
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  placeholder="Min"
                  className="price-input bg-[var(--color-surface-hover)] text-[var(--color-text)] border-[var(--color-border)]"
                />
                <span className="text-[var(--color-text)]">-</span>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  placeholder="Max"
                  className="price-input bg-[var(--color-surface-hover)] text-[var(--color-text)] border-[var(--color-border)]"
                />
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider accent-[var(--color-primary)]"
              />
              <div className="price-display text-[var(--color-text-muted)]">
                {priceRange[0]}€ - {priceRange[1]}€
              </div>
            </div>
          </div>
        </aside>

        {/* Grille de produits */}
        <main className="products-main">
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="no-products text-[var(--color-text-muted)]">Aucun produit ne correspond à vos critères</p>
            )}
          </div>

          {/* Compteur de résultats */}
          <div className="products-footer border-t border-[var(--color-border)]">
            <p className="text-[var(--color-text-muted)]">{filteredProducts.length} produit(s) trouvé(s)</p>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}

export default Products;
