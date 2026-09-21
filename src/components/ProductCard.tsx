'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { Product } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishDispatch, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    cartDispatch({ type: 'ADD_ITEM', product });
    showToast(`${product.name} ajouté au panier`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishDispatch({ type: 'TOGGLE_ITEM', product });
    showToast(wishlisted ? 'Retiré de la wishlist' : 'Ajouté à la wishlist', wishlisted ? 'info' : 'success');
  };

  return (
    <Link href={`/product-detail?slug=${product.slug}`} className={`group block bg-card rounded-2xl border border-border overflow-hidden product-card-hover ${className}`}>
      <div className="relative image-zoom bg-muted aspect-square overflow-hidden">
        <AppImage
          src={product.image}
          alt={`${product.brand} ${product.name} — flacon produit sur fond blanc`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.discount && <span className="badge-discount">-{product.discount}%</span>}
          {product.isNew && !product.discount && <span className="badge-new">Nouveau</span>}
          {product.isBestseller && !product.discount && !product.isNew && (
            <span className="badge-new" style={{ background: 'linear-gradient(135deg, #C8965A, #B8843A)' }}>Bestseller</span>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-muted-foreground border border-border">Rupture de stock</span>
          </div>
        )}
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
            wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-muted-foreground hover:text-red-500'
          }`}
          aria-label={wishlisted ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
        >
          <Icon name={wishlisted ? 'HeartIcon' : 'HeartIcon'} size={15} variant={wishlisted ? 'solid' : 'outline'} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-2">{product.name}</p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <span key={s} className={`text-[10px] ${s <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}`}>★</span>
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-primary price-tag">{product.price} د.م.</span>
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through price-tag">{product.oldPrice} د.م.</span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shimmer-btn relative overflow-hidden ${
              product.inStock
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            aria-label="Ajouter au panier"
          >
            <Icon name="ShoppingCartIcon" size={14} />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>
    </Link>
  );
}