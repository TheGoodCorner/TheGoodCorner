import React, { useState, useEffect} from "react";
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useProductStore } from "../stores/productStore";
import ProductCard from "../components/products/ProductCard";
import { useUserStore } from "../stores/userStore";
import { PRODUCT_PRICE_MAX } from "../utils/constants";
import ReactPaginate from "react-paginate";

const STANDARD_CATEGORIES = [
  "All",
  "Training",
  "Professional",
  "Combat",
  "Cardio",
];
const itemsPerPage = 10;

function Products() {
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const filters = useProductStore((state) => state.filters);
  const setFilters = useProductStore((state) => state.setFilters);
  const getFilteredProducts = useProductStore(
    (state) => state.getFilteredProducts,
  );
//   const fetchAllProducts = useProductStore((state) => state.fetchProducts);
  const user = useUserStore((state) => state.user);
  const currentUserId = user?.id;
  const [isOtherOpen, setIsOtherOpen] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const filteredProducts = getFilteredProducts();

  useEffect(() => {
    setItemOffset(0);
  }, [filters]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: "smooth" })};

  const allCategories = products.map((p) =>
      typeof p.category === "object" ? p.category?.name : p.category,
    ).filter(Boolean);
	
  const customCategories = [
    ...new Set(
      allCategories.filter((cat) => !STANDARD_CATEGORIES.includes(cat)),
    ),
  ];
  const isCustomSelected = customCategories.includes(filters.selectedCategory);

  const handleCategoryChange = (categoryName) => {
    setFilters({
      selectedCategory: categoryName === "All" ? "" : categoryName,
    });
  };


  return (
    <div className="bg-[var(--color-bg)]">
      <div className="products-container bg-[var(--color-bg)]">
        <div className="products-header text-[var(--color-text)]">
          <h1>Nos Produits</h1>
          <p className="text-[var(--color-text-muted)]">
            Retrouvez notre sélection de produits, de peer to peer
          </p>
        </div>

        <div className="products-content">
          <aside className="filters-sidebar bg-[var(--color-surface)] border-r border-[var(--color-border)]">
            {/* Section Filtre Catégorie */}
            <div className="filter-group">
              <div className="filter-title text-[var(--color-text)]">
                <Filter size={18} />
                <span>Catégorie</span>
              </div>

              <div className="filter-options space-y-2 mt-3">
                {/* Catégories Standards */}
                {STANDARD_CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className="filter-checkbox text-[var(--color-text)] flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={
                        category === "All"
                          ? filters.selectedCategory === ""
                          : filters.selectedCategory === category
                      }
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="accent-blue-600 cursor-pointer"
                    />
                    <span>{category}</span>
                  </label>
                ))}
                {/* Nouvelle catégorie : Mes annonces */}
                {Boolean(currentUserId) &&
                  products.some(
                    (p) => Number(p.userId) === Number(currentUserId),
                  ) && (
                    <label className="filter-checkbox text-[var(--color-text)] flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value="MyProducts"
                        checked={filters.selectedCategory === "MyProducts"}
                        onChange={() => handleCategoryChange("MyProducts")}
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span className="font-medium text-blue-400">
                        Mes annonces
                      </span>
                    </label>
                  )}

                {/* Bouton Accordéon / Dropdown "Autre" */}
                {customCategories.length > 0 && (
                  <div className="pt-1">
                    {/* Bouton cliquable "Autre" */}
                    <button
                      type="button"
                      onClick={() => setIsOtherOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        isCustomSelected
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                          : "text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                      }`}
                    >
                      <span>
                        {isCustomSelected
                          ? `Autre (${filters.selectedCategory})`
                          : "Autre"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isOtherOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Liste déroulante des catégories customs */}
                    {isOtherOpen && (
                      <div className="mt-1 ml-2 pl-2 border-l border-[var(--color-border)] space-y-1 animate-in fade-in duration-150">
                        {customCategories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              handleCategoryChange(cat);
                              setIsOtherOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                              filters.selectedCategory === cat
                                ? "bg-blue-600 text-white font-semibold"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-title text-[var(--color-text)]">
                <span>Prix</span>
              </div>

              <div className="price-filter flex flex-col gap-4 mt-3">
                {/* Contrôles Min / Max */}
                <div className="flex items-center justify-between gap-2">
                  {/* Contrôle Min */}
                  <div className="flex items-center justify-between bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md px-2 py-1 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        const currentMin = filters.minPrice || 0;
                        const newMin = Math.max(0, currentMin - 100);
                        setFilters({ ...filters, minPrice: newMin });
                      }}
                      className="text-[var(--color-text)] hover:text-blue-500 font-bold px-1.5 py-0.5 cursor-pointer select-none"
                    >
                      -
                    </button>
                    <span className="text-[var(--color-text)] text-sm font-medium select-none">
                      {filters.minPrice || 0}€
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentMin = filters.minPrice || 0;
                        const currentMax =
                          filters.maxPrice ?? PRODUCT_PRICE_MAX;
                        const newMin = Math.min(currentMax, currentMin + 100);
                        setFilters({ ...filters, minPrice: newMin });
                      }}
                      className="text-[var(--color-text)] hover:text-blue-500 font-bold px-1.5 py-0.5 cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-[var(--color-text)] font-semibold">
                    A
                  </span>

                  {/* Contrôle Max */}
                  <div className="flex items-center justify-between bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md px-2 py-1 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        const currentMin = filters.minPrice || 0;
                        const currentMax =
                          filters.maxPrice ?? PRODUCT_PRICE_MAX;
                        const newMax = Math.max(currentMin, currentMax - 100);
                        setFilters({ ...filters, maxPrice: newMax });
                      }}
                      className="text-[var(--color-text)] hover:text-blue-500 font-bold px-1.5 py-0.5 cursor-pointer select-none"
                    >
                      -
                    </button>
                    <span className="text-[var(--color-text)] text-sm font-medium select-none">
                      {filters.maxPrice ?? PRODUCT_PRICE_MAX}€
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentMax =
                          filters.maxPrice ?? PRODUCT_PRICE_MAX;
                        const newMax = Math.min(
                          PRODUCT_PRICE_MAX,
                          currentMax + 100,
                        );
                        setFilters({ ...filters, maxPrice: newMax });
                      }}
                      className="text-[var(--color-text)] hover:text-blue-500 font-bold px-1.5 py-0.5 cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max={PRODUCT_PRICE_MAX}
                  step="5"
                  value={filters.maxPrice ?? PRODUCT_PRICE_MAX}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: Math.max(
                        filters.minPrice || 0,
                        parseInt(e.target.value) || 0,
                      ),
                    })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />

                {/* Badge récapitulatif */}
                <div className="w-full py-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md text-center text-[var(--color-text)] text-sm font-semibold">
                  {filters.minPrice || 0}€ A{" "}
                  {filters.maxPrice ?? PRODUCT_PRICE_MAX}€
                </div>
              </div>
            </div>
          </aside>

          <main className="products-main">
            <div className="products-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-[var(--color-surface-hover)] rounded-lg animate-pulse"
                  />
                ))
              ) : products.length === 0 ? (
                <p className="no-products text-[var(--color-text-muted)]">
                  Aucun produit disponible pour le moment. Revenez bientôt !
                </p>
              ) : currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="no-products text-[var(--color-text-muted)]">
                  Aucun produit ne correspond à vos critères
                </p>
              )}
            </div>

              {!loading && pageCount > 1 && (
                <div className="mt-8 mb-6 flex justify-center">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel={<ChevronRight size={18} />}
                    previousLabel={<ChevronLeft size={18} />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    forcePage={Math.floor(itemOffset / itemsPerPage)}
                    renderOnZeroPageCount={null}
                    containerClassName="flex items-center gap-1.5 select-none"
                    pageClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors overflow-hidden"
                    pageLinkClassName="px-3.5 py-2 block cursor-pointer text-sm font-medium"
                    activeClassName="!bg-blue-600 border-blue-600 !text-white"
                    previousClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors overflow-hidden"
                    previousLinkClassName="px-2.5 py-2 flex items-center justify-center cursor-pointer"
                    nextClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors overflow-hidden"
                    nextLinkClassName="px-2.5 py-2 flex items-center justify-center cursor-pointer"
                    breakClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text-muted)]"
                    breakLinkClassName="px-3 py-2 block text-sm"
                    disabledClassName="opacity-30 pointer-events-none cursor-not-allowed"
                  />
                </div>
              )}
            <div className="products-footer border-t border-[var(--color-border)] pt-4 mt-6">
              <p className="text-[var(--color-text-muted)]">
                {filteredProducts.length} produit(s) trouvé(s)
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;