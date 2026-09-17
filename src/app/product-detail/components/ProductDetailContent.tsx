'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, WHATSAPP_NUMBER } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

const REVIEWS = [
{
  id: '1',
  name: 'Samira B.',
  city: 'Casablanca',
  rating: 5,
  date: 'Août 2026',
  title: 'Produit excellent!',
  text: 'J\'utilise ce nettoyant depuis 3 mois et ma peau n\'a jamais été aussi douce. Il ne dessèche pas et ne laisse pas de résidus. Je le recommande vivement pour les peaux sensibles.',
  verified: true,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_121cd10a0-1773028191002.png"
},
{
  id: '2',
  name: 'Houda M.',
  city: 'Rabat',
  rating: 5,
  date: 'Juillet 2026',
  title: 'Livraison rapide et produit authentique',
  text: 'Reçu en 24h à Rabat, emballage parfait. Le produit est identique à ce qu\'on trouve en pharmacie en France. Prix bien meilleur qu\'en pharmacie classique.',
  verified: true,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_183e66eb8-1770058982767.png"
},
{
  id: '3',
  name: 'Zineb A.',
  city: 'Marrakech',
  rating: 4,
  date: 'Juin 2026',
  title: 'Très bon pour peau mixte',
  text: 'Bon produit, j\'ai la peau mixte et il convient parfaitement. La texture est légère et non grasse. Je n\'ai mis 4 étoiles car le flacon est un peu difficile à ouvrir.',
  verified: true,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c6a91560-1773028191182.png"
}];


