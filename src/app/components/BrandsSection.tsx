'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const BRAND_NAMES = ['CeraVe', 'Bioderma', 'La Roche-Posay', 'Vichy', 'Eucerin', 'Mustela', 'Uriage', 'Avène', 'ISDIN', 'Luxeol', 'Floxia', 'Rogé Cavaillès'];

export default function BrandsSection() {
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
    <section ref={sectionRef} className="py-14 bg-muted border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8 fade-up">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Marques officielles disponibles</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {BRAND_NAMES?.map((brand, i) => (
            <Link
              key={brand}
              href="/product-catalog"
              className={`fade-up stagger-${(i % 8) + 1} flex items-center justify-center px-4 py-4 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-card transition-all group`}
            >
              <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">{brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}