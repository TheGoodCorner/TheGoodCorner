import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import ProductCard from '../components/products/ProductCard';
import { useState } from 'react';

const STANDARD_CATEGORIES = ['All', 'Training', 'Professional', 'Combat', 'Cardio'];

function Products() {
	const products = useProductStore((state) => state.products);
	const loading = useProductStore((state) => state.loading);
	const filters = useProductStore((state) => state.filters);
	const setFilters = useProductStore((state) => state.setFilters);
	const getFilteredProducts = useProductStore((state) => state.getFilteredProducts);
	const fetchAllProducts = useProductStore((state) => state.fetchProducts);

	const allCategories = products.map((p) => (typeof p.category === 'object' ? p.category?.name : p.category)).filter(Boolean);

	const customCategories = [...new Set(allCategories.filter((cat) => !STANDARD_CATEGORIES.includes(cat))),];

	const isCustomSelected = customCategories.includes(filters.selectedCategory);
	const [isOtherOpen, setIsOtherOpen] = useState(false);
	const filteredProducts = getFilteredProducts();

	const handleCategoryChange = (categoryName) => {
		setFilters({ selectedCategory: categoryName === 'All' ? '' : categoryName });
	};

	return (
		<div className='bg-[var(--color-bg)]'>
			<div className="products-container bg-[var(--color-bg)]">
				<div className="products-header text-[var(--color-text)]">
					<h1>Nos Produits</h1>
					<p className="text-[var(--color-text-muted)]">Retrouvez notre sélection de produits, de peer to peer</p>
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
												category === 'All'
													? filters.selectedCategory === ''
													: filters.selectedCategory === category
											}
											onChange={(e) => handleCategoryChange(e.target.value)}
											className="accent-blue-600 cursor-pointer"
										/>
										<span>{category}</span>
									</label>
								))}
								{/* Bouton Accordéon / Dropdown "Autre" */}
								{customCategories.length > 0 && (
									<div className="pt-1">
										{/* Bouton cliquable "Autre" */}
										<button
											type="button"
											onClick={() => setIsOtherOpen((prev) => !prev)}
											className={`w-full flex items-center justify-between py-1.5 px-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${isCustomSelected
													? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
													: 'text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
												}`}
										>
											<span>
												{isCustomSelected ? `Autre (${filters.selectedCategory})` : 'Autre'}
											</span>
											<ChevronDown
												size={16}
												className={`transition-transform duration-200 ${isOtherOpen ? 'rotate-180' : ''
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
														className={`w-full text-left px-2 py-1 rounded text-xs transition-colors cursor-pointer ${filters.selectedCategory === cat
																? 'bg-blue-600 text-white font-semibold'
																: 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
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
												const currentMax = filters.maxPrice ?? 10000;
												const newMin = Math.min(currentMax, currentMin + 100);
												setFilters({ ...filters, minPrice: newMin });
											}}
											className="text-[var(--color-text)] hover:text-blue-500 font-bold px-1.5 py-0.5 cursor-pointer select-none"
										>
											+
										</button>
									</div>

									<span className="text-[var(--color-text)] font-semibold">A</span>

									{/* Contrôle Max */}
									<div className="flex items-center justify-between bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md px-2 py-1 flex-1">
										<button
											type="button"
											onClick={() => {
												const currentMin = filters.minPrice || 0;
												const currentMax = filters.maxPrice ?? 10000;
												const newMax = Math.max(currentMin, currentMax - 100);
												setFilters({ ...filters, maxPrice: newMax });
											}}
											className="text-[var(--color-text)] hover:text-blue-500 font-bold px-1.5 py-0.5 cursor-pointer select-none"
										>
											-
										</button>
										<span className="text-[var(--color-text)] text-sm font-medium select-none">
											{filters.maxPrice ?? 10000}€
										</span>
										<button
											type="button"
											onClick={() => {
												const currentMax = filters.maxPrice ?? 10000;
												const newMax = Math.min(10000, currentMax + 100);
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
									max="10000"
									step="5"
									value={filters.maxPrice ?? 10000 / 2}
									onChange={(e) =>
										setFilters({
											...filters,
											maxPrice: Math.max(filters.minPrice || 0, parseInt(e.target.value) || 0),
										})
									}
									className="w-full accent-blue-600 cursor-pointer"
								/>

								{/* Badge récapitulatif */}
								<div className="w-full py-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-md text-center text-[var(--color-text)] text-sm font-semibold">
									{filters.minPrice || 0}€ A {filters.maxPrice ?? 10000}€
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