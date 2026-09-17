'use client';
import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

const FEATURES = [
{
  id: 'f1',
  icon: '✅',
  title: 'Produits 100% authentiques',
  description: 'Tous nos produits sont importés directement auprès des laboratoires officiels. Zéro contrefaçon, garantie d\'authenticité.',
  colSpan: 'md:col-span-2',
  rowSpan: '',
  bg: 'bg-primary',
  textLight: true,
  large: true
},
{
  id: 'f2',
  icon: '🚚',
  title: 'Livraison rapide',
  description: '24–48h à Casablanca, 48–72h partout au Maroc. Paiement à la livraison.',
  colSpan: '',
  rowSpan: '',
  bg: 'bg-card',
  textLight: false,
  large: false
},
{
  id: 'f3',
  icon: '💬',
  title: 'Support WhatsApp',
  description: 'Notre équipe répond 7j/7 sur WhatsApp pour vous conseiller.',
  colSpan: '',
  rowSpan: '',
  bg: 'bg-accent',
  textLight: true,
  large: false
},
{
  id: 'f4',
  icon: '💰',
  title: 'Prix compétitifs',
  description: 'Les meilleures marques aux meilleurs prix au Maroc, avec des promotions régulières.',
  colSpan: '',
  rowSpan: '',
  bg: 'bg-card',
  textLight: false,
  large: false
},
{
  id: 'f5',
  icon: '🔄',
  title: 'Retours faciles',
  description: 'Retour gratuit sous 7 jours si vous n\'êtes pas satisfait(e).',
  colSpan: '',
  rowSpan: '',
  bg: 'bg-muted',
  textLight: false,
  large: false
}];


export default function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-up').forEach((el) => el.classList.add('visible'));
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="fade-up">
            <span className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-2 block">Pourquoi nous choisir</span>
            <h2 className="font-display text-section-title text-foreground">
              La parapharmacie<br />
              <span className="italic text-primary">de confiance</span><br />
              au Maroc
            </h2>
          </div>
          <div className="fade-up stagger-2">
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Depuis Casablanca, nous livrons les meilleures marques de parapharmacie européenne partout au Maroc. Notre équipe de professionnels sélectionne chaque produit avec soin pour garantir authenticité et efficacité.
            </p>
          </div>
        </div>

        {/* BENTO GRID AUDIT:
              5 cards: f1(cs-2), f2, f3, f4, f5
              Row 1: [col-1–2: f1 cs-2] [col-3: f2] [col-4: f3]
              Row 2: [col-1: f4] [col-2: f5] [col-3–4: image cs-2]
              Placed 5/5 cards + 1 image = 6 cells ✓
           */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card f1: col-span-2 */}
          <div className="fade-up md:col-span-2 bg-primary rounded-3xl p-8 flex flex-col justify-between min-h-[200px] group hover:scale-[1.01] transition-transform">
            <span className="text-4xl">{FEATURES?.[0]?.icon}</span>
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{FEATURES?.[0]?.title}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{FEATURES?.[0]?.description}</p>
            </div>
          </div>

          {/* Card f2 */}
          <div className="fade-up stagger-2 bg-card border border-border rounded-3xl p-6 flex flex-col justify-between min-h-[180px] group hover:border-primary hover:shadow-card transition-all">
            <span className="text-3xl">{FEATURES?.[1]?.icon}</span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{FEATURES?.[1]?.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{FEATURES?.[1]?.description}</p>
            </div>
          </div>

          {/* Card f3 */}
          <div className="fade-up stagger-3 bg-accent rounded-3xl p-6 flex flex-col justify-between min-h-[180px] group hover:scale-[1.02] transition-transform">
            <span className="text-3xl">{FEATURES?.[2]?.icon}</span>
            <div>
              <h3 className="font-semibold text-white mb-1">{FEATURES?.[2]?.title}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{FEATURES?.[2]?.description}</p>
            </div>
          </div>

          {/* Card f4 */}
          <div className="fade-up stagger-4 bg-card border border-border rounded-3xl p-6 flex flex-col justify-between min-h-[160px] group hover:border-primary hover:shadow-card transition-all">
            <span className="text-3xl">{FEATURES?.[3]?.icon}</span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{FEATURES?.[3]?.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{FEATURES?.[3]?.description}</p>
            </div>
          </div>

          {/* Card f5 */}
          <div className="fade-up stagger-5 bg-muted rounded-3xl p-6 flex flex-col justify-between min-h-[160px] group hover:border-primary hover:shadow-card transition-all border border-transparent">
            <span className="text-3xl">{FEATURES?.[4]?.icon}</span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{FEATURES?.[4]?.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{FEATURES?.[4]?.description}</p>
            </div>
          </div>

          {/* Image card: col-span-2 */}
          <div className="fade-up stagger-6 md:col-span-2 rounded-3xl overflow-hidden min-h-[160px] relative image-zoom">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1570b0896-1781362371128.png"
              alt="Pharmacien professionnel en blouse blanche conseillant une cliente dans une parapharmacie lumineuse et moderne"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <p className="text-white font-display text-xl font-bold">Conseils d'experts</p>
                <p className="text-white/80 text-sm mt-1">Notre équipe vous guide vers les meilleurs soins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}