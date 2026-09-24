'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { createClient } from '@/lib/supabase/client';
import { fetchCategories } from '@/lib/supabase/adapters';
import type { Category } from '@/lib/mockData';
import type { SiteSettingsRow } from '@/lib/supabase/types';

export default function Header() {
  const { totalItems, dispatch: cartDispatch } = useCart();
  const { state: wishlistState } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [freeShipping, setFreeShipping] = useState(500);
  const [devise, setDevise] = useState('DH');

  useEffect(() => {
    fetchCategories().then(setCategories);
    const supabase = createClient();
    supabase
      .from('site_settings')
      .select('livraison_gratuite_a_partir, devise')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        const s = data as Pick<SiteSettingsRow, 'livraison_gratuite_a_partir' | 'devise'> | null;
        if (s?.livraison_gratuite_a_partir) setFreeShipping(s.livraison_gratuite_a_partir);
        if (s?.devise) setDevise(s.devise === 'MAD' ? 'DH' : s.devise);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar text-primary-foreground text-xs font-semibold py-2 text-center px-4">
        🚚 Livraison gratuite dès {freeShipping} {devise} · Paiement à la livraison · Produits 100% authentiques
      </div>

      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-nav' : 'bg-white'} border-b border-border`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <AppLogo size={36} />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-primary leading-none block">OK</span>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase leading-none">Parapharmacie</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                Catégories <Icon name="ChevronDownIcon" size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-border p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories?.map(cat => (
                  <Link
                    key={cat?.id}
                    href="/product-catalog"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-foreground"
                  >
                    <span className="text-lg">{cat?.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{cat?.name}</p>
                      <p className="text-xs text-muted-foreground">{cat?.productCount} produits</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/product-catalog" className="hover:text-primary transition-colors">Promotions</Link>
            <Link href="/product-catalog" className="hover:text-primary transition-colors">Nouveautés</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
              aria-label="Rechercher"
            >
              <Icon name="MagnifyingGlassIcon" size={20} />
            </button>

            <Link href="#" className="hidden sm:flex p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-primary relative" aria-label="Wishlist">
              <Icon name="HeartIcon" size={20} />
              {wishlistState?.items?.length > 0 && (
                <span className="cart-badge">{wishlistState?.items?.length}</span>
              )}
            </Link>

            <button
              onClick={() => cartDispatch({ type: 'TOGGLE_CART' })}
              className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
              aria-label="Panier"
            >
              <Icon name="ShoppingCartIcon" size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            <Link href="#" className="hidden sm:flex p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-primary" aria-label="Compte">
              <Icon name="UserIcon" size={20} />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Icon name="Bars3Icon" size={22} />
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-border px-4 py-3 bg-white animate-slide-down">
            <div className="max-w-2xl mx-auto relative">
              <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e?.target?.value)}
                placeholder="Rechercher un produit, une marque..."
                className="w-full pl-10 pr-10 py-3 bg-muted rounded-xl text-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Icon name="XMarkIcon" size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 flex flex-col animate-slide-up shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <AppLogo size={32} />
                <span className="font-display font-bold text-primary">OK Parapharmacie</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors font-semibold">
                <Icon name="HomeIcon" size={18} className="text-primary" /> Accueil
              </Link>
              <p className="px-4 pt-3 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Catégories</p>
              {categories?.map(cat => (
                <Link
                  key={cat?.id}
                  href="/product-catalog"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm"
                >
                  <span>{cat?.icon}</span> {cat?.name}
                </Link>
              ))}
            </nav>
            <div className="px-4 py-4 border-t border-border space-y-2">
              <Link href="#" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium text-sm">
                <Icon name="UserIcon" size={18} className="text-muted-foreground" /> Mon Compte
              </Link>
              <Link href="#" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium text-sm">
                <Icon name="HeartIcon" size={18} className="text-muted-foreground" /> Ma Wishlist
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}