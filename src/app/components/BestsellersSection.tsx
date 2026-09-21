'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { fetchActiveProducts } from '@/lib/supabase/adapters';
import type { Product } from '@/lib/mockData';
import Icon from '@/components/ui/AppIcon';

export default function BestsellersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    fetchActiveProducts().then((products) => setBestsellers(products.slice(0, 10)));
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">Top ventes</span>
            <h2 className="font-display text-section-title text-foreground">
              Meilleures <span className="italic text-primary">ventes</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Précédent"
            >
              <Icon name="ChevronLeftIcon" size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Suivant"
            >
              <Icon name="ChevronRightIcon" size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
        >
          {bestsellers.map(product => (
            <div key={product.id} className="flex-shrink-0 w-56 sm:w-64 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/product-catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary text-primary rounded-2xl font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Voir tous les produits
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}