import React, { useState, useEffect } from "react";
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useProductStore } from "../stores/productStore";
import ProductCard from "../components/products/ProductCard";
import { useUserStore } from "../stores/userStore";
import { PRODUCT_PRICE_MAX, CATEGORIES, getCategoryLabel } from "../utils/constants";
import ReactPaginate from "react-paginate";

const STANDARD_CATEGORIES = ["All", ...CATEGORIES.map((c) => c.value)];
const itemsPerPage = 12;

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
        window.scrollTo({ top: 0, behavior: "smooth" })
    };

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
        <div className="bg-transparent min-h-screen">
            <div className="w-full max-w-[1750px] mx-auto px-6 sm:px-10 lg:px-12 py-8">
                <div className="text-center mb-10 text-[var(--color-text)]">
                    <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-extrabold tracking-tight">
                        Nos Produits
                    </h1>
                    <p className="mt-3 text-base md:text-lg text-[var(--color-text-muted)]">
                        Retrouvez notre sélection de produits, de peer to peer
                    </p>
                </div>

                {/* Contenu Responsive : Colonne sur mobile, Ligne sur Desktop */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Sidebar Filtres */}
                    <aside className="w-full lg:w-64 shrink-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 lg:sticky lg:top-6">
                        {/* Grille 2 colonnes sur tablette/mobile large, 1 colonne sur desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">

                            {/* Section Catégories compacte en badges / flex-wrap */}
                            <div>
                                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--color-text)] mb-2.5">
                                    <Filter size={16} />
                                    <span>Catégorie</span>
                                </div>

                                <div className="flex flex-wrap lg:flex-col gap-1.5">
                                    {STANDARD_CATEGORIES.map((category) => {
                                        const isSelected =
                                            category === "All"
                                                ? filters.selectedCategory === ""
                                                : filters.selectedCategory === category;

                                        return (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() => handleCategoryChange(category)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${isSelected
                                                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                                                    : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                                                    }`}
                                            >
                                                {category === "All" ? "Tous" : getCategoryLabel(category)}
                                            </button>
                                        );
                                    })}

                                    {Boolean(currentUserId) &&
                                        products.some((p) => Number(p.userId) === Number(currentUserId)) && (
                                            <button
                                                type="button"
                                                onClick={() => handleCategoryChange("MyProducts")}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${filters.selectedCategory === "MyProducts"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                                    }`}
                                            >
                                                Mes annonces
                                            </button>
                                        )}
                                </div>
                            </div>

                            {/* Section Prix compacte */}
                            <div>
                                <div className="font-semibold text-sm text-[var(--color-text)] mb-2.5">
                                    Prix
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center justify-between bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md px-2 py-1 flex-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        minPrice: Math.max(0, (filters.minPrice || 0) - 100),
                                                    })
                                                }
                                                className="hover:text-blue-500 font-bold px-1"
                                            >
                                                -
                                            </button>
                                            <span className="font-medium">{filters.minPrice || 0}€</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        minPrice: Math.min(
                                                            filters.maxPrice ?? PRODUCT_PRICE_MAX,
                                                            (filters.minPrice || 0) + 100
                                                        ),
                                                    })
                                                }
                                                className="hover:text-blue-500 font-bold px-1"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span className="text-[var(--color-text-muted)]">à</span>

                                        <div className="flex items-center justify-between bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md px-2 py-1 flex-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        maxPrice: Math.max(
                                                            filters.minPrice || 0,
                                                            (filters.maxPrice ?? PRODUCT_PRICE_MAX) - 100
                                                        ),
                                                    })
                                                }
                                                className="hover:text-blue-500 font-bold px-1"
                                            >
                                                -
                                            </button>
                                            <span className="font-medium">
                                                {filters.maxPrice ?? PRODUCT_PRICE_MAX}€
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        maxPrice: Math.min(
                                                            PRODUCT_PRICE_MAX,
                                                            (filters.maxPrice ?? PRODUCT_PRICE_MAX) + 100
                                                        ),
                                                    })
                                                }
                                                className="hover:text-blue-500 font-bold px-1"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

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
                                                    parseInt(e.target.value) || 0
                                                ),
                                            })
                                        }
                                        className="w-full accent-blue-600 h-1.5 cursor-pointer"
                                    />
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* Zone principale (Grille + Pagination) */}
                    <main className="flex-1 w-full min-w-0">
                        {/* Grille responsive : 1 col mobile, 2 col sm, 3 col md, 4 col xl */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-[3/4] bg-[var(--color-surface-hover)] rounded-xl animate-pulse"
                                    />
                                ))
                            ) : products.length === 0 ? (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-[var(--color-text-muted)]">
                                        Aucun produit disponible pour le moment. Revenez bientôt !
                                    </p>
                                </div>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-[var(--color-text-muted)]">
                                        Aucun produit ne correspond à vos critères
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Responsive */}
                        {!loading && pageCount > 1 && (
                            <div className="mt-8 mb-6 flex justify-center">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel={<ChevronRight size={18} />}
                                    previousLabel={<ChevronLeft size={18} />}
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={2}
                                    marginPagesDisplayed={1}
                                    pageCount={pageCount}
                                    forcePage={Math.floor(itemOffset / itemsPerPage)}
                                    renderOnZeroPageCount={null}
                                    containerClassName="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 select-none"
                                    pageClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors overflow-hidden"
                                    pageLinkClassName="px-3 py-1.5 sm:px-3.5 sm:py-2 block cursor-pointer text-xs sm:text-sm font-medium"
                                    activeClassName="!bg-blue-600 border-blue-600 !text-white"
                                    previousClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors overflow-hidden"
                                    previousLinkClassName="p-1.5 sm:px-2.5 sm:py-2 flex items-center justify-center cursor-pointer"
                                    nextClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors overflow-hidden"
                                    nextLinkClassName="p-1.5 sm:px-2.5 sm:py-2 flex items-center justify-center cursor-pointer"
                                    breakClassName="border border-[var(--color-border)] rounded-md text-[var(--color-text)]"
                                    breakLinkClassName="px-2.5 py-1.5 sm:px-3 sm:py-2 block text-xs sm:text-sm"
                                    disabledClassName="opacity-30 pointer-events-none cursor-not-allowed"
                                />
                            </div>
                        )}

                        {/* Footer de résultats */}
                        <div className="border-t border-[var(--color-border)] pt-4 mt-6">
                            <p className="text-sm text-[var(--color-text-muted)]">
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