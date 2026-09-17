import React from 'react';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CatalogContent from './components/CatalogContent';

export const metadata = {
  title: 'Catalogue Produits — OK Parapharmacie',
  description: 'Parcourez notre sélection de produits de parapharmacie: CeraVe, Bioderma, La Roche-Posay, Vichy et plus. Filtres par catégorie, marque, prix.',
};

export default function ProductCatalogPage() {
  return (
    <Providers>
      <CartDrawer />
      <Header />
      <main>
        <CatalogContent />
      </main>
      <Footer />
    </Providers>
  );
}