import React from 'react';
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

export default function HomePage() {
  return (
    <Providers>
      <CartDrawer />
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <PromoBannerSection />
        <BestsellersSection />
        <BrandsSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </Providers>
  );
}