'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const PROMO_BANNERS = [
{
  id: '1',
  title: 'Solaires',
  subtitle: 'Protégez votre peau',
  description: 'SPF 30 à 100+ · Tous types de peaux',
  discount: 'Jusqu\'à -25%',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ac15eee7-1764654650295.png",
  bg: 'from-amber-900/80 via-amber-800/60 to-transparent',
  textColor: 'text-white'
},
{
  id: '2',
  title: 'Bébé & Maman',
  subtitle: 'Douceur & protection',
  description: 'Mustela, Uriage, Bioderma',
  discount: 'Dès 55 د.م.',
  image: "https://images.unsplash.com/photo-1615715035999-516964e790a7",
  bg: 'from-primary/80 via-primary/50 to-transparent',
  textColor: 'text-white'
}];


export default function PromoBannerSection() {
  return (
    <section className="py-12 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">
          {PROMO_BANNERS?.map((banner) =>
          <Link
            key={banner?.id}
            href="/product-catalog"
            className="group relative rounded-3xl overflow-hidden h-52 md:h-64 image-zoom shadow-card hover:shadow-card-hover transition-shadow">
            
              <AppImage
              src={banner?.image}
              alt={`${banner?.title} — ${banner?.description}, éclairage studio lumineux fond blanc clair`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover" />
            
              <div className={`absolute inset-0 bg-gradient-to-r ${banner?.bg}`} />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div className="tag-promo text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                  {banner?.discount}
                </div>
                <h3 className={`font-display text-2xl font-bold ${banner?.textColor} leading-tight`}>{banner?.title}</h3>
                <p className={`text-sm ${banner?.textColor} opacity-80 mt-1`}>{banner?.description}</p>
                <div className={`flex items-center gap-1 mt-3 text-sm font-semibold ${banner?.textColor} group-hover:gap-2 transition-all`}>
                  Voir la sélection <Icon name="ArrowRightIcon" size={14} />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>);

}