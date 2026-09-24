'use client';
import React, { useEffect, useState } from 'react';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import PromoBannerSection from './components/PromoBannerSection';
import BestsellersSection from './components/BestsellersSection';
import BrandsSection from './components/BrandsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettingsRow } from '@/lib/supabase/types';

const DEFAULT_SECTIONS: SiteSettingsRow['sections'] = {
  featured: true,
  bestsellers: true,
  promo_banner: true,
  brands: true,
  testimonials: true,
  newsletter: true,
};

export default function HomePage() {
  const [sections, setSections] = useState<SiteSettingsRow['sections']>(DEFAULT_SECTIONS);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('site_settings')
      .select('sections')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        const s = data as Pick<SiteSettingsRow, 'sections'> | null;
        if (s?.sections) setSections({ ...DEFAULT_SECTIONS, ...s.sections });
      });
  }, []);

  return (
    <Providers>
      <CartDrawer />
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        {sections.featured !== false && <FeaturedProductsSection />}
        {sections.promo_banner !== false && <PromoBannerSection />}
        {sections.bestsellers !== false && <BestsellersSection />}
        {sections.brands !== false && <BrandsSection />}
        <WhyChooseUsSection />
        {sections.testimonials !== false && <TestimonialsSection />}
        {sections.newsletter !== false && <NewsletterSection />}
      </main>
      <Footer />
    </Providers>
  );
}
