'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/mockData';

export default function FeaturedProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  const featured = PRODUCTS?.filter(p => p?.isFeatured)?.slice(0, 4);

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div className="fade-up">
            <span className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">Sélection du moment</span>
            <h2 className="font-display text-section-title text-foreground">
              Produits <span className="italic text-primary">vedettes</span>
            </h2>
          </div>
          <Link href="/product-catalog" className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary hover:underline fade-up stagger-2">
            Voir tout le catalogue →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured?.map((product, i) => (
            <div key={product?.id} className={`fade-up stagger-${i + 1}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}