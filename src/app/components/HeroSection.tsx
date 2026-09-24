'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettingsRow } from '@/lib/supabase/types';

const DEFAULT_TITLE = 'Votre beauté, soignée avec soin.';
const DEFAULT_SUBTITLE = 'Découvrez les meilleures marques européennes — CeraVe, Bioderma, La Roche-Posay, Vichy — livrées partout au Maroc. Paiement à la livraison.';
const DEFAULT_CTA = 'Découvrir nos produits';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [ctaText, setCtaText] = useState(DEFAULT_CTA);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('site_settings')
      .select('hero_title, hero_subtitle, cta_text')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        const s = data as Pick<SiteSettingsRow, 'hero_title' | 'hero_subtitle' | 'cta_text'> | null;
        if (s?.hero_title) setTitle(s.hero_title);
        if (s?.hero_subtitle) setSubtitle(s.hero_subtitle);
        if (s?.cta_text) setCtaText(s.cta_text);
      });
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      const blobs = heroRef.current.querySelectorAll<HTMLElement>('[data-parallax]');
      blobs.forEach((blob) => {
        const speed = parseFloat(blob.dataset.parallax || '1');
        blob.style.transform = `translate(${mx * speed * 40}px, ${my * speed * 30}px)`;
      });
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', onMouseMove);
    return () => el?.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">
      {/* Noise overlay */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-[1] opacity-60 mix-blend-multiply" />

      {/* Background blobs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] blob-green pointer-events-none" data-parallax="0.3" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] blob-gold pointer-events-none" data-parallax="0.5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blob-green opacity-30 pointer-events-none" data-parallax="0.2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
        {/* Left: Text */}
        <div className="space-y-8">
          {/* Eyebrow badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
            <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Parapharmacie en Ligne · Maroc</span>
          </div>

          {/* Headline */}
          {title === DEFAULT_TITLE ? (
            <h1 className="font-display text-hero-xl text-foreground leading-[0.88] tracking-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
              Votre beauté,{' '}
              <span className="italic text-primary relative inline-block">
                soignée
                <svg className="absolute w-full -bottom-1 left-0 text-accent" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0 8 Q 100 14 200 8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>{' '}
              <br />avec soin.
            </h1>
          ) : (
            <h1 className="font-display text-hero-xl text-foreground leading-[0.95] tracking-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
              {title}
            </h1>
          )}

          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg animate-fade-up" style={{ animationDelay: '200ms' }}>
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link
              href="/product-catalog"
              className="shimmer-btn relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-card-hover">
              
              {ctaText}
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
            <Link
              href="/product-catalog"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border text-foreground rounded-2xl font-semibold text-sm hover:border-primary hover:text-primary transition-colors">
              
              Voir les promotions
              <Icon name="TagIcon" size={16} />
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 pt-2 animate-fade-up" style={{ animationDelay: '400ms' }}>
            {[
            { icon: '🚚', label: 'Livraison partout au Maroc' },
            { icon: '💳', label: 'Paiement à la livraison' },
            { icon: '✅', label: 'Produits authentiques' }].
            map((item, i) =>
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-base">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Visual */}
        <div className="relative flex justify-center items-center animate-fade-up" style={{ animationDelay: '200ms' }}>
          {/* Main product image */}
          <div className="relative z-10 w-full max-w-md">
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(27,94,59,0.25)] bg-gradient-to-br from-muted to-white aspect-[4/5]">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1d24e2d63-1772315429209.png"
                alt="Produits de parapharmacie CeraVe et Bioderma sur fond blanc épuré, éclairage doux naturel"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover"
                priority />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Spinning badge */}
            <div className="absolute -bottom-5 -left-5 z-20 bg-white p-4 rounded-full shadow-xl border border-border animate-spin-slow hidden md:flex items-center justify-center">
              <svg className="w-20 h-20 text-primary" viewBox="0 0 100 100">
                <path id="heroCircle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                <text className="text-[9px] font-bold uppercase fill-current">
                  <textPath href="#heroCircle">100% Authentique · Livraison Maroc · </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -right-4 top-8 z-20 glass-panel rounded-2xl px-4 py-3 shadow-xl animate-float hidden md:block" style={{ animationDelay: '0s' }}>
              <p className="text-xs text-muted-foreground font-medium">Produits disponibles</p>
              <p className="text-2xl font-display font-bold text-primary">500+</p>
            </div>

            <div className="absolute -right-4 bottom-16 z-20 glass-panel rounded-2xl px-4 py-3 shadow-xl animate-float hidden md:block" style={{ animationDelay: '2s' }}>
              <p className="text-xs text-muted-foreground font-medium">Clients satisfaits</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-display font-bold text-accent">4.9</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => <span key={s} className="star-filled text-xs">★</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px]">
          <path fill="var(--muted)" fillOpacity="0.5" d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>);

}