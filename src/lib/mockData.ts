export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  slug: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  description?: string;
  ingredients?: string;
  usage?: string;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  icon: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
{ id: '1', name: 'Visage', slug: 'visage', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&auto=format&fit=crop', productCount: 142, icon: '✨' },
{ id: '2', name: 'Corps', slug: 'corps', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop', productCount: 98, icon: '🌿' },
{ id: '3', name: 'Cheveux', slug: 'cheveux', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&auto=format&fit=crop', productCount: 87, icon: '💆' },
{ id: '4', name: 'Hygiène', slug: 'hygiene', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop', productCount: 65, icon: '🧴' },
{ id: '5', name: 'Bébé & Maman', slug: 'bebe-maman', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop', productCount: 73, icon: '👶' },
{ id: '6', name: 'Solaire', slug: 'solaire', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop', productCount: 44, icon: '☀️' },
{ id: '7', name: 'Compléments', slug: 'complements', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop', productCount: 56, icon: '💊' },
{ id: '8', name: 'Parfum & Bien-être', slug: 'parfum-bienetre', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&auto=format&fit=crop', productCount: 39, icon: '🌸' }];


export const BRANDS: Brand[] = [
{ id: '1', name: 'CeraVe', logo: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&auto=format&fit=crop', slug: 'cerave' },
{ id: '2', name: 'Bioderma', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&auto=format&fit=crop', slug: 'bioderma' },
{ id: '3', name: 'La Roche-Posay', logo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&auto=format&fit=crop', slug: 'la-roche-posay' },
{ id: '4', name: 'Vichy', logo: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a22?w=200&auto=format&fit=crop', slug: 'vichy' },
{ id: '5', name: 'Eucerin', logo: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&auto=format&fit=crop', slug: 'eucerin' },
{ id: '6', name: 'Mustela', logo: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop', slug: 'mustela' }];


export const PRODUCTS: Product[] = [
{
  id: '1',
  name: 'Nettoyant Hydratant CeraVe',
  brand: 'CeraVe',
  category: 'Visage',
  slug: 'cerave-nettoyant-hydratant',
  price: 129,
  oldPrice: 165,
  discount: 22,
  rating: 4.8,
  reviewCount: 247,
  image: "https://images.unsplash.com/photo-1735286770188-de4c5131589a",
  images: [
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop'],

  inStock: true,
  isBestseller: true,
  isFeatured: true,
  sku: 'CRV-001-473ML',
  description: 'Le Nettoyant Hydratant CeraVe est formulé avec 3 céramides essentielles et de l\'acide hyaluronique pour nettoyer la peau en douceur tout en maintenant la barrière cutanée naturelle. Sa formule non comédogène convient aux peaux normales à sèches.',
  ingredients: 'Aqua, Glycerin, Cetearyl Alcohol, Polysorbate 20, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Sodium Lauroyl Lactylate, Cholesterol, Phenoxyethanol, Disodium EDTA, Sodium Hyaluronate.',
  usage: 'Appliquer sur le visage humide, masser doucement en mouvements circulaires, rincer abondamment à l\'eau tiède. Utiliser matin et soir.'
},
{
  id: '2',
  name: 'Micellar Water Sensibio H2O',
  brand: 'Bioderma',
  category: 'Visage',
  slug: 'bioderma-sensibio-h2o',
  price: 89,
  oldPrice: 110,
  discount: 19,
  rating: 4.9,
  reviewCount: 512,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1123b7038-1772071556621.png",
  inStock: true,
  isBestseller: true,
  isFeatured: true,
  sku: 'BDR-002-500ML'
},
{
  id: '3',
  name: 'Anthelios SPF 50+ Fluide',
  brand: 'La Roche-Posay',
  category: 'Solaire',
  slug: 'laroche-anthelios-spf50',
  price: 175,
  oldPrice: 210,
  discount: 17,
  rating: 4.7,
  reviewCount: 189,
  image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop',
  inStock: true,
  isFeatured: true,
  sku: 'LRP-003-50ML'
},
{
  id: '4',
  name: 'Liftactiv Sérum 10',
  brand: 'Vichy',
  category: 'Visage',
  slug: 'vichy-liftactiv-serum',
  price: 245,
  oldPrice: 290,
  discount: 15,
  rating: 4.6,
  reviewCount: 134,
  image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&auto=format&fit=crop',
  inStock: true,
  isNew: true,
  sku: 'VCH-004-30ML'
},
{
  id: '5',
  name: 'Crème Riche Uréa 5%',
  brand: 'Eucerin',
  category: 'Corps',
  slug: 'eucerin-creme-riche-urea',
  price: 95,
  rating: 4.5,
  reviewCount: 98,
  image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop',
  inStock: true,
  sku: 'ECR-005-250ML'
},
{
  id: '6',
  name: 'Bébé Crème Visage & Corps',
  brand: 'Mustela',
  category: 'Bébé & Maman',
  slug: 'mustela-bebe-creme',
  price: 115,
  oldPrice: 140,
  discount: 18,
  rating: 4.9,
  reviewCount: 321,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a1dd2df6-1772070091947.png",
  inStock: true,
  isBestseller: true,
  sku: 'MST-006-150ML'
},
{
  id: '7',
  name: 'Shampoing Doux Kératine',
  brand: 'Luxeol',
  category: 'Cheveux',
  slug: 'luxeol-shampoing-keratine',
  price: 79,
  rating: 4.4,
  reviewCount: 67,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e14abdf2-1764739810807.png",
  inStock: true,
  isNew: true,
  sku: 'LXL-007-300ML'
},
{
  id: '8',
  name: 'Gel Douche pH Neutre',
  brand: 'Rogé Cavaillès',
  category: 'Hygiène',
  slug: 'roge-cavailles-gel-douche',
  price: 55,
  oldPrice: 70,
  discount: 21,
  rating: 4.3,
  reviewCount: 45,
  image: "https://images.unsplash.com/photo-1608564348103-2b78891150cf",
  inStock: true,
  sku: 'RGC-008-400ML'
},
{
  id: '9',
  name: 'Oméga 3 Premium',
  brand: 'ISDIN',
  category: 'Compléments',
  slug: 'isdin-omega3-premium',
  price: 189,
  rating: 4.6,
  reviewCount: 78,
  image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop',
  inStock: false,
  isNew: true,
  sku: 'ISD-009-60CAPS'
},
{
  id: '10',
  name: 'Eau de Parfum Rose Oud',
  brand: 'Floxia',
  category: 'Parfum & Bien-être',
  slug: 'floxia-rose-oud-edp',
  price: 320,
  oldPrice: 390,
  discount: 18,
  rating: 4.7,
  reviewCount: 56,
  image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&auto=format&fit=crop',
  inStock: true,
  sku: 'FLX-010-50ML'
},
{
  id: '11',
  name: 'Effaclar Gel Moussant',
  brand: 'La Roche-Posay',
  category: 'Visage',
  slug: 'laroche-effaclar-gel',
  price: 99,
  oldPrice: 125,
  discount: 21,
  rating: 4.8,
  reviewCount: 203,
  image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop',
  inStock: true,
  isBestseller: true,
  sku: 'LRP-011-200ML'
},
{
  id: '12',
  name: 'Minoxidil 5% Solution',
  brand: 'Vichy',
  category: 'Cheveux',
  slug: 'vichy-minoxidil-5',
  price: 265,
  rating: 4.5,
  reviewCount: 112,
  image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop',
  inStock: true,
  sku: 'VCH-012-60ML'
},
{
  id: '13',
  name: 'Crème Solaire Enfant SPF50',
  brand: 'Mustela',
  category: 'Solaire',
  slug: 'mustela-solaire-enfant-spf50',
  price: 145,
  oldPrice: 175,
  discount: 17,
  rating: 4.9,
  reviewCount: 87,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bbdd23e9-1772472765055.png",
  inStock: true,
  sku: 'MST-013-100ML'
},
{
  id: '14',
  name: 'Huile Corps Amande Douce',
  brand: 'Bioderma',
  category: 'Corps',
  slug: 'bioderma-huile-amande',
  price: 135,
  rating: 4.6,
  reviewCount: 92,
  image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop',
  inStock: true,
  isNew: true,
  sku: 'BDR-014-200ML'
},
{
  id: '15',
  name: 'Collagène Marin 10000mg',
  brand: 'ISDIN',
  category: 'Compléments',
  slug: 'isdin-collagene-marin',
  price: 229,
  oldPrice: 280,
  discount: 18,
  rating: 4.7,
  reviewCount: 143,
  image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop',
  inStock: true,
  isBestseller: true,
  sku: 'ISD-015-30SACH'
},
{
  id: '16',
  name: 'Déodorant 48H Invisible',
  brand: 'Eucerin',
  category: 'Hygiène',
  slug: 'eucerin-deodorant-48h',
  price: 68,
  rating: 4.4,
  reviewCount: 34,
  image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop',
  inStock: true,
  sku: 'ECR-016-50ML'
}];


export const TESTIMONIALS = [
{
  id: '1',
  name: 'Fatima Zahra B.',
  city: 'Casablanca',
  rating: 5,
  text: 'Produits 100% authentiques, livraison rapide à Casablanca. J\'ai commandé mon CeraVe et Bioderma, reçus en 24h. Je recommande vivement!',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a4222761-1772693752792.png",
  date: 'Août 2026'
},
{
  id: '2',
  name: 'Imane K.',
  city: 'Rabat',
  rating: 5,
  text: 'Excellent service client via WhatsApp. Les prix sont vraiment compétitifs comparés aux pharmacies classiques. Mon go-to pour la parapharmacie!',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ba39a87c-1777377588125.png",
  date: 'Juillet 2026'
},
{
  id: '3',
  name: 'Nadia M.',
  city: 'Marrakech',
  rating: 5,
  text: 'J\'ai commandé pour la première fois et je suis bluffée par la qualité. Emballage soigné, produits bien protégés. Livraison en 48h à Marrakech.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b05e4c5a-1773135090267.png",
  date: 'Septembre 2026'
},
{
  id: '4',
  name: 'Khadija A.',
  city: 'Fès',
  rating: 4,
  text: 'Grande sélection de marques européennes introuvables ailleurs au Maroc. Le Liftactiv Vichy que je cherchais depuis des mois, enfin disponible!',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a50f3aaf-1771337474409.png",
  date: 'Août 2026'
}];


export const WHATSAPP_NUMBER = '+212600000000';