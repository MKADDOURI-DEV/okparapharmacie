'use client';
import React, { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { TESTIMONIALS } from '@/lib/mockData';

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-muted overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">Avis clients</span>
            <h2 className="font-display text-section-title text-foreground">
              Ce que disent<br />
              <span className="italic text-primary">nos clientes</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors" aria-label="Précédent">
              <Icon name="ChevronLeftIcon" size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Suivant">
              <Icon name="ChevronRightIcon" size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="min-w-[300px] md:min-w-[380px] snap-start bg-card rounded-3xl p-7 border border-border hover:border-primary/30 hover:shadow-card transition-all flex-shrink-0"
            >
              <div className="text-accent mb-4">
                <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
                  <path d="M0 20V12.5C0 5.5 4.33 1.33 13 0l1.5 2.5C10.17 3.83 7.83 6.17 7 9.5h5V20H0zm16 0V12.5C16 5.5 20.33 1.33 29 0l1.5 2.5C26.17 3.83 23.83 6.17 23 9.5h5V20H16z"/>
                </svg>
              </div>
              <p className="text-foreground/80 font-light italic leading-relaxed text-sm mb-6">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                    <AppImage
                      src={t.avatar}
                      alt={`Photo de profil de ${t.name}, cliente satisfaite de OK Parapharmacie`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city} · {t.date}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-xs ${s <= t.rating ? 'star-filled' : 'star-empty'}`}>★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}