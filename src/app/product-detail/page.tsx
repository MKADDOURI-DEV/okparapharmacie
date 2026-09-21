import React, { Suspense } from 'react';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailContent from './components/ProductDetailContent';

export const metadata = {
  title: 'Produit — OK Parapharmacie',
  description: 'Découvrez nos produits de parapharmacie. Livraison rapide partout au Maroc. Paiement à la livraison.',
};

export default function ProductDetailPage() {
  return (
    <Providers>
      <CartDrawer />
      <Header />
      <main>
        <Suspense fallback={null}>
          <ProductDetailContent />
        </Suspense>
      </main>
      <Footer />
    </Providers>
  );
}