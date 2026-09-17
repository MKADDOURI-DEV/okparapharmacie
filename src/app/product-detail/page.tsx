import React from 'react';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailContent from './components/ProductDetailContent';

export const metadata = {
  title: 'Nettoyant Hydratant CeraVe — OK Parapharmacie',
  description: 'Nettoyant Hydratant CeraVe 473ml. Formulé avec 3 céramides essentielles. Prix: 129 د.م. Livraison rapide partout au Maroc. Paiement à la livraison.',
};

export default function ProductDetailPage() {
  return (
    <Providers>
      <CartDrawer />
      <Header />
      <main>
        <ProductDetailContent />
      </main>
      <Footer />
    </Providers>
  );
}