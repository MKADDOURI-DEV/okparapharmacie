'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/AppIcon';
import { fetchActiveProducts, fetchCategories } from '@/lib/supabase/adapters';
import type { Product, Category } from '@/lib/mockData';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Recommandés' },
  { value: 'price-asc', label: 'Prix croissant' },
  {value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'discount', label: 'Plus remisés' },
];

const ITEMS_PER_PAGE = 12;

export default function CatalogContent() {
  const [PRODUCTS, setProducts] = useState<Product[]>([]);
  const [CATEGORIES, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([fetchActiveProducts(), fetchCategories()]).then(([products, categories]) => {
      setProducts(products);
      setCategories(categories);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (inStockOnly) result = result.filter(p => p.inStock);
    if (discountOnly) result = result.filter(p => !!p.discount);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'discount': result.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [PRODUCTS, selectedCategories, selectedBrands, priceRange, inStockOnly, discountOnly, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setInStockOnly(false);
    setDiscountOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (inStockOnly ? 1 : 0) +
    (discountOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  const UNIQUE_BRANDS = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();

  const SidebarContent = () => (
    <aside className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Recherche</h3>
        <div className="relative">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Nom, marque..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted rounded-xl border border-transparent focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Catégories</h3>
        <div className="space-y-1.5">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  selectedCategories.includes(cat.name)
                    ? 'bg-primary border-primary' :'border-border group-hover:border-primary'
                }`}
                onClick={() => toggleCategory(cat.name)}
              >
                {selectedCategories.includes(cat.name) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 cursor-pointer"
                onClick={() => toggleCategory(cat.name)}
              >
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">{cat.productCount}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Marques</h3>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {UNIQUE_BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  selectedBrands.includes(brand)
                    ? 'bg-primary border-primary' :'border-border group-hover:border-primary'
                }`}
                onClick={() => toggleBrand(brand)}
              >
                {selectedBrands.includes(brand) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer"
                onClick={() => toggleBrand(brand)}
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Prix (د.م.)</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-primary price-tag">{priceRange[0]} د.م.</span>
            <span className="text-primary price-tag">{priceRange[1]} د.م.</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={priceRange[1]}
            onChange={e => { setPriceRange([priceRange[0], Number(e.target.value)]); setCurrentPage(1); }}
            className="range-slider w-full"
          />
          <div className="grid grid-cols-2 gap-2">
            {[100, 150, 200, 300].map(val => (
              <button
                key={val}
                onClick={() => { setPriceRange([0, val]); setCurrentPage(1); }}
                className={`text-xs py-1.5 rounded-lg border transition-colors ${
                  priceRange[1] === val ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary'
                }`}
              >
                Jusqu&apos;à {val} د.م.
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Disponibilité</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                inStockOnly ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'
              }`}
              onClick={() => { setInStockOnly(!inStockOnly); setCurrentPage(1); }}
            >
              {inStockOnly && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer" onClick={() => { setInStockOnly(!inStockOnly); setCurrentPage(1); }}>
              En stock uniquement
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                discountOnly ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'
              }`}
              onClick={() => { setDiscountOnly(!discountOnly); setCurrentPage(1); }}
            >
              {discountOnly && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer" onClick={() => { setDiscountOnly(!discountOnly); setCurrentPage(1); }}>
              En promotion
            </span>
          </label>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 border-2 border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          Effacer tous les filtres ({activeFilterCount})
        </button>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-foreground font-medium">Catalogue</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-display text-hero-lg text-foreground mb-2">
            Tous nos <span className="italic text-primary">produits</span>
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="filter-chip gap-1.5"
              >
                {cat}
                <Icon name="XMarkIcon" size={12} />
              </button>
            ))}
            {selectedBrands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="filter-chip gap-1.5"
              >
                {brand}
                <Icon name="XMarkIcon" size={12} />
              </button>
            ))}
            {inStockOnly && (
              <button onClick={() => setInStockOnly(false)} className="filter-chip gap-1.5">
                En stock <Icon name="XMarkIcon" size={12} />
              </button>
            )}
            {discountOnly && (
              <button onClick={() => setDiscountOnly(false)} className="filter-chip gap-1.5">
                Promotion <Icon name="XMarkIcon" size={12} />
              </button>
            )}
            <button onClick={clearAllFilters} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
              Tout effacer
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl border border-border p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-foreground">Filtres</h2>
                {activeFilterCount > 0 && (
                  <span className="badge-discount">{activeFilterCount}</span>
                )}
              </div>
              <SidebarContent />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 bg-white rounded-2xl border border-border px-4 py-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <Icon name="AdjustmentsHorizontalIcon" size={18} className="text-primary" />
                Filtres
                {activeFilterCount > 0 && <span className="badge-discount">{activeFilterCount}</span>}
              </button>

              <p className="hidden lg:block text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProducts.length}</span> résultats
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground hidden sm:block">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="text-sm font-semibold bg-muted border-0 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                Chargement des produits...
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Icon name="MagnifyingGlassIcon" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Aucun produit trouvé</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  Essayez de modifier vos filtres ou élargir votre recherche.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Page précédente"
                >
                  <Icon name="ChevronLeftIcon" size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white' :'border border-border hover:bg-muted text-foreground'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Page suivante"
                >
                  <Icon name="ChevronRightIcon" size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-[85vw] max-w-sm bg-white z-50 flex flex-col shadow-xl lg:hidden animate-slide-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-foreground text-lg">Filtres</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <SidebarContent />
            </div>
            <div className="px-5 py-4 border-t border-border">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Voir {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}