export default function ProductDetailContent() {
  const product = PRODUCTS[0];
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage' | 'reviews'>('description');
  const [isZoomed, setIsZoomed] = useState(false);

  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishDispatch, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const images = product.images || [product.image];

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_ITEM', product, quantity });
    cartDispatch({ type: 'TOGGLE_CART' });
    showToast(`${product.name} ajouté au panier`, 'success');
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour OK Parapharmacie! Je souhaite commander:\n\n` +
      `Produit: ${product.name}\n` +
      `Marque: ${product.brand}\n` +
      `Prix: ${product.price} د.م.\n` +
      `Quantité: ${quantity}\n` +
      `Total: ${product.price * quantity} د.م.\n\n` +
      `Merci de confirmer la disponibilité et les délais de livraison.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${msg}`, '_blank');
  };

  const handleWishlist = () => {
    wishDispatch({ type: 'TOGGLE_ITEM', product });
    showToast(wishlisted ? 'Retiré de la wishlist' : 'Ajouté à la wishlist', wishlisted ? 'info' : 'success');
  };

  const avgRating = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <Link href="/product-catalog" className="hover:text-primary transition-colors">Catalogue</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-muted-foreground">{product.category}</span>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-foreground font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className={`relative rounded-3xl overflow-hidden bg-muted border border-border aspect-square cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}>
              
              <AppImage
                src={images[activeImage]}
                alt={`${product.brand} ${product.name} — vue principale du produit, flacon sur fond blanc`}
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                priority />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.discount && <span className="badge-discount text-xs px-2.5 py-1">-{product.discount}%</span>}
                {product.isNew && <span className="badge-new text-xs px-2.5 py-1">Nouveau</span>}
                {product.isBestseller && <span className="badge-new text-xs px-2.5 py-1" style={{ background: 'linear-gradient(135deg, #C8965A, #B8843A)' }}>Bestseller</span>}
              </div>
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground pointer-events-none">
                <Icon name="MagnifyingGlassPlusIcon" size={14} />
                {isZoomed ? 'Cliquer pour dézoomer' : 'Cliquer pour zoomer'}
              </div>
              {/* Nav arrows */}
              {images.length > 1 &&
              <>
                  <button
                  onClick={(e) => {e.stopPropagation();setActiveImage((i) => (i - 1 + images.length) % images.length);}}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Image précédente">
                  
                    <Icon name="ChevronLeftIcon" size={16} />
                  </button>
                  <button
                  onClick={(e) => {e.stopPropagation();setActiveImage((i) => (i + 1) % images.length);}}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Image suivante">
                  
                    <Icon name="ChevronRightIcon" size={16} />
                  </button>
                </>
              }
            </div>

            {/* Thumbnails */}
            {images.length > 1 &&
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {images.map((img, i) =>
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === i ? 'gallery-thumb-active' : 'gallery-thumb-inactive hover:border-muted-foreground'}`
                }
                aria-label={`Image ${i + 1}`}>
                
                    <AppImage
                  src={img}
                  alt={`${product.name} vue ${i + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover" />
                
                  </button>
              )}
              </div>
            }
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand + SKU */}
            <div className="flex items-center justify-between">
              <Link href="/product-catalog" className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors">
                {product.brand}
              </Link>
              {product.sku &&
              <span className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</span>
              }
            </div>

            {/* Name */}
            <h1 className="font-display text-hero-lg text-foreground">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) =>
                <span key={s} className={`text-base ${s <= Math.round(avgRating) ? 'star-filled' : 'star-empty'}`}>★</span>
                )}
              </div>
              <span className="text-sm font-bold text-foreground">{avgRating.toFixed(1)}</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-sm text-primary hover:underline font-medium">
                
                {product.reviewCount} avis
              </button>
              <span className="text-muted-foreground text-sm">·</span>
              <span className={`flex items-center gap-1.5 text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-400'}`} />
                {product.inStock ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 py-4 border-y border-border">
              <span className="font-display text-4xl font-bold text-primary price-tag">{product.price} د.م.</span>
              {product.oldPrice &&
              <span className="text-xl text-muted-foreground line-through price-tag">{product.oldPrice} د.م.</span>
              }
              {product.discount &&
              <span className="badge-discount text-sm px-3 py-1">Économie: {product.oldPrice! - product.price} د.م.</span>
              }
            </div>

            {/* Short description */}
            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.description?.slice(0, 180)}...
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">Quantité:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="quantity-btn"
                  aria-label="Diminuer la quantité">
                  
                  <Icon name="MinusIcon" size={14} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="quantity-btn"
                  aria-label="Augmenter la quantité">
                  
                  <Icon name="PlusIcon" size={14} />
                </button>
              </div>
              <span className="text-sm text-muted-foreground font-medium price-tag">
                = {(product.price * quantity).toFixed(0)} د.م.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all shimmer-btn relative overflow-hidden ${
                  product.inStock ?
                  'bg-primary text-primary-foreground hover:opacity-90 shadow-card-hover' :
                  'bg-muted text-muted-foreground cursor-not-allowed'}`
                  }>
                  
                  <Icon name="ShoppingCartIcon" size={18} />
                  Ajouter au panier
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  wishlisted ?
                  'border-red-200 bg-red-50 text-red-500' : 'border-border hover:border-red-200 hover:bg-red-50 hover:text-red-500 text-muted-foreground'}`
                  }
                  aria-label={wishlisted ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}>
                  
                  <Icon name="HeartIcon" size={20} variant={wishlisted ? 'solid' : 'outline'} />
                </button>
              </div>

              <button
                onClick={() => {
                  handleAddToCart();
                }}
                disabled={!product.inStock}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm border-2 transition-all ${
                product.inStock ?
                'border-primary text-primary hover:bg-primary hover:text-white' : 'border-muted text-muted-foreground cursor-not-allowed'}`
                }>
                
                <Icon name="BoltIcon" size={18} />
                Acheter maintenant
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm bg-green-500 text-white hover:bg-green-600 transition-colors">
                
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Commander via WhatsApp
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
              { icon: '🔒', label: 'Paiement sécurisé' },
              { icon: '🚚', label: 'Livraison rapide' },
              { icon: '✅', label: 'Authentique' }].
              map((badge, i) =>
              <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-muted rounded-xl text-center">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-xs font-semibold text-muted-foreground leading-tight">{badge.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-0 border-b border-border overflow-x-auto no-scrollbar">
            {([
            { key: 'description', label: 'Description' },
            { key: 'ingredients', label: 'Ingrédients' },
            { key: 'usage', label: 'Mode d\'emploi' },
            { key: 'reviews', label: `Avis (${REVIEWS.length})` }] as
            const).map((tab) =>
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.key ? 'tab-active' : 'tab-inactive hover:text-foreground'}`
              }>
              
                {tab.label}
              </button>
            )}
          </div>

          <div className="py-8">
            {activeTab === 'description' &&
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p className="text-base leading-relaxed">{product.description}</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  {[
                { label: 'Marque', value: product.brand },
                { label: 'Catégorie', value: product.category },
                { label: 'Référence', value: product.sku || 'N/A' },
                { label: 'Disponibilité', value: product.inStock ? 'En stock' : 'Rupture' }].
                map((item) =>
                <div key={item.label} className="flex justify-between py-3 border-b border-border text-sm">
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                )}
                </div>
              </div>
            }

            {activeTab === 'ingredients' &&
            <div className="max-w-3xl">
                <p className="text-sm text-muted-foreground leading-relaxed font-mono bg-muted rounded-2xl p-6">
                  {product.ingredients || 'Liste des ingrédients non disponible.'}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  * Les ingrédients peuvent varier selon le lot. Consultez toujours l&apos;emballage du produit pour la liste complète.
                </p>
              </div>
            }

            {activeTab === 'usage' &&
            <div className="max-w-2xl space-y-4">
                <div className="flex gap-4 p-5 bg-muted rounded-2xl">
                  <span className="text-2xl flex-shrink-0">📋</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.usage || 'Instructions d\'utilisation non disponibles.'}</p>
                </div>
                <div className="flex gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                  <span className="text-2xl flex-shrink-0">⚠️</span>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    En cas d&apos;irritation ou de réaction allergique, cessez immédiatement l&apos;utilisation et consultez un médecin. Tenir hors de portée des enfants.
                  </p>
                </div>
              </div>
            }

            {activeTab === 'reviews' &&
            <div className="space-y-6 max-w-3xl">
                {/* Rating Summary */}
                <div className="flex items-center gap-8 p-6 bg-muted rounded-2xl">
                  <div className="text-center">
                    <p className="font-display text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((s) =>
                    <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'star-filled' : 'star-empty'}`}>★</span>
                    )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{REVIEWS.length} avis</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                    const count = REVIEWS.filter((r) => r.rating === star).length;
                    const pct = REVIEWS.length > 0 ? count / REVIEWS.length * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                          <span className="w-4 text-muted-foreground">{star}</span>
                          <span className="star-filled text-xs">★</span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-4 text-muted-foreground">{count}</span>
                        </div>);

                  })}
                  </div>
                </div>

                {/* Individual Reviews */}
                {REVIEWS.map((review) =>
              <div key={review.id} className="p-6 bg-white border border-border rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          <AppImage
                        src={review.avatar}
                        alt={`Photo de profil de ${review.name}`}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover" />
                      
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.city} · {review.date}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) =>
                      <span key={s} className={`text-sm ${s <= review.rating ? 'star-filled' : 'star-empty'}`}>★</span>
                      )}
                        </div>
                        {review.verified &&
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Achat vérifié</span>
                    }
                      </div>
                    </div>
                    <p className="font-semibold text-foreground text-sm">{review.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{review.text}</p>
                  </div>
              )}
              </div>
            }
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 &&
        <div className="mt-12 pt-12 border-t border-border">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">Vous pourriez aussi aimer</span>
                <h2 className="font-display text-section-title text-foreground">
                  Produits <span className="italic text-primary">similaires</span>
                </h2>
              </div>
              <Link href="/product-catalog" className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) =>
            <ProductCard key={p.id} product={p} />
            )}
            </div>
          </div>
        }
      </div>

      {/* Mobile sticky bar */}
      <div className="sticky-product-bar md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground line-clamp-1">{product.name}</p>
            <p className="font-bold text-primary price-tag">{product.price} د.م.</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
            product.inStock ?
            'bg-primary text-white hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`
            }>
            
            <Icon name="ShoppingCartIcon" size={16} />
            Ajouter
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-green-500 text-white hover:bg-green-600 transition-colors"
            aria-label="Commander via WhatsApp">
            
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
        </div>
      </div>
    </div>);

}