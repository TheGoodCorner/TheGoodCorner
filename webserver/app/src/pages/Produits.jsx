import React from 'react';
import { Filter } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import ProductCard from '../components/products/ProductCard';

function Products() {
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const filters = useProductStore((state) => state.filters);
  const setFilters = useProductStore((state) => state.setFilters);
  const getFilteredProducts = useProductStore((state) => state.getFilteredProducts);
  const fetchAllProducts = useProductStore((state) => state.fetchProducts);

  const categories = ['All', ...new Set(products.map((p) => p.category?.name).filter(Boolean))];
  const filteredProducts = getFilteredProducts();

  const handleCategoryChange = (categoryName) => {
    setFilters({ selectedCategory: categoryName === 'All' ? '' : categoryName });
  };

  // fetchAllProducts();
  return (
    <div className='bg-[var(--color-bg)]'>
    <div className="products-container bg-[var(--color-bg)]">
      <div className="products-header text-[var(--color-text)]">
        <h1>Nos Produits</h1>
        <p className="text-[var(--color-text-muted)]">Retrouvez notre sélection de produits, de peer to peer</p>
      </div>

      <div className="products-content">
        <aside className="filters-sidebar bg-[var(--color-surface)] border-r border-[var(--color-border)]">
          <div className="filter-group">
            <div className="filter-title text-[var(--color-text)]">
              <Filter size={18} />
              <span>Catégorie</span>
            </div>
            <div className="filter-options">
              {categories.map((category) => (
                <label key={category} className="filter-checkbox text-[var(--color-text)]">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={
                      category === 'All'
                        ? filters.selectedCategory === ''
                        : filters.selectedCategory === category
                    }
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

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
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ minPrice: parseInt(e.target.value) || 0 })}
                  placeholder="Min"
                  className="price-input bg-[var(--color-surface-hover)] text-[var(--color-text)] border-[var(--color-border)]"
                />
                <span className="text-[var(--color-text)]">-</span>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) || 0 })}
                  placeholder="Max"
                  className="price-input bg-[var(--color-surface-hover)] text-[var(--color-text)] border-[var(--color-border)]"
                />
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) })}
                className="price-slider accent-[var(--color-primary)]"
              />
              <div className="price-display text-[var(--color-text-muted)]">
                {filters.minPrice}€ - {filters.maxPrice}€
              </div>
            </div>
          </div>
        </aside>

        <main className="products-main">
          <div className="products-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[var(--color-surface-hover)] rounded-lg animate-pulse" />
              ))
            ) : products.length === 0 ? (
              <p className="no-products text-[var(--color-text-muted)]">
                Aucun produit disponible pour le moment. Revenez bientôt !
              </p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="no-products text-[var(--color-text-muted)]">Aucun produit ne correspond à vos critères</p>
            )}
          </div>
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