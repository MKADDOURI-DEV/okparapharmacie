'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { CATEGORIES } from '@/lib/mockData';

export default function CategoriesSection() {
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

  return (
    <section ref={sectionRef} className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div className="fade-up">
            <span className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">Nos Rayons</span>
            <h2 className="font-display text-section-title text-foreground">
              Explorez par<br />
              <span className="italic text-primary"> catégorie</span>
            </h2>
          </div>
          <Link href="/product-catalog" className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary hover:underline fade-up stagger-2">
            Tout voir
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </Link>
        </div>

        {/* BENTO GRID AUDIT:
            8 cards: Visage, Corps, Cheveux, Hygiène, Bébé & Maman, Solaire, Compléments, Parfum
            Row 1: [col-1: Visage] [col-2: Corps] [col-3: Cheveux] [col-4: Hygiène]
            Row 2: [col-1: Bébé] [col-2: Solaire] [col-3: Compléments] [col-4: Parfum]
            Placed 8/8 ✓
        */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES?.map((cat, index) => (
            <Link
              key={cat?.id}
              href="/product-catalog"
              className={`fade-up stagger-${(index % 8) + 1} group relative rounded-3xl overflow-hidden aspect-[4/5] bg-card border border-border image-zoom shadow-card hover:shadow-card-hover transition-shadow`}
            >
              <AppImage
                src={cat?.image}
                alt={`Catégorie ${cat?.name} — produits de parapharmacie sur fond épuré`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <span className="text-2xl mb-1">{cat?.icon}</span>
                <p className="text-white font-display font-semibold text-base leading-tight">{cat?.name}</p>
                <p className="text-white/70 text-xs mt-1">{cat?.productCount} produits</p>
              </div>
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}